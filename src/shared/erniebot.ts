import { ok } from "node:assert";

import OpenAI, { APIError, OpenAIError } from "openai";
import { APIClient, type Fetch } from "openai/core";
import { Stream } from "openai/streaming";

export type ErnieAPIOptions = {
  baseURL?: string;
  token?: string;
  timeout?: number | undefined;
  httpAgent?: any;
  fetch?: Fetch | undefined;
};

export class ErnieAPI extends APIClient {
  protected token: string;

  constructor(options?: ErnieAPIOptions) {
    const {
      token = process.env.AISTUDIO_ACCESS_TOKEN || "",
      baseURL = "https://aistudio.baidu.com/llm/lmapi/v1",
      timeout = 30000,
      fetch = globalThis.fetch,
      httpAgent = undefined,
      ...rest
    } = options || {};

    super({
      baseURL,
      timeout,
      fetch,
      httpAgent,
      ...rest,
    });

    // ok(token, "token is required");

    this.token = token;
  }

  chat = new Chat(this);

  protected override authHeaders() {
    return {
      Authorization: `token ${this.token}`,
    };
  }

  protected override defaultQuery() {
    return {};
  }
}

export class APIResource {
  protected _client: APIClient;

  constructor(client: APIClient) {
    this._client = client;
  }
}

export class Chat extends APIResource {
  completions = new Completions(this._client);
}

export class Completions extends APIResource {
  // Note: 文心一言不是通过模型，而是通过 endpoint 区分的
  // 使用模型名称是为了和 OpenAI 的 API 保持一致
  // 同时也是为了方便使用
  protected resources = new Map([
    [
      "ernie-bot",
      {
        id: "ernie-bot",
        endpoint: "/chat/completions",
      },
    ],
    [
      "ernie-bot-turbo",
      {
        id: "ernie-bot-turbo",
        endpoint: "/chat/eb-instant",
      },
    ],
    [
      "ernie-bot-4",
      {
        id: "ernie-bot-4",
        endpoint: "/chat/completions_pro",
      },
    ],
  ]);

  /**
   * Creates a model response for the given chat conversation.
   */
  create(
    body: OpenAI.ChatCompletionCreateParamsNonStreaming & {
      model: ErnieChatModel;
    },
    options?: OpenAI.RequestOptions
  ): Promise<OpenAI.ChatCompletion>;
  create(
    body: OpenAI.ChatCompletionCreateParamsStreaming & {
      model: ErnieChatModel;
    },
    options?: OpenAI.RequestOptions
  ): Promise<Stream<OpenAI.ChatCompletionChunk>>;

  async create(
    params: OpenAI.ChatCompletionCreateParams & {
      model: ErnieChatModel;
    },
    options?: OpenAI.RequestOptions
  ) {
    const { model = "ernie-bot", ...body } = params;
    const resource = this.resources.get(model);

    if (!resource) {
      throw new OpenAIError(`Invalid model: ${model}`);
    }

    const stream = body?.stream;

    const headers = {
      ...options?.headers,
      // Note: 如果是 stream 的话，需要设置 Accept 为 text/event-stream
      Accept: stream ? "text/event-stream" : "application/json",
    };

    // Note: 因为文心一言的响应内容被包裹了一层，
    // 要设置 __binaryResponse 为 true， 是为了让 client 返回原始的 response
    // 然后在 afterResponse 里面处理
    const response: Response = await this._client.post(resource.endpoint, {
      ...options,
      body,
      headers,
      stream: false,
      __binaryResponse: true,
    });

    if (stream) {
      const controller = new AbortController();

      options?.signal?.addEventListener("abort", () => {
        controller.abort();
      });

      return fromOpenAIStream(
        model,
        Stream.fromSSEResponse(response, controller),
        controller
      );
    }

    return fromResponse(model, await response.json());
  }
}

/**
 * 如果 code 不为 0，抛出 APIError
 *
 * @param code -
 * @param message -
 */
export function assertNonZero(code: number, message: string) {
  if (code === 0) return;

  throw makeAPIError(code, message);
}

/**
 * 构建错误
 *
 * @param code -
 * @param message -
 * @returns 错误
 */
export function makeAPIError(code: number, message: string) {
  const error = { code, message };

  switch (code) {
    case 2:
      return APIError.generate(500, error, message, {});
    case 6: // permission error
    case 111: // token expired
      return APIError.generate(403, error, message, {});
    case 17:
    case 18:
    case 19:
    case 40407:
      return APIError.generate(429, error, message, {});
    case 110: // invalid token
    case 40401: // invalid token
      return APIError.generate(401, error, message, {});
    case 336003: // invalid parameter
      return APIError.generate(400, error, message, {});
    case 336100: // try again
      return APIError.generate(500, error, message, {});
    default:
      return APIError.generate(undefined, error, message, {});
  }
}

/**
 * @param model - 模型名称
 * @param stream - 流
 * @param controller - 控制器
 */
export function fromOpenAIStream(
  model: string,
  stream: Stream<ErnieResponse>,
  controller: AbortController
): Stream<OpenAI.ChatCompletionChunk> {
  async function* iterator(): AsyncIterator<
    OpenAI.ChatCompletionChunk,
    any,
    undefined
  > {
    for await (const chunk of stream) {
      const { errorCode, errorMsg, result: data } = chunk;

      assertNonZero(errorCode, errorMsg);

      const choice: OpenAI.ChatCompletionChunk.Choice = {
        index: 0,
        delta: {
          role: "assistant",
          content: data.result,
        },
        finish_reason: null,
      };

      // TODO 需要确认 is_truncated 是否和 is_end 互斥
      // TODO 需要确认 functions 是否响应式不一样
      if (data.is_end) {
        choice.finish_reason = "stop";
      } else if (data.is_truncated) {
        choice.finish_reason = "length";
      } else if (data.need_clear_history) {
        choice.finish_reason = "content_filter";
      }

      yield {
        id: data.id,
        model,
        choices: [choice],
        object: "chat.completion.chunk",
        created: parseInt(data.created, 10),
      };
    }
  }

  return new Stream(iterator, controller);
}

/**
 * @param model
 * @param data
 */
export function fromResponse(
  model: string,
  data: ErnieResponse
): OpenAI.ChatCompletion {
  const { errorCode, errorMsg, result } = data;

  assertNonZero(errorCode, errorMsg);

  const choice: OpenAI.ChatCompletion.Choice = {
    index: 0,
    message: {
      role: "assistant",
      content: result.result,
    },
    finish_reason: "stop",
  };

  // TODO 需要确认 is_truncated 是否和 is_end 互斥
  // TODO 需要确认 functions 是否响应式不一样
  if (result.is_end) {
    choice.finish_reason = "stop";
  } else if (result.is_truncated) {
    choice.finish_reason = "length";
  } else if (result.need_clear_history) {
    choice.finish_reason = "content_filter";
  }

  return {
    id: result.id,
    model: model,
    choices: [choice],
    created: parseInt(result.created, 10),
    object: "chat.completion",
    usage: result.usage,
  };
}

export type ErnieChatModel = "ernie-bot" | "ernie-bot-turbo" | "ernie-bot-4";

export type ErnieResult = {
  id: string;
  result: string;
  created: string;
  is_end: boolean;
  is_truncated: boolean;
  need_clear_history: boolean;
  usage: OpenAI.CompletionUsage;
};

export type ErnieResponse = {
  errorCode: number;
  errorMsg: string;
  result: ErnieResult;
};
