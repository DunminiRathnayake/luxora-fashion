import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

function FeaturedProducts() {
  // Balanced showcase of 3 products (forms a clean 3-column grid row)
  const featured = products.slice(0, 3);

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

        {/* Staggered Cards Entry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featured.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default FeaturedProducts;