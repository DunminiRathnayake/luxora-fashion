import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getSingleProduct = asyncHandler(async (req, res) => {
  // Validate MongoDB ObjectId first
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid Product ID format");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
