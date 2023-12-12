import OpenAI, { APIError, OpenAIError } from 'openai';
import { APIClient, type Fetch } from 'openai/core';
import { Stream } from 'openai/streaming';

import { APIResource } from './resource';
import { ensureArray } from './util';

export type ErnieAIOptions = {
  baseURL?: string;
  token?: string;
  timeout?: number | undefined;
  httpAgent?: any;
  fetch?: Fetch | undefined;
};

// Note: 文心一言 由于分发在不同的平台，所以有不同的文档
// 百度云的响应和 OpenAI 的比较类似，但授权没有 AI Studio 方便
// 之前 AI Studio 的文档是有文档的，但现在不知道去哪了
// 参考：
// - https://cloud.baidu.com/doc/WENXINWORKSHOP/s/jlil56u11
// - https://github.com/PaddlePaddle/ERNIE-Bot-SDK/blob/develop/aistudio/backends/aistudio.py
export class ErnieAI extends APIClient {
  protected token: string;

  constructor(options?: ErnieAIOptions) {
    const {
      token = process.env.AISTUDIO_ACCESS_TOKEN || '',
      baseURL = 'https://aistudio.baidu.com/llm/lmapi/v1',
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

export class Chat extends APIResource {
  completions = new Completions(this._client);
}

export class Completions extends APIResource {
  // Note: 文心一言不是通过模型，而是通过 endpoint 区分的
  // 使用模型名称是为了和 OpenAI 的 API 保持一致
  // 同时也是为了方便使用
  protected endpoints: Record<ErnieAI.ChatModel, string> = {
    'ernie-bot': '/chat/completions',
    'ernie-bot-turbo': '/chat/eb-instant',
    'ernie-bot-4': '/chat/completions_pro',
    'ernie-bot-8k': '/chat/ernie_bot_8k',
  };

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
    const { model = 'ernie-bot', ...body } = this.buildCreateParams(params);
    const endpoint = this.endpoints[model]

    if (!endpoint) {
      throw new OpenAIError(`Invalid model: ${model}`);
    }

    const stream = body.stream;

    const headers = {
      ...options?.headers,
      // Note: 如果是 stream 的话，需要设置 Accept 为 text/event-stream
      Accept: stream ? 'text/event-stream' : 'application/json',
    };

    const response: Response = await this._client.post(endpoint, {
      ...options,
      body,
      headers,
      // 文心一言的响应内容被包裹了一层，需要解构并转换为 OpenAI 的格式
      // 设置 __binaryResponse 为 true， 是为了让 client 返回原始的 response
      stream: false,
      __binaryResponse: true,
    });

    if (stream) {
      const controller = new AbortController();

      options?.signal?.addEventListener('abort', () => {
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

  protected buildCreateParams(
    params: OpenAI.ChatCompletionCreateParams &
      OverrideOpenAIChatCompletionCreateParams
  ): ErnieAI.ChatCompletionCreateParams {
    const { messages = [], presence_penalty, user, stop, ...rest } = params;

    const head = messages[0];

    // 文心一言的 system 是独立字段
    //（1）长度限制1024个字符
    //（2）如果使用functions参数，不支持设定人设system
    const system = head && head.role === 'system' ? head.content : undefined;

    // 移除 system 角色的消息
    if (system) {
      messages.splice(0, 1);
    }

    const data: ErnieAI.ChatCompletionCreateParams = {
      ...rest,
      system,
      messages,
    };

    if (user) {
      data.user_id = user;
    }

    if (presence_penalty) {
      data.penalty_score = presence_penalty;
    }

    if (stop) {
      data.stop = ensureArray(stop);
    }

    return data;
  }
}

/**
 * 如果 code 不为 0，抛出 APIError
 *
 * @param code -
 * @param message -
 */
function assertNonZero(code: number, message: string) {
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
function makeAPIError(code: number, message: string) {
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
function fromOpenAIStream(
  model: string,
  stream: Stream<ErnieAI.APIResponse>,
  controller: AbortController
): Stream<OpenAI.ChatCompletionChunk> {
  async function* iterator(): AsyncIterator<
    OpenAI.ChatCompletionChunk,
    any,
    undefined
  > {
    for await (const chunk of stream) {
      // TODO 某些情况下，文心一言的 result 只有 id，需要排查情况
      const { errorCode, errorMsg, result: data } = chunk;

      assertNonZero(errorCode, errorMsg);

      const choice: OpenAI.ChatCompletionChunk.Choice = {
        index: 0,
        delta: {
          role: 'assistant',
          content: data.result || '',
        },
        finish_reason: null,
      };

      // TODO 需要确认 is_truncated 是否和 is_end 互斥
      // TODO 需要确认 functions 是否响应式不一样
      if (data.is_end) {
        choice.finish_reason = 'stop';
      } else if (data.is_truncated) {
        choice.finish_reason = 'length';
      } else if (data.need_clear_history) {
        choice.finish_reason = 'content_filter';
      }

      yield {
        id: data.id,
        model,
        choices: [choice],
        object: 'chat.completion.chunk',
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
function fromResponse(
  model: string,
  data: ErnieAI.APIResponse
): OpenAI.ChatCompletion {
  const { errorCode, errorMsg, result } = data;

  assertNonZero(errorCode, errorMsg);

  const choice: OpenAI.ChatCompletion.Choice = {
    index: 0,
    message: {
      role: 'assistant',
      content: result.result,
    },
    finish_reason: 'stop',
  };

  // TODO 需要确认 is_truncated 是否和 is_end 互斥
  // TODO 需要确认 functions 是否响应式不一样
  if (result.is_end) {
    choice.finish_reason = 'stop';
  } else if (result.is_truncated) {
    choice.finish_reason = 'length';
  } else if (result.need_clear_history) {
    choice.finish_reason = 'content_filter';
  }

  return {
    id: result.id,
    model: model,
    choices: [choice],
    created: parseInt(result.created, 10),
    object: 'chat.completion',
    usage: result.usage,
  };
}

// 用于覆盖 OpenAI.ChatCompletionCreateParams 的参数
type OverrideOpenAIChatCompletionCreateParams = {
  model: ErnieAI.ChatModel;
  disable_search?: boolean | null;
  enable_citation?: boolean | null;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ErnieAI {
  export type ChatModel =
    | 'ernie-bot'
    | 'ernie-bot-turbo'
    | 'ernie-bot-4'
    | 'ernie-bot-8k';

  export interface ChatCompletionCreateParams {
    /**
     * 模型名称
     */
    model: ErnieAI.ChatModel;

    /**
     * 是否强制关闭实时搜索功能，默认 false，表示不关闭
     *
     * @defaultValue false
     */
    disable_search?: boolean | null;

    /**
     * 是否开启上角标返回，说明：
     * （1）开启后，有概率触发搜索溯源信息search_info，search_info内容见响应参数介绍
     * （2）默认false，不开启
     *
     * @defaultValue false
     */
    enable_citation?: boolean | null;

    /**
     * 模型人设，主要用于人设设定，例如，你是xxx公司制作的AI助手，说明：
     * （1）长度限制1024个字符
     * （2）如果使用 functions 参数，不支持设定人设 system
     *
     * @remarks OpenAI 是通过 messages 的 role 来区分的
     */
    system?: string | null;

    /**
     * 聊天上下文信息
     *
     * @remarks 不支持 system 角色
     */
    messages: OpenAI.ChatCompletionCreateParams['messages'];

    /**
     * 一个可触发函数的描述列表
     */
    functions?: OpenAI.ChatCompletionCreateParams['functions'];

    /**
     * 内容随机性
     *
     * 说明：
     * （1）较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定
     * （2）默认0.8，范围 (0, 1.0]，不能为0
     * （3）建议该参数和 top_p 只设置1个
     * （4）建议 top_p 和 temperature 不要同时更改
     */
    temperature?: number | null;

    /**
     * 生成文本的多样性
     *
     * 说明：
     * （1）影响输出文本的多样性，取值越大，生成文本的多样性越强
     * （2）默认0.8，取值范围 [0, 1.0]
     * （3）建议该参数和 temperature 只设置1个
     * （4）建议 top_p 和 temperature 不要同时更改
     */
    top_p?: number | null;

    /**
     *
     * 通过对已生成的token增加惩罚，减少重复生成的现象。说明：
     * （1）值越大表示惩罚越大
     * （2）默认1.0，取值范围：[1.0, 2.0]
     *
     * @remarks 在 OpenAI 中，参数名为 presence_penalty
     */
    penalty_score?: number | null;

    /**
     * 是否以流式接口的形式返回数据，默认 false
     */
    stream?: boolean | null;

    /**
     * 生成停止标识，当模型生成结果以stop中某个元素结尾时，停止文本生成。说明：
     * （1）每个元素长度不超过20字符
     * （2）最多4个元素
     */
    stop?: string | string[] | undefined;

    /**
     * 表示最终用户的唯一标识符，可以监视和检测滥用行为，防止接口恶意调用
     *
     * @remarks OpenAI 中是通过 user 区分
     */
    user_id?: string | undefined;
  }

  export type APIResult = {
    id: string;
    result: string;
    created: string;
    is_end: boolean;
    is_truncated: boolean;
    need_clear_history: boolean;
    usage: OpenAI.CompletionUsage;
  };

  export type APIResponse = {
    errorCode: number;
    errorMsg: string;
    result: APIResult;
  };
}

export default ErnieAI;
