import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart, formatPrice } from "../context/CartContext";
import { useCartDrawer } from "../context/CartDrawerContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export function MiniCartDrawer() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, cartCount } = useCart();
  const { isCartOpen, closeCart } = useCartDrawer();
  const [isMobile, setIsMobile] = useState(false);

  // Monitor viewport size for responsive animation variants and touch gestures
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lock body scroll when cart drawer is active
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const getProductImage = (img) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    if (!img) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
    if (img.startsWith("http")) return img;
    return `${API_URL}${img}`;
  };

  const formatSizeLabel = (dbSize) => {
    const mapping = {
      XS: "UK 8",
      S: "UK 10",
      M: "UK 12",
      L: "UK 14",
      XL: "UK 16",
    };
    return mapping[dbSize] || dbSize;
  };

  // Colombo delivery style metrics
  const shippingFee = subtotal > 15000 || subtotal === 0 ? 0 : 350;
  const totalAmount = subtotal + shippingFee;

  // Responsive Drawer Variants
  const drawerVariants = {
    hidden: isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 },
    visible: {
      y: 0,
      x: 0,
      transition: { type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
    exit: isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 },
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur Mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-all cursor-pointer"
          />

          {/* Drawer Body Container */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.7 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 140) {
                closeCart();
              }
            }}
            className={`fixed z-50 bg-white text-black shadow-2xl flex flex-col ${
              isMobile
                ? "inset-x-0 bottom-0 h-[88vh] rounded-t-xl"
                : "right-0 top-0 h-screen w-full sm:w-[420px]"
            }`}
          >
            {/* Header section */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-900">
                  Shopping Bag
                </h3>
                <span className="text-[10px] text-neutral-400 font-light mt-0.5 block uppercase tracking-wider">
                  {cartCount} {cartCount === 1 ? "Item" : "Items"} curated
                </span>
              </div>
              
              {isMobile && (
                <div className="w-12 h-1 bg-neutral-200 rounded-full absolute top-2.5 left-1/2 -translate-x-1/2" />
              )}

              <button
                onClick={closeCart}
                className="p-1.5 hover:bg-neutral-50 rounded-full text-neutral-800 transition-colors cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Contents */}
            <div className="flex-grow overflow-y-auto px-6 py-4 scrollbar-none">
              <AnimatePresence initial={false}>
                {cartItems.length > 0 ? (
                  <motion.div layout className="space-y-5">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 border-b border-neutral-100 pb-5 items-start justify-between"
                      >
                        {/* Item Info Split */}
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="w-16 h-20 bg-neutral-50 border border-neutral-100 overflow-hidden shrink-0 rounded-sm">
                            <img
                              src={getProductImage(item.image)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Meta */}
                          <div className="flex flex-col justify-between py-0.5">
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-neutral-950 truncate max-w-[200px]">
                                {item.name}
                              </h4>
                              <span className="text-[10px] text-neutral-400 font-light block mt-0.5 uppercase tracking-wider">
                                Size: <span className="font-semibold text-black">{formatSizeLabel(item.size)}</span>
                              </span>
                            </div>

                            {/* Quantity buttons */}
                            <div className="flex items-center border border-neutral-200 rounded-full w-24 justify-between py-0.5 px-0.5 bg-neutral-50 mt-2">
                              <button
                                onClick={() => item.quantity > 1 && updateQuantity(item.key, item.quantity - 1)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer ${
                                  item.quantity <= 1 ? "opacity-30 cursor-not-allowed" : ""
                                }`}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-2.5 h-2.5 text-neutral-600" />
                              </button>
                              <span className="text-[10px] font-semibold text-neutral-800 w-6 text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5 text-neutral-600" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex flex-col items-end justify-between h-20 py-0.5 shrink-0">
                          <span className="text-xs font-semibold text-neutral-900">
                            {item.price}
                          </span>
                          
                          <button
                            onClick={() => removeFromCart(item.key)}
                            className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  // Empty State
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-20"
                  >
                    <div className="w-14 h-14 rounded-full border border-neutral-200 flex items-center justify-center mb-5 text-neutral-400">
                      <ShoppingBag className="w-5 h-5 font-light" />
                    </div>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-2">
                      Your bag is empty
                    </h4>
                    <p className="text-xs text-neutral-500 font-light max-w-[250px] leading-relaxed mb-8">
                      Select exquisite statement pieces from our tailored collections to complete your capsule.
                    </p>
                    <button
                      onClick={closeCart}
                      className="bg-black text-white text-[9px] uppercase tracking-widest font-semibold px-6 py-3 hover:bg-neutral-850 transition-colors rounded-sm cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom summary & checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-neutral-100 p-6 bg-white space-y-3 shrink-0">
                <div className="space-y-2 text-[11px] font-light text-neutral-600 tracking-wide">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-black">
                      {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-black pt-2.5 border-t border-neutral-100">
                    <span>Total Bill</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2.5">
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="w-full py-3.5 bg-black text-white text-[9px] uppercase tracking-widest font-semibold border border-black hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center cursor-pointer rounded-sm no-underline text-center"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={closeCart}
                    className="w-full py-3.5 bg-transparent text-neutral-800 text-[9px] uppercase tracking-widest font-semibold border border-neutral-250 hover:border-black transition-all duration-300 flex items-center justify-center cursor-pointer rounded-sm text-center"
                  >
                    <Link to="/cart" className="no-underline text-neutral-850 w-full h-full block">
                      View Bag
                    </Link>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MiniCartDrawer;

export function CartToast() {
  const { toast, setToast, openCart } = useCartDrawer();

  const formatSizeLabel = (dbSize) => {
    const mapping = {
      XS: "UK 8",
      S: "UK 10",
      M: "UK 12",
      L: "UK 14",
      XL: "UK 16",
    };
    return mapping[dbSize] || dbSize;
  };

  const getProductImage = (img) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    if (!img) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
    if (img.startsWith("http")) return img;
    return `${API_URL}${img}`;
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-22 right-6 md:right-10 z-50 bg-white border border-neutral-150 shadow-xl p-4 flex gap-4 w-76 rounded-sm"
        >
          {/* Toast image */}
          <div className="w-12 h-16 bg-neutral-50 border border-neutral-100 overflow-hidden shrink-0 rounded-sm">
            <img src={getProductImage(toast.image)} alt={toast.name} className="w-full h-full object-cover" />
          </div>
          
          {/* Toast details */}
          <div className="flex-grow flex flex-col justify-between py-0.5">
            <div>
              <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-semibold block">
                Added to Bag
              </span>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase truncate max-w-[140px] mt-0.5">
                {toast.name}
              </h4>
              <span className="text-[9px] text-neutral-500 font-light mt-0.5 block">
                Size: {formatSizeLabel(toast.size)}
              </span>
            </div>
            
            <button
              onClick={() => {
                setToast(null);
                openCart();
              }}
              className="text-[9px] font-semibold uppercase tracking-wider text-black underline underline-offset-2 hover:text-neutral-600 text-left bg-transparent border-0 outline-none cursor-pointer mt-1"
            >
              Open Bag
            </button>
          </div>

          <button
            onClick={() => setToast(null)}
            className="text-neutral-400 hover:text-black self-start p-0.5 cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
