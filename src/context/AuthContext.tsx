import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

type User = {
  userName?: string;
  email?: string;
  password: string;
  remember?: boolean;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User) => void;
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

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setIsAuthenticated(true);
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const updateLocalStorage = (
    isAuthenticated: boolean,
    user: User | null,
    token: string | null
  ) => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token || "");
  };

  const login = (userData: User) => {
    // ✅ Giả lập token (tùy bạn đặt)
    const fakeToken = "fake-jwt-token";

    setIsAuthenticated(true);
    setUser(userData);
    setToken(fakeToken);

    updateLocalStorage(true, userData, fakeToken);

    toast.success("Đăng nhập thành công (local)!");
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
