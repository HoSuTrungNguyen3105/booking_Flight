import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLoginUser } from "../components/Api/usePostApi";
import { useToast } from "./ToastContext";
import { UserRole, type UserData } from "../utils/type";
import { useGetMyInfo } from "../components/Api/useGetApi";

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

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const toast = useToast();
  const { refetchLogin } = useLoginUser();
  const { getMyInfo, refetchGetMyInfo } = useGetMyInfo(user?.id ?? 0);

  const isAdminLogin = useMemo(() => user?.role === UserRole.ADMIN, [user]);

  const updateLocalStorage = (
    isAuthenticated: boolean,
    token: string | null
  ) => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("token", token || "");
  };

  const fetchMyInfo = useCallback(async () => {
    const res = await refetchGetMyInfo();
    if (res?.resultCode === "00" && res.data) {
      setUser(res.data);
      updateLocalStorage(true, localStorage.getItem("token"));
    }
  }, [getMyInfo]);

  const login = async (userData: User) => {
    const res = await refetchLogin(userData);
    if (res?.resultCode === "00" && res.data) {
      const accessToken = res.accessToken;
      // const userInfo: UserData = res.data;
      // setUser(userInfo);
      setIsAuthenticated(true);
      // setUser(userInfo);
      setToken(accessToken ?? null);
      updateLocalStorage(true, accessToken ?? null);
      // toast("Đăng nhập thành công!", "success");
    } else if (res?.resultCode === "NETWORK_ERROR") {
      toast(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
        "info"
      );
    } else {
      toast(res?.resultMessage || "Đăng nhập thất bại", "error");
    }
  };

  // const login = async (userData: User) => {
  //   const res = await refetchLogin(userData);
  //   console.log("🚀 ~ file: AuthContext.tsx:57 ~ login ~ res:", res);
  //   if (!res) {
  //     toast("Không thể kết nối đến server . Xem lại kết nối mạng.", "error");
  //   } else if (res?.resultCode === "00" && res.user) {
  //     const accessToken = res.accessToken;
  //     const userInfo: UserData = res.user;
  //     setUser(res.user);
  //     setIsAuthenticated(true);
  //     // setUser(userInfo);
  //     setToken(accessToken ?? null);
  //     updateLocalStorage(true, userInfo, accessToken ?? null);
  //     toast("Đăng nhập thành công!", "success");
  //   } else if (res?.resultCode === "NETWORK_ERROR") {
  //     toast("Không thể kết nối đến server . Xem lại kết nối mạng.", "error");
  //   } else if (res?.resultCode === "9") {
  //     toast("Bạn cần đổi mật khẩu trước khi tiếp tục", "info");
  //   } else {
  //     toast(res?.resultMessage || "Đăng nhập thất bại", "error");
  //   }
  // };

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

  // const login = async (userData: User) => {
  //   const res = await refetchLogin(userData);

  //   if (!res) {
  //     toast(
  //       "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại backend hoặc kết nối mạng.",
  //       "error"
  //     );
  //   } else if (res?.resultCode === "00" && res.user) {
  //     const accessToken = res.accessToken;
  //     const userInfo: UserData = res.user;
  //     setUser({
  //       ...userInfo,
  //       authType: "ID,PW", // nếu cần thêm field cho frontend
  //       name: "",
  //       firstname: "",
  //       lastname: "",
  //       password: userData.password,
  //     });
  //     setIsAuthenticated(true);
  //     setToken(accessToken ?? null);
  //     updateLocalStorage(true, userInfo, accessToken ?? null);
  //     toast("Đăng nhập thành công!", "success");
  //   } else if (res?.resultCode === "NETWORK_ERROR") {
  //     toast(
  //       "Không thể kết nối đến . Vui lòng kiểm tra lại kết nối mạng.",
  //       "error"
  //     );
  //   } else {
  //     toast(res?.resultMessage || "Đăng nhập thất bại", "error");
  //   }
  // };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    // const savedUser = localStorage.getItem("user");
    if (savedToken) {
      setIsAuthenticated(true);
      setToken(savedToken);
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

export { AuthProvider, useAuth };
