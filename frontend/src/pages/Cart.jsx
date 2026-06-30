import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, removeFromCart, updateTenure, totalMonthly, totalDeposit } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <svg viewBox="0 0 120 120" className="w-28 h-28 mx-auto mb-4 text-brand-200" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="60" cy="60" r="54" strokeOpacity="0.4" />
          <path d="M30 44h8l8 36h32l8-26H44" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="88" r="4" fill="currentColor" stroke="none" />
          <circle cx="76" cy="88" r="4" fill="currentColor" stroke="none" />
        </svg>
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-brand-700 font-medium">Browse products →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.product._id} className="bg-white border rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800">{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity} · ₹{item.product.monthlyRent}/mo</p>
              <select
                className="mt-2 text-sm border rounded-lg px-2 py-1"
                value={item.tenureMonths}
                onChange={(e) => updateTenure(item.product._id, Number(e.target.value))}
              >
                {item.product.tenureOptions.map((t) => (
                  <option key={t} value={t}>{t} months</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => removeFromCart(item.product._id)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-brand-50 rounded-xl p-5 flex flex-col gap-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Monthly Rent</span>
          <span className="font-semibold text-gray-900">₹{totalMonthly}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Security Deposit</span>
          <span className="font-semibold text-gray-900">₹{totalDeposit}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-6 w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
