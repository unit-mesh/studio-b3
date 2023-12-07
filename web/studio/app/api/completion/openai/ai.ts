import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const api = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export type AskParams = {
  model?: OpenAI.ChatCompletionCreateParams['model'];
  prompt: string;
  system?: string;
  temperature?: number;
  presence_penalty?: number;
  max_tokens?: number;
};

export function askAI({
  model = 'gpt-3.5-turbo',
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
