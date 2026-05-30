import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

const CAMPAIGN_IMAGES = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
];

function Hero() {
  const [campaignIndex, setCampaignIndex] = useState(0);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isLookbookHovered, setIsLookbookHovered] = useState(false);

  // Auto-cycle campaign images every 6 seconds with automatic timer reset on manual interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setCampaignIndex((prev) => (prev + 1) % CAMPAIGN_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [campaignIndex]);

  // 1. Mouse coordinates for parallax movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 2. Smooth spring dynamics capped for gentle luxury drift
  const springConfig = { damping: 55, stiffness: 90, mass: 1 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // Parallax transform mapping (max 15px movement for subtle effect)
  const imageParallaxX = useTransform(xSpring, [-0.5, 0.5], [-15, 15]);
  const imageParallaxY = useTransform(ySpring, [-0.5, 0.5], [-15, 15]);

  // 3. Scroll-dependent transformations
  const { scrollY } = useScroll();
  const textScrollY = useTransform(scrollY, [0, 600], [0, -80]);
  const textOpacity = useTransform(scrollY, [0, 450], [1, 0.15]);
  const imageScrollScale = useTransform(scrollY, [0, 800], [1, 1.06]);
  const imageScrollY = useTransform(scrollY, [0, 800], [0, 30]);

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

  // 5. Staggered reveal configuration for the main heading words
  const headingWords = ["ELEVATE", "YOUR", "STYLE"];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const wordVariants = {
    hidden: {
      y: 120,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1] // Cinematic out-quint
      }
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen md:h-screen w-full overflow-hidden flex flex-col md:flex-row select-none animate-editorial-gradient"
      aria-label="Luxora Editorial Campaign Hero"
    >
      {/* Cinematic animated repeating grain overlay */}
      <div className="noise-grain pointer-events-none opacity-[0.025] mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Left Column: Editorial Typography & Content */}
      <motion.div
        style={{
          y: textScrollY,
          opacity: textOpacity,
        }}
        className="w-full md:w-1/2 order-2 md:order-1 flex flex-col justify-center items-start px-6 sm:px-12 md:px-16 lg:px-24 py-12 md:py-24 h-auto md:h-full relative z-25"
      >
        {/* Announcement Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 text-[10px] md:text-xs uppercase tracking-[6px] text-neutral-400 font-semibold"
        >
          SPRING / SUMMER 2026
        </motion.div>

        {/* Heading Container */}
        <div className="relative mb-6 flex flex-col items-start select-text w-full">
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-serif font-light text-neutral-900 tracking-tight leading-[0.9] text-[clamp(3rem,10vw,5rem)] sm:text-[clamp(4rem,8vw,7rem)] lg:text-[clamp(5rem,10vw,9rem)]"
          >
            {headingWords.map((word, index) => (
              <span key={index} className="block overflow-hidden pb-1 sm:pb-2 md:pb-3">
                <motion.span variants={wordVariants} className="block">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Script Accent: (New Collection) */}
          <motion.span
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 1, rotate: -1.5 }}
            transition={{ delay: 1.0, duration: 1.2, ease: "easeOut" }}
            className="absolute -top-3 sm:-top-5 right-4 sm:right-10 md:right-16 font-serif italic text-neutral-400/90 text-sm sm:text-base md:text-lg select-none"
          >
            (New Collection)
          </motion.span>
        </div>

        {/* Subtitle list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.0, ease: "easeOut" }}
          className="mb-8 flex flex-col gap-1 sm:gap-1.5 font-sans text-neutral-500 font-light tracking-[2px] text-xs sm:text-sm md:text-base leading-relaxed"
        >
          <p>Timeless designs.</p>
          <p>Premium fabrics.</p>
          <p>Made for the modern woman.</p>
        </motion.div>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.0, ease: "easeOut" }}
          className="flex flex-wrap gap-4 items-center w-full"
        >
          {/* Shop Collection Button */}
          <motion.div
            onHoverStart={() => setIsShopHovered(true)}
            onHoverEnd={() => setIsShopHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Link
              to="/shop"
              className="flex items-center gap-3 px-8 py-4 bg-black text-white text-[10px] tracking-[4px] uppercase font-medium rounded-xs no-underline transition-all duration-300 shadow-md border border-black cursor-pointer"
            >
              <span>Shop Collection</span>
              <motion.span
                animate={{ x: isShopHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                &rarr;
              </motion.span>
            </Link>
          </motion.div>

          {/* View Lookbook Button */}
          <motion.div
            onHoverStart={() => setIsLookbookHovered(true)}
            onHoverEnd={() => setIsLookbookHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={() => {
                const collectionsSection = document.getElementById("collections");
                if (collectionsSection) {
                  collectionsSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`relative overflow-hidden px-8 py-4 border border-black text-[10px] tracking-[4px] uppercase font-medium rounded-xs transition-colors duration-400 cursor-pointer ${
                isLookbookHovered ? "text-white" : "text-black"
              }`}
            >
              <span className="relative z-10">View Lookbook</span>
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: isLookbookHovered ? "0%" : "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 bg-black z-0 pointer-events-none"
              />
            </button>
          </motion.div>
        </motion.div>

        {/* Bouncing Scroll down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-6 left-6 md:left-16 hidden md:flex items-center gap-3 z-20 pointer-events-none"
        >
          <div className="w-[12px] h-[22px] border border-neutral-400 rounded-full flex justify-center p-0.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-neutral-800 rounded-full"
            />
          </div>
          <span className="text-[8px] uppercase tracking-[3px] text-neutral-500 font-light">Scroll</span>
        </motion.div>
      </motion.div>

      {/* Right Column: Model Image */}
      <motion.div
        style={{
          y: imageScrollY,
        }}
        className="w-full md:w-1/2 h-[50vh] md:h-full order-1 md:order-2 relative overflow-hidden bg-neutral-100"
      >
        {/* Parallax & Scale Container */}
        <motion.div
          style={{
            x: imageParallaxX,
            y: imageParallaxY,
            scale: imageScrollScale,
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <motion.img
            key={campaignIndex}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            src={getOptimizedImageUrl(CAMPAIGN_IMAGES[campaignIndex], 1200)}
            alt={`Luxora Campaign Editorial Pose ${campaignIndex + 1}`}
            className="w-full h-full object-cover object-top"
          />
        </motion.div>

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 z-10 pointer-events-none" />

        {/* Floating Tag 1: NEW DROP */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-6 left-6 md:top-12 md:left-12 z-20 backdrop-blur-md bg-white/20 border border-white/20 shadow-md px-4 py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[4px] font-semibold text-white pointer-events-none select-none"
        >
          New Drop
        </motion.div>

        {/* Floating Tag 2: LIMITED EDITION */}
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 backdrop-blur-md bg-black/25 border border-white/10 shadow-md px-4 py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[4px] font-semibold text-white pointer-events-none select-none"
        >
          Limited Edition
        </motion.div>

        {/* Campaign Thumbnails switcher */}
        <div className="absolute bottom-6 left-6 z-20 flex gap-2 md:gap-3 pointer-events-auto">
          {CAMPAIGN_IMAGES.map((imgUrl, idx) => (
            <motion.img
              key={idx}
              whileHover={{ scale: 1.05 }}
              onClick={() => setCampaignIndex(idx)}
              src={getOptimizedImageUrl(imgUrl, 150)}
              alt={`Switch to campaign pose ${idx + 1}`}
              className={`w-10 h-14 md:w-12 md:h-16 object-cover cursor-pointer rounded-xs transition-all duration-300 ${
                campaignIndex === idx 
                  ? "ring-2 ring-white ring-offset-1 ring-offset-neutral-900 scale-105" 
                  : "opacity-60 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;