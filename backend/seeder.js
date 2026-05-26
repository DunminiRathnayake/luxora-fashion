import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import { sampleProducts } from "./data/products.js";

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Insert sample data
    await Product.insertMany(sampleProducts);

    // Insert default users
    const defaultUsers = [
      {
        name: "Luxora Admin",
        email: "admin@luxora.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Dunmini Rathnayake",
        email: "customer@luxora.com",
        password: "customer123",
        role: "customer",
      },
    ];

    await User.create(defaultUsers);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

importData();

