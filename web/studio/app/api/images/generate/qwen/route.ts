import { QWenAI } from '@studio-b3/llmapi';

// 通义千问 API
// see https://platform.imagine.art/dashboard
const api = new QWenAI({
  apiKey: process.env.QWEN_API_KEY || '',
});

// export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // See https://help.aliyun.com/zh/dashscope/developer-reference/api-details-9
  const response = await api.images.generate({
    model: 'wanx-v1',
    prompt: prompt,
    n: 1,
    size: '1024*1024'
  });

  // Respond with the stream
  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
