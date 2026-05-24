import mongoose from "mongoose";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sampleProducts } from "../data/products.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const products = await Product.find({});
    res.json(products);
  } else {
    console.log("MongoDB is offline. Serving fallback sample products.");
    res.json(sampleProducts);
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getSingleProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  if (mongoose.connection.readyState === 1) {
    // Validate ObjectId
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findById(productId);
      if (product) {
        return res.json(product);
      }
    }
  }

  // Fallback if MongoDB is disconnected or if it's a mock ObjectId
  const sampleProduct = sampleProducts.find((p) => p._id === productId);
  
  if (sampleProduct) {
    res.json(sampleProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
