import OpenAI, { APIError, OpenAIError } from 'openai';
import { APIClient, type Fetch, type Headers, type RequestOptions } from 'openai/core';
import { Stream } from 'openai/streaming';

import {
  SSEDecoder,
  iterMessages,
} from './streaming';
import { APIResource } from './resource';

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
      apiKey = process.env.QWEN_API_KEY || '',
      baseURL = 'https://dashscope.aliyuncs.com/api/v1',
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

  chat = new QWenChat(this);

  images = new QWenImages(this);

  protected override authHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  protected override defaultQuery() {
    return {};
  }

  protected override makeStatusError(
    status: number | undefined,
    error: Object | undefined,
    message: string | undefined,
    headers: Headers | undefined,
  ) {
    return APIError.generate(status, { error }, message, headers);
  }
}

export class QWenChat extends APIResource {
  completions = new QWenCompletions(this._client);
}

export class QWenCompletions extends APIResource {
  /**
   * Creates a model response for the given chat conversation.
   */
  create(
    body: QWenAI.ChatCompletionCreateParamsNonStreaming,
    options?: RequestOptions
  ): Promise<OpenAI.ChatCompletion>;
  create(
    body: QWenAI.ChatCompletionCreateParamsStreaming,
    options?: RequestOptions
  ): Promise<Stream<OpenAI.ChatCompletionChunk>>;

  async create(
    params: OpenAI.ChatCompletionCreateParams,
    options?: RequestOptions
  ) {
    const { stream, ...rest } = params;

    const headers = {
      ...options?.headers,
    };

    // Note: 如果是 stream 的话，需要设置 Accept 为 text/event-stream
    if (params.stream) {
      headers['Accept'] = 'text/event-stream';
    }

    const body = this.buildCreateParams(rest);

    // See https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-qianwen-vl-api/
    const path = isMultiModal(params.model)
      ? '/services/aigc/multimodal-generation/generation'
      : '/services/aigc/text-generation/generation';

    const response: Response = await this._client.post(
      path,
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

      options?.signal?.addEventListener('abort', () => {
        controller.abort();
      });

      return this.fromSSEResponse(body.model, response, controller);
    }

    return this.fromResponse(body.model, await response.json());
  }

  protected buildCreateParams(
    params: QWenAI.ChatCompletionCreateParams
  ): QWenChat.ChatCompletionCreateParams {
    const { model, messages, presence_penalty, ...parameters } = params;


    const data: QWenChat.ChatCompletionCreateParams = {
      model,
      input: {
        messages,
      },
      parameters,
    };

    // 多模型支持图片与视频
    if (isMultiModal(model)) {
      // 修复与 OpenAI 的兼容性问题
      data.input.messages.forEach(message => {
        if (Array.isArray(message.content)) {
          message.content.forEach(part => {
            if (part.type === 'image_url') {
              // @ts-expect-error
              part.image = part.image_url.url;

              delete part.image_url;
            }

            // 不支持 type 字段
            delete part.type;
          });
        } else {
          message.content = [
            // @ts-expect-error 不支持 type 字段
            { text: message.content! },
          ];
        }

        return message;
      });
    } else {
      data.parameters.result_format = 'text';
      data.parameters.repetition_penalty = presence_penalty;

      if (params.stream) {
        data.parameters.incremental_output = true;
      }
    }

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

    function transform(data: QWenChat.ChatCompletionChunk): OpenAI.ChatCompletionChunk {
      const choice: OpenAI.ChatCompletionChunk.Choice = {
        index: 0,
        delta: {
          role: 'assistant',
          content: data.output.text || '',
        },
        finish_reason: null,
      };


      if (isMultiModal(model)) {
        const { message } = data.output.choices[0]

        // @ts-expect-error
        choice.delta = message;
      }

      const finish_reason = data.output.finish_reason;
      if (finish_reason !== 'null') {
        choice.finish_reason = finish_reason;
      }

      return {
        id: data.request_id,
        model,
        choices: [choice],
        object: 'chat.completion.chunk',
        created: Date.now() / 1000,
      };
    }

    async function* iterator(): AsyncIterator<OpenAI.ChatCompletionChunk, any, undefined> {
      if (consumed) {
        throw new Error('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
      }
      consumed = true;
      let done = false;
      try {
        for await (const sse of iterMessages(response, decoder, controller)) {
          if (done) continue;

          if (sse.data.startsWith('[DONE]')) {
            done = true;
            continue;
          }

          if (sse.event === 'result') {
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

            yield transform(data);
          }
        }
        done = true;
      } catch (e) {
        // If the user calls `stream.controller.abort()`, we should exit without throwing.
        if (e instanceof Error && e.name === 'AbortError') return;
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
    response: QWenChat.ChatCompletion
  ): OpenAI.ChatCompletion {
    const { output, usage } = response;

    const choice: OpenAI.ChatCompletion.Choice = {
      index: 0,
      message: {
        role: 'assistant',
        content: output.text,
      },
      finish_reason: output.finish_reason || 'stop',
    };

    if (isMultiModal(model)) {
      const { message } = output.choices[0];

      const content = message.content;

      choice.message = {
        role: 'assistant',
        content: Array.isArray(content) ? content[0].text : content,
      };
    }

    return {
      id: response.request_id,
      model: model,
      choices: [choice],
      created: Date.now() / 1000,
      object: 'chat.completion',
      usage: {
        completion_tokens: usage.output_tokens,
        prompt_tokens: usage.input_tokens,
        total_tokens: usage.total_tokens,
      },
    };
  }
}


function isMultiModal(model: QWenAI.ChatModel): boolean {
  return model.startsWith('qwen-vl');
}

export namespace QWenChat {
  export type QWenCompletionUsage = {
    output_tokens: number;
    input_tokens: number;
    total_tokens: number;
  }

  export type ChatCompletion = {
    request_id: string;
    usage: QWenCompletionUsage;
    output: {
      text: string;
      finish_reason: 'stop' | 'length';
      // Note: 仅多模型支持
      choices: OpenAI.ChatCompletion.Choice[];
    };
  }

  export interface ChatCompletionChunk {
    request_id: string;
    usage: QWenCompletionUsage;
    output: {
      text: string;
      finish_reason: 'stop' | 'length' | 'null';

      // Note: 仅多模型支持
      choices: OpenAI.ChatCompletion['choices'];
    };
  }

  /**
   * - text 旧版本的 text
   * - message 兼容 openai 的 message
   *
   * @defaultValue "text"
   */
  export type ResultFormat = 'text' | 'message';

  export type ChatCompletionInputParam = {
    /**
     * 聊天上下文信息
     */
    messages: OpenAI.ChatCompletionCreateParams['messages'];
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
}

export class QWenImages extends APIResource {
  /**
   * Creates an image given a prompt.
   */
  async generate(params: QWenAI.ImageGenerateParams, options: RequestOptions = {}): Promise<OpenAI.ImagesResponse> {
    const client = this._client;

    const { headers, ...config } = options;
    const { model = 'wanx-v1', prompt, n = 1, size, cfg, ...rest } = params;

    const taskId = await client
      .post<any, Response>('/services/aigc/text2image/image-synthesis', {
        ...config,
        headers: { 'X-DashScope-Async': 'enable', ...headers },
        body: {
          model,
          input: {
            prompt,
          },
          parameters: {
            ...rest,
            // Note: 修正 OpenAI 与通义万象的兼容性问题
            ...(size ? { size: size.replace('x', '*',) } : {}),
            scale: cfg,
            n,
          },
        },
        __binaryResponse: true,
      })
      .then<QWenImages.ImageCreateTaskResponse>(res => res.json())
      .then(res => res.output.task_id);

    return this.waitTask(taskId, options).then(images => {
      return {
        created: Date.now() / 1000,
        data: images,
      };
    });
  }

  protected async waitTask(taskId: string, options?: RequestOptions): Promise<QwenImageTask.Image[]> {
    const response = await this._client
      .get<any, Response>(`/tasks/${taskId}`, {
        ...options,
        __binaryResponse: true,
      })
      .then<QWenImages.ImageTaskQueryResponse>(response => response.json());

    const { task_status } = response.output;

    if (task_status === 'PENDING' || task_status === 'RUNNING') {
      return new Promise<QwenImageTask.Image[]>(resolve => {
        setTimeout(() => resolve(this.waitTask(taskId, options)), 5000);
      });
    }

    if (task_status === 'SUCCEEDED') {
      return response.output.results.filter(result => 'url' in result) as QwenImageTask.Image[];
    }

    if (task_status === 'FAILED') {
      throw new OpenAIError((response as QWenImages.ImageTaskFailedResponse).message);
    }

    throw new OpenAIError('Unknown task status');
  }
}

export namespace QWenImages {
  export type ImageCreateTaskResponse = {
    request_id: string;
    output: {
      task_id: string;
      task_status: QwenImageTask.Status;
    };
  };

  export type ImageTaskQueryResponse =
    | ImageTaskPendingResponse
    | ImageTaskRunningResponse
    | ImageTaskFinishedResponse
    | ImageTaskFailedResponse
    | ImageTaskUnknownResponse;

  export type ImageTaskPendingResponse = {
    request_id: string;
    output: {
      task_id: string;
      task_status: 'PENDING';
      task_metrics: QwenImageTask.Metrics;
      submit_time: string;
      scheduled_time: string;
    };
  };

  export type ImageTaskRunningResponse = {
    request_id: string;
    output: {
      task_id: string;
      task_status: 'RUNNING';
      task_metrics: QwenImageTask.Metrics;
      submit_time: string;
      scheduled_time: string;
    };
  };

  export type ImageTaskFinishedResponse = {
    request_id: string;
    output: {
      task_id: string;
      task_status: 'SUCCEEDED';
      task_metrics: QwenImageTask.Metrics;
      results: (QwenImageTask.Image | QwenImageTask.FailedError)[];
      submit_time: string;
      scheduled_time: string;
      end_time: string;
    };
    usage: {
      image_count: number;
    };
  };

  export type ImageTaskFailedResponse = {
    request_id: string;
    code: string;
    message: string;
    output: {
      task_status: 'FAILED';
      task_metrics: QwenImageTask.Metrics;
      submit_time: string;
      scheduled_time: string;
    };
  };

  export type ImageTaskUnknownResponse = {
    request_id: string;
    output: {
      task_status: 'UNKNOWN';
      task_metrics: QwenImageTask.Metrics;
    };
  };
}

export namespace QwenImageTask {
  export type Image = {
    url: string;
  };

  export type FailedError = {
    code: string;
    message: string;
  };

  export type Status = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'UNKNOWN';

  export type Metrics = {
    TOTAL: number;
    SUCCEEDED: number;
    FAILED: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace QWenAI {
  export type ChatModel =
    | (string & NonNullable<unknown>)
    // 通义千问
    | 'qwen-turbo'
    | 'qwen-plus'
    | 'qwen-max'
    | 'qwen-max-1201'
    | 'qwen-max-longcontext'
    // 通义千问开源系列
    | 'qwen-7b-chat'
    | 'qwen-14b-chat'
    | 'qwen-72b-chat'
    // 多模型
    | 'qwen-vl-v1'
    | 'qwen-vl-chat-v1'
    | 'qwen-vl-plus'
    // LLAMA2
    | 'llama2-7b-chat-v2'
    | 'llama2-13b-chat-v2'
    // 百川
    | 'baichuan-7b-v1'
    | 'baichuan2-13b-chat-v1'
    | 'baichuan2-7b-chat-v1'
    // ChatGLM
    | 'chatglm3-6b'
    | 'chatglm-6b-v2';

  export interface ChatCompletionCreateParamsNonStreaming extends OpenAI.ChatCompletionCreateParamsNonStreaming {
    model: ChatModel;
  }

  export interface ChatCompletionCreateParamsStreaming extends OpenAI.ChatCompletionCreateParamsStreaming {
    model: ChatModel;
  }

  export type ChatCompletionCreateParams = ChatCompletionCreateParamsNonStreaming | ChatCompletionCreateParamsStreaming;

  export type ImageModel =
    | (string & NonNullable<unknown>)
    // 通义万相
    | 'wanx-v1'
    // Stable Diffusion
    | 'stable-diffusion-v1.5'
    | 'stable-diffusion-xl';

  export interface ImageGenerateParams {
    /**
     * The model to use for image generation.
     *
     * @defaultValue wanx-v1
     */
    model?: ImageModel | null;

    /**
     * A prompt is the text input that guides the AI in generating visual content.
     * It defines the textual description or concept for the image you wish to generate.
     * Think of it as the creative vision you want the AI to bring to life.
     * Crafting clear and creative prompts is crucial for achieving the desired results with Imagine's API.
     * For example, A serene forest with a river under the moonlight, can be a prompt.
     */
    prompt: string;

    /**
     * The negative_prompt parameter empowers you to provide additional
     * guidance to the AI by specifying what you don't want in the image.
     * It helps refine the creative direction, ensuring that the generated
     * content aligns with your intentions.
     */
    negative_prompt?: string | null;

    /**
     * The size of the generated images.
     * 
     * 通义万象目前仅支持 '1024*1024', '720*1280', '1280*720'三种分辨率，默认为1024*1024像素。
     *
     * @defaultValue 1024x1024
     */
    size?: (string & NonNullable<unknown>) | '1024x1024' | '720x1280' | '1280x720' | null;

    /**
     * The style of the generated images.
     *
     * - \<photography\> 摄影
     * - \<portrait\> 人像写真
     * - \<3d cartoon\> 3D卡通
     * - \<anime\> 动画
     * - \<oil painting\> 油画
     * - \<watercolor\>水彩
     * - \<sketch\> 素描
     * - \<chinese painting\> 中国画
     * - \<flat illustration\> 扁平插画
     * - \<auto\> 默认
     *
     * 仅 wanx-v1 模型支持
     *
     * @defaultValue <auto>
     */
    style?:
    | '<photography>'
    | '<portrait>'
    | '<3d cartoon>'
    | '<anime>'
    | '<oil painting>'
    | '<watercolor>'
    | '<sketch>'
    | '<chinese painting>'
    | '<flat illustration>'
    | '<auto>'
    | null;

    /**
     * The number of images to generate. Must be between 1 and 4.
     *
     * 通义万象目前支持1~4张，默认为1。
     * 
     * @defaultValue 1
     */
    n?: number | null;

    /**
     * The steps parameter defines the number of operations or iterations that the
     * generator will perform during image creation. It can impact the complexity
     * and detail of the generated image.
     *
     * Range: 30-50
     *
     * 仅 StableDiffusion 模型支持
     *
     * @defaultValue 40
     */
    steps?: number | null;

    /**
     * The cfg parameter acts as a creative control knob.
     * You can adjust it to fine-tune the level of artistic innovation in the image.
     * Lower values encourage faithful execution of the prompt,
     * while higher values introduce more creative and imaginative variations.
     *
     * Range: 1 - 15
     *
     * @defaultValue 10
     */
    cfg?: number | null;

    /**
     * The seed parameter serves as the initial value for the random number generator.
     * By setting a specific seed value, you can ensure that the AI generates the same
     * image or outcome each time you use that exact seed.
     *
     * range: 1-Infinity
     */
    seed?: number | null;

    /**
     * The format in which the generated images are returned.
     */
    response_format?: 'url' | null;
  }
}

export default QWenAI;
