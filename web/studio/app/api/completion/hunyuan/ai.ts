import OpenAI from 'openai';
import { HunYuanAI } from '@studio-b3/llmapi';

const api = new HunYuanAI({
  // see https://console.cloud.tencent.com/cam/capi
  appId: process.env.HUNYUAN_APP_ID,
  secretId: process.env.HUNYUAN_SECRET_ID,
  secretKey: process.env.HUNYUAN_SECRET_KEY
});

export type AskParams = {
  model?: HunYuanAI.ChatModel;
  prompt: string;
  system?: string;
  temperature?: number;
  presence_penalty?: number;
  max_tokens?: number;
};

export function askAI({
  model = 'hunyuan',
  prompt,
  system,
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
    messages,
  });
}
