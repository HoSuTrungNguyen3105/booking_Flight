import { Navigate, Outlet } from "react-router-dom";

const Guard = () => {
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default Guard;
