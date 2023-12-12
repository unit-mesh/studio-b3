import { OpenAIStream, StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  const responseData = {
    'choices': [
      {
        'finish_reason': 'stop',
        'index': 0,
        'message': {
          'content': 'The 2020 World Series was played in Texas at Globe Life Field in Arlington.',
          'role': 'assistant'
        }
      }
    ],
    'created': 1677664795,
    'id': 'chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW',
    'model': 'gpt-3.5-turbo-0613',
    'object': 'chat.completion'
  };

  const response = new Response(JSON.stringify(responseData), {
    headers: { 'Content-Type': 'application/json' }
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}