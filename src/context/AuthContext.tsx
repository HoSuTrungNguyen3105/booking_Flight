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
import {
  useGetDistancesByLocationCode,
  useGetLocationCode,
} from "./Api/useGetLocation";

export type UserWithMFA = {
  email: string;
  code: string;
  authType: string;
};

export type AuthType = "ADMIN" | "IDPW" | "MFA";

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
  const toast = useToast();
  const hasFetched = useRef(false);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValid, setIsValid] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [stateLogin, setStateLogin] = useState<AuthType>(() => {
  //   return (localStorage.getItem("stateLogin") as AuthType) || "IDPW";
  // });

  const { refetchLogin } = useLoginUser();
  const { refetchAdminLogin } = useLoginAdmin();
  const { refetchSetLoginMfa } = useLoginByMfa();
  const { fetchVerifyPassword } = useVerifyPw({ id: user?.id });
  const { refetchGetMyUserInfo } = useGetMyUserInfo();
  const { refetchGetMyAdminInfo } = useGetMyAdminInfo();
  const { refetchLogoutSession } = useLogoutSessionFromPassenger();
  const { refetchUpdateUserRank } = useUpdateUserRank();
  const { refetchGetSessionByID } = useGetSessionsByID();
  const isAdmin = useMemo(() => user?.role === UserRole.ADMIN, [user]);

  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [countryCode, setCountryCode] = useState("");

  const handleRender = useCallback(() => {
    const saved = localStorage.getItem("cord");
    if (!saved) return;

    try {
      // Nếu lưu dạng JSON.stringify([lat, lng])
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 2) {
        const lat = Number(parsed[0]);
        const lng = Number(parsed[1]);

        // Đảm bảo đúng kiểu [number, number]
        if (!isNaN(lat) && !isNaN(lng)) {
          setCoords([lat, lng]);
        } else {
          console.warn("Dữ liệu toạ độ không hợp lệ:", parsed);
        }
      }
    } catch (err) {
      console.error("Lỗi khi parse localStorage:", err);
    }
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  const { refetchDistance } = useGetLocationCode(
    coords?.[0] as number,
    coords?.[1] as number
  );

  console.log("cor", coords);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      const saved = localStorage.getItem("cord");
      if (saved) {
        console.log("save", saved);
        const parsed: [number, number] = JSON.parse(saved);
        console.log("parsed", parsed);
        if (Array.isArray(parsed) && parsed.length === 2) {
          setCoords(parsed);
          // const res = await refetchDistance();
          // console.log("res", res);
        }
      }

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
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      if (!coords) return;
      const res = await refetchDistance();
      console.log("refetchDistance", res);
      const newCode = res?.data?.[0]?.countryCode;
      if (newCode && newCode !== countryCode) {
        setCountryCode(newCode);
        localStorage.setItem("countryCode", newCode);
      }
    };

    fetchCountry();
    // Không nên thêm countryCode vào dependency!
  }, [coords]);

  // const { dataDistance } = useGetDistancesByLocationCode(countryCode);

  // const [callingCode, setCallingCode] = useState(
  //   dataDistance?.data.callingCode
  // );

  /** Helper quản lý localStorage */
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
    },
  };

  /** Verify Password */
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
  const fetchMyUserInfo = useCallback(async (id?: string) => {
    if (!id) return;
    const res = await refetchGetMyUserInfo({ id });
    if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
      setPassenger(res.data);
      setIsAuthenticated(true);
    } else {
      setPassenger(null);
      setIsAuthenticated(false);
    }
    return res;
  }, []);

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
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!id || !token) return;

    try {
      await refetchLogoutSession({ id: Number(id), token });
    } catch (err) {
      console.error("Lỗi khi logout:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setPassenger(null);
      setToken(null);
      storage.clear();
    }
  }, [refetchLogoutSession]);

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
      const isPassenger = savedState === "IDPW" ? userId : null;

      const res = await refetchGetSessionByID({
        passengerId: isPassenger,
        userId: Number(isADMIN),
        token,
      });

      if (!res) {
        console.warn("Không nhận được phản hồi từ server");
        // logout();
        return;
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
    const result = await handleLogin(refetchLogin, data, "IDPW");
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

      const valid = await hasValidLogin();
      console.warn("valid", valid);
      if (!valid) return;

      if (savedState === "IDPW") {
        await fetchMyUserInfo(savedId);
      }
      if (savedState === "ADMIN") {
        await fetchMyAdminInfo(Number(savedId));
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
        isAdmin,
        isValid,
        // loading,
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
