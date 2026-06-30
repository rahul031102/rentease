import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Furniture", "Appliances"],
    },
    subCategory: { type: String, required: true }, // e.g. Bed, Sofa, Table, Fridge, Washing Machine, TV
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    monthlyRent: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    tenureOptions: { type: [Number], default: [3, 6, 12] }, // months
    city: { type: String, required: true, default: "All" },
    totalQuantity: { type: Number, required: true, default: 1 },
    availableQuantity: { type: Number, required: true, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
