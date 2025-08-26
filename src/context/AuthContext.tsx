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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number>(0); // BI loi goi khi chay
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const toast = useToast();
  const { refetchLogin } = useLoginUser();
  const { getMyInfo, refetchGetMyInfo } = useGetMyInfo(userId ?? undefined);

  const isAdminLogin = useMemo(() => user?.role === UserRole.ADMIN, [user]);

  const updateLocalStorage = (
    isAuthenticated: boolean,
    token: string | null
  ) => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("token", token || "");
  };

  const login = async (userData: User) => {
    const res = await refetchLogin(userData);
    if (res?.resultCode === "00" && res.data) {
      const accessToken = res.accessToken;
      setIsAuthenticated(true);
      setToken(accessToken ?? null);
      updateLocalStorage(true, accessToken ?? null);
      setUserId(res.data.id);
      // gọi API lấy thông tin user
      // const { refetchGetMyInfo } = useGetMyInfo(res.data.id);
      // const myInfo = await refetchGetMyInfo();
      // console.log("MyInfo after login:", myInfo);
      // if (myInfo?.resultCode === "00") {
      //   setUser(myInfo.data || null);
      // }
      await fetchMyInfo();
    } else if (res?.resultCode === "NETWORK_ERROR") {
      toast("Không thể kết nối đến server. Vui lòng thử lại.", "info");
    } else {
      toast(res?.resultMessage || "Đăng nhập thất bại", "error");
    }
  };

  const fetchMyInfo = useCallback(async () => {
    try {
      // const { refetchGetMyInfo } = useGetMyInfo(id);
      const resquests = await refetchGetMyInfo();
      console.log("MyInfo after login:", resquests);
      if (resquests?.resultCode === "00") {
        setUser(resquests.data || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("🔥 Backend lỗi khi fetch user:", err);
      logout(); // ❌ server ngắt thì signout
    }
  }, []);

  // const fetchMyInfo = useCallback(async () => {
  //   // const res = await refetchGetMyInfo();
  //   // if (res?.resultCode === "00" && res.data) {
  //   //   setUser(getMyInfo?.data || null);
  //   //   updateLocalStorage(true, token);
  //   // }
  //   const myInfo = await refetchGetMyInfo();
  //     console.log("MyInfo after login:", myInfo);
  //     if (myInfo?.resultCode === "00") {
  //       setUser(myInfo.data || null);
  //     }
  // }, [refetchGetMyInfo, token]);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setIsAuthenticated(true);
      setToken(savedToken);
      fetchMyInfo();
    }
  }, [fetchMyInfo]);

  useEffect(() => {
    if (getMyInfo) {
      setUser(getMyInfo.data ?? null);
    }
  }, [getMyInfo]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
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
