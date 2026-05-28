import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCartDrawer } from "../context/CartDrawerContext";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { cartCount, user, logoutUser } = useCart();
  const { openCart, bounceCartIcon } = useCartDrawer();
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
    <nav className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-neutral-200/40 bg-[#faf9f6]/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      {/* Brand Logo */}
      <Link to="/" className="text-xl font-serif font-light tracking-[8px] text-black no-underline z-50 hover:opacity-80 transition-opacity">
        LUXORA
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 items-center text-[10px] uppercase tracking-[3px] font-light">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `relative py-2 text-neutral-500 hover:text-black transition-colors duration-300 no-underline ${
              isActive ? "text-black font-normal" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>Home</span>
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"
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
              isActive ? "text-black font-normal" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>Shop</span>
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        {user ? (
          <div className="flex gap-6 items-center">
            <NavLink
              to="/profile/orders"
              className={({ isActive }) =>
                `relative py-2 text-neutral-500 hover:text-black transition-colors duration-300 no-underline ${
                  isActive ? "text-black font-normal" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Orders</span>
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
            <button
              onClick={logoutUser}
              className="relative py-2 text-neutral-500 hover:text-black transition-colors duration-300 no-underline cursor-pointer uppercase tracking-[3px] font-light bg-transparent border-0 outline-none text-[10px]"
            >
              Logout ({user.name.split(" ")[0]})
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className={`relative py-2 text-neutral-500 hover:text-black transition-colors duration-300 no-underline ${
              isAuthActive ? "text-black font-normal" : ""
            }`}
          >
            <span>Login</span>
            {isAuthActive && (
              <motion.div
                layoutId="navUnderline"
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </NavLink>
        )}
      </div>

      {/* Right Actions: Favorites, Bag & Mobile Menu Toggle */}
      <div className="flex gap-4 md:gap-6 items-center z-50">
        
        {/* Wishlist Link */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex items-center gap-1.5 text-neutral-500 hover:text-black transition-colors no-underline relative py-2 text-[10px] uppercase tracking-[3px] font-light ${
              isActive ? "text-black font-normal" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Heart className={`w-3.5 h-3.5 ${isActive ? "fill-black text-black" : "text-neutral-800"}`} />
              <span className="hidden sm:inline">Favorites</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-2 bg-black text-white text-[7px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-white">
                  {wishlistCount}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        {/* Bag Trigger Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            openCart();
          }}
          className={`flex items-center gap-1.5 text-neutral-500 hover:text-black transition-colors no-underline relative py-2 text-[10px] uppercase tracking-[3px] font-light bg-transparent border-0 outline-none cursor-pointer ${
            location.pathname === "/cart" ? "text-black font-normal" : ""
          }`}
        >
          <motion.div
            animate={bounceCartIcon ? { scale: [1, 1.3, 0.95, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-neutral-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-black text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                {cartCount}
              </span>
            )}
          </motion.div>
          <span className="hidden sm:inline">Bag</span>
          {location.pathname === "/cart" && (
            <motion.div
              layoutId="navUnderline"
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
        </button>

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
            className="fixed inset-0 w-screen h-screen bg-[#faf9f6]/98 backdrop-blur-2xl z-40 flex flex-col justify-center items-center px-8"
          >
            <motion.div
              variants={navLinksVariants}
              className="flex flex-col gap-8 text-center text-xl tracking-[6px] uppercase font-light text-neutral-800"
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
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openCart();
                  }}
                  className={`no-underline hover:text-black hover:font-normal transition-all uppercase tracking-[4px] bg-transparent border-0 outline-none cursor-pointer ${
                    location.pathname === "/cart" ? "text-black font-semibold underline underline-offset-8" : "text-neutral-500"
                  }`}
                >
                  Shopping Bag ({cartCount})
                </button>
              </motion.div>

              {user && (
                <motion.div variants={linkItemVariants}>
                  <Link
                    to="/profile/orders"
                    className={`no-underline hover:text-black hover:font-normal transition-all ${
                      location.pathname === "/profile/orders" ? "text-black font-medium underline underline-offset-8" : "text-neutral-500"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </motion.div>
              )}

              <motion.div variants={linkItemVariants}>
                {user ? (
                  <button
                    onClick={() => {
                      logoutUser();
                      setIsMenuOpen(false);
                    }}
                    className="no-underline text-neutral-500 hover:text-black hover:font-normal transition-all uppercase tracking-[4px] bg-transparent border-0 outline-none cursor-pointer"
                  >
                    Logout ({user.name.split(" ")[0]})
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`no-underline hover:text-black hover:font-normal transition-all ${
                      isAuthActive ? "text-black font-medium underline underline-offset-8" : "text-neutral-500"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Register
                  </Link>
                )}
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