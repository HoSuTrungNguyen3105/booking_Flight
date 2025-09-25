import React, { memo, useEffect, useState } from "react";
import { Box, alpha } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import MessageList, { type Message } from "./MessageList";
import MessageInput from "./MessageInput";
import theme from "../../scss/theme";
import { useSocket } from "../../context/use[custom]/useSocket";
import {
  connectSocket,
  disconnectSocket,
} from "../../context/use[custom]/socket";

const ChatContainer: React.FC = () => {
  const { currentUser, selectedUser } = useChat(); // người chat hiện tại + người được chọn
  const { user } = useAuth(); // user đăng nhập

  const [messages, setMessages] = useState<Message[]>([]);

  // Kết nối socket khi có user
  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("token") || "";
    connectSocket(user.id, token);

    return () => {
      disconnectSocket();
    };
  }, [user?.id]);

  // Nhận message mới từ server
  const { data: incomingMessage, isConnected } = useSocket<Message>({
    event: "new_message",
    autoListen: true,
    userId: user?.id,
  });

  // Update message list khi có message mới
  useEffect(() => {
    if (incomingMessage) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage]);

  // Gửi message
  const { emit: sendMessage } = useSocket({
    event: "send_message",
    autoListen: false,
  });

  const handleSendMessage = (content: string) => {
    if (!selectedUser?.id || !user?.id) return console.log("no");
    sendMessage(
      {
        senderId: user.id,
        receiverId: selectedUser.id,
        content,
      },
      (res) => {
        console.log("Server response:", res);
        // Server emit 'new_message' sẽ update message list
      }
    );
  };

  return (
    <Box display="flex" height="80vh">
      <Box flex={1} display="flex" flexDirection="column" p={2}>
        <Box
          sx={{
            height: "20rem",
            color: theme.palette.text.primary,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <MessageList messages={messages} currentUser={{ id: user?.id! }} />
        </Box>
        <Box
          mt={2}
          sx={{
            border: `1px solid ${theme.palette.primary.light}`,
            borderRadius: 3,
            p: 2,
            pb: 0,
            background: alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <MessageInput content={content} onSendMessage={handleSendMessage} />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(ChatContainer);
