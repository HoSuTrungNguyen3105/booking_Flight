import {
  type DetailResponseMessage,
  type SocketResponseMessage,
} from "./common.types";

export type Conversation = {
  userId: number;
  name: string;
  lastMessage: string;
  timestamp: number;
};

export type SendMessageProps = {
  receiverId: number;
  senderId: number;
  content: string;
};

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  sender: {
    id: number;
    name: string;
    pictureUrl: string;
    email: string;
  };
  receiver: {
    id: number;
    name: string;
    pictureUrl: string;
    email: string;
  };
}

export type MessageBetweenUserLoginResponse = SocketResponseMessage<Message>;
export type MessageApiResponse = DetailResponseMessage<Message>;
export type ResConversationsResponse = DetailResponseMessage<Conversation>;
