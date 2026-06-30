import React, { useEffect, useState } from "react";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const subCategoriesByCategory = {
  Furniture: ["Bed", "Sofa", "Table"],
  Appliances: ["Fridge", "Washing Machine", "TV"],
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (subCategory) params.subCategory = subCategory;
      if (search) params.search = search;
      const { data } = await api.get("/products", { params });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Furniture & Appliances</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          placeholder="Search products..."
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-brand-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
        />
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("");
          }}
        >
          <option value="">All Categories</option>
          <option value="Furniture">Furniture</option>
          <option value="Appliances">Appliances</option>
        </select>
        {category && (
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">All Types</option>
            {subCategoriesByCategory[category].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
        <button
          onClick={fetchProducts}
          className="bg-brand-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-100" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-3 w-16 bg-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="52" cy="52" r="28" />
            <path d="M72 72l20 20" strokeLinecap="round" />
          </svg>
          <p className="text-gray-500">No products found. Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
