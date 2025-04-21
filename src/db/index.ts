import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { chatsTable, MessageModel, messagesTable, type ChatModel } from './schema'
import { and, desc, eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);


export async function createChat(row: ChatModel) {
  try {
    const [newChat] = await db.insert(chatsTable).values(row).returning();
    return newChat;
  } catch (error) {
    console.error('[insert Chat Failed]: ', error);
    return null;
  }
}

export async function getChat(chatId: number, userId: string) {
  try {
    const chatList = await db.select().from(chatsTable)
      .where(and(eq(chatsTable.id, chatId), eq(chatsTable.userId, userId)));
    if (chatList == null || chatList.length === 0) {
      return null;
    }
    return chatList[0];
  } catch (error) {
    console.error('[select chat Failed]: ', error);
    return null;
  }
}

export async function getChatsByUserId(userId: string) {
  try {
    const chatList = await db.select().from(chatsTable)
      .where(eq(chatsTable.userId, userId)).orderBy(desc(chatsTable.id));

    if (chatList == null || chatList.length === 0) {
      return null;
    }
    return chatList;
  } catch (error) {
    console.error('[select chat Failed]: ', error);
    return null;
  }
}

export async function createMessage(row: MessageModel) {
  try {
    const [newMessage] = await db.insert(messagesTable).values(row).returning();
    return newMessage;
  } catch (error) {
    console.error('[insert Message Failed]: ', error);
    return null;
  }
}

export async function getMessagesByChatId(chatId: number) {
  try {
 
    const messages = await db.select().from(messagesTable)
      .where(eq(messagesTable.chatId, chatId))

    if (messages == null || messages.length === 0) {
      return [];
    }
    return messages;
  } catch (error) {
    console.error('[select messages Failed]: ', error);
    return null;
  }
}