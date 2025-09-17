import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchUser from "./SearchUser";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

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
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
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

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    socket.emit("join", { userId: user.id });
    try {
      const response = await axios.get(
        `http://localhost:4000/messages/${user.id}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
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
    <div>
      <div className=" px-10 mt-5 rounded-lg ">
        <div className=" flex items-center  rounded-t-2xl px-10 gap-36 bg-gradient-to-r from-pink-300 to-purple-300">
          {" "}
          <SearchUser onUserSelect={handleUserSelect} />
          {/* <UserDetails user={selectedUser} /> */}
        </div>

        {/* <ChatHeader currentUser={currentUser} selectedUser={selectedUser} /> */}

        <div className=" rounded-b-3xl bg-gradient-to-r from-purple-300 to-pink-300 overflow-auto ">
          <MessageList
            messages={messages}
            currentUser={{ id: currentUser?.id as string }}
          />
        </div>
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
