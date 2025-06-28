import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    email:"",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Mật khẩu không khớp");
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        fullName: form.fullName,
        username: form.username,
        email:form.email,
        password: form.password,
        role: "customer",
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder="Họ và tên"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Username"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Mật khẩu"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Xác nhận mật khẩu"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
