import { createContext, useContext, useEffect, useState } from "react";
import { useLoginUser } from "../components/Api/usePostApi";
import { useToast } from "./ToastContext";
import axios, { AxiosError } from "axios";

type User = {
  email: string;
  password: string;
  remember?: boolean;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User) => Promise<void>;
  register: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Component export tách riêng
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const toast = useToast();
  const { loginUserData, refetchLogin } = useLoginUser();
  const updateLocalStorage = (
    isAuthenticated: boolean,
    user: User | null,
    token: string | null
  ) => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token || "");
  };

  const login = async (userData: User) => {
    // try {
    //   const res = await refetchLogin(userData);
    //   console.log("res full:", res);

    //   if (res?.resultCode === "00") {
    //     const accessToken = res.accessToken;
    //     setIsAuthenticated(true);
    //     setUser(userData);
    //     setToken(accessToken ?? null);
    //     updateLocalStorage(true, userData, accessToken ?? null);
    //     toast("Đăng nhập thành công!", "success");
    //   } else {
    //     toast(res?.resultMessage || "Đăng nhập thất bại", "error");
    //   }
    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     if (error.code === "ECONNABORTED") {
    //       toast("Kết nối hết thời gian. Vui lòng thử lại sau.", "error");
    //     } else if (!error.response) {
    //       // ❌ Không có phản hồi => thường là server chưa chạy hoặc mất mạng
    //       toast(
    //         "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại backend hoặc kết nối mạng.",
    //         "error"
    //       );
    //       console.error("Không có phản hồi từ server:", error.message);
    //     } else {
    //       // Có phản hồi nhưng mã lỗi (4xx, 5xx)
    //       const status = error.response.status;
    //       const message =
    //         error.response.data?.message || `Lỗi máy chủ (${status})`;
    //       toast(message, "error");
    //       console.error("Lỗi có phản hồi từ server:", status, message);
    //     }
    //   } else {
    //     // Lỗi không phải từ Axios
    //     toast("Lỗi không xác định ở phía client", "error");
    //     console.error("Lỗi không xác định:", error);
    //   }
    // }
    const res = await refetchLogin(userData);

    if (!res) {
      toast(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại backend hoặc kết nối mạng.",
        "error"
      );
    } else if (res?.resultCode === "00") {
      const accessToken = res.accessToken;
      setIsAuthenticated(true);
      setUser(userData);
      setToken(accessToken ?? null);
      updateLocalStorage(true, userData, accessToken ?? null);
      toast("Đăng nhập thành công!", "success");
    } else if (res?.resultCode === "NETWORK_ERROR") {
      toast(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại backend hoặc kết nối mạng.",
        "error"
      );
    } else {
      toast(res?.resultMessage || "Đăng nhập thất bại", "error");
    }
  };

  const register = (userData: User) => {
    toast("Đăng ký thành công (giả lập)", "success");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast("Đăng xuất thành công!", "success");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setIsAuthenticated(true);
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// ✅ Custom hook: Định nghĩa & export riêng
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
// ✅ Named exports để tránh lỗi HMR
export { AuthProvider, useAuth };
