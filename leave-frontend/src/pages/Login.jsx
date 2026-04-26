import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in (sessionStorage)
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    if (user) {
      if (user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const login = async () => {
    setError("");

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/login", {
        email,
        password
      });

      const { token, user } = res.data;

      // 🔥 Save in sessionStorage (NOT localStorage)
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user?.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  // Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">

      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[360px] border border-gray-200">

        <h1 className="text-center text-indigo-600 font-bold text-xl mb-2">
          LeaveMS
        </h1>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Login to continue
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 mb-1 block">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-400 rounded-lg 
            placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-1 block">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-400 rounded-lg 
            placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading || !form.email || !form.password}
          className={`w-full p-3 rounded-lg font-semibold text-white transition duration-200
            ${
              loading || !form.email || !form.password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 hover:shadow-lg"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-500 text-center mt-6">
          Employee Leave Management System
        </p>

      </div>
    </div>
  );
}

