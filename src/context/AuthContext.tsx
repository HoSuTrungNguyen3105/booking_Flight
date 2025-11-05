import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLoginAdmin,
  useLoginByMfa,
  useLoginUser,
  useUpdateUserRank,
  useVerifyPw,
  type LoginReqProps,
} from "./Api/usePostApi";
import { useToast } from "./ToastContext";
import {
  UserRole,
  type LoginDataResponse,
  type Passenger,
  type ResponseGGAuthenticate,
  type UserData,
} from "../utils/type";
import { ResponseCode } from "../utils/response";
import { useGetMyAdminInfo, useGetMyUserInfo } from "./Api/usePostApi";

export type UserWithMFA = {
  email: string;
  code: string;
  authType: string;
};

export type AuthType = "ADMIN" | "IDPW";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  passenger: Passenger | null;
  token: string | null;
  isAdmin: boolean;
  // authType: AuthType;
  isValid: boolean;
  verifyPassword: (password: string) => Promise<boolean>;
  setValid: (valid: boolean) => void;
  resetValidation: () => void;
  fetchMyUserInfo: () => void;
  fetchMyAdminInfo: () => void;
  loginPassenger: (
    data: LoginReqProps
  ) => Promise<LoginDataResponse<Passenger>>;
  loginAdmin: (data: LoginReqProps) => Promise<LoginDataResponse<UserData>>;
  loginWithGGAuthenticator: (
    userData: UserWithMFA
  ) => Promise<ResponseGGAuthenticate>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [stateLogin, setStateLogin] = useState<AuthType>("IDPW");
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { refetchUpdateUserRank } = useUpdateUserRank();
  const [isValid, setIsValid] = useState(false);

  const toast = useToast();
  const { refetchLogin } = useLoginUser();
  const { refetchAdminLogin } = useLoginAdmin();
  const { refetchSetLoginMfa } = useLoginByMfa();
  const { refetchGetMyUserInfo } = useGetMyUserInfo();
  const { refetchGetMyAdminInfo } = useGetMyAdminInfo();
  const { fetchVerifyPassword } = useVerifyPw({ id: user?.id });

  const isAdminLogin = useMemo(
    () => user?.role === UserRole.ADMIN,
    [user, refetchGetMyAdminInfo]
  );

  const verifyPassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        const response = await fetchVerifyPassword({ password });
        const isValidResult = response?.resultCode === ResponseCode.SUCCESS;

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
    id?: number | string
  ) => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("token", token || "");
    if (id) localStorage.setItem("userId", String(id));
  };

  const loginPassenger = async (
    data: LoginReqProps
  ): Promise<LoginDataResponse<Passenger>> => {
    const res = await refetchLogin(data);
    if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
      const accessToken = res.accessToken;
      const id = res.data.id;
      setIsAuthenticated(true);
      setToken(accessToken ?? null);
      updateLocalStorage(true, accessToken ?? null, id);
      await fetchMyUserInfo(id);
      return res;
    } else {
      toast(res?.resultMessage || "Unexpected error occurred", "error");
      return res as LoginDataResponse<Passenger>;
    }
  };

  const loginAdmin = async (
    data: LoginReqProps
  ): Promise<LoginDataResponse<UserData>> => {
    const res = await refetchAdminLogin(data);
    if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
      const accessToken = res.accessToken;
      const id = res.data.id;
      setIsAuthenticated(true);
      setToken(accessToken ?? null);
      updateLocalStorage(true, accessToken ?? null, id);
      setStateLogin("ADMIN");
      await fetchMyAdminInfo(id);
      return res;
    } else {
      toast(res?.resultMessage || "Unexpected error occurred", "error");
      return res as LoginDataResponse<UserData>;
    }
  };

  const loginWithGGAuthenticator = async (
    userData: UserWithMFA
  ): Promise<ResponseGGAuthenticate> => {
    const res = await refetchSetLoginMfa({
      email: userData.email,
      code: userData.code,
      authType: userData.authType,
    });
    if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
      const accessToken = res.accessToken;
      const id = res.data.id;
      setIsAuthenticated(true);
      setToken(accessToken ?? null);
      updateLocalStorage(true, accessToken ?? null, id);
      await fetchMyAdminInfo(id);
      return res;
    } else {
      toast(res?.resultMessage || "Đăng nhập thất bại", "error");
      return res as ResponseGGAuthenticate;
    }
  };

  const fetchMyUserInfo = useCallback(async (id?: string) => {
    if (!id) return;
    try {
      const requests = await refetchGetMyUserInfo({ id });
      const dataUser = requests?.data;
      if (requests?.resultCode === ResponseCode.SUCCESS && dataUser) {
        setPassenger(dataUser);
        setIsAuthenticated(true);
        // await refetchUpdateUserRank({ userId: id });
      } else {
        setIsAuthenticated(false);
        setPassenger(null);
      }

      return requests;
    } catch (err) {
      return undefined;
    }
  }, []);

  const fetchMyAdminInfo = useCallback(
    async (id?: number) => {
      if (!id) return;
      try {
        const requests = await refetchGetMyAdminInfo({ id });
        const dataUser = requests?.data;
        if (requests?.resultCode === ResponseCode.SUCCESS && dataUser) {
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
    [refetchUpdateUserRank]
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
    const savedId = localStorage.getItem("userId");

    if (!savedToken || !savedId) return;

    setToken(savedToken);
    setIsAuthenticated(true);

    if (stateLogin === "ADMIN") {
      fetchMyAdminInfo(Number(savedId));
    } else {
      fetchMyUserInfo(savedId);
    }
  }, [fetchMyUserInfo, fetchMyAdminInfo, stateLogin]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        passenger,
        token,
        loginPassenger,
        loginAdmin,
        loginWithGGAuthenticator,
        fetchMyAdminInfo,
        fetchMyUserInfo,
        logout,
        isValid,
        verifyPassword,
        setValid,
        resetValidation,
        isAdmin: isAdminLogin,
        // authType: "IDPW",
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
