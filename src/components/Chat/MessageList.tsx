import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useSocket } from "../../context/use[custom]/useSocket";

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  sender: {
    id: number;
    name: string;
    pictureUrl: string;
    email: string;
  };
  receiver: {
    id: number;
    name: string;
    pictureUrl: string;
    email: string;
  };
}

interface MessageListProps {
  messages: Message[];
  currentUser: { id: number };
}

interface MessageListProps {
  messages: Message[];
  currentUser: { id: number };
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  // const { user } = useAuth();
  const [messagesData, setMessages] = useState<Message[]>(messages);

  const { data: newMessage, isConnected } = useSocket<Message>({
    event: "new_message",
    autoListen: true,
    userId: currentUser?.id,
    onSuccess: (message) => {
      // Kiểm tra xem tin nhắn có thuộc cuộc trò chuyện hiện tại không
      if (
        currentUser &&
        (message.senderId === currentUser.id ||
          message.receiverId === currentUser.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    },
    onError: (error) => {
      console.error("Lỗi nhận tin nhắn:", error);
    },
  });

  const { emit: sendMessage, loading: sending } = useSocket({
    event: "send_message",
    autoListen: false, // Chỉ dùng để gửi, không lắng nghe
  });

  const handleSendMessage = (content: string, receiverId: number) => {
    if (!currentUser) return;

    sendMessage(
      {
        content,
        senderId: currentUser.id,
        receiverId,
      },
      (response) => {
        console.log("Tin nhắn đã gửi:", response);
      }
    );
  };

  return (
    <Box
      height={384}
      mt={10}
      p={2}
      sx={{
        overflowY: "auto",
      }}
    >
      <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
      {messagesData.map((msg) => {
        const isOwnMessage = msg.senderId === currentUser.id;
        return (
          <Box
            key={msg.id}
            display="flex"
            justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
            alignItems="flex-end"
            mb={1}
          >
            {!isOwnMessage && (
              <Box mr={1}>
                <img
                  src={msg.sender.pictureUrl}
                  alt={msg.sender.name}
                  style={{ width: 32, height: 32, borderRadius: "50%" }}
                />
              </Box>
            )}

            <Paper
              elevation={2}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 3,
                maxWidth: "60%",
                bgcolor: isOwnMessage ? "primary.main" : "grey.300",
                color: isOwnMessage ? "white" : "black",
              }}
            >
              {!isOwnMessage && (
                <Typography variant="caption" color="text.secondary">
                  {msg.sender.name}
                </Typography>
              )}
              <Typography variant="body2">{msg.content}</Typography>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default MessageList;
