import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

type User = {
  userName?: string;
  email?: string;
  // password: string;
  emailPrefix?: string;
  emailSuffix?: string;
  password: string;
  remember?: boolean;
  // role:
};
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  register: (userData: User) => void;
  logout: () => void;
}
interface AuthProviderProps {
  children: React.ReactNode;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const saveIsAuthenticated =
      localStorage.getItem("isAuthenticated") === "true";
    const saveUser = localStorage.getItem("user");
    if (saveIsAuthenticated && saveUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(saveUser));
    }
  }, []);
  // login: (userData: User) => {
  //         setIsAuthenticate(true);
  //         setUser(userData);
  //         localStorage.setItem("isAuthenticated", "true");
  //         localStorage.setItem("user", JSON.stringify(userData));
  //       },
  //       logout: () => {
  //         setIsAuthenticate(false);
  //         setUser(null);
  //         localStorage.removeItem("isAuthenticated");
  //         localStorage.removeItem("user");
  //       },
  const updateLocalStorage = (isAuthenticated: boolean, user: User | null) => {
    if (!updateLocalStorage) return;
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("user", JSON.stringify(user));
  };

  const login = async (userData: User) => {
    if (!userData) return;
    // const res = await refetchLoginUser(userData);
    // try {
    //   if (res?.resultCode === MessageOption.Option00) {
    //     setIsAuthenticated(true);
    //     setUser(userData);
    //     updateLocalStorage(true, userData);
    //   }
    // } catch (err) {
    //   console.error('Lỗi khi đăng nhập:', err);
    //   setUser(null);
    //   setIsAuthenticated(false);
    // }
  };
  const register = async (userData: User) => {
    if (!userData) return;
    // const res = await refetchRegisterUser(userData);
    // try {
    //   if (res?.resultCode === MessageOption.Option00) {
    //     setIsAuthenticated(true);
    //     setUser(userData);
    //     updateLocalStorage(true, userData);
    //   }
    // } catch (err) {
    //   console.error('Lỗi khi đăng ký:', err);
    //   setUser(null);
    //   setIsAuthenticated(false);
    // }
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    toast.success("Logout Success");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
