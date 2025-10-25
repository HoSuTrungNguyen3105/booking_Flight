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
import {
  connectSocket,
  disconnectSocket,
} from "../../context/use[custom]/socket";
import type {
  Message,
  MessageBetweenUserLoginResponse,
} from "../../utils/type";
import Conversations from "./Conversations";
import { Filter, Group } from "@mui/icons-material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import SearchUser from "./SearchUser";

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
    console.log("userid", user);
    // setIsSearchPanelOpen(false);

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

  // Kết nối socket khi có user
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

  console.log("receiverId", receiverId);
  console.log("selectedUser", selectedUser);
  console.log("user", user?.id);

  return (
    <Box
      display="flex"
      height="90vh"
      sx={{ bgcolor: "background.default", overflow: "hidden" }}
    >
      {/* Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: isSidebarOpen ? 320 : 0,
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          borderRight: 1,
          borderColor: "divider",
          zIndex: 10,
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            p: 2.5,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {/* Title + Status */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box>
              <Typography variant="h6" fontWeight="700" fontSize="1.2rem">
                Enterprise Chat
              </Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <Typography variant="caption" fontWeight="500">
                  {isConnected ? "Connected" : "Disconnected"}
                </Typography>
              </Box>
            </Box>

            {/* Actions */}
            <Box display="flex" gap={1}>
              <Tooltip title="Filter conversations">
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  <Badge color="error" variant="dot">
                    <Filter fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip
                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={toggleSidebar}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  {isSidebarOpen ? (
                    <FaArrowLeft size={14} />
                  ) : (
                    <FaArrowRight size={14} />
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
              mt: 1,
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.2,
              textTransform: "none",
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
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

        {/* Conversations */}
        <Conversations
          selectedUser={selectedUser || 0}
          handleUserSelect={handleUserSelect}
          userId={user?.id || 0}
        />
      </Paper>

      {/* Main Chat Area */}
      <Box flexGrow={1} display="flex" flexDirection="column">
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
