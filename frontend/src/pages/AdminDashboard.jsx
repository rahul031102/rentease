import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useToast } from "../context/ToastContext.jsx";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const emptyProduct = {
  name: "",
  category: "Furniture",
  subCategory: "Bed",
  description: "",
  monthlyRent: "",
  securityDeposit: "",
  city: "All",
  totalQuantity: 1,
  availableQuantity: 1,
};

const tabs = ["Overview", "Inventory", "Rentals"];

const PIE_COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#6366f1", "#ef4444", "#9ca3af", "#06b6d4"];

function revenueByCategory(rentals) {
  const totals = {};
  rentals.forEach((r) => {
    if (!["confirmed", "delivered", "active"].includes(r.status)) return;
    r.items.forEach((it) => {
      // category isn't stored on the rental item, so infer Furniture vs Appliances
      // by matching against the rent — fall back to "Other" if unknown.
      const cat = it.name.match(/Fridge|Washing|TV/i) ? "Appliances" : "Furniture";
      totals[cat] = (totals[cat] || 0) + it.monthlyRent * it.quantity;
    });
  });
  return Object.entries(totals).map(([category, revenue]) => ({ category, revenue }));
}

function rentalsByStatus(rentals) {
  const totals = {};
  rentals.forEach((r) => {
    totals[r.status] = (totals[r.status] || 0) + 1;
  });
  return Object.entries(totals).map(([status, count]) => ({ status: status.replace("_", " "), count }));
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  const loadStats = () => api.get("/admin/stats").then(({ data }) => setStats(data));
  const loadProducts = () => api.get("/products").then(({ data }) => setProducts(data));
  const loadRentals = () => api.get("/rentals").then(({ data }) => setRentals(data));

  useEffect(() => {
    loadStats();
    loadProducts();
    loadRentals();
  }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      monthlyRent: Number(form.monthlyRent),
      securityDeposit: Number(form.securityDeposit),
      totalQuantity: Number(form.totalQuantity),
      availableQuantity: Number(form.availableQuantity),
    };
    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
      showToast("Product updated");
    } else {
      await api.post("/products", payload);
      showToast("Product added");
    }
    setForm(emptyProduct);
    setEditingId(null);
    loadProducts();
    loadStats();
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      description: p.description,
      monthlyRent: p.monthlyRent,
      securityDeposit: p.securityDeposit,
      city: p.city,
      totalQuantity: p.totalQuantity,
      availableQuantity: p.availableQuantity,
    });
    setEditingId(p._id);
    setTab("Inventory");
  };

  const handleDeactivate = async (id) => {
    await api.delete(`/products/${id}`);
    showToast("Product deactivated", "info");
    loadProducts();
    loadStats();
  };

  const updateRentalStatus = async (id, status) => {
    await api.put(`/rentals/${id}/status`, { status });
    showToast(`Rental marked as ${status.replace("_", " ")}`);
    loadRentals();
    loadStats();
  };

  const resolveMaintenance = async (rentalId, index) => {
    await api.put(`/rentals/${rentalId}/maintenance/${index}`, { status: "resolved" });
    showToast("Maintenance request resolved");
    loadRentals();
    loadStats();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-8 border-b">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {[
              ["Active Rentals", stats.activeRentalsCount],
              ["Monthly Recurring Revenue", `₹${stats.monthlyRecurringRevenue}`],
              ["Product Utilization Rate", `${stats.productUtilizationRate}%`],
              ["Total Users", stats.totalUsers],
              ["Total Active Products", stats.totalProducts],
              ["Open Maintenance Requests", stats.openMaintenanceRequests],
            ].map(([label, value]) => (
              <div key={label} className="bg-white border rounded-xl p-5">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Monthly Rent by Category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueByCategory(rentals)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `₹${v}`} />
                  <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Rentals by Status</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={rentalsByStatus(rentals)}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={90}
                    label={(d) => d.status}
                  >
                    {rentalsByStatus(rentals).map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab === "Inventory" && (
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSaveProduct} className="bg-white border rounded-xl p-5 flex flex-col gap-3 h-fit">
            <h2 className="font-semibold text-gray-800">{editingId ? "Edit Product" : "Add Product"}</h2>
            <input required placeholder="Name" className="border rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select className="border rounded-lg px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="Furniture">Furniture</option>
                <option value="Appliances">Appliances</option>
              </select>
              <input required placeholder="Sub-category (e.g. Sofa)" className="border rounded-lg px-3 py-2 text-sm" value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })} />
            </div>
            <textarea placeholder="Description" rows={2} className="border rounded-lg px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Monthly Rent" className="border rounded-lg px-3 py-2 text-sm" value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })} />
              <input required type="number" placeholder="Security Deposit" className="border rounded-lg px-3 py-2 text-sm" value={form.securityDeposit} onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Total Quantity" className="border rounded-lg px-3 py-2 text-sm" value={form.totalQuantity} onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })} />
              <input required type="number" placeholder="Available Quantity" className="border rounded-lg px-3 py-2 text-sm" value={form.availableQuantity} onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })} />
            </div>
            <input placeholder="City (or 'All')" className="border rounded-lg px-3 py-2 text-sm" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <div className="flex gap-2">
              <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
                {editingId ? "Save Changes" : "Add Product"}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setForm(emptyProduct); setEditingId(null); }} className="text-sm text-gray-500">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div key={p._id} className="bg-white border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.category} · {p.subCategory} · ₹{p.monthlyRent}/mo</p>
                  <p className="text-xs text-gray-400">{p.availableQuantity}/{p.totalQuantity} available · {p.city}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">Edit</button>
                  <button onClick={() => handleDeactivate(p._id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100">Deactivate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Rentals" && (
        <div className="flex flex-col gap-5">
          {rentals.map((r) => (
            <div key={r._id} className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{r.user?.name}</p>
                  <p className="text-xs text-gray-500">{r.user?.email}</p>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => updateRentalStatus(r._id, e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1"
                >
                  {["pending", "confirmed", "delivered", "active", "return_requested", "returned", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <ul className="text-sm text-gray-700 mb-2">
                {r.items.map((it, idx) => (
                  <li key={idx}>{it.name} × {it.quantity} ({it.tenureMonths} mo)</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mb-2">
                Delivery {new Date(r.deliveryDate).toLocaleDateString()} · {r.deliveryAddress}, {r.city}
              </p>
              {r.maintenanceRequests?.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Maintenance Requests</p>
                  {r.maintenanceRequests.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm text-gray-600 py-0.5">
                      <span>{m.issue} — {m.status}</span>
                      {m.status !== "resolved" && (
                        <button onClick={() => resolveMaintenance(r._id, idx)} className="text-xs text-brand-700 hover:underline">
                          Mark resolved
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
