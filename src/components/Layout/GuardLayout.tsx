import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Nếu đã login thì chặn truy cập vào loginPage, redirect về home
    return <Navigate to="/" replace />;
  }

  // Nếu chưa login thì cho vào trang (vd: LoginPage, RegisterPage)
  return <>{children}</>;
};

export default GuestGuard;
