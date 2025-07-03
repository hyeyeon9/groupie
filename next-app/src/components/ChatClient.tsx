"use client";

import { UserInfo } from "@/app/chat/page";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

type ChatClientProps = {
  userInfo: UserInfo;
};

export default function ChatClient({ userInfo }: ChatClientProps) {
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState<string[]>([]);

  useEffect(() => {
    // Nest.js 서버 주소 (포트는 3001로 설정했다면 그걸로)
    socket = io("http://localhost:3001");

    // 서버로부터 받은 메시지 처리
    socket.on("chat", (data: { nickname: string; message: string }) => {
      setChatList((prev) => [...prev, `${data.nickname} : ${data.message}`]);
    });

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat", {
        nickname: userInfo.nickname,
        message: message,
      }); // 서버에 chat 이벤트로 메시지 보냄
      setMessage("");
    }
  };

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-bold">💬 채팅</h2>

      <div className="border p-2 h-40 overflow-y-auto bg-white rounded">
        {chatList.map((msg, idx) => (
          <div key={idx}>👤 {msg}</div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          보내기
        </button>
      </div>
    </div>
  );
}
