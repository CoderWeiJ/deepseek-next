
import { auth } from '@clerk/nextjs/server';
import { getChat } from '@/db';
import { unauthorized }  from 'next/navigation'


export async function POST(req: Request) {
  const { chat_id } = await req.json();

  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({error: unauthorized}), { status: 401 });
  }

  // 1. 创建一个chat
  const chat = await getChat(chat_id, userId);
  
  // 2. 返回新Chat的id
  return new Response(JSON.stringify(chat), { status: 200 });
}