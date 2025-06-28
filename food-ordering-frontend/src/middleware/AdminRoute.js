import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};

export default AdminRoute;
