import React, { memo, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  alpha,
  Drawer,
  useMediaQuery,
  Chip,
  Avatar,
  InputAdornment,
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
import {
  ArrowBack,
  Filter,
  Group,
  Search,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";

const ChatContainer: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const userId = user?.id;

  // Responsive sidebar handling
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) setIsSidebarOpen(false);
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

  const handleUserSelect = (user: number) => {
    setSelectedUser(user);
    setReceiverId(user);
    closeSidebar(); // Close sidebar on mobile when user is selected

    if (userId && user) {
      findMessages({ userId, user2Id: user });
    }
  };

  // Socket connection
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

  // Sidebar Content Component
  const SidebarContent = () => (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: `1px solid ${theme.palette.divider}`,
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="600">
            Tin nhắn
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              color="inherit"
              onClick={() =>
                setActiveFilter(activeFilter === "unread" ? "all" : "unread")
              }
              sx={{
                opacity: activeFilter === "unread" ? 1 : 0.7,
                transition: "all 0.2s ease",
              }}
            >
              <Badge
                color="error"
                variant={activeFilter === "unread" ? "standard" : "dot"}
                invisible={activeFilter === "unread"}
              >
                <Filter />
              </Badge>
            </IconButton>
            {isMobile && (
              <IconButton color="inherit" onClick={closeSidebar}>
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Filter Chips */}
        <Box display="flex" gap={1} mt={2}>
          <Chip
            label="Tất cả"
            variant={activeFilter === "all" ? "filled" : "outlined"}
            onClick={() => setActiveFilter("all")}
            sx={{
              color: activeFilter === "all" ? "primary.main" : "inherit",
              bgcolor: activeFilter === "all" ? "white" : "transparent",
              borderColor: "white",
              "&:hover": { bgcolor: alpha("#fff", 0.1) },
            }}
          />
          <Chip
            label="Chưa đọc"
            variant={activeFilter === "unread" ? "filled" : "outlined"}
            onClick={() => setActiveFilter("unread")}
            sx={{
              color: activeFilter === "unread" ? "primary.main" : "inherit",
              bgcolor: activeFilter === "unread" ? "white" : "transparent",
              borderColor: "white",
              "&:hover": { bgcolor: alpha("#fff", 0.1) },
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<Group />}
          sx={{
            mt: 2,
            bgcolor: "white",
            color: "primary.main",
            fontWeight: "600",
            borderRadius: 2,
            py: 1.5,
            boxShadow: theme.shadows[2],
            "&:hover": {
              bgcolor: "grey.50",
              boxShadow: theme.shadows[4],
              transform: "translateY(-1px)",
              transition: "all 0.2s ease",
            },
          }}
        >
          Tìm người dùng
        </Button>
      </Box>

      {/* Search Box */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <InputTextField
          placeholder="Tìm kiếm cuộc trò chuyện..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e)}
        />
      </Box>

      {/* Conversations */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Conversations
          handleUserSelect={handleUserSelect}
          userId={user?.id || 0}
        />
      </Box>
    </Stack>
  );

  return (
    <Box
      display="flex"
      height="80vh"
      sx={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: isSidebarOpen ? 320 : 0,
            minWidth: isSidebarOpen ? 320 : 0,
            transition: "all 0.3s ease",
            overflow: "hidden",
            display: { xs: "none", md: "block" },
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Drawer for Mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={closeSidebar}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: "100%",
              maxWidth: 400,
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: "background.paper",
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {(!isSidebarOpen || isMobile) && (
            <IconButton
              onClick={toggleSidebar}
              sx={{
                color: "text.primary",
                bgcolor: "action.hover",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {receiverId ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography variant="h6" fontWeight="600">
                  Người dùng #{receiverId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đang hoạt động
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="h6" color="text.secondary">
              Chọn một cuộc trò chuyện để bắt đầu
            </Typography>
          )}
        </Box>

        {/* Message List */}
        <Box flex={1} overflow="auto">
          <MessageList
            selectedUser={receiverId as number}
            messages={messages}
            currentUser={{ id: user?.id! }}
          />
        </Box>
      </Box>

      {/* Floating Toggle Button for Mobile */}
      {isMobile && !isSidebarOpen && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "primary.main",
            color: "white",
            boxShadow: theme.shadows[4],
            zIndex: 1000,
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default memo(ChatContainer);
