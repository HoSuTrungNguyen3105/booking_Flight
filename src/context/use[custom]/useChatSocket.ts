import { useEffect, useState } from "react";
import { socket } from "./socket";

export const useChatSocket = (receiverId: number) => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.connect();

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message_sent", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
    };
  }, [receiverId]);

  const sendMessage = (content: string, senderId: number) => {
    socket.emit("send_message", { senderId, receiverId, content });
  };

  return { messages, sendMessage };
};
