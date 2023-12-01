import { OpenAIStream, StreamingTextResponse } from "ai";

import { ErnieAPI } from "./erniebot";

const api = new ErnieAPI({
	// 访问令牌通过编程对 AI Studio ⽤户进⾏身份验证
	// https://aistudio.baidu.com/index/accessToken
	token: process.env.AISTUDIO_ACCESS_TOKEN || '',
});

// export const runtime = 'edge';

export async function POST(req: Request) {
	const { prompt } = await req.json();

	const response = await api.chat.completions.create({
		model: "ernie-bot",
		stream: true,
		temperature: 0.6,
		max_tokens: 1000,
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
	});

	const stream = OpenAIStream(response);
	return new StreamingTextResponse(stream);
}
