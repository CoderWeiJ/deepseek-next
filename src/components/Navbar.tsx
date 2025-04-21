"use client";

import { ChatModel } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: () => {
      return axios.post<ChatModel[]>("/api/get-chats");
    },
    enabled: !!user?.id,
  });

  const pathname = usePathname();


  return (
    <div className="h-screen bg-gray-50">
      <div className="flex items-center justify-center">
        <p className="font-bold text-2xl">Deepseek</p>
      </div>

      <div
        className="h-10 flex items-center justify-center mt-4 cursor-pointer"
        onClick={() => {
          router.push(`/`);
        }}
      >
        <p className="h-full w-2/3 bg-blue-100 rounded-lg flex items-center justify-center font-thin text-1xl">
          创建新会话
        </p>
      </div>

      {/* 目录 */}
      <div className="flex items-center justify-center flex-col gap-2 p-6">
        {chats?.data?.map((chat) => {
          return (
            <div
              className="w-full h-10 cursor-pointer"
              key={chat.id}
              onClick={() => {
                router.push(`/chat/${chat.id}`);
              }}
            >
              <p
                className={`font-extralight text-sm line-clamp-1 hover:shadow-cyan-400 transition-shadow ${
                  pathname === `/chat/${chat.id}` ? "text-blue-700" : ""
                }`}
              >
                {chat.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
