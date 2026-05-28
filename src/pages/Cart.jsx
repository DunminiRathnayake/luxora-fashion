import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, formatPrice, parsePrice } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock, User, Mail, Phone, MapPin, Loader2, AlertCircle } from "lucide-react";
import SEO from "../components/SEO";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

const WHATSAPP_NUMBER = "94771234567"; // Constant store for easily changing later

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, user, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState("cart"); // 'cart' | 'login_required' | 'checkout_review'
  
  // Checkout operation states
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  // User details states for checkout form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Sync details if user login status shifts
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  // Dynamic Shipping Calculations
  const shippingThreshold = 10000;
  const shippingCost = subtotal > shippingThreshold ? 0 : 500;
  const orderTotal = subtotal + shippingCost;

  const handleProceedToCheckout = () => {
    if (!user) {
      setStep("login_required");
    } else {
      setStep("checkout_review");
    }
  };

  const handleWhatsAppConfirm = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setConfirmError("Please fill in all delivery details before confirming.");
      return;
    }

    setIsConfirming(true);
    setConfirmError("");

    // Prepare items collection for DB save
    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      image: item.image,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderPayload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      deliveryAddress: address,
      orderItems,
      subtotal,
      shippingFee: shippingCost,
      totalAmount: orderTotal,
      whatsappConfirmed: true,
    };

    try {
      // 1. Save to DB first
      const savedOrder = await createOrder(orderPayload);
      const orderId = savedOrder._id || savedOrder.id;

      // 2. Prepare message summary with order ID
      const itemsSummary = cartItems
        .map((item, index) => {
          return `${index + 1}. ${item.name}\n   Size: ${item.size}\n   Qty: ${item.quantity}\n   Price: ${item.price}`;
        })
        .join("\n\n");

      const shippingText = shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost);

      const message = `Hello Luxora, I want to confirm my order.

Order ID: ${orderId}

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Order Items:
${itemsSummary}

Subtotal: ${formatPrice(subtotal)}
Shipping: ${shippingText}
Total: ${formatPrice(orderTotal)}

Please confirm availability and delivery details.`;

      const encodedMessage = encodeURIComponent(message);

      // 3. Open WhatsApp
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");

      // 4. Clear cart & redirect
      clearCart();
      navigate("/profile/orders");
    } catch (err) {
      setConfirmError(err.message || "Failed to confirm order. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  // Step 1: Login Required Screen
  if (step === "login_required") {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center bg-[#faf9f6]">
        <SEO title="Secure Checkout - Login Required" description="Log in to your Luxora account to proceed with your order details." />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 border border-neutral-200/50 rounded-xs max-w-md shadow-xs"
        >
          <div className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6 bg-white">
            <Lock className="w-5 h-5 text-neutral-800" />
          </div>
          <h2 className="text-xl font-light tracking-widest uppercase mb-3 text-black">
            Login Required
          </h2>
          <p className="text-gray-500 font-light text-xs sm:text-sm leading-relaxed mb-8">
            Please log in or set up a luxury profile to confirm your order details and verify your address.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              state={{ from: "/cart" }}
              className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              Login
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/register"
              state={{ from: "/cart" }}
              className="w-full py-4 bg-transparent text-neutral-800 text-xs uppercase tracking-widest font-semibold border border-neutral-255 hover:border-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              Register
            </Link>
            <button
              onClick={() => setStep("cart")}
              className="text-xs text-neutral-500 hover:text-black underline underline-offset-4 tracking-wider uppercase mt-4 cursor-pointer bg-transparent border-0 outline-none"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Step 2: Checkout Review Section
  if (step === "checkout_review") {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-24 pt-8 md:pt-16">
        <SEO title="Confirm Checkout Details" description="Review your order details and enter your shipping info to confirm on WhatsApp." />
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          
          <div className="flex justify-between items-end mb-12 border-b pb-6 border-neutral-100">
            <div>
              <span className="text-[10px] tracking-[6px] uppercase text-neutral-400 font-semibold block mb-2">
                Order Review
              </span>
              <h1 className="text-2xl md:text-3xl font-light tracking-widest uppercase text-black">
                Confirm Details
              </h1>
            </div>
            <button
              onClick={() => setStep("cart")}
              className="text-xs text-neutral-500 hover:text-black uppercase tracking-wider underline underline-offset-4 cursor-pointer bg-transparent border-0 outline-none"
            >
              Back To Bag
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Side: Delivery Details Form */}
            <div className="lg:col-span-7 bg-white border border-neutral-200/60 p-6 md:p-8 rounded-xs shadow-xs">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-900 border-b pb-4 mb-6">
                Delivery Details
              </h3>
              
              <form className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xs text-neutral-800 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-all font-light"
                      placeholder="Dunmini Rathnayake"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xs text-neutral-800 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-all font-light"
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xs text-neutral-800 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-all font-light"
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Delivery Address
                  </label>
                  <div className="relative items-start">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 text-xs text-neutral-800 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-all font-light resize-none"
                      placeholder="Negombo, Sri Lanka"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Right Side: Order Review Summary */}
            <div className="lg:col-span-5 bg-white border border-neutral-200/60 p-6 md:p-8 rounded-xs shadow-xs">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-900 border-b pb-4 mb-6">
                Order Items
              </h3>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.key} className="flex gap-4 items-center justify-between border-b border-neutral-200/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-16 overflow-hidden rounded-sm border shrink-0 bg-white">
                        <img
                          src={getOptimizedImageUrl(item.image, 100)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-neutral-900 truncate max-w-[160px]">{item.name}</h4>
                        <p className="text-[10px] text-neutral-500 mt-0.5">Size: <span className="font-semibold">{item.size}</span> | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-800">
                      {formatPrice(parsePrice(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Totals */}
              <div className="space-y-4 text-xs font-light text-neutral-600 border-t border-neutral-200 pt-6">
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

              {/* Error Alert */}
              <AnimatePresence>
                {confirmError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 bg-red-950/10 border border-red-900/30 text-red-600 text-xs font-light tracking-wide uppercase py-3 px-4 rounded-sm flex items-center gap-2 overflow-hidden"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{confirmError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm WhatsApp CTA */}
              <button
                onClick={handleWhatsAppConfirm}
                disabled={isConfirming}
                className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-sm disabled:bg-neutral-850 disabled:text-neutral-400 disabled:border-neutral-800"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                    Saving Order Details...
                  </>
                ) : (
                  <>
                    {/* Premium WhatsApp SVG Icon */}
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Confirm Order on WhatsApp
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Step 3: Standard Cart Page View
  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24 pt-8 md:pt-16">
      <SEO title="Shopping Bag" description="View products, customize sizes, or adjust quantities in your luxury Luxora shopping bag." />
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
                              src={getOptimizedImageUrl(item.image, 200)}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
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
                              className={`w-6 h-6 rounded-full flex items-center justify-center hover:bg-neutral-250 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black ${
                                item.quantity <= 1 ? "opacity-35 cursor-not-allowed" : ""
                              }`}
                              aria-label={`Decrease quantity of ${item.name} size ${item.size}`}
                            >
                              <Minus className="w-3 h-3 text-neutral-600" />
                            </button>
                            <span 
                              className="text-xs font-semibold text-neutral-800 w-6 text-center select-none"
                              aria-label={`Current quantity is ${item.quantity}`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
                              aria-label={`Increase quantity of ${item.name} size ${item.size}`}
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
                              className="w-8 h-8 rounded-full border border-neutral-100 hover:border-black flex items-center justify-center text-neutral-400 hover:text-black transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
                              title="Remove item"
                              aria-label={`Remove ${item.name} size ${item.size} from shopping bag`}
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
                <div className="bg-white border border-neutral-200/60 p-6 md:p-8 rounded-xs shadow-xs">
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
                    onClick={handleProceedToCheckout}
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