import React from "react";

const icons = {
  Bed: (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 38v14M58 38v14M6 38v-8a4 4 0 014-4h44a4 4 0 014 4v8M6 38h52M14 26v-4a4 4 0 014-4h8a4 4 0 014 4v4M34 26v-4a4 4 0 014-4h8a4 4 0 014 4v4" />
    </svg>
  ),
  Sofa: (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 32v14a4 4 0 004 4h36a4 4 0 004-4V32M10 32a4 4 0 014-4h36a4 4 0 014 4M10 32H6v10h4M58 32h4v10h-4M16 36v10M48 36v10M16 28v-6a4 4 0 014-4h24a4 4 0 014 4v6" />
    </svg>
  ),
  Table: (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h52v8H6zM12 26v22M52 26v22M22 26v8M42 26v8" />
    </svg>
  ),
  Fridge: (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="6" width="32" height="52" rx="3" />
      <path d="M16 24h32M22 12v6M22 30v8" />
    </svg>
  ),
  "Washing Machine": (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="8" width="44" height="48" rx="3" />
      <circle cx="32" cy="36" r="12" />
      <circle cx="32" cy="36" r="6" />
      <path d="M18 16h4M28 16h4" />
    </svg>
  ),
  TV: (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="12" width="52" height="32" rx="3" />
      <path d="M24 52h16M32 44v8" />
    </svg>
  ),
};

export default function ProductIcon({ subCategory, className = "" }) {
  return (
    <div className={`text-brand-600 ${className}`}>
      {icons[subCategory] || icons.Table}
    </div>
  );
}
