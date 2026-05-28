import { useMyOrders } from "../hooks/useMyOrders";
import { formatPrice } from "../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag, Calendar, MapPin, CheckCircle, Package, Truck, Clock, ShieldAlert } from "lucide-react";
import SEO from "../components/SEO";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

// Luxury Status Progress Timeline component
function LuxuryTimeline({ status }) {
  const steps = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  const currentIdx = steps.indexOf(status);

  // If status is Cancelled, render a simple alerts bar instead
  if (status === "Cancelled") {
    return (
      <div className="bg-red-950/10 border border-red-900/30 p-4 text-red-600 text-xs font-light tracking-widest uppercase rounded flex items-center gap-2 mt-6">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>This order has been cancelled by curator staff</span>
      </div>
    );
  }

  const getStepIcon = (step) => {
    switch (step) {
      case "Pending":
        return Clock;
      case "Confirmed":
        return CheckCircle;
      case "Processing":
        return Package;
      case "Shipped":
        return Truck;
      case "Delivered":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-neutral-100">
      <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block mb-6">
        Fulfillment Tracker
      </span>
      
      {/* Desktop Horizontal Timeline */}
      <div 
        className="hidden md:flex justify-between items-center relative pr-4"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax={steps.length - 1}
        aria-valuenow={currentIdx}
        aria-valuetext={`Order fulfillment state: ${status}`}
      >
        {/* Progress connecting lines behind */}
        <div className="absolute top-1/2 left-[5%] right-[5%] -translate-y-1/2 h-[1px] bg-neutral-200 z-0">
          <div
            className="bg-black h-full transition-all duration-700 ease-out"
            style={{ width: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isActive = idx === currentIdx;
          const StepIcon = getStepIcon(step);

          return (
            <div 
              key={step} 
              className="flex flex-col items-center z-10 relative bg-white px-2"
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  isActive
                    ? "bg-black text-white border-black shadow-md scale-105"
                    : isCompleted
                    ? "bg-white text-black border-black"
                    : "bg-neutral-50 text-neutral-300 border-neutral-200"
                }`}
                aria-label={`${step} status ${isActive ? "(current)" : isCompleted ? "(completed)" : "(pending)"}`}
              >
                <StepIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <span
                className={`text-[9px] uppercase tracking-wider mt-3 font-semibold transition-colors duration-300 ${
                  isActive ? "text-black" : "text-neutral-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Timeline */}
      <div 
        className="flex md:hidden flex-col gap-6 relative pl-6"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax={steps.length - 1}
        aria-valuenow={currentIdx}
        aria-valuetext={`Order fulfillment state: ${status}`}
      >
        {/* Progress connecting line */}
        <div className="absolute left-[34px] top-4 bottom-4 w-[1px] bg-neutral-200 z-0">
          <div
            className="bg-black w-full transition-all duration-700 ease-out origin-top"
            style={{ height: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isActive = idx === currentIdx;
          const StepIcon = getStepIcon(step);

          return (
            <div 
              key={step} 
              className="flex items-center gap-4 z-10 relative"
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 transition-all duration-500 bg-white ${
                  isActive
                    ? "bg-black text-white border-black shadow"
                    : isCompleted
                    ? "bg-white text-black border-black"
                    : "bg-neutral-50 text-neutral-300 border-neutral-200"
                }`}
                aria-label={`${step} status ${isActive ? "(current)" : isCompleted ? "(completed)" : "(pending)"}`}
              >
                <StepIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <span
                className={`text-[10px] uppercase tracking-widest font-semibold ${
                  isActive ? "text-black" : "text-neutral-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileOrders() {
  const { orders, loading, error } = useMyOrders();

  const getProductImage = (item) => {
    const API_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000");
    const img = item.image;
    let url = img;
    if (!img) {
      url = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
    } else if (!img.startsWith("http")) {
      url = `${API_URL}${img}`;
    }
    return getOptimizedImageUrl(url, 120);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24 pt-8 md:pt-16">
      <SEO title="Your Orders" description="Track your order fulfillment, view delivery status, and review details of your luxury purchases." />
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-12 border-b pb-6 border-neutral-100 gap-4">
          <div>
            <span className="text-[10px] tracking-[6px] uppercase text-neutral-400 font-semibold block mb-2">
              Buyer Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-light tracking-widest uppercase text-black">
              Your Orders
            </h1>
          </div>
          <span className="text-xs text-neutral-500 font-light hidden sm:block">
            Monitor delivery updates dynamically
          </span>
        </div>

        {/* Loading placeholders */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-neutral-50 border border-neutral-200 p-6 rounded animate-pulse space-y-4">
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-10 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-[1px] bg-neutral-200 w-full"></div>
                <div className="h-16 bg-neutral-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center border border-neutral-200 rounded-sm">
            <span className="text-[10px] tracking-[4px] uppercase text-neutral-400 font-semibold block mb-2">
              Network Interruption
            </span>
            <p className="text-neutral-500 font-light text-xs max-w-xs mx-auto mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-2.5 hover:bg-neutral-800 transition-colors font-medium cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={order._id || order.id}
                  className="bg-neutral-50 border border-neutral-150 p-6 md:p-8 rounded shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Order Meta details */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-neutral-200/50 pb-4 mb-6 gap-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold block">
                        Order Identifier
                      </span>
                      <span className="text-sm font-mono font-medium text-neutral-800">
                        {order._id || order.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-light text-neutral-500 sm:text-right">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-16 bg-white border border-neutral-200 overflow-hidden shrink-0">
                            <img
                              src={getProductImage(item)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold uppercase text-neutral-900">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-neutral-500 mt-0.5">
                              Size: <span className="font-semibold text-black uppercase">{item.size}</span> | Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-neutral-800">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address */}
                  <div className="mt-6 p-4 bg-white border border-neutral-150 rounded flex gap-2.5 items-start">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold block">
                        Shipping Address
                      </span>
                      <p className="text-xs text-neutral-700 font-light mt-0.5">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between items-baseline mt-6 text-xs text-neutral-600 font-light">
                    <span>Shipping fee: {order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</span>
                    <span className="text-neutral-850">
                      Total Bill: <span className="text-sm font-bold text-black">{formatPrice(order.totalAmount)}</span>
                    </span>
                  </div>

                  {/* Progress Timeline */}
                  <LuxuryTimeline status={order.orderStatus} />

                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-6 h-6 text-neutral-400" />
            </div>
            <h2 className="text-lg font-light tracking-widest uppercase mb-3">
              No Orders Found
            </h2>
            <p className="text-gray-500 font-light text-xs leading-relaxed mb-8">
              No order history is available under your account. Select from our signature collections to find your first piece.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white text-[10px] uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors duration-300 font-medium no-underline"
            >
              Discover Collection
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfileOrders;
