import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(251,248,242,0.85)"
          : "rgba(251,248,242,0.0)",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(14,42,29,0.08)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px rgba(14,42,29,0.06)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-canvas transition-all duration-300 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #D8643A 0%, #bf5530 100%)",
              boxShadow: "0 2px 12px rgba(216,100,58,0.4)",
            }}
          >
            RE
          </div>
          <span className="font-display font-semibold text-xl text-ink tracking-tight">
            RentEase
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: "/products", label: "Browse" },
            ...(user ? [{ to: "/my-rentals", label: "My Rentals" }] : []),
            ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: location.pathname === to ? "#D8643A" : "#0E2A1D99",
                background: location.pathname === to ? "rgba(216,100,58,0.08)" : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-ink/5"
            style={{ color: "#0E2A1D" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.94-4.693 2.534-7.115a.75.75 0 00-.728-.917H5.106M7.5 14.25L5.106 5.21M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {items.length > 0 && (
              <span
                className="absolute -top-1 -right-1 text-canvas text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #D8643A, #bf5530)",
                  width: 18, height: 18,
                  boxShadow: "0 2px 8px rgba(216,100,58,0.5)",
                }}
              >
                {items.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <div
                className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-xs font-semibold text-canvas"
                style={{ background: "linear-gradient(135deg, #0E2A1D, #1a4a32)" }}
              >
                {user.name[0].toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                style={{ color: "#0E2A1D66" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-premium text-sm font-semibold px-5 py-2 rounded-xl text-canvas"
              style={{
                background: "linear-gradient(135deg, #0E2A1D 0%, #1a4a32 100%)",
                boxShadow: "0 2px 12px rgba(14,42,29,0.3)",
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
