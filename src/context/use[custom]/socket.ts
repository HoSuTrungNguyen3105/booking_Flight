import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_REACT_APP_URL || "http://localhost:3000";

export const socket = io(baseURL, {
  transports: ["websocket"],
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token"),
  },
});

socket.connect();
