import { VYroAI } from '@studio-b3/llmapi';

// Imagine Art
// see https://platform.imagine.art/dashboard
const api = new VYroAI({
  apiKey: process.env.VYRO_API_KEY,
  apiType: process.env.VYRO_API_TYPE,
});

// export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const response = await api.images.generate({
    model: 'imagine-v5',
    prompt: prompt,
  });

  // TODO 目前只支持单图
  const image = response.data[0].binary!;

  // Respond with the stream
  return new Response(image as globalThis.ReadableStream, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
