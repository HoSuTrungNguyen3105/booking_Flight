import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchUser from "./SearchUser";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { alpha, Box, Paper } from "@mui/material";
import type { BaseUserData } from "../../utils/type";
import theme from "../../scss/theme";
import ChatSidebar from "./ChatSidebar";

const socket = io("http://localhost:3000");

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

const ChatContainer: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token) navigate("/");
    // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // axios
    //   .get("http://localhost:4000/current-user")
    //   .then((response) => setCurrentUser(response.data))
    //   .catch((error) => console.error(error));

    // Listen for new messages
    socket.on("newMessage", (message: Message) => {
      if (message.senderId === currentUser?.id) return; // Ignore messages sent by the current user
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("newMessage");
    };
  }, [navigate, currentUser]);

  const handleUserSelect = async (user: BaseUserData) => {
    // setSelectedUser(user);
    // socket.emit("join", { userId: user.id });
    // try {
    //   const response = await axios.get(
    //     `http://localhost:4000/messages/${user.id}`
    //   );
    //   setMessages(response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUser || !currentUser || content.trim() === "") return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:4000/messages", message);
      socket.emit("sendMessage", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box display="flex" height="89vh">
      {/* Sidebar bên trái */}
      <Box
        width="300px"
        sx={{
          borderRight: `1px solid ${theme.palette.divider}`,
          //   background: `linear-gradient(135deg, ${alpha(
          //     theme.palette.primary.light,
          //     0.1
          //   )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        }}
      >
        <ChatSidebar />
      </Box>

      {/* Phần chính bên phải */}
      <Box flex={1} display="flex" flexDirection="column" p={2}>
        {/* Header với Search */}
        {/* <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={3}
          py={2}
          sx={{
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.8
            )} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)`,
            color: theme.palette.primary.contrastText,
            borderRadius: 2,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <SearchUser onUserSelect={handleUserSelect} />
        </Box> */}

        {/* Danh sách tin nhắn */}
        <Box
          sx={{
            // background: `linear-gradient(135deg, ${alpha(
            //   theme.palette.primary.light,
            //   0.1
            // )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            color: theme.palette.text.primary,
            flex: 1,
            // minHeight: "20vh",
            overflowY: "auto",
            // borderRadius: 2,
            // mt: 2,
            // p: 2,
            // border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
          }}
        >
          <MessageList
            messages={messages}
            currentUser={{ id: currentUser?.id as string }}
          />
        </Box>

        {/* Input gửi tin nhắn */}
        <Box
          mt={2}
          sx={{
            border: `1px solid ${theme.palette.primary.light}`,
            borderRadius: 3,
            p: 2,
            pb: 0,
            background: alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <MessageInput onSendMessage={handleSendMessage} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatContainer;
