import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// Initialize Database connection
connectDB();

const app = express();

// Middleware config
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const uploadPath = path.join(process.cwd(), "backend", "uploads");
app.use("/uploads", express.static(uploadPath));

// API Status Diagnostics Route
app.get("/", (req, res) => {
  res.send("Luxora API Running");
});

// Bind routing modules
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// Unmatched routes fallback
app.use(notFound);

// Central exception processing
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
