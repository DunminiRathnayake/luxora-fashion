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

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, images, category, sizes, stock, featured } = req.body;

  const productImages = images || (image ? [image] : []);

  if (mongoose.connection.readyState === 1) {
    const product = new Product({
      name,
      price: Number(price),
      description,
      images: productImages,
      category,
      sizes: sizes || ["XS", "S", "M", "L", "XL"],
      stock: Number(stock) || 0,
      featured: !!featured,
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } else {
    console.log("MongoDB is offline. Creating in-memory fallback product.");
    const newProduct = {
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      price: Number(price),
      description,
      images: productImages,
      category,
      sizes: sizes || ["XS", "S", "M", "L", "XL"],
      stock: Number(stock) || 0,
      featured: !!featured,
    };
    
    sampleProducts.push(newProduct);
    return res.status(201).json(newProduct);
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, images, category, sizes, stock, featured } = req.body;
  const productId = req.params.id;

  const productImages = images || (image ? [image] : []);

  if (mongoose.connection.readyState === 1) {
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findById(productId);
      if (product) {
        product.name = name || product.name;
        product.price = price !== undefined ? Number(price) : product.price;
        product.description = description || product.description;
        product.images = productImages.length > 0 ? productImages : product.images;
        product.category = category || product.category;
        product.sizes = sizes || product.sizes;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        product.featured = featured !== undefined ? !!featured : product.featured;

        const updatedProduct = await product.save();
        return res.json(updatedProduct);
      }
    }
  }

  // Fallback for offline or local sample list
  const sampleProduct = sampleProducts.find((p) => p._id === productId);
  if (sampleProduct) {
    sampleProduct.name = name || sampleProduct.name;
    sampleProduct.price = price !== undefined ? Number(price) : sampleProduct.price;
    sampleProduct.description = description || sampleProduct.description;
    sampleProduct.images = productImages.length > 0 ? productImages : sampleProduct.images;
    sampleProduct.category = category || sampleProduct.category;
    sampleProduct.sizes = sizes || sampleProduct.sizes;
    sampleProduct.stock = stock !== undefined ? Number(stock) : sampleProduct.stock;
    sampleProduct.featured = featured !== undefined ? !!featured : sampleProduct.featured;

    return res.json(sampleProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  if (mongoose.connection.readyState === 1) {
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findById(productId);
      if (product) {
        await Product.deleteOne({ _id: productId });
        return res.json({ message: "Product removed successfully" });
      }
    }
  }

  // Fallback
  const index = sampleProducts.findIndex((p) => p._id === productId);
  if (index !== -1) {
    sampleProducts.splice(index, 1);
    return res.json({ message: "Product removed successfully from fallback database" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
