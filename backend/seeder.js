import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const sampleProducts = [
  {
    name: "Midnight Satin Dress",
    price: 8500,
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"],
    category: "Dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 12,
    featured: true,
    description: "Exquisitely tailored from premium satin materials, this piece defines modern luxury. Featuring a structured silhouette and exceptional drape, it offers a sophisticated profile for day-to-night styling.",
  },
  {
    name: "Elegant White Top",
    price: 4200,
    images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"],
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 20,
    featured: true,
    description: "Designed with elegant minimalism, this white top is a versatile classic. Constructed with soft breathable cotton, it serves as the perfect base layer for chic summer ensembles.",
  },
  {
    name: "Classic Black Blazer",
    price: 12000,
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"],
    category: "Blazers",
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    featured: true,
    description: "A timeless wardrobe essential, this classic blazer features crisp notched lapels and structured shoulder structuring. Exudes powerful confidence for corporate styling and formal events.",
  },
  {
    name: "Emerald Velvet Gown",
    price: 16500,
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"],
    category: "Evening Wear",
    sizes: ["XS", "S", "M", "L"],
    stock: 6,
    featured: false,
    description: "Luxuriate in the deep emerald hues of this stunning velvet gown. Featuring a plunging neckline and thigh-high side slit, it commands immediate attention for night-out galas.",
  },
  {
    name: "Chiffon Maxi Dress",
    price: 9800,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"],
    category: "Dresses",
    sizes: ["S", "M", "L"],
    stock: 15,
    featured: false,
    description: "Float effortlessly through beach sunsets in this light, pleated chiffon maxi dress. Detailed with delicate waist ties and open shoulders for romantic vacation styling.",
  },
  {
    name: "Oversized Linen Shirt",
    price: 3800,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"],
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 25,
    featured: false,
    description: "Crafted from authentic pre-washed flax linens, this oversized shirt captures laid-back luxury. Soft structural lines and shell buttons complete its elegant, relaxed styling.",
  },
  {
    name: "Camel Tailored Blazer",
    price: 13500,
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"],
    category: "Blazers",
    sizes: ["XS", "S", "M", "L"],
    stock: 10,
    featured: false,
    description: "A refined outer layer for contemporary autumn wardrobing. This tailored blazer features a clean double-breasted profile and standard neutral camel tones for versatile layering.",
  },
  {
    name: "Sequined Silk Top",
    price: 7200,
    images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"],
    category: "Evening Wear",
    sizes: ["S", "M", "L"],
    stock: 14,
    featured: false,
    description: "Shimmer through nighttime occasions in our hand-detailed sequin top. Lined with premium mulberry silk to provide a delicate, friction-free feel against the skin.",
  },
];

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
