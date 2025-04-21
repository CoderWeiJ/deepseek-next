"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import EastIcon from "@mui/icons-material/East";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChatModel, MessageModel } from "@/db/schema";
import { UIMessage } from "ai";

export default function Page() {
  const [model, setModel] = useState("deepseek-v3");
  const endRef = useRef<HTMLDivElement>(null);
  const { chat_id = "" } = useParams();
  const { data: chat } = useQuery({
    queryKey: ["chat", chat_id],
    queryFn: () => {
      return axios.post<ChatModel>(`/api/get-chat`, { chat_id });
    },
  });
  const { data: previousMessages } = useQuery({
    queryKey: ["messages", chat_id],
    queryFn: () => {
      return axios.post<MessageModel[]>(`/api/get-messages`, {
        chat_id,
        chat_user_id: chat?.data?.userId,
      });
    },
    enabled: !!chat?.data?.userId,
  });
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    body: { model, chat_id, chat_user_id: chat?.data?.userId },
    initialMessages: previousMessages?.data as unknown as UIMessage[],
  });

  function handleChangeMode() {
    setModel(model === "deepseek-v3" ? "deepseek-r1" : "deepseek-v3");
  }

  useEffect(() => {
    if (endRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //#region 第一次创建chat的时候自动请求
  async function handleFirstMessage(targetModel: string) {
    setModel(targetModel);
    
    if (chat?.data?.title && previousMessages?.data?.length === 0) {
      await append(
        { role: "user", content: chat.data.title },
        {
          body: {
            model: targetModel,
            chat_id,
            chat_user_id: chat.data?.userId,
          },
          // model: targetModel,
          // chat_id,
          // chat_user_id: chat.data?.userId,
        }
      );
    }
  }

  useEffect(() => {
    // if (chat?.data == null) {
    //   return;
    // }
    setModel(chat?.data?.model);
    handleFirstMessage(chat?.data?.model);
  }, [chat?.data?.title, previousMessages]);
  //#endregion

  return (
    <div className="flex flex-col h-screen justify-between items-center flex-1">
      <div className="flex flex-col w-2/3 gap-8 overflow-y-auto justify-between flex-1">
        <div className="flex flex-col gap-8 flex-1 mt-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg flex flex-row ${
                message?.role === "assistant"
                  ? "justify-start mr-18"
                  : "justify-end ml-10"
              }`}
            >
              {/* {message.role === "user" ? "User: " : "AI: "} */}
              <p
                className={`inline-block p-2 rounded-lg ${
                  message?.role === "assistant" ? "bg-blue-300" : "bg-slate-100"
                }`}
              >
                {message.content}
              </p>
            </div>
          ))}
        </div>

        <div ref={endRef} className="h-4"></div>

        <div className="mb-8 flex flex-col items-center justify-center mt-4 shadow-lg border-[1px] border-gray-300 h-32 rounded-lg">
          <textarea
            value={input}
            onChange={handleInputChange}
            className="w-full rounded-lg p-3 h-30 focus:outline-none resize-none"
          />
          <div className="flex flex-row items-center justify-between w-full h-12 mb-2">
            <div
              className={`flex flex-row items-center justify-center rounded-lg border-[1px] px-2 py-1 ml-2 cursor-pointer ${
                model === "deepseek-r1"
                  ? "border-blue-300 bg-blue-200"
                  : "border-gray-300"
              }`}
              onClick={() => handleChangeMode()}
            >
              <p className="text-sm select-none">深度思考(R1)</p>
            </div>

            <div
              onClick={handleSubmit}
              className="flex items-center justify-center border-2 mr-4 border-black p-1 rounded-full transition-shadow hover:cursor-pointer hover:shadow-md"
            >
              <EastIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
