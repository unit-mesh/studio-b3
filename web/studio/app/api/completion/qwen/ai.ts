import OpenAI from 'openai';
import { QWenAI } from '@studio-b3/llmapi';

const api = new QWenAI({
  // https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key
  apiKey: process.env.QWEN_API_KEY || '',
});

export type AskParams = {
  model?: QWenAI.ChatModel;
  prompt: string;
  system?: string;
  temperature?: number;
  presence_penalty?: number;
  max_tokens?: number;
};

export function askAI({
  model = 'qwen-max',
  prompt,
  system,
  max_tokens,
  temperature = 0.9,
  ...rest
}: AskParams) {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  if (system) {
    messages.unshift({
      role: 'system',
      content: system,
    });
  }

  return api.chat.completions.create({
    ...rest,
    stream: true,
    model,
    temperature,
    max_tokens,
    messages,
  });
}
