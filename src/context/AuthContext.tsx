import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLoginByMfa, useLoginUser } from "../components/Api/usePostApi";
import { useToast } from "./ToastContext";
import {
  UserRole,
  type DataResponseId,
  type UserData,
  type UserDataResponse,
  type UserListResponse,
} from "../utils/type";
import { useGetMyInfo } from "../components/Api/useGetApi";

export type User = {
  email: string;
  password: string;
  remember?: boolean;
};

export type UserWithMFA = {
  email: string;
  code: string; // mã 6 số từ Google Authenticator
};

export type AuthType = "DEV" | "IDPW";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  isAdmin: boolean;
  authType: AuthType;
  login: (userData: User) => Promise<UserListResponse>;
  loginWithGGAuthenticator: (userData: UserWithMFA) => Promise<DataResponseId>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const toast = useToast();
  const { refetchLogin } = useLoginUser();
  const { refetchSetLoginMfa } = useLoginByMfa();
  const { refetchGetMyInfo } = useGetMyInfo();

  const isAdminLogin = useMemo(
    () => user?.role === UserRole.ADMIN,
    [user, refetchGetMyInfo]
  );

  const updateLocalStorage = (
    isAuthenticated: boolean,
    token: string | null,
    userId?: number
  ) => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("token", token || "");
    if (userId) localStorage.setItem("userId", String(userId));
  };

  const login = async (userData: User): Promise<UserListResponse> => {
    const res = await refetchLogin(userData);
    if (res?.resultCode === "00" && res.data) {
      const accessToken = res.accessToken;
      const id = res.data.id;
      setIsAuthenticated(true);
      setToken(accessToken ?? null);
      updateLocalStorage(true, accessToken ?? null, id);
      await fetchMyInfo(id);
      console.log("login", res);
      return res;
    } else {
      toast((res?.resultMessage as string) || "Đăng nhập thất bại", "error");
      return res as UserListResponse;
    }
  };

  const loginWithGGAuthenticator = async (
    userData: UserWithMFA
  ): Promise<DataResponseId> => {
    // const res = await refetchLogin(userData);

    const res = await refetchSetLoginMfa({
      email: userData.email,
      code: userData.code,
    });
    if (res?.resultCode === "00" && res.data) {
      const accessToken = res.accessToken;
      const id = res.data.id;
      setIsAuthenticated(true);
      setToken(accessToken ?? null);
      updateLocalStorage(true, accessToken ?? null, id);
      await fetchMyInfo(id);
      console.log("login", res);
      return res;
    } else {
      toast((res?.resultMessage as string) || "Đăng nhập thất bại", "error");
      return res as UserListResponse;
    }
  };

  const fetchMyInfo = useCallback(
    async (id?: number) => {
      if (!id) return;
      try {
        const requests = await refetchGetMyInfo(id);

        if (requests?.resultCode === "00" && requests.data) {
          setUser(requests.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }

        return requests;
      } catch (err) {
        setIsAuthenticated(false);
        return undefined;
      }
    },
    [refetchGetMyInfo]
  );

  // const refreshUser = useCallback(async () => {
  //   const savedUserId = localStorage.getItem("userId");
  //   if (!savedUserId) return;

  //   try {
  //     const res = await refetchGetMyInfo(Number(savedUserId));
  //     if (res?.resultCode === "00" && res.data) {
  //       setUser(res.data);
  //       setIsAuthenticated(true);
  //     }
  //     return res;
  //   } catch (err) {
  //     console.error("refreshUser error:", err);
  //     return null;
  //   }
  // }, [refetchGetMyInfo]);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");

    if (!savedToken || !savedUserId) {
      logout();
      return;
    }
    setToken(savedToken);

    const verifyUser = async () => {
      try {
        setToken(savedToken);
        const res = await fetchMyInfo(Number(savedUserId));

        if (res?.resultCode === "00" && res.data) {
          setIsAuthenticated(true);
          setUser(res.data);
        } else {
          setIsAuthenticated(false);
          toast(
            (res?.resultMessage as string) || "Xác thực người dùng thất bại",
            "info"
          );
        }
      } catch (err) {
        logout();
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        loginWithGGAuthenticator,
        logout,
        isAdmin: isAdminLogin,
        authType: "IDPW",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
