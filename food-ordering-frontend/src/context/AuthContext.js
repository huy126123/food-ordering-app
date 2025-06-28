import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = !!token && !!user;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Invalid or expired token");

        if (location.pathname === "/login") {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        logout();
      }
    };

    if (token) {
      fetchUser();
    } else if (location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [token]);

  const updateContextUserInfo = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ token, user, updateContextUserInfo, logout, isLogin, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
