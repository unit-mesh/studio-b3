import { OpenAIStream, StreamingTextResponse } from "ai";

import { ErnieAPI } from "../../../../shared/erniebot";

const api = new ErnieAPI({
	// 访问令牌通过编程对 AI Studio ⽤户进⾏身份验证
	// https://aistudio.baidu.com/index/accessToken
	token: process.env.AISTUDIO_ACCESS_TOKEN || '',
});

// Set the runtime to edge for best performance
// export const runtime = 'edge';

export async function POST(req: Request) {
	const { prompt } = await req.json();

	// Ask OpenAI for a streaming completion given the prompt
	const response = await api.chat.completions.create({
		model: "ernie-bot",
		stream: true,
		temperature: 0.6,
		max_tokens: 300,
		messages: [
			{
				role: "user",
				content: `Create three slogans for a business with unique features.
 
Business: Bookstore with cats
Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles"
Business: Gym with rock climbing
Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit"
Business: ${prompt}
Slogans:`,
			},
		],
	});

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);

	// Respond with the stream
	return new StreamingTextResponse(stream);
}
