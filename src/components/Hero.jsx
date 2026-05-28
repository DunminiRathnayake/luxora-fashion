import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

function Hero() {
  // 1. Mouse Position Motion Values for Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 2. Smooth Spring Interpolation
  const springConfig = { damping: 50, stiffness: 200, mass: 0.5 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // 3. Coordinate Maps for Parallax Layers (opposite movement for depth feeling)
  const bgX = useTransform(xSpring, [-0.5, 0.5], [-15, 15]);
  const bgY = useTransform(ySpring, [-0.5, 0.5], [-15, 15]);

  const textX = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);
  const textY = useTransform(ySpring, [-0.5, 0.5], [-10, 10]);

  const centerImageX = useTransform(xSpring, [-0.5, 0.5], [-6, 6]);
  const centerImageY = useTransform(ySpring, [-0.5, 0.5], [-6, 6]);

  const cardLeftX = useTransform(xSpring, [-0.5, 0.5], [-25, 25]);
  const cardLeftY = useTransform(ySpring, [-0.5, 0.5], [-35, 35]);

  const cardRightX = useTransform(xSpring, [-0.5, 0.5], [-35, 35]);
  const cardRightY = useTransform(ySpring, [-0.5, 0.5], [-25, 25]);

  const labelX = useTransform(xSpring, [-0.5, 0.5], [-5, 5]);
  const labelY = useTransform(ySpring, [-0.5, 0.5], [-5, 5]);

  // 4. Mouse event triggers
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
      className="relative h-screen w-full overflow-hidden bg-neutral-950 flex items-center justify-center select-none"
      aria-label="Luxora Editorial Homepage Hero"
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

      {/* Radial soft spotlight glow (moving slightly to emphasize space) */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute w-[600px] h-[600px] bg-neutral-100/10 rounded-full blur-[140px] pointer-events-none z-0"
      />

      {/* Solid black mask for general vignette depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/40 z-0 pointer-events-none" />

      {/* Giant brand label overlay (Behind the main visual, but in front of gradient) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
        <motion.h1
          style={{ x: textX, y: textY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.07, scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12rem] sm:text-[16rem] md:text-[22rem] font-serif font-extralight tracking-[0.16em] text-white leading-none uppercase text-center"
        >
          LUXORA
        </motion.h1>
      </div>

      {/* Visual Composition Layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex items-center justify-center h-full">
        <div className="relative flex items-center justify-center w-full max-w-md md:max-w-xl lg:max-w-3xl h-[65vh]">
          
          {/* LEFT Floating Card (Visible on md+) */}
          <motion.div
            style={{ x: cardLeftX, y: cardLeftY }}
            initial={{ opacity: 0, x: -50, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: -4 }}
            transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute left-[-18%] top-[12%] w-[210px] aspect-[3/4] bg-neutral-900 border border-white/5 shadow-2xl z-20 overflow-hidden cursor-pointer group"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full h-full relative"
            >
              <img
                src={getOptimizedImageUrl("https://images.unsplash.com/photo-1490481651871-ab68de25d43d", 600)}
                alt="Luxora editorial side detail left"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-103 transition-all duration-[1s]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* MAIN Centered Image Card */}
          <motion.div
            style={{ x: centerImageX, y: centerImageY }}
            initial={{ opacity: 0, y: 55, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="w-[280px] sm:w-[350px] md:w-[380px] aspect-[3/4] bg-neutral-900 border border-white/10 shadow-3xl z-10 overflow-hidden relative cursor-pointer group rounded-xs"
          >
            <img
              src={getOptimizedImageUrl("https://images.unsplash.com/photo-1539109136881-3be0616acf4b", 800)}
              alt="Luxora high fashion model center focus"
              className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-[1.8s] ease-[0.16, 1, 0.3, 1]"
              loading="eager"
            />
            {/* Dark bottom block shading for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* RIGHT Floating Card (Visible on md+) */}
          <motion.div
            style={{ x: cardRightX, y: cardRightY }}
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute right-[-16%] bottom-[8%] w-[210px] aspect-[3/4] bg-neutral-900 border border-white/5 shadow-2xl z-20 overflow-hidden cursor-pointer group"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 0.2 }}
              className="w-full h-full relative"
            >
              <img
                src={getOptimizedImageUrl("https://images.unsplash.com/photo-1496747611176-843222e1e57c", 600)}
                alt="Luxora editorial side detail right"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-103 transition-all duration-[1s]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Foreground Header Content & CTAs */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 z-30 pointer-events-none"
      >
        <div className="flex flex-col items-center max-w-2xl px-6 text-center select-none">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="uppercase tracking-[8px] text-[10px] sm:text-xs text-neutral-400 font-semibold mb-3.5"
          >
            Winter / Spring 2026 Collection
          </motion.p>

          <div className="overflow-hidden mb-3.5">
            <motion.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl tracking-widest text-white leading-tight font-serif uppercase font-light"
            >
              Modern Elegance <br className="sm:hidden" />
              <span className="italic font-light text-neutral-200">Redefined</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-neutral-300 font-light text-[11px] sm:text-xs leading-relaxed tracking-wider mb-8"
          >
            Curated statement apparel designed for quiet luxury, enduring quality, and the modern editorial lifestyle.
          </motion.p>

          {/* Interactive CTAs with spring hover translation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 flex-wrap justify-center pointer-events-auto"
          >
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/shop"
                className="inline-block px-10 py-4 uppercase text-[10px] tracking-[3px] font-semibold text-black bg-white hover:bg-transparent hover:text-white border border-white transition-all duration-500 rounded-xs shadow-md focus-visible:ring-1 focus-visible:ring-white"
              >
                Shop Collection
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/shop?featured=true"
                className="inline-block px-10 py-4 uppercase text-[10px] tracking-[3px] font-semibold text-white bg-transparent hover:bg-white hover:text-black border border-white/20 hover:border-white transition-all duration-500 rounded-xs focus-visible:ring-1 focus-visible:ring-white"
              >
                Explore New Arrivals
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Accent labels */}
      <motion.div
        style={{ x: labelX, y: labelY }}
        className="absolute left-8 bottom-12 hidden lg:block z-20 text-[9px] uppercase tracking-[6px] text-neutral-500 font-light origin-left rotate-270 -translate-x-full"
      >
        Luxora Atelier © 2026
      </motion.div>

      <motion.div
        style={{ x: labelX, y: labelY }}
        className="absolute right-8 bottom-12 hidden lg:block z-20 text-[9px] uppercase tracking-[6px] text-neutral-500 font-light"
      >
        NEGOMBO / SRI LANKA
      </motion.div>

      {/* Scroll indicator below the CTAs */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-25 pointer-events-none">
        <div className="w-[12px] h-[22px] border border-neutral-700 rounded-full flex justify-center p-0.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-0.5 h-0.5 bg-neutral-400 rounded-full"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;