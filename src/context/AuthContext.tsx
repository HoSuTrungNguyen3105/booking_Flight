import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLoginUser } from "../components/Api/usePostApi";
import { useToast } from "./ToastContext";
import { UserRole, type UserData } from "../utils/type";

export type User = {
  email: string;
  password: string;
  remember?: boolean;
};
export type AuthType = "DEV" | "IDPW";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  isAdmin: boolean;
  authType: AuthType;
  login: (userData: User) => Promise<void>;
  register: (userData: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Component export tách riêng
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const toast = useToast();
  const { refetchLogin } = useLoginUser();

  const isAdminLogin = useMemo(() => {
    const userAdmin = user?.role === UserRole.ADMIN;
    return userAdmin;
  }, [user]);

  const updateLocalStorage = (
    isAuthenticated: boolean,
    user: UserData | null,
    token: string | null
  ) => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token || "");
  };

  const login = async (userData: User) => {
    const res = await refetchLogin(userData);

    if (!res) {
      toast("Không thể kết nối đến server . Xem lại kết nối mạng.", "error");
    } else if (res?.resultCode === "00" && res.user) {
      const accessToken = res.accessToken;
      const userInfo: UserData = res.user;
      setUser(res.user);
      setIsAuthenticated(true);
      // setUser(userInfo);
      setToken(accessToken ?? null);
      updateLocalStorage(true, userInfo, accessToken ?? null);
      toast("Đăng nhập thành công!", "success");
    } else if (res?.resultCode === "NETWORK_ERROR") {
      toast("Không thể kết nối đến server . Xem lại kết nối mạng.", "error");
    } else if (res?.resultCode === "9") {
      toast("Bạn cần đổi mật khẩu trước khi tiếp tục", "info");
    } else {
      toast(res?.resultMessage || "Đăng nhập thất bại", "error");
    }
  };

  //   const login = async (userData: User) => {
  //   try {
  //     const res = await refetchLogin(userData);

  //     if (!res) {
  //       toast("Không thể kết nối đến server. Xem lại kết nối mạng.", "error");
  //       return { resultCode: "NETWORK_ERROR" };
  //     }

  //     if (res?.resultCode === "00" && res.user) {
  //       const accessToken = res.accessToken;
  //       const userInfo: UserData = res.user;

  //       setUser(res.user);
  //       setIsAuthenticated(true);
  //       setToken(accessToken ?? null);
  //       updateLocalStorage(true, userInfo, accessToken ?? null);

  //       toast("Đăng nhập thành công!", "success");
  //     } else if (res?.resultCode === "NETWORK_ERROR") {
  //       toast("Không thể kết nối đến server. Xem lại kết nối mạng.", "error");
  //     } else if (res?.resultCode === "9") {
  //       // 🔥 nếu server trả về code '9' (bắt đổi mật khẩu)
  //       toast("Bạn cần đổi mật khẩu trước khi tiếp tục", "info");
  //     } else {
  //       toast(res?.resultMessage || "Đăng nhập thất bại", "error");
  //     }

  //     // return res; // ✅ Quan trọng: trả về cho LoginPage xử lý
  //   } catch (error) {
  //     console.error("🔥 Lỗi login:", error);
  //     toast("Có lỗi xảy ra khi đăng nhập", "error");
  //     return { resultCode: "ERROR" };
  //   }
  // };

  // const loginAndGetResponse = async (userData: User) => {
  //   return await refetchLogin(userData); // khi cần raw response
  // };

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
      value={{
        isAuthenticated,
        user,
        token,
        login,
        register,
        logout,
        isAdmin: isAdminLogin,
        authType: "IDPW",
      }}
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
