import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  } else if (isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default GuestGuard;
