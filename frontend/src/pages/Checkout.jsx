import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Checkout() {
  const { items, totalMonthly, totalDeposit, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = delivery details, 2 = payment
  const [form, setForm] = useState({
    deliveryDate: "",
    deliveryAddress: user?.address || "",
    city: user?.city || "",
  });
  const [payment, setPayment] = useState({ method: "card", cardNumber: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleContinue = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
          tenureMonths: i.tenureMonths,
        })),
        deliveryDate: form.deliveryDate,
        deliveryAddress: form.deliveryAddress,
        city: form.city,
      };
      // Payment is simulated for this MVP — no real charge is made.
      await new Promise((res) => setTimeout(res, 900));
      await api.post("/rentals", payload);
      clearCart();
      showToast("Payment successful — rental confirmed!");
      navigate("/my-rentals");
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
      showToast("Checkout failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <span className={step === 1 ? "text-brand-700 font-semibold" : ""}>1. Delivery</span>
        <span>→</span>
        <span className={step === 2 ? "text-brand-700 font-semibold" : ""}>2. Payment</span>
      </div>

      {step === 1 && (
        <form onSubmit={handleContinue} className="bg-white border rounded-xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Delivery Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.deliveryDate}
              onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Delivery Address</label>
            <textarea
              required
              rows={3}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <input
              required
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div className="bg-brand-50 rounded-lg p-4 text-sm flex flex-col gap-1">
            <div className="flex justify-between"><span>Monthly Rent</span><span className="font-semibold">₹{totalMonthly}</span></div>
            <div className="flex justify-between"><span>Security Deposit</span><span className="font-semibold">₹{totalDeposit}</span></div>
          </div>

          <button className="bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700">
            Continue to Payment
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePay} className="bg-white border rounded-xl p-6 flex flex-col gap-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            Demo payment — this is simulated for the project, no real card is charged.
          </p>

          <div className="flex gap-2">
            {["card", "upi"].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setPayment({ ...payment, method: m })}
                className={`px-4 py-2 rounded-lg text-sm border ${
                  payment.method === m ? "bg-brand-600 text-white border-brand-600" : "border-gray-300 text-gray-600"
                }`}
              >
                {m === "card" ? "Card" : "UPI"}
              </button>
            ))}
          </div>

          {payment.method === "card" ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">Card Number</label>
                <input
                  required
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Expiry</label>
                  <input
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={payment.expiry}
                    onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CVV</label>
                  <input
                    required
                    placeholder="123"
                    maxLength={3}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={payment.cvv}
                    onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="text-sm font-medium text-gray-700">UPI ID</label>
              <input
                required
                placeholder="yourname@upi"
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={payment.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
              />
            </div>
          )}

          <div className="bg-brand-50 rounded-lg p-4 text-sm flex flex-col gap-1">
            <div className="flex justify-between"><span>Monthly Rent</span><span className="font-semibold">₹{totalMonthly}</span></div>
            <div className="flex justify-between"><span>Security Deposit</span><span className="font-semibold">₹{totalDeposit}</span></div>
            <div className="flex justify-between border-t border-brand-100 pt-1 mt-1"><span>Due Today</span><span className="font-bold">₹{totalMonthly + totalDeposit}</span></div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="flex-1 border rounded-lg py-3 text-sm font-medium text-gray-600">
              Back
            </button>
            <button disabled={loading} className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60">
              {loading ? "Processing..." : `Pay ₹${totalMonthly + totalDeposit}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
