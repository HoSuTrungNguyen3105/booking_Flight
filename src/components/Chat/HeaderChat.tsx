import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Badge,
  Chip,
  Button,
  Drawer,
  AppBar,
  Toolbar,
  Stack,
  alpha,
  Divider,
  Fab,
  Zoom,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Mic as MicIcon,
  FilterList as FilterIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  MarkEmailUnread as UnreadIcon,
} from "@mui/icons-material";
import theme from "../../scss/theme";
import InputTextField from "../../common/Input/InputTextField";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSocket } from "../../context/use[custom]/useSocket";
import type {
  Message,
  MessageBetweenUserLoginResponse,
  ResConversationsResponse,
} from "../../utils/type";
import { socket } from "../../context/use[custom]/socket";
import { useAuth } from "../../context/AuthContext";
import ChatContainer from "./ChatContainer";

const ChatApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const { user } = useAuth();
  const userId = user?.id;
  // const { data, loading } = useSocket<ResConversationsResponse>({
  //   event: "getConversationsResponse",
  //   autoListen: true,
  //   userId,
  //   onSuccess: (res) => {
  //     if (res?.resultCode === "00") {
  //       console.log("Conversations:", res.list);
  //     } else {
  //       console.warn(" Server error:", res?.resultMessage);
  //     }
  //   },
  // });

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { emit: sendMessage, loading: sending } = useSocket<any>({
    event: "send_message",
    autoListen: false,
    onSuccess: (res) => {
      if (res?.data?.resultCode === "00") {
        setMessage(res.data.list); // cập nhật state local
      } else {
        console.warn("Server error:", res?.data?.resultMessage);
      }
    },

    onError: (err) => console.error("Lỗi gửi:", err),
  });

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    sendMessage({
      senderId: userId,
      receiverId: receiverId,
      content: message,
    });
    setMessage("");
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

  // --- Khi chọn user ---
  const handleUserSelect = (user: number) => {
    setSelectedUser(user);
    setReceiverId(user);
    setIsSearchPanelOpen(false);

    if (userId && user) {
      findMessages({ userId, user2Id: user }); // emit socket
    }
  };

  const [conversationMenuAnchor, setConversationMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [filterUnread, setFilterUnread] = useState(false);
  const [filterPinned, setFilterPinned] = useState(false);

  const toggleSearchPanel = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
  };

  // const { data: incomingMessage } = useSocket<Message>({
  //   event: "new_message",
  //   autoListen: true,
  //   userId: user?.id,
  //   onSuccess: (msg) => {
  //     console.log("Tin nhắn mới nhận:", msg);
  //   },
  // });

  const { data: newMessage, isConnected } = useSocket<Message>({
    event: "new_message",
    autoListen: true,
    userId,
    onSuccess: (message) => {
      // Kiểm tra xem tin nhắn có thuộc cuộc trò chuyện hiện tại không
      if (
        userId &&
        (message.senderId === userId || message.receiverId === userId)
      ) {
        // setMessage((prev) => [...prev, message]);
      }
    },
    onError: (error) => {
      console.error("Lỗi nhận tin nhắn:", error);
    },
  });

  // useEffect(() => {
  //   if (incomingMessage) {
  //     setMessage((prev) => [...prev, incomingMessage]);
  //   }
  // }, [incomingMessage]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleConversationMenuClose = () => {
    setConversationMenuAnchor(null);
  };

  useEffect(() => {
    if (isConnected) {
      socket.emit("getConversations", { userId });
    }
  }, [isConnected, userId]);

  return (
    <>
      <Box sx={{ display: "flex", height: "90vh", bgcolor: "grey.50" }}>
        <Stack
          sx={{
            width: isSidebarOpen ? 280 : 0,
            height: "90vh",
            // borderRadius: 0,
            overflow: "hidden",
            transition: "width 0.3s ease",
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            position: "relative",
          }}
          // elevation={0}
        >
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
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Tin nhắn
              </Typography>
              <Box>
                <IconButton
                  color="inherit"
                  onClick={() => setFilterUnread(!filterUnread)}
                  sx={{ mr: 1 }}
                >
                  <Badge color="error" variant="dot" invisible={!filterUnread}>
                    <UnreadIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => setFilterPinned(!filterPinned)}
                  sx={{ mr: 1 }}
                >
                  <Badge color="error" variant="dot" invisible={!filterPinned}>
                    <FilterIcon />
                  </Badge>
                </IconButton>
                <Button variant="outlined" onClick={toggleSidebar}>
                  {/* <CloseIcon /> */}
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
              startIcon={<GroupIcon />}
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

          {/* Search Box inside Sidebar */}
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <InputTextField
              // value={setSearchValue }
              placeholder="Tìm kiếm cuộc trò chuyện..."
            />
          </Box>
          {/* <ChatContainer /> */}
        </Stack>

        {/* Main Chat Area */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* App Bar */}
          <AppBar
            position="static"
            color="transparent"
            elevation={1}
            sx={{
              bgcolor: "background.paper",
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Toolbar sx={{ minHeight: "72px !important" }}>
              {!isSidebarOpen && (
                <IconButton edge="start" sx={{ mr: 2 }} onClick={toggleSidebar}>
                  <MenuIcon />
                </IconButton>
              )}

              {selectedUser ? (
                <Box
                  sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    //   color={selectedUser.online ? "success" : "default"}
                  >
                    <Avatar
                      //src={selectedUser.avatar}
                      sx={{ mr: 2, width: 40, height: 40 }}
                    >
                      {/* {selectedUser.name.charAt(0)} */}
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {selectedUser}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {/* {selectedUser.online
                        ? "Đang hoạt động"
                        : `Hoạt động ${selectedUser.lastSeen}`}{" "}
                      • {selectedUser.position} */}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography
                  variant="h6"
                  sx={{ flexGrow: 1 }}
                  fontWeight="medium"
                >
                  Enterprise Chat
                </Typography>
              )}

              <Box>
                <IconButton sx={{ mr: 1 }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton onClick={handleUserMenuOpen}>
                  <AccountIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Empty State */}
          {!selectedUser && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                background: `radial-gradient(circle, ${alpha(
                  theme.palette.primary.light,
                  0.05
                )} 0%, transparent 70%)`,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  mb: 3,
                  "& svg": {
                    fontSize: 80,
                    color: "primary.main",
                    opacity: 0.7,
                  },
                }}
              >
                <ChatIcon />
              </Box>
              <Typography
                variant="h5"
                color="textSecondary"
                gutterBottom
                fontWeight="medium"
              >
                Chào mừng đến với Enterprise Chat
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
                sx={{ maxWidth: 500, mb: 3 }}
              >
                Chọn một cuộc trò chuyện từ sidebar hoặc tìm kiếm người dùng mới
                để bắt đầu trò chuyện
              </Typography>
              <Button
                variant="contained"
                startIcon={<GroupIcon />}
                onClick={toggleSearchPanel}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  fontWeight: "medium",
                  boxShadow: theme.shadows[2],
                }}
              >
                Tìm người dùng
              </Button>
            </Box>
          )}

          {/* Chat Interface */}
          {selectedUser && (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Chat Messages */}
              <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
                {loadingMessages && (
                  <Typography>Đang tải tin nhắn...</Typography>
                )}

                {messagesData?.data?.resultCode === "00" &&
                messagesData.data.list?.length ? (
                  messagesData.data.list.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          msg.senderId === userId ? "flex-end" : "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          p: 1.5,
                          borderRadius: 4,
                          bgcolor:
                            msg.senderId === userId
                              ? "primary.main"
                              : "grey.100",
                          color:
                            msg.senderId === userId ? "white" : "text.primary",
                          boxShadow: theme.shadows[1],
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
                          {new Date(Number(msg.createdAt)).toLocaleString(
                            "vi-VN"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    {messagesData?.data?.resultMessage ||
                      "Chưa có tin nhắn nào"}
                  </Typography>
                )}
              </Box>

              {/* Message Input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton sx={{ mr: 1 }}>
                    <AttachFileIcon />
                  </IconButton>
                  <IconButton sx={{ mr: 1 }}>
                    <EmojiIcon />
                  </IconButton>
                  <InputTextField
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e)}
                    onKeyDown={handleKeyPress}
                  />
                  <Zoom in={message.length > 0}>
                    <Fab
                      color="primary"
                      size="small"
                      onClick={handleSendMessage}
                      sx={{ boxShadow: theme.shadows[4] }}
                    >
                      <SendIcon />
                    </Fab>
                  </Zoom>
                  <IconButton sx={{ ml: 1 }}>
                    <MicIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Search Panel Drawer */}
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
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              // onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </Drawer>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              width: 200,
              borderRadius: 2,
              boxShadow: theme.shadows[3],
            },
          }}
        >
          <MenuItem onClick={handleUserMenuClose}>
            <AccountIcon sx={{ mr: 2 }} />
            Hồ sơ
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <SettingsIcon sx={{ mr: 2 }} />
            Cài đặt
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleUserMenuClose}>
            <LogoutIcon sx={{ mr: 2 }} />
            Đăng xuất
          </MenuItem>
        </Menu>

        {/* Conversation Menu */}
        <Menu
          anchorEl={conversationMenuAnchor}
          open={Boolean(conversationMenuAnchor)}
          onClose={handleConversationMenuClose}
          PaperProps={{
            sx: {
              width: 180,
              borderRadius: 2,
              boxShadow: theme.shadows[3],
            },
          }}
        >
          <MenuItem onClick={handleConversationMenuClose}>
            Đánh dấu đã đọc
          </MenuItem>
          <MenuItem onClick={handleConversationMenuClose}>
            Ghim hội thoại
          </MenuItem>
          <MenuItem onClick={handleConversationMenuClose}>
            Tắt thông báo
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleConversationMenuClose}
            sx={{ color: "error.main" }}
          >
            Xóa hội thoại
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default ChatApp;
