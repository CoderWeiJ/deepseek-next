
import { auth } from '@clerk/nextjs/server';
import {  getChatsByUserId } from '@/db';

export const maxDuration = 30;


export async function POST() {

  const { userId } = await auth();
  if (userId) {
    // 1. 创建一个chat
    const chats = await getChatsByUserId(userId)    
    // 2. 返回新Chat的id
    return new Response(JSON.stringify(chats), { status: 200 });
  }
  return new Response(null, { status: 200 });
}