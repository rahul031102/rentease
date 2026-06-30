import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import ProductIcon from "../components/ProductIcon.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [tenure, setTenure] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      setTenure(data.tenureOptions[0]);
    });
  }, [id]);

  if (!product) return <p className="max-w-4xl mx-auto px-4 py-10 text-gray-500">Loading...</p>;

  const handleAdd = () => {
    if (!user) return navigate("/login");
    addToCart(product, tenure);
    setAdded(true);
    showToast(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl h-72 flex items-center justify-center">
        <ProductIcon subCategory={product.subCategory} className="w-32 h-32 [&>svg]:w-32 [&>svg]:h-32" />
      </div>

      <div>
        <span className="text-xs uppercase tracking-wide text-gray-400">{product.category}</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
        <p className="text-gray-500 mt-3">{product.description}</p>

        <div className="mt-6 flex gap-6">
          <div>
            <p className="text-xs text-gray-400">Monthly Rent</p>
            <p className="text-brand-700 font-bold text-xl">₹{product.monthlyRent}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Security Deposit</p>
            <p className="text-gray-800 font-bold text-xl">₹{product.securityDeposit}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Rental Tenure</p>
          <div className="flex gap-2">
            {product.tenureOptions.map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={`px-4 py-2 rounded-lg text-sm border ${
                  tenure === t ? "bg-brand-600 text-white border-brand-600" : "border-gray-300 text-gray-600"
                }`}
              >
                {t} months
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          {product.availableQuantity > 0
            ? `${product.availableQuantity} units available`
            : "Currently out of stock"}
        </p>

        <button
          disabled={product.availableQuantity === 0}
          onClick={handleAdd}
          className="mt-6 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
