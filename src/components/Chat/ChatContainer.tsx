import React, { memo, useEffect, useState } from "react";
import { Box, alpha } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import theme from "../../scss/theme";
import { useSocket } from "../../context/use[custom]/useSocket";
import {
  connectSocket,
  disconnectSocket,
} from "../../context/use[custom]/socket";
import type { Message } from "../../utils/type";
import ChatSidebar from "./ChatSidebar";

const ChatContainer: React.FC = () => {
  const { selectedUser } = useChat();
  const { user } = useAuth(); // User đăng nhập

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  // Kết nối socket khi có user
  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("token") || "";
    connectSocket(user.id, token);

    return () => {
      disconnectSocket();
    };
  }, [user?.id]);

  const { emit: sendMessage, isConnected } = useSocket({
    event: "send_message",
    autoListen: false, // không cần listen ở đây
  });

  const { data: incomingMessage } = useSocket<Message>({
    event: "new_message",
    autoListen: true,
    userId: user?.id,
    onSuccess: (msg) => {
      console.log("Tin nhắn mới nhận:", msg);
    },
  });

  useEffect(() => {
    if (incomingMessage) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage]);

  const handleSend = () => {
    if (!content.trim()) return;
    if (!user?.id || !selectedUser?.id) return;

    sendMessage(
      {
        senderId: user.id,
        receiverId: selectedUser.id,
        content,
      },
      (res) => {
        console.log("Đã gửi tin nhắn:", res);
        setMessages((prev) => [...prev, res]); // hiển thị ngay trên UI
      }
    );

    setContent("");
  };

  return (
    <Box display="flex" height="80vh">
      <Box flex={1} display="flex" flexDirection="column" p={2}>
        {/* Message list */}
        {/* <ChatSidebar /> */}
        <Box
          flex={1}
          overflow="auto"
          sx={{
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          <MessageList messages={messages} currentUser={{ id: user?.id! }} />
        </Box>

        {/* Message input */}
        <Box
          sx={{
            border: `1px solid ${theme.palette.primary.light}`,
            borderRadius: 3,
            p: 2,
            pb: 0,
            background: alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <MessageInput content={content} onSendMessage={handleSend} />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(ChatContainer);
