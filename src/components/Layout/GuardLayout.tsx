import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default GuestGuard;
