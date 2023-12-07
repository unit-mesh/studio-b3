import { OpenAIStream, StreamingTextResponse } from 'ai';

import { askAI } from './ai'

// export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await askAI({
    prompt
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
