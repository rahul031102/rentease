import express from "express";
import Rental from "../models/Rental.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalProducts, rentals] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Product.countDocuments({ isActive: true }),
      Rental.find(),
    ]);

    const activeRentals = rentals.filter((r) =>
      ["confirmed", "delivered", "active"].includes(r.status)
    );

    const mrr = activeRentals.reduce((sum, r) => sum + r.totalMonthlyRent, 0);

    const products = await Product.find({ isActive: true });
    const totalUnits = products.reduce((s, p) => s + p.totalQuantity, 0);
    const availableUnits = products.reduce((s, p) => s + p.availableQuantity, 0);
    const utilizationRate = totalUnits
      ? (((totalUnits - availableUnits) / totalUnits) * 100).toFixed(1)
      : 0;

    const openMaintenance = rentals.reduce(
      (sum, r) => sum + r.maintenanceRequests.filter((m) => m.status !== "resolved").length,
      0
    );

    res.json({
      totalUsers,
      totalProducts,
      activeRentalsCount: activeRentals.length,
      monthlyRecurringRevenue: mrr,
      productUtilizationRate: utilizationRate,
      openMaintenanceRequests: openMaintenance,
      totalRentals: rentals.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
