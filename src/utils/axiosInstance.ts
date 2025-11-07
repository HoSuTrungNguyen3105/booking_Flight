import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_URL;

if (!baseURL) {
  throw new Error(
    "VITE_REACT_APP_URL is not defined in your environment variables. Please add VITE_REACT_APP_URL to your .env file at the project root."
  );
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    // "X-RapidAPI-Key": "...",
    // "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
});

// axiosInstance.interceptors.response.use(
//   (response) => response, // phải return nguyên response
//   (error) => Promise.reject(error)
// );

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
