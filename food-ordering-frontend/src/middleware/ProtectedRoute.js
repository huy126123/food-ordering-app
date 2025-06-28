import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useAuth();
  const location = useLocation();

  if (!isLogin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
