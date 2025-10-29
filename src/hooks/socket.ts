import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_REACT_APP_URL;

export const socket = io(baseURL, {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectSocket = (userId?: number | string, token?: string) => {
  if (!userId || !token) return;
  socket.auth = { userId, token };
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};
