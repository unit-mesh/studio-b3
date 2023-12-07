import { OpenAIStream, StreamingTextResponse } from 'ai';

import { askAI } from './ai'

// Set the runtime to edge for best performance
// export const runtime = 'edge';

export async function POST(req: Request) {
	const { prompt } = await req.json();

	// Ask OpenAI for a streaming completion given the prompt
	const response = await askAI({
		prompt
	});
	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);
	// Respond with the stream
	return new StreamingTextResponse(stream);
}