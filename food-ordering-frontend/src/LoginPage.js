import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login: loginApi, error, loading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginApi(username, password);
    // Optional: Redirect here after success
    // if (user) navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
