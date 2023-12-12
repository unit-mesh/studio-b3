import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { Response } from 'openai/src/core';

export async function POST(req: Request) {
  const responseData = {
    "choices": [
      {
        "message": {
          "content": "Hello, world",
          "role": "assistant"
        }
      }
    ],
    "created": 1677664795,
    "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
    "model": "gpt-3.5-turbo-0613",
    "object": "chat.completion",
  }

  const response = new Response(JSON.stringify(responseData), {
    headers: { 'Content-Type': 'application/json' },
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}