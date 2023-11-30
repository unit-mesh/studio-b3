import { OpenAIStream, StreamingTextResponse } from "ai";

import QWenAI from "./qwen";

const api = new QWenAI({
  // https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key
  apiKey: process.env.QWEN_API_KEY || "",
});

// export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await api.chat.completions.create({
    model: "qwen-turbo",
    stream: true,
    temperature: 0.6,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  
	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);
  
	// Respond with the stream
	return new StreamingTextResponse(stream);
}
