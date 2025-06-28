import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./middleware/AdminRoute";
import ProtectedRoute from "./middleware/ProtectedRoute";
import MenuPage from "./pages/menu/MenuPage";
import LoginPage from "./pages/login/LoginPage";
import OrderHistoryPage from "./pages/menu/OrderHistoryPage";
import AdminPage from "./pages/admin/AdminPage";
import { SocketProvider } from "./context/SocketProvider";
import { ToastContainer } from "react-toastify";
import RegisterPage from "./pages/login/RegisterPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<MenuPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />

              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
