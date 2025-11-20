import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useToast } from "./ToastContext";
import {
  UserRole,
  type LoginDataResponse,
  type Passenger,
  type ResponseGGAuthenticate,
  type UserData,
} from "../utils/type";
import { ResponseCode } from "../utils/response";
import { refetchDistance } from "./Api/useGetLocation";
import type { AuthType } from "../components/Auth/Login";
import useLocalStorage from "./use[custom]/useLocalStorage";
import {
  useGetMyAdminInfo,
  useGetMyUserInfo,
  useGetSessionsByID,
  useLoginAdmin,
  useLoginUser,
  useLogoutSessionFromPassenger,
  useUpdateUserRank,
  useVerifyPw,
  type LoginReqProps,
} from "./Api/UserApi";
import { useLoginByMfa } from "./Api/AuthApi";

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
  countryCode: string | null;
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

  const [userId, setUserId] = useLocalStorage<string | null>("userId", null);
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [stateLogin, setStateLogin] = useLocalStorage<AuthType | null>(
    "stateLogin",
    null
  );
  const [coords, setCoords] = useLocalStorage<[number, number] | null>(
    "cord",
    null
  );
  const [countryCode, setCountryCode] = useLocalStorage<string | null>(
    "countryCode",
    null
  );

  const storage = {
    save: (token: string, userId: string | number, state: AuthType) => {
      setToken(token);
      setUserId(String(userId));
      setStateLogin(state);
    },
    clear: () => {
      setToken(null);
      setUserId(null);
      setStateLogin(null);
      setCoords(null);
      setCountryCode("");
    },
  };

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

  const handleRender = useCallback(() => {
    if (!coords) return;

    try {
      if (Array.isArray(coords) && coords.length === 2) {
        const lat = Number(coords[0]);
        const lng = Number(coords[1]);
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
      if (coords) {
        const [lat, lng] = coords;
        if (!isNaN(lat) && !isNaN(lng)) return;
      }
      if (!coords) {
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
          setCountryCode(newCode);
        }
      }, 2000);
    };

    fetchCountry();
  }, [coords]);

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
    if (!token) return;
    try {
      const res = await refetchLogoutSession();
      console.log("reslogout", res);
      if (res?.resultCode === ResponseCode.SUCCESS) {
        setIsAuthenticated(false);
        setUser(null);
        setCoords(null);
        setCountryCode(null);
        setPassenger(null);
        setToken(null);
        storage.clear();
      }
    } catch (err: any) {
      toast(err.message);
    }
  }, [toast]);

  const hasValidLogin = useCallback(async () => {
    try {
      if (!token) {
        console.warn("Token không tồn tại, logout...");
        logout();
        return;
      }

      const isADMIN = stateLogin === "ADMIN" ? userId : null;
      const isPassenger = stateLogin === "ID,PW" ? userId : null;

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

  useEffect(() => {
    const initAuth = async () => {
      if (!token || !userId) return;
      setToken(token);
      setIsAuthenticated(true);

      await hasValidLogin();

      if (stateLogin === "ID,PW") {
        await fetchMyUserInfo(userId);
        return;
      }
      if (stateLogin === "ADMIN" || stateLogin === "DEV") {
        await fetchMyAdminInfo(Number(userId));
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
