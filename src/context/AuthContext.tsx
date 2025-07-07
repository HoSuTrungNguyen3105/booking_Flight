import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoginUser } from "../components/Api/usePostApi";

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

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const { refetchLogin } = useLoginUser(); // Không truyền user ban đầu

  const login = async (userData: User) => {
    try {
      const res = await refetchLogin(userData); // ✅ truyền userData khi gọi API

      if (res?.resultCode === "0000") {
        setIsAuthenticated(true);
        setUser(userData); // hoặc res.user nếu response có object user
        setToken(token);

        updateLocalStorage(true, userData, token);
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error(res?.resultMessage || "Đăng nhập thất bại!");
      }
    } catch (error: any) {
      toast.error("Lỗi hệ thống khi đăng nhập");
      console.error("Login error:", error);
    }
  };

  const register = (userData: User) => {
    toast.success("Đăng ký thành công (giả lập)");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công!");
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
