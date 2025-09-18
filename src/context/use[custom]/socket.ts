import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_REACT_APP_URL;

export const socket = io(baseURL, {
  transports: ["websocket"],
  autoConnect: false,
  // auth: {
  //   token: localStorage.getItem("token"),
  // },
});
// Cập nhật auth trước khi connect
socket.auth = { token: localStorage.getItem("token") };
// socket.connect();

// socket.connect();
