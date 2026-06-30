import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Queen Size Wooden Bed",
    category: "Furniture",
    subCategory: "Bed",
    description: "Sturdy wooden queen bed frame, ideal for shared apartments.",
    monthlyRent: 999,
    securityDeposit: 2000,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 10,
    availableQuantity: 10,
  },
  {
    name: "3-Seater Fabric Sofa",
    category: "Furniture",
    subCategory: "Sofa",
    description: "Comfortable 3-seater sofa with washable fabric cover.",
    monthlyRent: 1299,
    securityDeposit: 2500,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 8,
    availableQuantity: 8,
  },
  {
    name: "4-Seater Dining Table",
    category: "Furniture",
    subCategory: "Table",
    description: "Compact dining table set, perfect for small families.",
    monthlyRent: 799,
    securityDeposit: 1500,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 6,
    availableQuantity: 6,
  },
  {
    name: "190L Single Door Refrigerator",
    category: "Appliances",
    subCategory: "Fridge",
    description: "Energy-efficient single door fridge, great for individuals.",
    monthlyRent: 899,
    securityDeposit: 3000,
    tenureOptions: [6, 12],
    city: "All",
    totalQuantity: 12,
    availableQuantity: 12,
  },
  {
    name: "6kg Front Load Washing Machine",
    category: "Appliances",
    subCategory: "Washing Machine",
    description: "Front load washer with multiple wash modes.",
    monthlyRent: 1099,
    securityDeposit: 3500,
    tenureOptions: [6, 12],
    city: "All",
    totalQuantity: 9,
    availableQuantity: 9,
  },
  {
    name: "43-inch Smart LED TV",
    category: "Appliances",
    subCategory: "TV",
    description: "Full HD smart TV with built-in streaming apps.",
    monthlyRent: 799,
    securityDeposit: 2500,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 7,
    availableQuantity: 7,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products`);

    const adminEmail = "admin@rentease.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "RentEase Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
      });
      console.log("Created admin user: admin@rentease.com / admin123");
    } else {
      console.log("Admin user already exists");
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
