import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative h-[92vh] flex items-center justify-center overflow-hidden bg-neutral-100">
      {/* Editorial Background Image with Ken Burns Zoom Effect */}
      <div className="absolute inset-0 z-0 bg-neutral-950">
        <motion.img
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.42 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=82"
          alt="Luxora high fashion editorial"
          className="w-full h-full object-cover object-[center_35%] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/40" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center max-w-4xl px-6 text-center"
      >
        <motion.p
          variants={itemVariants}
          className="uppercase tracking-[8px] text-[10px] sm:text-xs text-neutral-300 font-semibold mb-5"
        >
          Winter / Spring 2026 Collection
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl tracking-widest text-white leading-tight font-serif uppercase font-light"
        >
          The Art of <br className="hidden sm:inline" />
          <span className="italic font-light text-neutral-200">Silhouette</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-lg text-neutral-350 font-light text-xs sm:text-sm leading-relaxed tracking-wider"
        >
          Curated statement apparel designed for quiet luxury, enduring quality, and the modern editorial lifestyle.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link
            to="/shop"
            className="inline-block px-10 py-4 uppercase text-[10px] tracking-[3px] font-semibold text-black bg-white hover:bg-transparent hover:text-white border border-white transition-all duration-500 rounded-xs shadow-md focus-visible:ring-1 focus-visible:ring-white"
          >
            Explore Capsule
          </Link>
          <Link
            to="/shop?featured=true"
            className="inline-block px-10 py-4 uppercase text-[10px] tracking-[3px] font-semibold text-white bg-transparent hover:bg-white hover:text-black border border-white/40 hover:border-white transition-all duration-500 rounded-xs focus-visible:ring-1 focus-visible:ring-white"
          >
            View Featured
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative vertical editorial text in margin */}
      <div className="absolute left-8 bottom-12 hidden lg:block z-10 text-[9px] uppercase tracking-[6px] text-neutral-400 font-light origin-left rotate-270 -translate-x-full">
        Luxora Capsule Editorial
      </div>

      <div className="absolute right-8 bottom-12 hidden lg:block z-10 text-[9px] uppercase tracking-[6px] text-neutral-400 font-light">
        Est. 2026 / Negombo
      </div>
    </section>
  );
}

export default Hero;