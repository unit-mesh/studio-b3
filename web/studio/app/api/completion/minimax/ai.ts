import OpenAI from 'openai';
import { MinimaxAI } from '@studio-b3/llmapi';

// See https://api.minimax.chat/user-center/basic-information/interface-key
const api = new MinimaxAI({
  orgId: process.env.MINIMAX_API_ORG,
  apiKey: process.env.MINIMAX_API_KEY,
});

export type AskParams = {
  model?: MinimaxAI.ChatModel;
  prompt: string;
  system?: string;
  temperature?: number;
  presence_penalty?: number;
  max_tokens?: number;
};

export function askAI({
  model = 'abab5-chat',
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
