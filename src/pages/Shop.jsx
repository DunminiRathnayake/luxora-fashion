import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { useProducts } from "../hooks/useProducts";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";

function Shop() {
  const { products, loading, error } = useProducts();
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
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      <SEO 
        title="Shop The Collection"
        description="Browse the exquisite Luxora fashion collection. Find structured evening dresses, standard luxury blazers, color swatches and standard UK sizes."
      />
      
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="text-[10px] tracking-[8px] uppercase text-neutral-400 font-semibold block mb-3">
          LUXORA ATELIER
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-[4px] uppercase text-neutral-900 mb-4">
          Shop The Collection
        </h1>
        <div className="w-12 h-[1px] bg-neutral-300 mx-auto my-6" />
        <p className="text-neutral-500 font-light text-xs sm:text-sm max-w-lg mx-auto leading-relaxed tracking-wide">
          Immerse yourself in our signature selection of elegant silhouettes, refined blazers, and luxury evening wear.
        </p>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200/50">
          
          {/* Category Filter Pills (Sleek Text Tabs) */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 order-2 md:order-1 items-center">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative py-2 text-[11px] uppercase tracking-[3px] transition-all duration-300 cursor-pointer bg-transparent border-0 outline-none ${
                    isActive
                      ? "text-black font-medium"
                      : "text-neutral-400 hover:text-black font-light"
                  }`}
                >
                  {category}
                  {isActive && (
                    <motion.div
                      layoutId="shopCategoryUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-neutral-950"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input Bar (Sleek Rectangle) */}
          <div className="relative w-full md:w-80 order-1 md:order-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="SEARCH CATALOGUE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 text-[10px] uppercase tracking-widest bg-neutral-50 border border-neutral-200 focus:border-black focus:outline-none transition-all duration-300 font-light rounded-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer bg-transparent border-0 outline-none"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mt-6 text-[10px] text-neutral-400 uppercase tracking-[3px]">
          <span>
            {selectedCategory} / {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
          </span>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-neutral-800 font-semibold hover:text-black uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-0 outline-none underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center border border-neutral-200 bg-neutral-50 max-w-md mx-auto rounded-sm shadow-xs">
            <span className="text-[10px] tracking-[4px] uppercase text-neutral-400 font-semibold block mb-2">
              Collection Unreachable
            </span>
            <p className="text-neutral-500 font-light text-xs sm:text-sm leading-relaxed mb-6 max-w-xs mx-auto">
              We are currently unable to retrieve our catalogue. The connection to the server failed.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white text-[10px] uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors font-semibold cursor-pointer border-0 rounded-sm"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
            className="py-20 text-center border border-neutral-200 bg-neutral-50 max-w-md mx-auto rounded-sm shadow-xs"
          >
            <p className="text-neutral-500 font-light text-xs sm:text-sm uppercase tracking-widest mb-6">
              No pieces match your selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="bg-black text-white text-[10px] uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-all cursor-pointer rounded-sm"
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