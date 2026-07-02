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
    image: "/images/products/bed.png",
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
    image: "/images/products/sofa.png",
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
    image: "/images/products/dining_table.png",
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
    image: "/images/products/fridge.png",
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
    image: "/images/products/washing_machine.png",
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
    image: "/images/products/tv.png",
    monthlyRent: 799,
    securityDeposit: 2500,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 7,
    availableQuantity: 7,
  },
  {
    name: "Single Bed with Mattress",
    category: "Furniture",
    subCategory: "Bed",
    description: "Comfortable single bed frame with orthopedic foam mattress included.",
    image: "/images/products/single_bed.png",
    monthlyRent: 599,
    securityDeposit: 1200,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 15,
    availableQuantity: 15,
  },
  {
    name: "L-shaped Sectional Sofa",
    category: "Furniture",
    subCategory: "Sofa",
    description: "Luxurious olive green L-shaped sectional sofa for large living rooms.",
    image: "/images/products/sectional_sofa.png",
    monthlyRent: 2499,
    securityDeposit: 5000,
    tenureOptions: [6, 12],
    city: "All",
    totalQuantity: 5,
    availableQuantity: 5,
  },
  {
    name: "Solid Wood Study Desk",
    category: "Furniture",
    subCategory: "Table",
    description: "Sleek work-from-home study desk with a comfortable ergonomic office chair.",
    image: "/images/products/study_desk.png",
    monthlyRent: 699,
    securityDeposit: 1500,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 10,
    availableQuantity: 10,
  },
  {
    name: "Solo Microwave Oven",
    category: "Appliances",
    subCategory: "Fridge",
    description: "Compact microwave oven for quick heating and simple cooking.",
    image: "/images/products/microwave.png",
    monthlyRent: 399,
    securityDeposit: 1000,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 20,
    availableQuantity: 20,
  },
  {
    name: "HEPA Air Purifier",
    category: "Appliances",
    subCategory: "Washing Machine",
    description: "Smart air purifier with HEPA filter to eliminate odors, dust, and pollen.",
    image: "/images/products/air_purifier.png",
    monthlyRent: 499,
    securityDeposit: 1200,
    tenureOptions: [3, 6, 12],
    city: "All",
    totalQuantity: 14,
    availableQuantity: 14,
  },
  {
    name: "5-Star Split Air Conditioner",
    category: "Appliances",
    subCategory: "Washing Machine",
    description: "High-efficiency split air conditioner with fast cooling modes.",
    image: "/images/products/air_conditioner.png",
    monthlyRent: 1599,
    securityDeposit: 4000,
    tenureOptions: [6, 12],
    city: "All",
    totalQuantity: 8,
    availableQuantity: 8,
  }
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
