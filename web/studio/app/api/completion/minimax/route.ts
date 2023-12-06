import { OpenAIStream, StreamingTextResponse } from 'ai';

import { MinimaxAI } from '@studio-b3/llmapi';

// See https://api.minimax.chat/user-center/basic-information/interface-key
const api = new MinimaxAI({
  orgId: process.env.MINIMAX_API_ORG,
  apiKey: process.env.MINIMAX_API_KEY,
});

// export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await api.chat.completions.create({
    model: 'abab5.5-chat',
    stream: true,
    temperature: 0.6,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
