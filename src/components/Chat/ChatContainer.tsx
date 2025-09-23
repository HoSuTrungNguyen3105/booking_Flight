import React, { memo, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import MessageList, { type Message } from "./MessageList";
import MessageInput from "./MessageInput";
import { alpha, Box } from "@mui/material";
import theme from "../../scss/theme";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/use[custom]/useSocket";

const socket = io("http://localhost:3000");

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const { currentUser, selectedUser } = useChat();

  useEffect(() => {
    socket.on("newMessage", (message: Message) => {
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

  const mockMessages: Message[] = [
    {
      id: 1,
      content: "Xin chào, bạn khỏe không?",
      createdAt: "1758118858000",
      senderId: 69,
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

  const { emit: sendMessage, loading: sending } = useSocket({
    event: "send_message",
    autoListen: false,
  });

  useSocket<number[]>({
    event: "online_users",
    autoListen: true,
    onSuccess: (userIds) => {},
  });

  // Fetch tin nhắn cũ khi chọn user khác
  // useEffect(() => {
  //   if (currentUser && selectedUser) {
  //     // Gọi API để lấy tin nhắn cũ
  //     fetch(`/api/messages/${currentUser.id}/${selectedUser.id}`)
  //       .then((res) => res.json())
  //       .then((data) => setMessages(data))
  //       .catch((err) => console.error("Error fetching messages:", err));
  //   }
  // }, [currentUser, selectedUser]);

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

  // const handleUserSelect = async (user: BaseUserData) => {
  //   // setSelectedUser(user);
  //   // socket.emit("join", { userId: user.id });
  //   // try {
  //   //   const response = await axios.get(
  //   //     `http://localhost:4000/messages/${user.id}`
  //   //   );
  //   //   setMessages(response.data);
  //   // } catch (error) {
  //   //   console.error(error);
  //   // }
  // };

  const sortedMessages = mockMessages
    .concat(incomingMessage ? [incomingMessage] : [])
    .sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

  return (
    <Box display="flex" height="80vh">
      {/* <ChatSidebar /> */}
      <Box flex={1} display="flex" flexDirection="column" p={2}>
        {/* <SearchUser onUserSelect={handleUserSelect} /> */}
        <Box
          sx={{
            height: "20rem",
            color: theme.palette.text.primary,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <MessageList
            messages={sortedMessages}
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

export default memo(ChatContainer);
