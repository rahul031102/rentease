import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-2xl text-ink">
          <span className="bg-rust text-canvas rounded px-2 py-1 text-xs font-mono">RE</span>
          RentEase
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/products" className="hover:text-rust">Browse</Link>
          {user && (
            <Link to="/my-rentals" className="hover:text-rust">My Rentals</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-rust">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative text-gray-600 hover:text-rust">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.94-4.693 2.534-7.115a.75.75 0 00-.728-.917H5.106M7.5 14.25L5.106 5.21M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rust text-canvas text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-gray-600">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-ink text-canvas text-sm font-medium px-4 py-2 rounded hover:bg-ink/90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
