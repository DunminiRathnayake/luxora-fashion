import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Dresses", "Tops", "Blazers", "Evening Wear"];

  // Filter products based on category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-4">
          Shop The Collection
        </h1>
        <p className="text-gray-500 font-light text-sm max-w-md mx-auto">
          Immerse yourself in our signature selection of elegant silhouettes, refined blazers, and luxury evening wear.
        </p>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 md:gap-4 order-2 md:order-1">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 text-xs uppercase tracking-wider font-medium transition-all duration-300 border rounded-full cursor-pointer ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-gray-600 border-gray-200 hover:text-black hover:border-black"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80 order-1 md:order-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 font-light"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mt-6 text-xs text-gray-400 uppercase tracking-widest">
          <span>
            {selectedCategory} / {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
          </span>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-black font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid with layout animations */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center border border-dashed border-gray-200 rounded-lg max-w-md mx-auto"
          >
            <p className="text-gray-400 font-light mb-4">
              No pieces match your current selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="bg-black text-white text-xs uppercase tracking-wider px-6 py-2.5 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Show All Products
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Shop;