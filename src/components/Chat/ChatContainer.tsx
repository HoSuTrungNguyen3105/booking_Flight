import React, { memo, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import MessageList from "./MessageList";
import theme from "../../scss/theme";
import { useSocket } from "../../context/use[custom]/useSocket";
import { connectSocket, disconnectSocket } from "../../hooks/socket";
import type {
  Message,
  MessageBetweenUserLoginResponse,
} from "../../utils/type";
import Conversations from "./Conversations";
import { Filter, Group } from "@mui/icons-material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ChatContainer: React.FC = () => {
  const { user } = useAuth();
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const userId = user?.id;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { emit: findMessages } = useSocket<MessageBetweenUserLoginResponse>({
    event: "findMessagesBetweenUsers",
    autoListen: true,
    onSuccess: (res) => {
      if (res?.data?.resultCode === "00") {
        console.log("Messages between users");
      } else {
        console.warn("Server error:", res?.data?.resultMessage);
      }
    },
  });

  const toggleSearchPanel = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
  };

  const handleUserSelect = (user: number) => {
    setSelectedUser(user);
    setReceiverId(user);

    if (userId && user) {
      findMessages({ userId, user2Id: user }); // emit socket
    }
  };

  const { isConnected } = useSocket<Message>({
    event: "new_message",
    autoListen: true,
    userId,
    onSuccess: (message) => {
      if (
        userId &&
        (message.sender.id === userId || message.receiver.id === userId)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    },
  });

  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("token") || "";
    connectSocket(user.id, token);

    return () => {
      disconnectSocket();
    };
  }, [user?.id]);

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

  return (
    <Box
      display="flex"
      height="calc(100vh - 64px)"
      sx={{
        bgcolor: "background.default",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: isSidebarOpen ? 320 : 0,
          minWidth: isSidebarOpen ? 320 : 0,
          transition: "all 0.35s ease-in-out",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          zIndex: 10,
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            p: 2.5,
            background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header content */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                fontSize="1.1rem"
                lineHeight={1.4}
              >
                Enterprise Chat
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.3,
                  opacity: 0.9,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: isConnected ? "success.main" : "error.main",
                  }}
                />
                {isConnected ? "Connected" : "Disconnected"}
              </Typography>
            </Box>

            {/* Sidebar Actions */}
            <Box display="flex" gap={1}>
              <Tooltip title="Filter conversations">
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  }}
                >
                  <Badge color="error" variant="dot">
                    <Filter fontSize="small" htmlColor="#fff" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip
                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <IconButton
                  size="small"
                  onClick={toggleSidebar}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  }}
                >
                  {isSidebarOpen ? (
                    <FaArrowLeft size={14} color="#fff" />
                  ) : (
                    <FaArrowRight size={14} color="#fff" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Find Users Button */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<Group />}
            onClick={toggleSearchPanel}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.1,
              textTransform: "none",
              fontSize: "0.9rem",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: "grey.50",
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[3],
              },
            }}
          >
            Find Users
          </Button>
        </Box>

        {/* Chat List */}
        <Box sx={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin" }}>
          <Conversations
            selectedUser={selectedUser || 0}
            handleUserSelect={handleUserSelect}
            userId={user?.id || 0}
          />
        </Box>
      </Paper>

      {/* Main Chat Area */}
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        sx={{
          transition: "all 0.3s ease",
          bgcolor: "background.paper",
        }}
      >
        <MessageList
          selectedUser={receiverId as number}
          messages={messages}
          currentUser={{ id: user?.id! }}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </Box>
    </Box>
  );
};

export default memo(ChatContainer);
