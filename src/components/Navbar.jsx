import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if auth pages are active
  const isAuthActive = location.pathname === "/login" || location.pathname === "/register";

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const navLinksVariants = {
    closed: {},
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const linkItemVariants = {
    closed: { opacity: 0, y: 30 },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-bold tracking-widest text-black no-underline z-50">
        LUXORA
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 items-center text-xs uppercase tracking-widest font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `relative py-2 text-neutral-500 hover:text-black transition-colors duration-300 no-underline ${
              isActive ? "text-black font-semibold" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>Home</span>
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `relative py-2 text-neutral-500 hover:text-black transition-colors duration-300 no-underline ${
              isActive ? "text-black font-semibold" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>Shop</span>
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to="/login"
          className={`relative py-2 text-neutral-500 hover:text-black transition-colors duration-300 no-underline ${
            isAuthActive ? "text-black font-semibold" : ""
          }`}
        >
          {({ isActive }) => (
            <>
              <span>Login</span>
              {isAuthActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>
      </div>

      {/* Right Actions: Favorites, Bag & Mobile Menu Toggle */}
      <div className="flex gap-4 md:gap-6 items-center z-50">
        
        {/* Wishlist Link */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex items-center gap-1.5 text-neutral-500 hover:text-black transition-colors no-underline relative py-2 text-xs uppercase tracking-widest font-medium ${
              isActive ? "text-black font-semibold" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Heart className={`w-4 h-4 ${isActive ? "fill-black text-black" : "text-neutral-800"}`} />
              <span className="hidden sm:inline">Favorites</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-2 bg-black text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-white">
                  {wishlistCount}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        {/* Bag Link */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex items-center gap-1.5 text-neutral-500 hover:text-black transition-colors no-underline relative py-2 text-xs uppercase tracking-widest font-medium ${
              isActive ? "text-black font-semibold" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ShoppingBag className="w-4 h-4 text-neutral-800" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-2 bg-black text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-white">
                  {cartCount}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-1 text-black hover:text-neutral-600 transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Fullscreen Mobile Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 w-screen h-screen bg-white/95 backdrop-blur-2xl z-40 flex flex-col justify-center items-center px-8"
          >
            <motion.div
              variants={navLinksVariants}
              className="flex flex-col gap-8 text-center text-2xl tracking-[6px] uppercase font-light text-neutral-800"
            >
              <motion.div variants={linkItemVariants}>
                <Link
                  to="/"
                  className={`no-underline hover:text-black hover:font-normal transition-all ${
                    location.pathname === "/" ? "text-black font-medium underline underline-offset-8" : "text-neutral-500"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.div>

              <motion.div variants={linkItemVariants}>
                <Link
                  to="/shop"
                  className={`no-underline hover:text-black hover:font-normal transition-all ${
                    location.pathname === "/shop" ? "text-black font-medium underline underline-offset-8" : "text-neutral-500"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
              </motion.div>

              <motion.div variants={linkItemVariants}>
                <Link
                  to="/wishlist"
                  className={`no-underline hover:text-black hover:font-normal transition-all ${
                    location.pathname === "/wishlist" ? "text-black font-medium underline underline-offset-8" : "text-neutral-500"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites ({wishlistCount})
                </Link>
              </motion.div>

              <motion.div variants={linkItemVariants}>
                <Link
                  to="/cart"
                  className={`no-underline hover:text-black hover:font-normal transition-all ${
                    location.pathname === "/cart" ? "text-black font-medium underline underline-offset-8" : "text-neutral-500"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shopping Bag ({cartCount})
                </Link>
              </motion.div>

              <motion.div variants={linkItemVariants}>
                <Link
                  to="/login"
                  className={`no-underline hover:text-black hover:font-normal transition-all ${
                    isAuthActive ? "text-black font-medium underline underline-offset-8" : "text-neutral-500"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Register
                </Link>
              </motion.div>
            </motion.div>

            {/* Editorial tagline inside mobile menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 text-center text-[10px] tracking-[4px] uppercase text-neutral-500"
            >
              Luxora Editorial © 2026
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;