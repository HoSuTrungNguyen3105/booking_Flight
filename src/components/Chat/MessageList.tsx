import React, { useState, useRef } from "react";
import {
  Box,
  Fab,
  IconButton,
  Typography,
  Zoom,
  Paper,
  Badge,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useSocket } from "../../context/use[custom]/useSocket";
import type {
  Message,
  MessageBetweenUserLoginResponse,
} from "../../utils/type";
import theme from "../../scss/theme";
import {
  AttachFile,
  EmojiEmotions,
  Menu,
  Mic,
  Send,
} from "@mui/icons-material";
import InputTextField from "../../common/Input/InputTextField";
import { DateFormatEnum, formatDate } from "../../hooks/format";

interface MessageListProps {
  messages: Message[];
  currentUser: { id: number };
  selectedUser: number;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  selectedUser,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messagesData, setMessages] = useState<Message[]>(messages ?? []);
  const userId = currentUser.id;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // socket gửi tin nhắn
  const { emit: sendMessage } = useSocket<any>({
    event: "send_message",
    autoListen: false,
    onSuccess: (res) => {
      if (res?.data?.resultCode === "00") {
        console.log("Gửi thành công");
      } else {
        console.warn("Server error:", res?.data?.resultMessage);
      }
    },
    onError: (err) => console.error("Lỗi gửi:", err),
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedUser) return;

    sendMessage({
      senderId: userId,
      receiverId: selectedUser,
      content: inputMessage,
    });

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // lấy lịch sử tin nhắn khi chọn user
  useSocket<MessageBetweenUserLoginResponse>({
    event: "findMessagesBetweenUsers",
    autoListen: true,
    onSuccess: (res) => {
      if (res?.data?.resultCode === "00") {
        setMessages(res.data.list || []);
      } else {
        console.warn("Server error:", res?.data?.resultMessage);
      }
    },
  });

  // lắng nghe tin nhắn mới từ server
  const { isConnected } = useSocket<Message>({
    event: "new_message",
    autoListen: true,
    userId: currentUser?.id,
    onSuccess: (message) => {
      if (
        currentUser &&
        (message.sender.id === currentUser.id ||
          message.receiver.id === currentUser.id)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    },
  });

  return (
    <Box
      flex={1}
      height={"90vh"}
      display="flex"
      flexDirection="column"
      minWidth={0}
    >
      {/* Chat Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          borderRadius: 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {!isSidebarOpen && (
            <Tooltip title="Show sidebar">
              <IconButton
                onClick={toggleSidebar}
                size="small"
                sx={{
                  backgroundColor: "action.hover",
                  "&:hover": { backgroundColor: "action.selected" },
                }}
              >
                <Menu />
              </IconButton>
            </Tooltip>
          )}

          {selectedUser ? (
            <Box display="flex" alignItems="center" gap={2} flex={1}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                color={isConnected ? "success" : "default"}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "primary.main",
                  }}
                >
                  {selectedUser}
                </Avatar>
              </Badge>
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {selectedUser}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isConnected ? "Online" : "Offline"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box flex={1}>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Welcome to Enterprise Chat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Messages Area */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          backgroundColor: "grey.50",
          overflow: "hidden",
        }}
      >
        {/* Messages Container */}
        <Box
          flex={1}
          p={3}
          sx={{
            overflowY: "auto",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          {messagesData.length > 0 ? (
            <>
              {messagesData.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.senderId === userId ? "flex-end" : "flex-start",
                    mb: 2,
                    animation: "fadeIn 0.3s ease",
                    "@keyframes fadeIn": {
                      from: { opacity: 0, transform: "translateY(10px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      px: 2.5,
                      py: 1.5,
                      borderRadius: 3,
                      borderTopLeftRadius: msg.senderId === userId ? 3 : 1,
                      borderTopRightRadius: msg.senderId === userId ? 1 : 3,
                      backgroundColor:
                        msg.senderId === userId ? "primary.main" : "white",
                      color: msg.senderId === userId ? "white" : "text.primary",
                      boxShadow: theme.shadows[1],
                      position: "relative",
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                      {msg.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        opacity: 0.7,
                        mt: 0.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {formatDate(
                        DateFormatEnum.HH_MM_A,
                        Number(msg.createdAt)
                      )}
                      {/* {new Date(Number(msg.createdAt)).toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })} */}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </>
          ) : selectedUser ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No messages yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start the conversation by sending a message
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select a conversation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a contact from the sidebar to start chatting
              </Typography>
            </Box>
          )}
          <div ref={bottomRef} />
        </Box>

        {/* Message Input */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Attach file">
              <IconButton
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <AttachFile fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Emoji">
              <IconButton
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <EmojiEmotions fontSize="small" />
              </IconButton>
            </Tooltip>

            <InputTextField
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e)}
              onKeyDown={handleKeyPress}
              disabled={!selectedUser}
            />

            <Zoom in={inputMessage.length > 0}>
              <Tooltip title="Send message">
                <Fab
                  color="primary"
                  size="small"
                  onClick={handleSendMessage}
                  disabled={!selectedUser}
                  sx={{
                    boxShadow: theme.shadows[2],
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Send fontSize="small" />
                </Fab>
              </Tooltip>
            </Zoom>

            <Tooltip title="Voice message">
              <IconButton
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <Mic fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MessageList;
