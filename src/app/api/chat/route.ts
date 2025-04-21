import { streamText, UIMessage } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek'

import { auth } from '@clerk/nextjs/server';
import { createMessage } from '@/db';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.BASE_URL,
})

export async function POST(req: Request) {
  const { messages, chat_id, chat_user_id } = await req.json();

  const { userId } = await auth();
  if (!userId || userId !== chat_user_id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const lastMessage = messages[messages.length - 1] as UIMessage;

  await createMessage({ chatId: chat_id, content: lastMessage.content, role: lastMessage.role })

  const result = streamText({
    model: deepseek('deepseek-v3'),
    system: 'You are a helpful assistant.',
    messages,
    onFinish: async (result) => {      
      await createMessage({ chatId: chat_id, content: result.text, role: 'assistant' })
    }
  });

  return result.toDataStreamResponse();
}