import { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem("luxora_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null); // { message, id, type: 'add' | 'remove' }

  useEffect(() => {
    localStorage.setItem("luxora_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const triggerToast = (message, type) => {
    const id = Date.now();
    setToast({ message, id, type });
    setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev));
    }, 2500);
  };

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      triggerToast(`Saved: ${product.name}`, "add");
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      const product = prev.find((item) => item.id === productId);
      if (product) {
        triggerToast(`Removed: ${product.name}`, "remove");
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const toggleWishlist = (product) => {
    const isSaved = wishlistItems.some((item) => item.id === product.id);
    if (isSaved) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}

      {/* Global Animated Toast Portal */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 30, scale: 0.9, x: "-50%" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-[10px] sm:text-xs uppercase tracking-widest px-6 py-4 shadow-xl rounded-full flex items-center gap-3 border border-neutral-800 font-medium"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                toast.type === "add" ? "fill-white text-white" : "text-neutral-400"
              }`}
            />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </WishlistContext.Provider>
  );
};
