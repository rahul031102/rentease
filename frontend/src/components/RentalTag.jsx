import React from "react";
import ProductIcon from "./ProductIcon.jsx";

export default function RentalTag({ subCategory, code, price, tenure, rotate = 0, className = "" }) {
  return (
    <div
      className={`select-none float-tag ${className}`}
      style={{ "--rotate": `${rotate}deg`, transform: `rotate(${rotate}deg)` }}
    >
      {/* String */}
      <div className="flex flex-col items-center mb-0">
        <div
          className="w-px h-8"
          style={{
            background: "linear-gradient(to bottom, rgba(14,42,29,0.1), rgba(14,42,29,0.35))",
            boxShadow: "1px 0 2px rgba(14,42,29,0.1)",
          }}
        />
      </div>

      {/* Tag body */}
      <div
        className="relative w-44 rounded-xl px-5 pt-6 pb-4"
        style={{
          background: "linear-gradient(145deg, #FAF6ED 0%, #F0EAD8 100%)",
          border: "1px solid rgba(14,42,29,0.1)",
          boxShadow:
            "0 8px 32px rgba(14,42,29,0.18), 0 2px 8px rgba(14,42,29,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {/* Punch hole */}
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
          style={{
            background: "#FBF8F2",
            border: "1.5px solid rgba(14,42,29,0.2)",
            boxShadow: "inset 0 1px 3px rgba(14,42,29,0.15)",
          }}
        />

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.8)",
              boxShadow: "0 4px 12px rgba(14,42,29,0.1), inset 0 1px 0 rgba(255,255,255,1)",
            }}
          >
            <ProductIcon subCategory={subCategory} className="w-7 h-7 text-ink" />
          </div>
        </div>

        {/* Perforation */}
        <div
          className="border-t border-dashed mb-2.5"
          style={{ borderColor: "rgba(14,42,29,0.15)" }}
        />

        <p className="font-mono text-[10px] tracking-widest mb-0.5" style={{ color: "rgba(14,42,29,0.45)" }}>
          {code}
        </p>
        <p className="font-mono text-base font-bold" style={{ color: "#0E2A1D" }}>
          ₹{price}
          <span className="text-xs font-normal ml-0.5" style={{ color: "rgba(14,42,29,0.45)" }}>/mo</span>
        </p>
        <p className="font-mono text-[10px] font-semibold mt-0.5 tracking-wider" style={{ color: "#D8643A" }}>
          {tenure} MO TENURE
        </p>
      </div>
    </div>
  );
}
