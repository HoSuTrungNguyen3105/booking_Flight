import React, { memo, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  alpha,
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
import InputTextField from "../../common/Input/InputTextField";
import { Close, Filter, Group, Menu } from "@mui/icons-material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ChatContainer: React.FC = () => {
  const { user } = useAuth();
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const userId = user?.id;
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const {
    data: messagesData,
    emit: findMessages,
    loading: loadingMessages,
  } = useSocket<MessageBetweenUserLoginResponse>({
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

  return (
    <Box display="flex" height="80vh">
      {/* Sidebar */}
      <Stack
        sx={{
          width: isSidebarOpen ? 280 : 0,
          overflow: "hidden",
          transition: "width 0.3s ease",
          flexDirection: "column",
          bgcolor: "grey.50",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "white",
            background: `linear-gradient(135deg, ${
              theme.palette.primary.main
            } 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight="600">
              Tin nhắn {isConnected ? "success" : "default"}
            </Typography>
            <Box>
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <Badge color="error" variant="dot">
                  <Filter />
                </Badge>
              </IconButton>
              <Button variant="outlined" onClick={toggleSidebar}>
                {isSidebarOpen ? (
                  <FaArrowRight size={16} />
                ) : (
                  <FaArrowLeft size={16} />
                )}
              </Button>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<Group />}
            onClick={toggleSearchPanel}
            sx={{
              mt: 2,
              bgcolor: "white",
              color: "primary.main",
              fontWeight: "600",
              borderRadius: 2,
              py: 1,
              "&:hover": { bgcolor: "grey.100", boxShadow: theme.shadows[2] },
            }}
          >
            Tìm người dùng
          </Button>
        </Box>

        {/* Search Box */}
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <InputTextField placeholder="Tìm kiếm cuộc trò chuyện..." />
        </Box>

        {/* {!isSidebarOpen && (
          <Button sx={{ mr: 2 }} onClick={toggleSidebar}>
            <Menu />
            Return
          </Button>
        )} */}

        {/* Conversations */}
        <Conversations
          handleUserSelect={handleUserSelect}
          userId={user?.id || 0}
        />
      </Stack>

      <Drawer
        anchor="right"
        open={isSearchPanelOpen}
        onClose={toggleSearchPanel}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400,
            boxSizing: "border-box",
            boxShadow: theme.shadows[5],
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.main",
            color: "white",
            background: `linear-gradient(135deg, ${
              theme.palette.primary.main
            } 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }} fontWeight="medium">
            Tìm kiếm người dùng
          </Typography>
          <IconButton onClick={toggleSearchPanel} color="inherit">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <InputTextField
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            // onChange={(e) => handleSearch(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </Drawer>

      {/* Message List */}
      <Box
        flex={1}
        overflow="auto"
        sx={{ color: theme.palette.text.primary, mb: 2 }}
      >
        {!isSidebarOpen && (
          <Button sx={{ mr: 2 }} onClick={toggleSidebar}>
            <Menu />
            Return
          </Button>
        )}
        <MessageList
          selectedUser={receiverId as number}
          messages={messages}
          currentUser={{ id: user?.id! }}
        />
      </Box>
    </Box>
  );
};

export default memo(ChatContainer);
