import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchUser from "./SearchUser";
import MessageList, { type Message } from "./MessageList";
import MessageInput from "./MessageInput";
import { alpha, Box, Paper } from "@mui/material";
import type { BaseUserData } from "../../utils/type";
import theme from "../../scss/theme";
import ChatSidebar from "./ChatSidebar";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/use[custom]/useSocket";

const socket = io("http://localhost:3000");

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const { currentUser, selectedUser } = useChat();

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
      //   if (message.senderId === currentUser?.id) return; // Ignore messages sent by the current user
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [navigate, currentUser]);

  const [newMessage, setNewMessage] = useState("");

  const { data: incomingMessage, isConnected } = useSocket<Message>({
    event: "new_message",
    autoListen: true,
    userId: currentUser?.id,
    onSuccess: (message) => {
      setMessages((prev) => [...prev, message]);
    },
  });

  // Dữ liệu mock theo cấu trúc API của bạn
  const mockMessages: Message[] = [
    {
      id: 1,
      content: "Xin chào, bạn khỏe không?",
      createdAt: "1758118858000",
      senderId: 6,
      receiverId: 11,
      sender: {
        id: 6,
        name: "Nguyễn Văn A",
        pictureUrl: "https://i.pravatar.cc/150?u=6",
        email: "tnhs3105@gmail.com",
      },
      receiver: {
        id: 11,
        name: "Trần Thị B",
        pictureUrl: "https://i.pravatar.cc/150?u=11",
        email: "trungnguyenhosu3105@gmail.com",
      },
    },
    {
      id: 3,
      content: "Mình khỏe, cảm ơn bạn! Còn bạn thì sao?",
      createdAt: "1758119539322",
      senderId: 11,
      receiverId: 6,
      sender: {
        id: 11,
        name: "Trần Thị B",
        pictureUrl: "https://i.pravatar.cc/150?u=11",
        email: "trungnguyenhosu3105@gmail.com",
      },
      receiver: {
        id: 6,
        name: "Nguyễn Văn A",
        pictureUrl: "https://i.pravatar.cc/150?u=6",
        email: "tnhs3105@gmail.com",
      },
    },
    {
      id: 4,
      content: "Mình cũng khỏe. Dạo này bạn thế nào?",
      createdAt: "1758119545000",
      senderId: 6,
      receiverId: 11,
      sender: {
        id: 6,
        name: "Nguyễn Văn A",
        pictureUrl: "https://i.pravatar.cc/150?u=6",
        email: "tnhs3105@gmail.com",
      },
      receiver: {
        id: 11,
        name: "Trần Thị B",
        pictureUrl: "https://i.pravatar.cc/150?u=11",
        email: "trungnguyenhosu3105@gmail.com",
      },
    },
    {
      id: 5,
      content: "Mình vẫn ổn. Cảm ơn bạn đã quan tâm!",
      createdAt: "1758119552000",
      senderId: 11,
      receiverId: 6,
      sender: {
        id: 11,
        name: "Trần Thị B",
        pictureUrl: "https://i.pravatar.cc/150?u=11",
        email: "trungnguyenhosu3105@gmail.com",
      },
      receiver: {
        id: 6,
        name: "Nguyễn Văn A",
        pictureUrl: "https://i.pravatar.cc/150?u=6",
        email: "tnhs3105@gmail.com",
      },
    },
  ];

  console.log("incomingMessage", incomingMessage);

  // Hook để gửi tin nhắn
  const { emit: sendMessage, loading: sending } = useSocket({
    event: "send_message",
    autoListen: false,
  });

  // Hook để nhận danh sách người dùng online
  useSocket<number[]>({
    event: "online_users",
    autoListen: true,
    onSuccess: (userIds) => {
      // Cập nhật danh sách người dùng online trong context
      // setOnlineUsers(userIds); // Sẽ thực hiện trong useEffect riêng
    },
  });

  // Fetch tin nhắn cũ khi chọn user khác
  useEffect(() => {
    if (currentUser && selectedUser) {
      // Gọi API để lấy tin nhắn cũ
      fetch(`/api/messages/${currentUser.id}/${selectedUser.id}`)
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("Error fetching messages:", err));
    }
  }, [currentUser, selectedUser]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser || !selectedUser || sending) return;

    sendMessage(
      {
        content: newMessage,
        senderId: currentUser.id,
        receiverId: selectedUser.id,
      },
      () => {
        setNewMessage("");
      }
    );
  };

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

  return (
    <Box display="flex" height="89vh">
      <ChatSidebar />
      <Box flex={1} display="flex" flexDirection="column" p={2}>
        <SearchUser onUserSelect={handleUserSelect} />
        <Box
          sx={{
            height: "20rem",
            color: theme.palette.text.primary,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <MessageList
            messages={mockMessages}
            currentUser={{ id: currentUser?.id as number }}
          />
        </Box>
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
