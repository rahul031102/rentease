import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useToast } from "../context/ToastContext.jsx";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-indigo-100 text-indigo-700",
  active: "bg-green-100 text-green-700",
  return_requested: "bg-orange-100 text-orange-700",
  returned: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueText, setIssueText] = useState({});
  const { showToast } = useToast();

  const fetchRentals = async () => {
    setLoading(true);
    const { data } = await api.get("/rentals/mine");
    setRentals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const requestReturn = async (id) => {
    await api.put(`/rentals/${id}/status`, { status: "return_requested" });
    showToast("Return requested");
    fetchRentals();
  };

  const submitMaintenance = async (id) => {
    const issue = issueText[id];
    if (!issue) return;
    await api.post(`/rentals/${id}/maintenance`, { issue });
    setIssueText({ ...issueText, [id]: "" });
    showToast("Maintenance request submitted");
    fetchRentals();
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border rounded-xl p-5 animate-pulse">
            <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
            <div className="h-3 w-full bg-gray-100 rounded mb-2" />
            <div className="h-3 w-2/3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Rentals</h1>

      {rentals.length === 0 ? (
        <div className="text-center py-16">
          <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" strokeWidth="3">
            <rect x="30" y="40" width="60" height="50" rx="4" />
            <path d="M30 56h60M48 40v-8a4 4 0 014-4h16a4 4 0 014 4v8" strokeLinecap="round" />
          </svg>
          <p className="text-gray-500">No rentals yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {rentals.map((r) => (
            <div key={r._id} className="bg-white border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">
                  Ordered {new Date(r.createdAt).toLocaleDateString()}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[r.status]}`}>
                  {r.status.replace("_", " ")}
                </span>
              </div>

              <ul className="text-sm text-gray-700 mb-3">
                {r.items.map((it, idx) => (
                  <li key={idx}>
                    {it.name} × {it.quantity} — {it.tenureMonths} months (₹{it.monthlyRent}/mo)
                  </li>
                ))}
              </ul>

              <div className="text-sm text-gray-500 mb-3">
                Delivery: {new Date(r.deliveryDate).toLocaleDateString()} to {r.deliveryAddress}, {r.city}
              </div>

              <div className="flex justify-between text-sm font-medium text-gray-800 mb-4">
                <span>Total Monthly: ₹{r.totalMonthlyRent}</span>
                <span>Deposit: ₹{r.totalSecurityDeposit}</span>
              </div>

              {r.maintenanceRequests?.length > 0 && (
                <div className="mb-4 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Maintenance Requests</p>
                  {r.maintenanceRequests.map((m, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      • {m.issue} — <span className="font-medium">{m.status}</span>
                    </p>
                  ))}
                </div>
              )}

              {["confirmed", "delivered", "active"].includes(r.status) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    placeholder="Describe an issue..."
                    className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px]"
                    value={issueText[r._id] || ""}
                    onChange={(e) => setIssueText({ ...issueText, [r._id]: e.target.value })}
                  />
                  <button
                    onClick={() => submitMaintenance(r._id)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
                  >
                    Request Maintenance
                  </button>
                  <button
                    onClick={() => requestReturn(r._id)}
                    className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg"
                  >
                    Request Return
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
