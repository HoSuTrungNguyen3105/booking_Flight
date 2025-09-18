import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface ChatContextType {
  currentUser: User | null;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  conversations: User[];
  setCurrentUser: (user: User) => void;
  onlineUsers: number[]; // Thêm mảng ID người dùng online
  setOnlineUsers: (userIds: number[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  const value: ChatContextType = {
    currentUser,
    selectedUser,
    setSelectedUser,
    conversations,
    setCurrentUser,
    onlineUsers,
    setOnlineUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
