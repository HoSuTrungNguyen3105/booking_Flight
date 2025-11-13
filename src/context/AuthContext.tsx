import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useGetSessionsByID,
  useLoginAdmin,
  useLoginByMfa,
  useLoginUser,
  useLogoutSessionFromPassenger,
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
import { refetchDistance } from "./Api/useGetLocation";
import type { AuthType } from "../components/Auth/Login";
import { useLocation } from "react-router-dom";

export type UserWithMFA = {
  email: string;
  code: string;
  authType: string;
};

// export type AuthType = "ADMIN" | "IDPW" | "DEV" | "MFA";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  passenger: Passenger | null;
  token: string | null;
  isAdmin: boolean;
  countryCode: string;
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
  const toast = useToast();
  const hasFetched = useRef(false);

  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<UserData | null>(null);
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const { refetchGetMyUserInfo } = useGetMyUserInfo();
  const { refetchGetMyAdminInfo } = useGetMyAdminInfo();
  const { refetchLogoutSession } = useLogoutSessionFromPassenger();
  const { refetchUpdateUserRank } = useUpdateUserRank();
  const { refetchGetSessionByID } = useGetSessionsByID();
  const { refetchLogin } = useLoginUser();
  const { refetchAdminLogin } = useLoginAdmin();
  const { refetchSetLoginMfa } = useLoginByMfa();
  const { fetchVerifyPassword } = useVerifyPw({ id: user?.id });
  const isAdmin = useMemo(() => user?.role === UserRole.ADMIN, [user]);

  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [countryCode, setCountryCode] = useState("");

  const handleRender = useCallback(() => {
    const saved = localStorage.getItem("cord");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 2) {
        const lat = Number(parsed[0]);
        const lng = Number(parsed[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          setCoords([lat, lng]);
        }
      }
    } catch (err) {
      console.error("Lỗi khi parse localStorage:", err);
    }
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  useEffect(() => {
    const fetchData = async () => {
      const saved = localStorage.getItem("cord");
      if (saved) {
        const parsed: [number, number] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 2) {
          setCoords(parsed);
        }
      }

      if (!saved) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newCoords: [number, number] = [
              pos.coords.latitude,
              pos.coords.longitude,
            ];
            setCoords(newCoords);
            localStorage.setItem("cord", JSON.stringify(newCoords));
          },
          (err) => console.error("Không thể lấy vị trí:", err)
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      if (!coords || hasFetched.current) return;
      hasFetched.current = true;

      const res = await refetchDistance(coords?.[0], coords?.[1]);
      setTimeout(() => {
        const newCode = res?.data?.[0]?.countryCode;
        if (newCode && newCode !== countryCode) {
          setCountryCode(newCode);
          localStorage.setItem("countryCode", newCode);
        }
      }, 2000);
    };

    fetchCountry();
  }, [coords]);

  const storage = {
    save: (token: string, userId: number | string, state: AuthType) => {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("stateLogin", state);
    },
    clear: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("stateLogin");
      localStorage.removeItem("cord");
      localStorage.removeItem("countryCode");
    },
  };

  const verifyPassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        const response = await fetchVerifyPassword({ password });
        const isValidResult = response?.resultCode === ResponseCode.SUCCESS;
        setIsValid(isValidResult);
        toast(
          isValidResult
            ? "Xác thực thành công"
            : (response?.resultMessage as string),
          isValidResult ? "success" : "error"
        );
        return isValidResult;
      } catch (error) {
        console.error("verifyPassword error:", error);
        setIsValid(false);
        return false;
      }
    },
    [fetchVerifyPassword, toast]
  );

  const setValid = useCallback((v: boolean) => setIsValid(v), []);
  const resetValidation = useCallback(() => setIsValid(false), []);

  /** Fetch thông tin user */
  // const fetchMyUserInfo = useCallback(async (id?: string) => {
  //   if (!id) return;
  //   const res = await refetchGetMyUserInfo({ id });
  //   if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
  //     setPassenger(res.data);
  //     setIsAuthenticated(true);
  //   } else {
  //     setPassenger(null);
  //     setIsAuthenticated(false);
  //   }
  //   return res;
  // }, []);

  const fetchMyUserInfo = useCallback(
    async (id?: string) => {
      if (!id) return;

      try {
        const res = await refetchGetMyUserInfo({ id });

        if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
          setPassenger(res.data);
          setIsAuthenticated(true);
        } else {
          setPassenger(null);
          setIsAuthenticated(false);
        }

        return res;
      } catch (error) {
        console.error("Fetch user info failed:", error);
        setPassenger(null);
        setIsAuthenticated(false);
      }
    },
    [refetchGetMyUserInfo]
  ); // nhớ thêm dependency

  /** Fetch thông tin admin */
  const fetchMyAdminInfo = useCallback(
    async (id?: number) => {
      if (!id) return;
      const res = await refetchGetMyAdminInfo({ id });

      if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
        await refetchUpdateUserRank({ userId: id });
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      return res;
    },
    [refetchUpdateUserRank]
  );

  /** Hàm xử lý login dùng chung */
  const handleLogin = async (
    fetchFn: Function,
    data: LoginReqProps,
    type: AuthType
  ) => {
    // setLoading(true);
    const res = await fetchFn(data);
    // setLoading(false);
    if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
      const token = res.accessToken;
      const id = res.data.id;
      setToken(token);
      setIsAuthenticated(true);
      storage.save(token, id, type);
      return { success: true, data: res };
    }

    toast(res?.resultMessage || "Đăng nhập thất bại", "error");
    return { success: false, data: res };
  };

  const logout = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await refetchLogoutSession();
      // if (res?.resultCode === ResponseCode.SUCCESS) {
      setIsAuthenticated(false);
      setUser(null);
      setPassenger(null);
      setToken(null);
      storage.clear();
      // }
    } catch (err) {
      console.error("Lỗi khi logout:", err);
    }
  }, [refetchLogoutSession]);

  // const logout = useCallback(async () => {
  //   const storedToken = localStorage.getItem("token");
  //   if (!storedToken) {
  //     setIsAuthenticated(false);
  //     setUser(null);
  //     setPassenger(null);
  //     setToken(null);
  //     storage.clear();
  //     return;
  //   }

  //   try {
  //     await refetchLogoutSession({ token: storedToken });
  //   } catch (err) {
  //     console.error("Lỗi khi logout:", err);
  //   } finally {
  //     setIsAuthenticated(false);
  //     setUser(null);
  //     setPassenger(null);
  //     setToken(null);
  //     storage.clear();
  //   }
  // }, [refetchLogoutSession]);

  const hasValidLogin = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const savedState = localStorage.getItem("stateLogin") as AuthType;

      // const savedId = localStorage.getItem("userId");
      if (!token) {
        console.warn("Token không tồn tại, logout...");
        logout();
        return;
      }

      const isADMIN = savedState === "ADMIN" ? userId : null;
      const isPassenger = savedState === "ID,PW" ? userId : null;

      const res = await refetchGetSessionByID({
        passengerId: isPassenger,
        userId: Number(isADMIN),
        token,
      });

      if (!res) {
        console.warn("Không nhận được phản hồi từ server");
        return false;
      }

      if (res.data?.requireLogout) {
        toast("Server yêu cầu logout do phiên không hợp lệ");
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Lỗi khi kiểm tra phiên đăng nhập:", error);
      // logout();
      return false;
    }
  }, [logout, passenger?.id, user?.id, refetchGetSessionByID]);

  const loginPassenger = async (data: LoginReqProps) => {
    const result = await handleLogin(refetchLogin, data, "ID,PW");
    if (result.success) await fetchMyUserInfo(result.data.data.id);
    return result.data;
  };

  const loginAdmin = async (data: LoginReqProps) => {
    const result = await handleLogin(refetchAdminLogin, data, "ADMIN");
    if (result.success) await fetchMyAdminInfo(result.data.data.id);
    return result.data;
  };

  const loginWithGGAuthenticator = async (
    userData: UserWithMFA
  ): Promise<ResponseGGAuthenticate> => {
    try {
      const res = await refetchSetLoginMfa(userData);
      if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
        const token = res.accessToken as string;
        const id = res.data.id;
        setToken(token);
        setIsAuthenticated(true);
        storage.save(token, id, "MFA");
        await fetchMyAdminInfo(id);
      } else {
        toast(res?.resultMessage || "Đăng nhập thất bại", "error");
      }
      return res as ResponseGGAuthenticate;
    } catch (error) {
      console.error("loginWithGGAuthenticator error:", error);
      return error as ResponseGGAuthenticate;
    }
  };

  /** Khôi phục login khi reload */
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedId = localStorage.getItem("userId");
      const savedState = localStorage.getItem("stateLogin") as AuthType;

      if (!savedToken || !savedId) return;
      setToken(savedToken);
      setIsAuthenticated(true);

      await hasValidLogin();

      if (savedState === "ID,PW") {
        await fetchMyUserInfo(savedId);
        return;
      }
      if (savedState === "ADMIN" || savedState === "DEV") {
        await fetchMyAdminInfo(Number(savedId));
        return;
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        passenger,
        countryCode,
        isAdmin,
        isValid,
        loginPassenger,
        loginAdmin,
        loginWithGGAuthenticator,
        fetchMyUserInfo,
        fetchMyAdminInfo,
        logout,
        verifyPassword,
        setValid,
        resetValidation,
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
