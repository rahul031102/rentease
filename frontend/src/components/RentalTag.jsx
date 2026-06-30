import React from "react";
import ProductIcon from "./ProductIcon.jsx";

/**
 * The signature visual element of RentEase: every rented item is rendered as
 * a hanging inventory tag — punch hole, string, dashed perforation, mono data —
 * because that's literally what renting is: borrowed, tracked, returnable.
 */
export default function RentalTag({ subCategory, code, price, tenure, rotate = 0, className = "" }) {
  return (
    <div
      className={`select-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg width="0" height="0">
        <defs />
      </svg>
      <div className="bg-tag rounded-lg shadow-xl px-5 pt-7 pb-4 w-44 relative border border-black/5">
        {/* punch hole + string */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-0.5 h-6 bg-ink/30" />
        </div>
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-canvas border border-ink/30" />

        <div className="flex justify-center mb-2 text-ink">
          <ProductIcon subCategory={subCategory} className="w-10 h-10 [&>svg]:w-10 [&>svg]:h-10" />
        </div>

        <div className="border-t border-dashed border-ink/20 pt-2 font-mono text-[10px] text-ink/60 tracking-wide">
          {code}
        </div>
        <p className="font-mono text-sm text-ink font-semibold mt-0.5">₹{price}<span className="text-ink/50">/mo</span></p>
        <p className="font-mono text-[10px] text-rust mt-0.5">{tenure} MO TENURE</p>
      </div>
    </div>
  );
}
