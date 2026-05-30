import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

function Hero() {
  // Active background index state for slow slideshow crossfade
  const [activeBg, setActiveBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBg((prev) => (prev === 0 ? 1 : 0));
    }, 6000); // Crossfade every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // 1. Mouse coordinates for parallax movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 2. Smooth spring dynamics (tuned for luxurious inertia)
  const springConfig = { damping: 65, stiffness: 120, mass: 0.8 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // 3. Transformations mapping layer offsets
  const bgX = useTransform(xSpring, [-0.5, 0.5], [-12, 12]);
  const bgY = useTransform(ySpring, [-0.5, 0.5], [-12, 12]);

  const logoX = useTransform(xSpring, [-0.5, 0.5], [-8, 8]);
  const logoY = useTransform(ySpring, [-0.5, 0.5], [-8, 8]);

  const textX = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);
  const textY = useTransform(ySpring, [-0.5, 0.5], [-10, 10]);

  const labelX = useTransform(xSpring, [-0.5, 0.5], [-5, 5]);
  const labelY = useTransform(ySpring, [-0.5, 0.5], [-5, 5]);

  // 4. Parallax event listeners
  const handleMouseMove = (e) => {
    const { clientWidth, clientHeight } = e.currentTarget;
    const x = e.clientX / clientWidth - 0.5;
    const y = e.clientY / clientHeight - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen w-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-center select-none"
      aria-label="Luxora Masked Logo Editorial Hero"
    >
      {/* Cinematic animated repeating grain overlay */}
      <div className="noise-grain pointer-events-none opacity-[0.035] mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Background Image Layer (Luxury Clothing Shop Slideshow with Ken Burns transitions) */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-neutral-950"
      >
        {/* Image 1 */}
        <motion.img
          animate={{ 
            opacity: activeBg === 0 ? 0.22 : 0,
            scale: activeBg === 0 ? 1.10 : 1.02,
            x: activeBg === 0 ? -12 : 0,
            y: activeBg === 0 ? -8 : 0
          }}
          transition={{ 
            opacity: { duration: 2.5, ease: "easeInOut" },
            scale: { duration: 6.0, ease: "easeOut" },
            x: { duration: 6.0, ease: "easeOut" },
            y: { duration: 6.0, ease: "easeOut" }
          }}
          src={getOptimizedImageUrl("https://images.unsplash.com/photo-1441986300917-64674bd600d8", 1600)}
          alt="Luxury boutique interior 1"
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity filter blur-[1px]"
        />
        {/* Image 2 */}
        <motion.img
          animate={{ 
            opacity: activeBg === 1 ? 0.22 : 0,
            scale: activeBg === 1 ? 1.10 : 1.02,
            x: activeBg === 1 ? 12 : 0,
            y: activeBg === 1 ? 8 : 0
          }}
          transition={{ 
            opacity: { duration: 2.5, ease: "easeInOut" },
            scale: { duration: 6.0, ease: "easeOut" },
            x: { duration: 6.0, ease: "easeOut" },
            y: { duration: 6.0, ease: "easeOut" }
          }}
          src={getOptimizedImageUrl("https://images.unsplash.com/photo-1558769132-cb1aea458c5e", 1600)}
          alt="Luxury boutique interior 2"
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity filter blur-[1px]"
        />
        {/* Soft radial overlay spotlight combined on top of boutique */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(242,240,234,0.15)_0%,_rgba(10,10,10,0.6)_80%)]" />
      </motion.div>

      {/* Solid black vignette depth gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30 z-0 pointer-events-none" />

      {/* Main Content Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center pt-24 pb-8 h-full">
        
        {/* Centered Masked Logo & Monogram (Parallax Layer - Scaled Down for Elegance) */}
        <motion.div
          style={{ x: logoX, y: logoY }}
          className="w-full flex flex-col items-center justify-center mb-6 relative"
        >
          {/* Interlocking L & X Vector Monogram Crest */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.08, rotate: 90 }}
            transition={{ 
              opacity: { duration: 1.8, delay: 0.1, ease: "easeOut" },
              y: { duration: 1.8, delay: 0.1, ease: "easeOut" },
              scale: { type: "spring", stiffness: 150, damping: 15 },
              rotate: { type: "spring", stiffness: 100, damping: 12 }
            }}
            className="mb-4 relative z-10 select-none pointer-events-auto cursor-default"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-10 h-10 md:w-12 md:h-12 text-neutral-100/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.14)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Minimalist Diamond (Sketching Entrance) */}
              <motion.polygon
                points="50,5 95,50 50,95 5,50"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.1, ease: "easeInOut" }}
              />
              {/* Inner Diamond (concentric, thin border) (Sketching Entrance) */}
              <motion.polygon
                points="50,11 89,50 50,89 11,50"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeOpacity="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
              />
              {/* Interlocking Monogram L & X (Refined Geometric Paths with Staggered Sketching Entrance) */}
              <motion.path
                d="M 42,32 L 42,63 L 58,63"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M 35,35 L 39,39 M 45,45 L 63,63"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.7, ease: "easeInOut" }}
              />
              <motion.path
                d="M 63,35 L 35,63"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.9, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.98, letterSpacing: "0.35em" }}
            animate={{ opacity: 1, scale: 1, letterSpacing: "0.20em" }}
            whileHover={{ letterSpacing: "0.27em", transition: { duration: 0.8, ease: "easeOut" } }}
            transition={{ 
              opacity: { duration: 2.2, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 2.2, ease: [0.16, 1, 0.3, 1] },
              letterSpacing: { duration: 2.5, ease: [0.16, 1, 0.3, 1] }
            }}
            className="logo-text-mask text-[10vw] md:text-[6.5vw] leading-none uppercase text-center font-serif font-extralight select-none pointer-events-auto cursor-default"
          >
            LUXORA
          </motion.h1>
        </motion.div>

        {/* Foreground Content Stack (Parallax Layer) */}
        <motion.div
          style={{ x: textX, y: textY }}
          className="flex flex-col items-center text-center pointer-events-none max-w-2xl"
        >
          {/* Subtitle */}
          <div className="overflow-hidden mb-4">
            <motion.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl sm:text-2xl md:text-3xl tracking-[4px] text-white leading-tight font-serif uppercase font-light"
            >
              Modern Elegance <span className="italic font-light text-neutral-350">Redefined</span>
            </motion.h2>
          </div>

          {/* Description (Wider and more elegant like Kado) */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-neutral-300 font-light text-xs sm:text-sm md:text-base leading-relaxed tracking-wide mb-8 opacity-90 mx-auto"
          >
            Curated statement apparel designed for quiet luxury, enduring quality, and the modern editorial lifestyle.
          </motion.p>

          {/* Luxury Brand Feature Highlight Pills (Inspired by Kado) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-10 w-full"
          >
            {[
              "Worldwide Shipping",
              "Bespoke Tailoring",
              "Ethically Crafted"
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-neutral-200 border border-white/5 bg-white/5 backdrop-blur-md rounded-full py-2 px-5 text-[10px] sm:text-xs tracking-wider font-light"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cfcaba"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                {text}
              </div>
            ))}
          </motion.div>

          {/* Interactive CTAs with spring hover translation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 flex-wrap justify-center pointer-events-auto"
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Link
                to="/shop"
                className="inline-block px-10 py-4 uppercase text-[10px] tracking-[3px] font-semibold text-black bg-white hover:bg-transparent hover:text-white border border-white transition-all duration-500 rounded-xs shadow-md focus-visible:ring-1 focus-visible:ring-white"
              >
                Shop Collection
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Link
                to="/shop?featured=true"
                className="inline-block px-10 py-4 uppercase text-[10px] tracking-[3px] font-semibold text-white bg-transparent hover:bg-white hover:text-black border border-white/20 hover:border-white transition-all duration-500 rounded-xs focus-visible:ring-1 focus-visible:ring-white"
              >
                Explore New Arrivals
              </Link>
            </motion.div>
          </motion.div>

        </motion.div>

      </div>

      {/* Floating Accent side labels */}
      <motion.div
        style={{ x: labelX, y: labelY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.8, delay: 1.0, ease: "easeOut" }}
        className="absolute left-8 bottom-12 hidden lg:block z-20 text-[9px] uppercase tracking-[6px] text-neutral-500 font-light origin-left rotate-270 -translate-x-full"
      >
        New Season 2026
      </motion.div>

      <motion.div
        style={{ x: labelX, y: labelY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.8, delay: 1.0, ease: "easeOut" }}
        className="absolute right-8 bottom-12 hidden lg:block z-20 text-[9px] uppercase tracking-[6px] text-neutral-500 font-light"
      >
        Luxury Edit
      </motion.div>

      {/* Animated Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-25 pointer-events-none"
      >
        <div className="w-[12px] h-[22px] border border-neutral-700 rounded-full flex justify-center p-0.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-0.5 h-0.5 bg-neutral-400 rounded-full"
          />
        </div>
      </motion.div>

    </section>
  );
}

export default Hero;