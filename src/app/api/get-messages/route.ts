
import { auth } from '@clerk/nextjs/server';
import {  getMessagesByChatId } from '@/db';
import { unauthorized } from 'next/navigation'

export const maxDuration = 30;


export async function POST(req: Request) {
  
  const { chat_id, chat_user_id } = await req.json();
  const { userId } = await auth();

  
  if (!userId || chat_user_id !== userId) {
    return new Response(JSON.stringify({error: unauthorized}), { status: 401 })
  }

  // 1. 创建一个chat
  const messages = await getMessagesByChatId(chat_id);    

  // 2. 返回新Chat的id
  return new Response(JSON.stringify(messages), { status: 200 });
  
}