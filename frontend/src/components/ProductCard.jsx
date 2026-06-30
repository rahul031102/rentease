import React, { useRef } from "react";
import { Link } from "react-router-dom";
import ProductIcon from "./ProductIcon.jsx";

export default function ProductCard({ product }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    card.style.boxShadow = `
      ${-x * 20}px ${-y * 20}px 40px rgba(14,42,29,0.12),
      0 20px 40px rgba(14,42,29,0.1),
      inset 0 1px 0 rgba(255,255,255,0.7)
    `;
    const glare = card.querySelector(".card-glare");
    if (glare) {
      glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.25) 0%, transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
    card.style.boxShadow = "0 1px 3px rgba(14,42,29,0.08)";
    const glare = card.querySelector(".card-glare");
    if (glare) glare.style.background = "transparent";
  };

  const available = product.availableQuantity > 0;

  return (
    <Link
      to={`/products/${product._id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="block rounded-2xl overflow-hidden relative"
      style={{
        background: "#fff",
        border: "1px solid rgba(14,42,29,0.07)",
        boxShadow: "0 1px 3px rgba(14,42,29,0.08)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glare overlay */}
      <div className="card-glare absolute inset-0 z-10 pointer-events-none rounded-2xl transition-all duration-200" />

      {/* Image area */}
      <div
        className="h-44 flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F4EFE2 0%, #EDE6D3 100%)",
        }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(14,42,29,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
            transform: "translateZ(20px)",
          }}
        >
          <ProductIcon subCategory={product.subCategory} className="w-10 h-10 text-ink" />
        </div>

        {/* Availability badge */}
        <div
          className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            background: available ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
            color: available ? "#15803d" : "#dc2626",
            border: `1px solid ${available ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
          }}
        >
          {available ? "Available" : "Out of stock"}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest font-mono mb-1" style={{ color: "#9FC2AE" }}>
          {product.category}
        </p>
        <h3 className="font-semibold text-ink text-[15px] leading-snug mb-4">
          {product.name}
        </h3>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[22px] font-display font-semibold" style={{ color: "#D8643A" }}>
              ₹{product.monthlyRent}
              <span className="text-xs font-sans font-normal ml-1" style={{ color: "#0E2A1D66" }}>/mo</span>
            </p>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: "#0E2A1D55" }}>
              Deposit ₹{product.securityDeposit}
            </p>
          </div>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #D8643A, #bf5530)",
              boxShadow: "0 4px 12px rgba(216,100,58,0.4)",
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
