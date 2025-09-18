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
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "a@example.com",
    avatar: "",
    lastSeen: "2 phút trước",
    online: true,
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "b@example.com",
    avatar: "",
    lastSeen: "10 phút trước",
    online: true,
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "c@example.com",
    avatar: "",
    lastSeen: "1 giờ trước",
    online: false,
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "d@example.com",
    avatar: "",
    lastSeen: "5 giờ trước",
    online: false,
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "e@example.com",
    avatar: "",
    lastSeen: "Hôm qua",
    online: true,
  },
];

const mockConversations = [
  {
    id: "1",
    userId: "1",
    lastMessage: "Bạn đang làm gì thế?",
    timestamp: "10:30 AM",
    unread: 2,
  },
  {
    id: "2",
    userId: "2",
    lastMessage: "Tôi sẽ gửi tài liệu cho bạn",
    timestamp: "09:15 AM",
    unread: 0,
  },
  {
    id: "3",
    userId: "3",
    lastMessage: "Cuộc họp lúc 3h chiều nhé",
    timestamp: "Yesterday",
    unread: 5,
  },
  {
    id: "4",
    userId: "4",
    lastMessage: "Cảm ơn bạn đã giúp đỡ",
    timestamp: "Monday",
    unread: 0,
  },
  {
    id: "5",
    userId: "5",
    lastMessage: "Dự án tiến triển tốt",
    timestamp: "Last week",
    unread: 1,
  },
];

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const conversationsWithUsers = mockConversations.map((conv) => {
    const user = mockUsers.find((u) => u.id === conv.userId);
    return { ...conv, user };
  });

  const handleSearch = (query: any) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSearchPanelOpen(false);
  };

  const toggleSearchPanel = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "grey.100" }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: isSidebarOpen ? 320 : 0,
          height: "100%",
          borderRadius: 0,
          overflow: "hidden",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
        elevation={2}
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Tin nhắn
            </Typography>
            <IconButton color="inherit" onClick={toggleSidebar}>
              <CloseIcon />
            </IconButton>
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
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            Tìm người dùng
          </Button>
        </Box>

        {/* Conversation List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <List disablePadding>
            {conversationsWithUsers.map((conv) => (
              <ListItem key={conv.id} disablePadding>
                <ListItemButton
                  selected={selectedUser === conv.userId}
                  onClick={() => handleUserSelect(conv.user)}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                      color="success"
                      //   invisible={!conv.user.online}
                    >
                      <Avatar src={conv?.user?.avatar}>
                        {/* {conv.user.name.charAt(0)} */}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2" noWrap>
                          {conv.user.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {conv.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          noWrap
                          sx={{ maxWidth: "70%" }}
                        >
                          {conv.lastMessage}
                        </Typography>
                        {conv.unread > 0 && (
                          <Chip
                            label={conv.unread}
                            size="small"
                            color="primary"
                            sx={{
                              height: 20,
                              minWidth: 20,
                              fontSize: "0.7rem",
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* App Bar */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            {!isSidebarOpen && (
              <IconButton edge="start" sx={{ mr: 2 }} onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {selectedUser ? selectedUser.name : "Chọn một cuộc trò chuyện"}
            </Typography>
            <IconButton onClick={toggleSearchPanel}>
              <SearchIcon />
            </IconButton>
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
            }}
          >
            <ChatIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Chào mừng đến với ứng dụng chat
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              Chọn một cuộc trò chuyện từ sidebar hoặc tìm kiếm người dùng mới
              để bắt đầu trò chuyện
            </Typography>
            <Button
              variant="contained"
              startIcon={<GroupIcon />}
              onClick={toggleSearchPanel}
              sx={{ mt: 2 }}
            >
              Tìm người dùng
            </Button>
          </Box>
        )}

        {/* Chat Interface */}
        {selectedUser && (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Chat Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                color="success"
                invisible={!selectedUser}
              >
                {/* <Avatar src={selectedUser.avatar} sx={{ mr: 2 }}>
                  {selectedUser.charAt(0)}
                </Avatar> */}
              </Badge>
              <Box>
                <Typography variant="subtitle1">{selectedUser.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {selectedUser.online
                    ? "Đang hoạt động"
                    : `Hoạt động ${selectedUser.lastSeen}`}
                </Typography>
              </Box>
            </Box>

            {/* Chat Messages */}
            <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
              {/* Placeholder for messages */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "grey.500",
                }}
              >
                <Typography>
                  Chọn một cuộc trò chuyện để xem tin nhắn
                </Typography>
              </Box>
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <TextField
                fullWidth
                placeholder="Nhập tin nhắn..."
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary">
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Tìm kiếm người dùng
          </Typography>
          <IconButton onClick={toggleSearchPanel}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          {searchResults.length > 0 ? (
            <List>
              {searchResults.map((user) => (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton onClick={() => handleUserSelect(user)}>
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
                        <Avatar src={user.avatar}>{user.name.charAt(0)}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mr: 1 }}
                          >
                            {user.email}
                          </Typography>
                          •
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ ml: 1 }}
                          >
                            {user.online
                              ? "Online"
                              : `Offline - ${user.lastSeen}`}
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
              <SearchIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography variant="body1" color="textSecondary">
                {searchQuery
                  ? "Không tìm thấy người dùng phù hợp"
                  : "Nhập từ khóa để tìm kiếm người dùng"}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

// Mock SendIcon component
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

export default ChatApp;
