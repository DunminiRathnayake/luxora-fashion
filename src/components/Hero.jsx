import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="h-[90vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
      {/* Elegant background highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-100/40 via-transparent to-transparent -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center max-w-4xl"
      >
        <motion.p
          variants={itemVariants}
          className="uppercase tracking-[8px] text-[10px] sm:text-xs text-neutral-400 font-semibold mb-4"
        >
          New Collection 2026
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl font-light tracking-wide text-neutral-900 leading-tight uppercase"
        >
          Modern Fashion
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-lg text-neutral-500 font-light text-xs sm:text-sm leading-relaxed"
        >
          Discover luxury apparel curated for timeless elegance, individual confidence, and the modern editorial lifestyle.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10">
          <Link
            to="/shop"
            className="inline-block border border-black px-10 py-4 uppercase text-xs tracking-widest font-semibold text-black hover:bg-black hover:text-white transition-all duration-300 no-underline shadow-sm hover:shadow"
          >
            Shop The Collection
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;