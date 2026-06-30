import express from "express";
import Rental from "../models/Rental.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sendEmail, rentalConfirmationEmail, maintenanceRequestEmail, statusUpdateEmail } from "../utils/email.js";

const router = express.Router();

// Create a rental (checkout)
router.post("/", protect, async (req, res) => {
  try {
    const { items, deliveryDate, deliveryAddress, city } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: "No items in rental" });
    }

    let totalMonthlyRent = 0;
    let totalSecurityDeposit = 0;
    const rentalItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (product.availableQuantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      product.availableQuantity -= item.quantity;
      await product.save();

      totalMonthlyRent += product.monthlyRent * item.quantity;
      totalSecurityDeposit += product.securityDeposit * item.quantity;

      rentalItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit,
        tenureMonths: item.tenureMonths || product.tenureOptions[0],
      });
    }

    const rental = await Rental.create({
      user: req.user._id,
      items: rentalItems,
      deliveryDate,
      deliveryAddress,
      city,
      totalMonthlyRent,
      totalSecurityDeposit,
    });

    sendEmail(rentalConfirmationEmail(req.user, rental)).catch((e) =>
      console.error("Confirmation email failed:", e.message)
    );

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my rentals
router.get("/mine", protect, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request maintenance
router.post("/:id/maintenance", protect, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (String(rental.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your rental" });
    }
    rental.maintenanceRequests.push({ issue: req.body.issue });
    await rental.save();

    sendEmail(maintenanceRequestEmail(req.user, rental, req.body.issue)).catch((e) =>
      console.error("Maintenance email failed:", e.message)
    );

    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request return / cancel
router.put("/:id/status", protect, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    const isOwner = String(rental.user) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    rental.status = req.body.status;

    // If returned/cancelled, restock items
    if (["returned", "cancelled"].includes(req.body.status)) {
      for (const item of rental.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { availableQuantity: item.quantity },
        });
      }
    }

    await rental.save();
    const fullRental = await Rental.findById(rental._id).populate("user", "name email");
    sendEmail(statusUpdateEmail(fullRental.user, fullRental)).catch((e) =>
      console.error("Status update email failed:", e.message)
    );
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all rentals
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const rentals = await Rental.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: resolve maintenance request
router.put("/:id/maintenance/:index", protect, adminOnly, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    const idx = parseInt(req.params.index, 10);
    if (!rental.maintenanceRequests[idx]) {
      return res.status(404).json({ message: "Request not found" });
    }
    rental.maintenanceRequests[idx].status = req.body.status || "resolved";
    if (req.body.status === "resolved") {
      rental.maintenanceRequests[idx].resolvedAt = new Date();
    }
    await rental.save();
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
