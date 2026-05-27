import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

function BrandStory() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[85vh] overflow-hidden bg-white">
      
      {/* LEFT IMAGE with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-85px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-[500px] md:h-auto overflow-hidden bg-neutral-100"
      >
        <img
          src={getOptimizedImageUrl("https://images.unsplash.com/photo-1483985988355-763728e1935b", 1000)}
          alt="Fashion Story Curation Narrative"
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]"
        />
      </motion.div>

      {/* RIGHT CONTENT with Staggered Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-85px" }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col justify-center px-8 sm:px-16 md:px-20 py-20 bg-white"
      >
        <span className="uppercase tracking-[8px] text-[10px] sm:text-xs text-neutral-400 font-semibold mb-4">
          Our Story
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wide leading-tight text-neutral-900 mb-6">
          Crafting Modern Elegance
        </h2>

        <p className="text-neutral-500 font-light text-xs sm:text-sm leading-relaxed mb-8 max-w-md">
          Luxora blends timeless sophistication with contemporary design aesthetics. Every collection is curated to inspire confidence, highlight individuality, and introduce effortless luxury back into daily wardrobing essentials.
        </p>

        <Link
          to="/shop"
          className="inline-block w-fit border border-black px-8 py-3.5 uppercase text-xs tracking-widest font-semibold text-black hover:bg-black hover:text-white transition-all duration-300 no-underline shadow-sm hover:shadow"
        >
          Discover More
        </Link>
      </motion.div>

    </section>
  );
}

export default BrandStory;