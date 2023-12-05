import OpenAI, { APIError, OpenAIError } from "openai";
import { APIClient, type Fetch } from "openai/core";
import { Stream } from "openai/streaming";

import {
  SSEDecoder,
  readableStreamAsyncIterable,
  LineDecoder,
  type ServerSentEvent,
  type Bytes,
} from "./streaming";

export type QWenAIOptions = {
  baseURL?: string;
  apiKey?: string;
  timeout?: number | undefined;
  httpAgent?: any;
  fetch?: Fetch | undefined;
};

// https://help.aliyun.com/zh/dashscope/developer-reference/api-details
export class QWenAI extends APIClient {
  protected apiKey: string;

  constructor(options?: QWenAIOptions) {
    const {
      apiKey = process.env.QWEN_API_KEY || "",
      baseURL = "https://dashscope.aliyuncs.com/api/v1",
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

    this.apiKey = apiKey;
  }

  chat = new Chat(this);

  protected override authHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
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
  /**
   * Creates a model response for the given chat conversation.
   */
  create(
    body: OpenAI.ChatCompletionCreateParamsNonStreaming &
      OverrideOpenAIChatCompletionCreateParams,
    options?: OpenAI.RequestOptions
  ): Promise<OpenAI.ChatCompletion>;
  create(
    body: OpenAI.ChatCompletionCreateParamsStreaming &
      OverrideOpenAIChatCompletionCreateParams,
    options?: OpenAI.RequestOptions
  ): Promise<Stream<OpenAI.ChatCompletionChunk>>;

  async create(
    params: OpenAI.ChatCompletionCreateParams &
      OverrideOpenAIChatCompletionCreateParams,
    options?: OpenAI.RequestOptions
  ) {
    const { stream, ...rest } = params;

    const headers = {
      ...options?.headers,
      // Note: 如果是 stream 的话，需要设置 Accept 为 text/event-stream
      Accept: stream ? "text/event-stream" : "application/json",
    };

    const body = this.buildCreateParams(rest);

    const response: Response = await this._client.post(
      "/services/aigc/text-generation/generation",
      {
        ...options,
        // @ts-expect-error 类型冲突？
        body,
        headers,
        // 通义千问的响应内容被包裹了一层，需要解构并转换为 OpenAI 的格式
        // 设置 __binaryResponse 为 true， 是为了让 client 返回原始的 response
        stream: false,
        __binaryResponse: true,
      }
    );

    if (stream) {
      const controller = new AbortController();

      options?.signal?.addEventListener("abort", () => {
        controller.abort();
      });

      return this.fromSSEResponse(body.model, response, controller);
    }

    return this.fromResponse(body.model, await response.json());
  }

  protected buildCreateParams(
    params: OpenAI.ChatCompletionCreateParams &
      OverrideOpenAIChatCompletionCreateParams
  ): QWenAI.ChatCompletionCreateParams {
    const { model, messages, presence_penalty, ...rest } = params;

    const data: QWenAI.ChatCompletionCreateParams = {
      model,
      input: {
        messages,
      },
      parameters: {
        ...rest,
        result_format: "text", // 强制使用 text 格式
        incremental_output: true,
        repetition_penalty: presence_penalty,
      },
    };

    return data;
  }

  /**
   * @param model - 模型名称
   * @param stream - 流
   * @param controller - 控制器
   */
  protected fromSSEResponse(
    model: string,
    response: Response,
    controller: AbortController
  ): Stream<OpenAI.ChatCompletionChunk> {
    let consumed = false;
    const decoder = new SSEDecoder();

    async function* iterMessages(): AsyncGenerator<
      ServerSentEvent,
      void,
      unknown
    > {
      if (!response.body) {
        controller.abort();
        throw new OpenAIError(
          `Attempted to iterate over a response with no body`
        );
      }

      const lineDecoder = new LineDecoder();

      const iter = readableStreamAsyncIterable<Bytes>(response.body);
      for await (const chunk of iter) {
        for (const line of lineDecoder.decode(chunk)) {
          const sse = decoder.decode(line);
          if (sse) yield sse;
        }
      }

      for (const line of lineDecoder.flush()) {
        const sse = decoder.decode(line);
        if (sse) yield sse;
      }
    }

    async function* iterator(): AsyncIterator<
      OpenAI.ChatCompletionChunk,
      any,
      undefined
    > {
      if (consumed) {
        throw new Error(
          "Cannot iterate over a consumed stream, use `.tee()` to split the stream."
        );
      }
      consumed = true;
      let done = false;
      try {
        for await (const sse of iterMessages()) {
          if (done) continue;

          if (sse.data.startsWith("[DONE]")) {
            done = true;
            continue;
          }

          if (sse.event === "result") {
            let data;

            try {
              data = JSON.parse(sse.data);
            } catch (e) {
              console.error(`Could not parse message into JSON:`, sse.data);
              console.error(`From chunk:`, sse.raw);
              throw e;
            }

            if (data && data.code) {
              throw new APIError(undefined, data, undefined, undefined);
            }

            const choice: OpenAI.ChatCompletionChunk.Choice = {
              index: 0,
              delta: {
                role: "assistant",
                content: data.output.text || "",
              },
              finish_reason: null,
            };

            const finish_reason = data.output.finish_reason;

            if (finish_reason !== "null") {
              choice.finish_reason = finish_reason;
            }

            yield {
              id: data.request_id,
              model,
              choices: [choice],
              object: "chat.completion.chunk",
              created: Date.now() / 1000,
            };
          }
        }
        done = true;
      } catch (e) {
        // If the user calls `stream.controller.abort()`, we should exit without throwing.
        if (e instanceof Error && e.name === "AbortError") return;
        throw e;
      } finally {
        // If the user `break`s, abort the ongoing request.
        if (!done) controller.abort();
      }
    }

    return new Stream(iterator, controller);
  }

  protected fromResponse(
    model: string,
    resp: QWenAI.APIResponse
  ): OpenAI.ChatCompletion {
    if ("code" in resp) {
      throw new APIError(undefined, resp, undefined, undefined);
    }

    const { output, usage } = resp;

    const choice: OpenAI.ChatCompletion.Choice = {
      index: 0,
      message: {
        role: "assistant",
        content: output.text,
      },
      finish_reason: output.finish_reason,
    };

    return {
      id: resp.request_id,
      model: model,
      choices: [choice],
      created: Date.now() / 1000,
      object: "chat.completion",
      usage: {
        completion_tokens: usage.output_tokens,
        prompt_tokens: usage.input_tokens,
        total_tokens: usage.total_tokens,
      },
    };
  }
}

// 用于覆盖 OpenAI.ChatCompletionCreateParams 的参数
type OverrideOpenAIChatCompletionCreateParams = {
  model: QWenAI.ChatModel;
  enable_search?: boolean | null;
  top_k?: number | null;
};

export namespace QWenAI {
  export type ChatModel = "qwen-turbo" | "qwen-plus" | "qwen-max";

  /**
   * - text 旧版本的 text
   * - message 兼容 openai 的 message
   *
   * @defaultValue "text"
   */
  export type ResultFormat = "text" | "message";

  export type ChatCompletionInputParam = {
    /**
     * 聊天上下文信息
     */
    messages: OpenAI.ChatCompletionCreateParams["messages"];
  };

  export type ChatCompletionParameters = {
    /**
     * 生成结果的格式
     *
     * @defaultValue "text"
     */
    result_format?: ResultFormat;

    /**
     * 生成时，随机数的种子，用于控制模型生成的随机性。
     *
     * 如果使用相同的种子，每次运行生成的结果都将相同；
     * 当需要复现模型的生成结果时，可以使用相同的种子。
     * seed参数支持无符号64位整数类型。
     *
     * @defaultValue 1234
     */
    seed?: number | null;

    /**
     * 用于限制模型生成token的数量，max_tokens设置的是生成上限，并不表示一定会生成这么多的token数量。最大值和默认值均为1500
     *
     * @defaultValue 1500
     */
    max_tokens?: number | null;

    /**
     * 生成文本的多样性
     *
     * @defaultValue 0.8
     */
    top_p?: number | null;

    /**
     * 生成时，采样候选集的大小。
     *
     * 例如，
     * 取值为50时，仅将单次生成中得分最高的50个token组成随机采样的候选集。
     * 取值越大，生成的随机性越高；取值越小，生成的确定性越高。
     *
     * 注意：如果top_k参数为空或者top_k的值大于100，表示不启用top_k策略，此时仅有top_p策略生效，默认是空。
     *
     * @defaultValue 80
     */
    top_k?: number | null;

    /**
     * 用于控制模型生成时的重复度。提高repetition_penalty时可以降低模型生成的重复度。1.0表示不做惩罚。默认为1.1。
     */
    repetition_penalty?: number | null;

    /**
     * 内容随机性
     *
     * @defaultValue 1.0
     */
    temperature?: number | null;

    /**
     * 生成停止标识符
     */
    stop?: string | string[] | null;

    /**
     * 生成时，是否参考搜索的结果。
     *
     * 注意：打开搜索并不意味着一定会使用搜索结果；
     * 如果打开搜索，模型会将搜索结果作为prompt，进而“自行判断”是否生成结合搜索结果的文本，默认为false
     */
    enable_search?: boolean | null;

    /**
     * 用于控制流式输出模式，默认False，即后面内容会包含已经输出的内容；
     * 设置为True，将开启增量输出模式，后面输出不会包含已经输出的内容，您需要自行拼接整体输出
     *
     * @defaultValue false
     */
    incremental_output?: boolean | null;
  };

  export interface ChatCompletionCreateParams {
    model: QWenAI.ChatModel;
    input: ChatCompletionInputParam;
    parameters: ChatCompletionParameters;
  }

  /**
   * result_format 为 text 时的响应
   */
  export interface APITextResponse {
    request_id: string;
    output: {
      text: string;
      finish_reason: "stop" | "length";
    };
    usage: {
      output_tokens: number;
      input_tokens: number;
      total_tokens: number;
    };
  }

  export interface APIErrorResponse {
    code: string;
    message: string;
    request_id: string;
  }

  export type APIResponse = APIErrorResponse | APITextResponse;
}

export default QWenAI;
