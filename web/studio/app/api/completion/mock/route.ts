import { OpenAIStream, StreamingTextResponse } from 'ai';


export async function POST(req: Request) {
  const response = new ReadableStream({
    start(controller) {
      controller.enqueue('Hello World, this is from mock api');
      controller.close();
    }
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(new Response(response));
  // Respond with the stream
  return new StreamingTextResponse(stream);
}