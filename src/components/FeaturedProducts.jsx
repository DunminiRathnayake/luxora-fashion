import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { useProducts } from "../hooks/useProducts";
import { motion } from "framer-motion";

function FeaturedProducts() {
  const { products, loading, error } = useProducts();

  // Filter products by featured flag, default to slicing first 3 if none flagged
  const featured = products.filter((p) => p.featured).slice(0, 3);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="px-6 md:px-10 py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] tracking-[6px] uppercase text-neutral-400 font-semibold block mb-2">
              Curated Wardrobe
            </span>
            <h2 className="text-2xl md:text-3xl font-light uppercase tracking-widest text-neutral-900">
              Featured Pieces
            </h2>
          </div>

          <Link
            to="/shop"
            className="border border-neutral-200 hover:border-black px-6 py-2.5 text-xs uppercase tracking-widest text-neutral-700 hover:text-black transition-all duration-300 no-underline font-medium shadow-sm hover:shadow"
          >
            View All
          </Link>
        </div>

        {/* Dynamic Display Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-neutral-50 rounded-sm border border-neutral-100">
            <span className="text-[10px] tracking-[4px] uppercase text-neutral-400 font-semibold block mb-2">
              Connection Offline
            </span>
            <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto">
              Our servers are currently resting. Please refresh or verify network access.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {displayProducts.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}

export default FeaturedProducts;