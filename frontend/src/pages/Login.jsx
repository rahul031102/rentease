import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-gray-500 mb-6 text-sm">Log in to manage your rentals.</p>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 flex flex-col gap-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button
          disabled={loading}
          className="bg-brand-600 text-white rounded-lg py-2.5 font-medium hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        <p className="text-sm text-gray-500 text-center">
          No account?{" "}
          <Link to="/register" className="text-brand-700 font-medium">
            Register
          </Link>
        </p>
        <p className="text-xs text-gray-400 text-center">
          Admin demo: admin@rentease.com / admin123
        </p>
      </form>
    </div>
  );
}
