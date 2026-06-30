import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
      <p className="text-gray-500 mb-6 text-sm">Start renting furniture & appliances in minutes.</p>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 flex flex-col gap-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input required className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.name} onChange={handleChange("name")} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" required className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.email} onChange={handleChange("email")} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input type="password" required minLength={6} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.password} onChange={handleChange("password")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.phone} onChange={handleChange("phone")} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.city} onChange={handleChange("city")} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.address} onChange={handleChange("address")} />
        </div>

        <button disabled={loading} className="bg-brand-600 text-white rounded-lg py-2.5 font-medium hover:bg-brand-700 disabled:opacity-60">
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-700 font-medium">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
