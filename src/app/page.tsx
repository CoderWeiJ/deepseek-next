"use client";

import { useState } from "react";
import EastIcon from "@mui/icons-material/East";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [model] = useState("deepseek-v3");
  const { user } = useUser();
  const queryClient = useQueryClient();



  const { mutate: createChat } = useMutation({
    mutationFn: () => {
      return axios.post("/api/create-chat", { title: question, model });
    },
    onSuccess: (res) => {

      router.push(`chat/${res.data.id}`)
      // 刷新缓存（key）
      queryClient.invalidateQueries({ queryKey: ['chats']})
    },
  });

  function handleSubmit() {
    if (question.trim() === '') {
      return;
    }
    if (!user) {
      router.push(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '')
      return;
    }

    createChat();
  }

  return (
    <div className="flex flex-col items-center h-screen flex-1">
      <div className="h-1/5"></div>
      <div className="w-1/2">
        <p className="text-bold text-2xl text-center">有什么可以帮您的吗</p>
        <div className="flex flex-col items-center justify-center mt-4 shadow-lg border-[1px] border-gray-300 h-32 rounded-lg">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-lg p-3 h-30 focus:outline-none resize-none"
          />
          <div className="flex flex-row items-center justify-between w-full h-12 mb-2">
            <div
              className={`flex flex-row items-center justify-center rounded-lg border-[1px] px-2 py-1 ml-2 cursor-pointer ${
                model === "deepseek-r1"
                  ? "border-blue-300 bg-blue-200"
                  : "border-gray-300"
              }`}
            >
              <p className="text-sm">深度思考R1</p>
            </div>

            <div className="flex items-center justify-center border-2 mr-4 border-black p-1 rounded-full transition-shadow hover:cursor-pointer hover:shadow-md" onClick={handleSubmit}>
              <EastIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
