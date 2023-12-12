import { OpenAIStream, StreamingTextResponse } from 'ai';

import * as minimax from './minimax/ai';
import * as openai from './openai/ai';
import * as qwen from './qwen/ai';
import * as yiyan from './yiyan/ai';
import * as hunyuan from './hunyuan/ai';

export type AskParams =
  | minimax.AskParams
  | openai.AskParams
  | qwen.AskParams
  | yiyan.AskParams;

const handlers = [
  {
    match: /abab/,
    handle: minimax.askAI,
  },
  {
    match: /qwen/,
    handle: qwen.askAI,
  },
  {
    match: /ernie/,
    handle: yiyan.askAI,
  },
  {
    match: /hunyuan/,
    handle: hunyuan.askAI,
  },
];

const fallback = openai.askAI;

function askAI(params: AskParams) {
  const model = params.model;

  if (!model) return fallback(params);

  const matches = handlers.find((h) => h.match.test(model));
  const handle = matches?.handle || fallback;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return handle(params);
}

export async function POST(req: Request) {
  const response = await askAI(await req.json());

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
