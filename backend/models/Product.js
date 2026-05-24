import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    images: {
      type: [String],
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
      default: ["XS", "S", "M", "L", "XL"],
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
