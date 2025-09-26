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
  useTheme,
  Divider,
  Fab,
  Zoom,
  InputBase,
  Menu,
  MenuItem,
  Tooltip,
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
  SendMessageProps,
  UserData,
} from "../../utils/type";
import { socket } from "../../context/use[custom]/socket";
import { useAuth } from "../../context/AuthContext";

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
  const { data, loading, isConnected } = useSocket<ResConversationsResponse>({
    event: "getConversationsResponse",
    autoListen: true,
    userId: userId,
    onSuccess: (res) => {
      if (res?.resultCode === "00") {
        console.log("Conversations:", res.list);
      } else {
        console.warn(" Server error:", res?.resultMessage);
      }
    },
  });
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const handleUserSelect = (user: UserData) => {
    setSelectedUser(user);
    setReceiverId(user.id);
    // setActiveMessages([]); // Clear previous messages
    setIsSearchPanelOpen(false);

    // Load conversation history for this user
    // You might want to implement this
    console.log("Selected user:", user);
  };
  const { data: messagesData, emit: findMessages } =
    useSocket<MessageBetweenUserLoginResponse>({
      event: "findMessagesBetweenUsers",
      autoListen: true,
    });

  const [conversationMenuAnchor, setConversationMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [filterUnread, setFilterUnread] = useState(false);
  const [filterPinned, setFilterPinned] = useState(false);

  const toggleSearchPanel = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = () => {
    if (message.trim() === "" && !receiverId && !userId) return;

    const newMessage: SendMessageProps = {
      receiverId: receiverId as number,
      senderId: userId as number,
      content: message,
    };

    //setActiveMessages([...activeMessages, newMessage]);
    setMessage("");
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

  // const handleConversationMenuOpen = (
  //   event: React.MouseEvent<HTMLElement>,
  //   conversation: Conversation
  // ) => {
  //   setConversationMenuAnchor(event.currentTarget);
  // };

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
      <Box sx={{ display: "flex", height: "70vh", bgcolor: "grey.50" }}>
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
          {loading && <div>Loading...</div>}

          {/* Conversation List */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <List>
              {data?.resultCode === "00" ? (
                <>
                  {data?.list?.map((conv) => (
                    <ListItem key={conv.userId}>
                      <ListItemButton
                        sx={{
                          py: 1.5,
                          px: 2,
                          "&.Mui-selected": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.12
                              ),
                            },
                          },
                        }}
                      >
                        {/* Avatar + trạng thái */}
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            variant="dot"
                            color="success"
                            //invisible={!conv.online}
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                // bgcolor: conv.online
                                //   ? "primary.main"
                                //   : "grey.400",
                              }}
                            >
                              {/* {conv.name.charAt(0)} */}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>

                        {/* Nội dung */}
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                noWrap
                                fontWeight="medium"
                              >
                                {conv.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {/* {conv.timestamp ?? ""} */}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mt: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                  maxWidth: "70%",
                                  // fontWeight:
                                  //   conv.unread > 0 ? "600" : "normal",
                                  // color:
                                  //   conv.unread > 0
                                  //     ? "text.primary"
                                  //     : "text.secondary",
                                }}
                              >
                                {conv.lastMessage}
                              </Typography>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {/* {conv.isPinned && (
                                  <Tooltip title="Đã ghim">
                                    <FilterIcon
                                      sx={{
                                        fontSize: 16,
                                        color: "primary.main",
                                        mr: 0.5,
                                      }}
                                    />
                                  </Tooltip>
                                )}
                                {conv.unread > 0 && (
                                  <Chip
                                    label={conv.unread}
                                    size="small"
                                    color="primary"
                                    sx={{
                                      height: 20,
                                      minWidth: 20,
                                      fontSize: "0.7rem",
                                      fontWeight: "bold",
                                    }}
                                  />
                                )} */}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", p: 2 }}
                >
                  {data?.resultMessage}
                </Typography>
              )}
            </List>
          </Box>
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
                    color={selectedUser.online ? "success" : "default"}
                  >
                    <Avatar
                      src={selectedUser.avatar}
                      sx={{ mr: 2, width: 40, height: 40 }}
                    >
                      {/* {selectedUser.name.charAt(0)} */}
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {selectedUser.online
                        ? "Đang hoạt động"
                        : `Hoạt động ${selectedUser.lastSeen}`}{" "}
                      • {selectedUser.position}
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
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  overflow: "auto",
                  background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${theme.palette.primary.main.replace(
                    "#",
                    ""
                  )}' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
              >
                {messagesData?.list?.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: "flex",
                      // justifyContent:
                      //   msg.sender === "current" ? "flex-end" : "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "70%",
                        p: 2,
                        borderRadius: 4,
                        bgcolor:
                          msg.senderId === userId ? "primary.main" : "grey.100",
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
                        {msg.createdAt}
                      </Typography>
                    </Box>
                  </Box>
                ))}
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
                  <InputBase
                    fullWidth
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={4}
                    sx={{
                      bgcolor: "grey.50",
                      borderRadius: 4,
                      px: 2,
                      py: 1,
                      mr: 1,
                    }}
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

          {/* <Box sx={{ flex: 1, overflow: "auto" }}>
            {searchResults.length > 0 ? (
              <List disablePadding>
                {searchResults.map((user) => (
                  <ListItem key={user.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleUserSelect(user)}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                          color="success"
                          invisible={!user.online}
                        >
                          <Avatar
                            src={user.avatar}
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: user.online
                                ? "primary.main"
                                : "grey.400",
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="medium">
                            {user.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {user.email}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {user.department} • {user.position}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <SearchIcon
                  sx={{ fontSize: 64, color: "grey.400", mb: 2, opacity: 0.5 }}
                />
                <Typography variant="body1" color="textSecondary">
                  {searchQuery
                    ? "Không tìm thấy người dùng phù hợp"
                    : "Nhập từ khóa để tìm kiếm người dùng"}
                </Typography>
              </Box>
            )}
          </Box> */}
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
