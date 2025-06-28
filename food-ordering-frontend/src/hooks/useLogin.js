import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useLogin = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateContextUserInfo } = useAuth();
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      const { token, user } = response.data;
      updateContextUserInfo(token, user);
      setError("");

      return token;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
};

export default useLogin;
