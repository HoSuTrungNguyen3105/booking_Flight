import { createContext, useContext, useEffect, useState } from "react";
import { useLoginUser } from "../components/Api/usePostApi";
import { useToast } from "./ToastContext";

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
  const login = async (userData: User) => {
    try {
      const res = await refetchLogin(userData);
      console.log("toast", loginUserData);
      if (res?.resultCode === "00") {
        console.log("toast", loginUserData);
        const accessToken = res.accessToken;
        setIsAuthenticated(true);
        setUser(userData);
        setToken(accessToken ?? null);
        updateLocalStorage(true, userData, accessToken ?? null);
        // toast("Đăng nhập thành công!", "success");
      } else {
        console.log("toast", loginUserData);
        toast(res?.resultMessage || "Đăng nhập thất bại", "error");
      }
    } catch (error) {
      toast("Lỗi hệ thống khi đăng nhập");
      console.error("Login error:", error);
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

  const updateLocalStorage = (
    isAuthenticated: boolean,
    user: User | null,
    token: string | null
  ) => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token || "");
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
