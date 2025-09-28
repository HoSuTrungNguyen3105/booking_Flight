import React, { useState, useEffect, useRef } from "react";
import {
  alpha,
  Box,
  Fab,
  IconButton,
  Typography,
  Zoom,
  Paper,
  Badge,
} from "@mui/material";
import { useSocket } from "../../context/use[custom]/useSocket";
import type {
  Message,
  MessageBetweenUserLoginResponse,
} from "../../utils/type";
import theme from "../../scss/theme";
import { AttachFile, EmojiEmotions, Mic, Send } from "@mui/icons-material";
import InputTextField from "../../common/Input/InputTextField";

interface MessageListProps {
  messages: Message[];
  currentUser: { id: number };
  selectedUser: number;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  selectedUser,
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
  const { data: messageResponse, loading: loadingMessages } =
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

  // auto scroll xuống cuối khi có tin nhắn mới
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messagesData]);

  return (
    <Paper
      elevation={3}
      sx={{
        height: 500,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Chat messages */}
      <Box
        flex={1}
        p={2}
        sx={{ overflowY: "auto", backgroundColor: "grey.50" }}
      >
        {/* <Typography variant="caption" color="text.secondary">
          {isConnected ? "🟢 Đang kết nối" : "🔴 Mất kết nối"}
        </Typography> */}

        {selectedUser ? (
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              // color={isConnected ? "success" : "default"}
            >
              {/* <ImageThumbnail url={ImageAvatar} /> */}
            </Badge>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {selectedUser}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ flexGrow: 1 }} fontWeight="medium">
            Enterprise Chat
          </Typography>
        )}
        {messagesData.length > 0 ? (
          messagesData.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent:
                  msg.senderId === userId ? "flex-end" : "flex-start",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  bgcolor:
                    msg.senderId === userId
                      ? theme.palette.primary.main
                      : "white",
                  color: msg.senderId === userId ? "white" : "text.primary",
                  boxShadow: theme.shadows[2],
                }}
              >
                <Typography variant="body1">{msg.content}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    color:
                      msg.senderId === userId
                        ? alpha("#fff", 0.7)
                        : "text.secondary",
                    mt: 0.5,
                  }}
                >
                  {new Date(Number(msg.createdAt)).toLocaleString("vi-VN")}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary" textAlign="center" mt={2}>
            {messageResponse?.data?.resultMessage || "Chưa có tin nhắn nào"}
          </Typography>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Message input */}
      <Box
        sx={{
          p: 1.5,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <AttachFile />
          </IconButton>
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <EmojiEmotions />
          </IconButton>
          <InputTextField
            placeholder="Nhập tin nhắn..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e)}
            onKeyDown={handleKeyPress}
            sx={{
              flex: 1,
              bgcolor: "grey.100",
              borderRadius: 2,
              px: 1.5,
              py: 1,
            }}
          />
          <Zoom in={inputMessage.length > 0}>
            <Fab
              color="primary"
              size="small"
              onClick={handleSendMessage}
              sx={{ boxShadow: theme.shadows[3] }}
            >
              <Send />
            </Fab>
          </Zoom>
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <Mic />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default MessageList;
