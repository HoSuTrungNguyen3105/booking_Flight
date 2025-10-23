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
  type LoginReqProps,
} from "./Api/usePostApi";
import { useToast } from "./ToastContext";
import {
  UserRole,
  type DataResponseId,
  type UserData,
  type UserListResponse,
} from "../utils/type";
import { useGetMyInfo } from "./Api/useGetApi";

export type UserWithMFA = {
  email: string;
  code: string;
  authType: string;
};

export type AuthType = "MFA" | "IDPW";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  isAdmin: boolean;
  authType: AuthType;
  isValid: boolean;
  verifyPassword: (password: string) => Promise<boolean>;
  setValid: (valid: boolean) => void;
  resetValidation: () => void;
  login: (userData: LoginReqProps) => Promise<UserListResponse>;
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

  const verifyPassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        const response = await fetchVerifyPassword({ password });
        const isValidResult = response?.resultCode === "00";

        setIsValid(isValidResult);

        if (isValidResult) {
          toast("Xác thực thành công", "success");
        } else {
          toast(response?.resultMessage || "Lỗi xác thực mật khẩu", "error");
        }

        return isValidResult;
      } catch (error) {
        console.error("verifyPassword error:", error);
        setIsValid(false);
        return false;
      }
    },
    [fetchVerifyPassword, toast]
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

  const login = async (userData: LoginReqProps): Promise<UserListResponse> => {
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
      toast(
        (res?.resultMessage as string) || "Unexpected error occurred",
        "error"
      );
      return res as UserListResponse;
    }
  };

  const loginWithGGAuthenticator = async (
    userData: UserWithMFA
  ): Promise<DataResponseId> => {
    const res = await refetchSetLoginMfa({
      email: userData.email,
      code: userData.code,
      authType: userData.authType,
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
        const dataUser = requests?.data;
        if (requests?.resultCode === "00" && dataUser) {
          setUser(dataUser);
          setIsAuthenticated(true);
          await refetchUpdateUserRank({ userId: id });
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }

        return requests;
      } catch (err) {
        return undefined;
      }
    },
    [refetchGetMyInfo, refetchUpdateUserRank]
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
        await fetchMyInfo(Number(savedUserId));
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
