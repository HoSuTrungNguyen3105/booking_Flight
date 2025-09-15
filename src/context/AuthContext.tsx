import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLoginByMfa,
  useLoginUser,
  useUpdateUserRank,
  useVerifyPw,
} from "../components/Api/usePostApi";
import { useToast } from "./ToastContext";
import {
  UserRole,
  type DataResponseId,
  type UserData,
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
  code: string;
};

export type AuthType = "DEV" | "IDPW";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  isAdmin: boolean;
  authType: AuthType;
  // verifyPassword: boolean;
  isValid: boolean;
  verifyPassword: (password: string) => Promise<boolean>;
  setValid: (valid: boolean) => void;
  resetValidation: () => void;
  login: (userData: User) => Promise<UserListResponse>;
  loginWithGGAuthenticator: (userData: UserWithMFA) => Promise<DataResponseId>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { refetchUpdateUserRank } = useUpdateUserRank();
  const [isValid, setIsValid] = useState(false);

  const toast = useToast();
  const { refetchLogin } = useLoginUser();
  const { refetchSetLoginMfa } = useLoginByMfa();
  const { refetchGetMyInfo } = useGetMyInfo();
  const { fetchVerifyPassword } = useVerifyPw({ id: user?.id });
  const isAdminLogin = useMemo(
    () => user?.role === UserRole.ADMIN,
    [user, refetchGetMyInfo]
  );

  // const verifyPassword = useCallback(
  //   async (password: string): Promise<boolean> => {
  //     try {
  //       const response = await fetchVerifyPassword({ password: password });

  //       const isValid = response?.resultCode === "00";
  //       setIsValid(isValid);

  //       if (isValid) {
  //         toast("Xác thực thành công", "success");
  //       } else {
  //         toast(response?.resultMessage || "Mật khẩu không chính xác", "error");
  //       }

  //       return isValid;
  //     } catch (error: any) {
  //       const errorMessage =
  //         error.response?.data?.resultMessage || "Lỗi xác thực";
  //       toast(errorMessage, "error");
  //       setIsValid(false);
  //       return false;
  //     }
  //   },
  //   [fetchVerifyPassword, toast]
  // );

  const verifyPassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        console.log("🔐 Starting password verification...");

        const response = await fetchVerifyPassword({ password });
        const isValidResult = response?.resultCode === "00";

        console.log("🎯 verifyPassword API response:", response);
        console.log("🎯 isValidResult from API:", isValidResult);

        // ĐẢM BẢO setIsValid ĐƯỢC GỌI
        setIsValid(isValidResult);
        console.log("🎯 setIsValid called with:", isValidResult);

        if (isValidResult) {
          toast("Xác thực thành công", "success");
        } else {
          toast(response?.resultMessage || "Mật khẩu không chính xác", "error");
        }

        return isValidResult;
      } catch (error: any) {
        console.error("💥 verifyPassword error:", error);
        setIsValid(false);
        console.log("🎯 setIsValid called with: false (due to error)");
        toast("Lỗi xác thực mật khẩu", "error");
        return false;
      }
    },
    []
  );

  const setValid = useCallback((valid: boolean) => {
    setIsValid(valid);
  }, []);

  const resetValidation = useCallback(() => {
    setIsValid(false);
  }, []);

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
      return res;
    } else {
      toast((res?.resultMessage as string) || "Đăng nhập thất bại", "error");
      return res as UserListResponse;
    }
  };

  const loginWithGGAuthenticator = async (
    userData: UserWithMFA
  ): Promise<DataResponseId> => {
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
          await refetchUpdateUserRank({ userId: id });
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
    [refetchUpdateUserRank, refetchGetMyInfo]
  );

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
        isValid,
        verifyPassword,
        setValid,
        resetValidation,
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
