import mongoose from "mongoose";

const rentalItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    quantity: { type: Number, default: 1 },
    monthlyRent: Number,
    securityDeposit: Number,
    tenureMonths: Number,
  },
  { _id: false }
);

const rentalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [rentalItemSchema],
    deliveryDate: { type: Date, required: true },
    deliveryAddress: { type: String, required: true },
    city: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "active", "return_requested", "returned", "cancelled"],
      default: "pending",
    },
    totalMonthlyRent: { type: Number, required: true },
    totalSecurityDeposit: { type: Number, required: true },
    maintenanceRequests: [
      {
        issue: String,
        status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
        createdAt: { type: Date, default: Date.now },
        resolvedAt: Date,
      },
    ],
    damageNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Rental", rentalSchema);
