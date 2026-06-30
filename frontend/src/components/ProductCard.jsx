import React from "react";
import { Link } from "react-router-dom";
import ProductIcon from "./ProductIcon.jsx";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-xl border hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div className="h-40 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <ProductIcon subCategory={product.subCategory} />
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-xs uppercase tracking-wide text-gray-400">{product.category}</span>
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <p className="text-brand-700 font-bold text-lg">₹{product.monthlyRent}<span className="text-xs font-normal text-gray-500">/mo</span></p>
            <p className="text-xs text-gray-500">Deposit ₹{product.securityDeposit}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${product.availableQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {product.availableQuantity > 0 ? "Available" : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}
