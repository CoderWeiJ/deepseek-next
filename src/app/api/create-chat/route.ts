
import { auth } from '@clerk/nextjs/server';
import { createChat } from '@/db';

export const maxDuration = 30;


export async function POST(req: Request) {

  const { title, model } = await req.json();

  const { userId } = await auth();
  if (userId) {
    // 1. 创建一个chat
    const newChat = await createChat({ title, model, userId });
    // 2. 返回新Chat的id
    return new Response(JSON.stringify({ id: newChat?.id }), { status: 200 });
  }
  return new Response(JSON.stringify({ id: null }), { status: 200 });
}