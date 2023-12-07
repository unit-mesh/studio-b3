import OpenAI from 'openai';
import { ErnieAI } from '@studio-b3/llmapi';

const api = new ErnieAI({
  // 访问令牌通过编程对 AI Studio ⽤户进⾏身份验证
  // https://aistudio.baidu.com/index/accessToken
  token: process.env.AISTUDIO_ACCESS_TOKEN || '',
});

export type AskParams = {
  model?: ErnieAI.ChatModel;
  prompt: string;
  system?: string;
  temperature?: number;
  presence_penalty?: number;
  max_tokens?: number;
};

export function askAI({
  model = 'ernie-bot',
  prompt,
  system,
  temperature = 0.6,
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
