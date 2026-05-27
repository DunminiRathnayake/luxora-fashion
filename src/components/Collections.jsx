import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

function Collections() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const categoriesList = [
    {
      name: "Dresses",
      image: getOptimizedImageUrl("https://images.unsplash.com/photo-1496747611176-843222e1e57c", 800),
      query: "Dresses",
    },
    {
      name: "Essentials",
      image: getOptimizedImageUrl("https://images.unsplash.com/photo-1529139574466-a303027c1d8b", 800),
      query: "Tops",
    },
    {
      name: "Evening Wear",
      image: getOptimizedImageUrl("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f", 800),
      query: "Evening Wear",
    },
  ];

  return (
    <section className="px-6 md:px-10 py-28 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[8px] text-[10px] sm:text-xs text-neutral-400 font-semibold mb-3">
            Explore The Edit
          </p>
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest text-neutral-900">
            Curated Collections
          </h2>
        </div>

        {/* Collection Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {categoriesList.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Link
                to={`/shop?category=${encodeURIComponent(category.query)}`}
                className="relative block h-[500px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-500 rounded-sm"
              >
                {/* Background Image Scale Effect */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900">
                  <img
                    src={category.image}
                    alt={`${category.name} collection category banner`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  {/* Subtle luxury editorial overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-all duration-300" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                  <span className="text-[10px] tracking-widest uppercase text-neutral-300 font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore Drop
                  </span>
                  <h3 className="text-white text-2xl font-light uppercase tracking-wider">
                    {category.name}
                  </h3>
                  <div className="w-10 h-[1px] bg-white mt-3 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default Collections;