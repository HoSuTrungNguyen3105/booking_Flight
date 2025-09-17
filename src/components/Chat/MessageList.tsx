import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export interface Message {
  id: number;
  content: string;
  senderId: number;
  timestamp?: string;
}

interface MessageListProps {
  messages: Message[];
  currentUser: { id: number };
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  return (
    <Box
      height={384}
      mt={10}
      p={2}
      sx={{
        overflowY: "auto",
      }}
    >
      {messages.map((msg) => {
        const isOwnMessage = msg.senderId === currentUser.id;
        return (
          <Box
            key={msg.id}
            display="flex"
            justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
            mb={1}
          >
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
              <Typography variant="body2">{msg.content}</Typography>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default MessageList;
