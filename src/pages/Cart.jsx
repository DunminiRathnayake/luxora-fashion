import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, formatPrice, parsePrice } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } =
    useCart();

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Dynamic Shipping: Free over Rs. 10,000, else Rs. 500
  const shippingThreshold = 10000;
  const shippingCost = subtotal > shippingThreshold ? 0 : 500;
  const orderTotal = subtotal + shippingCost;

  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      clearCart();
    }, 3500);
  };

  if (checkoutComplete) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-50 p-10 md:p-16 border rounded-lg max-w-lg shadow-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-4 text-black">
            Order Received
          </h2>
          <p className="text-gray-500 font-light text-sm leading-relaxed mb-6">
            Thank you for shopping with **LUXORA**. We are preparing your order. A confirmation email and shipping details will be sent shortly.
          </p>
          <div className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium animate-pulse">
            Processing bag details...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 pt-8 md:pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h1 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-12 border-b pb-6 border-neutral-100">
          Shopping Bag
        </h1>

        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-20 text-center max-w-md mx-auto"
            >
              <div className="w-16 h-16 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-6 h-6 text-neutral-400" />
              </div>
              <h2 className="text-xl font-light tracking-widest uppercase mb-3">
                Your Bag is Empty
              </h2>
              <p className="text-gray-500 font-light text-sm leading-relaxed mb-8">
                Select from our curated collections to find premium pieces that define your personal aesthetic.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-black text-white text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-white hover:text-black border border-black transition-all duration-300 font-medium cursor-pointer"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="cart-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
            >
              {/* Cart Items List */}
              <div className="lg:col-span-8">
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col sm:flex-row gap-6 border-b border-neutral-100 pb-6 items-start sm:items-center justify-between"
                      >
                        {/* Image & Details */}
                        <div className="flex gap-5 items-center">
                          <Link
                            to={`/product/${item.id}`}
                            className="w-20 h-26 bg-neutral-50 overflow-hidden shrink-0 border"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </Link>

                          <div>
                            <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                              {item.category}
                            </span>
                            <h2 className="text-sm font-medium text-neutral-900 uppercase tracking-wide mt-0.5">
                              <Link
                                to={`/product/${item.id}`}
                                className="text-black no-underline hover:underline"
                              >
                                {item.name}
                              </Link>
                            </h2>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              Size: <span className="font-semibold text-black uppercase">{item.size}</span>
                            </p>
                            <p className="text-xs text-neutral-600 font-medium mt-1">
                              {item.price}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex flex-row sm:flex-col md:flex-row items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                          {/* Quantity */}
                          <div className="flex items-center border border-neutral-200 rounded-full w-28 justify-between py-1 px-1 bg-neutral-50">
                            <button
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className={`w-6 h-6 rounded-full flex items-center justify-center hover:bg-neutral-250 transition-colors cursor-pointer ${
                                item.quantity <= 1 ? "opacity-35 cursor-not-allowed" : ""
                              }`}
                            >
                              <Minus className="w-3 h-3 text-neutral-600" />
                            </button>
                            <span className="text-xs font-semibold text-neutral-800 w-6 text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-neutral-600" />
                            </button>
                          </div>

                          {/* Price & Trash */}
                          <div className="flex items-center gap-5">
                            <div className="text-right">
                              <span className="text-xs text-neutral-400 block sm:hidden uppercase tracking-widest">
                                Subtotal
                              </span>
                              <span className="text-sm font-semibold text-neutral-800">
                                {formatPrice(
                                  parsePrice(item.price) * item.quantity
                                )}
                              </span>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.key)}
                              className="w-8 h-8 rounded-full border border-neutral-100 hover:border-black flex items-center justify-center text-neutral-400 hover:text-black transition-all cursor-pointer shadow-sm"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-neutral-50 border border-neutral-150 p-6 md:p-8 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-900 border-b pb-4 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-4 text-xs font-light text-neutral-600">
                    <div className="flex justify-between">
                      <span>Bag Subtotal</span>
                      <span className="font-semibold text-neutral-850">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Estimated Shipping</span>
                      <span className="font-semibold text-neutral-850">
                        {shippingCost === 0 ? (
                          <span className="text-green-600 font-semibold uppercase tracking-wider text-[10px]">
                            Complimentary
                          </span>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </span>
                    </div>

                    {shippingCost > 0 && (
                      <div className="text-[10px] text-gray-400 leading-normal bg-white p-3 border border-neutral-100 rounded-md">
                        Spend <span className="font-medium text-black">{formatPrice(shippingThreshold - subtotal)}</span> more to unlock **Complimentary Shipping**.
                      </div>
                    )}
                  </div>

                  <div className="border-t border-neutral-200 mt-6 pt-6 mb-8">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs uppercase tracking-widest font-semibold text-neutral-800">
                        Order Total
                      </span>
                      <span className="text-lg font-bold text-neutral-950">
                        {formatPrice(orderTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Actions */}
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    Proceed To Checkout
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="mt-4 text-center">
                    <Link
                      to="/shop"
                      className="text-xs text-neutral-500 hover:text-black underline underline-offset-4 tracking-wider uppercase"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Cart;