import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("BASE_URL =", import.meta.env.VITE_REACT_APP_URL);

export default axiosInstance;
