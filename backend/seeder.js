import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import { sampleProducts } from "./data/products.js";

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();

    // Insert sample data
    await Product.insertMany(sampleProducts);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

importData();
