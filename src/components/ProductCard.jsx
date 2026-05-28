import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useCartDrawer } from "../context/CartDrawerContext";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

const SIZE_MAPPING = [
  { dbValue: "XS", label: "8" },
  { dbValue: "S", label: "10" },
  { dbValue: "M", label: "12" },
  { dbValue: "L", label: "14" },
  { dbValue: "XL", label: "16" }
];

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { triggerCartAddFeedback } = useCartDrawer();
  
  const [isHovered, setIsHovered] = useState(false);
  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = (e, dbSize) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, dbSize, 1);
    triggerCartAddFeedback({
      name: product.name,
      size: dbSize,
      image: product.image
    });
  };

  const availableSizes = SIZE_MAPPING.filter((sm) =>
    (product.sizes || ["XS", "S", "M", "L", "XL"]).includes(sm.dbValue)
  );

  return (
    <Link
      to={`/product/${product.id}`}
      className="block group cursor-pointer text-black no-underline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden relative aspect-[3/4] bg-neutral-50 border border-neutral-150/50 rounded-xs shadow-xs group-hover:shadow-md transition-all duration-500">
        <img
          src={getOptimizedImageUrl(product.image, 500)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[0.16, 1, 0.3, 1] group-hover:scale-[1.03]"
          loading="lazy"
        />
        
        {/* Heart Wishlist Overlay with Soft Blur */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 z-20 w-8.5 h-8.5 bg-[#faf9f6]/90 hover:bg-[#12100e] text-[#12100e] hover:text-[#faf9f6] backdrop-blur-xs rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-neutral-200/40 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
          title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors duration-300 ${
              isSaved ? "fill-current text-current" : "text-neutral-500 hover:text-current"
            }`}
          />
        </motion.button>

        {/* Quick Add Overlay on Hover - Luxury Blur Panel */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 z-10 bg-black/30 backdrop-blur-[2px] p-4 flex flex-col justify-end items-center"
            >
              {isOutOfStock ? (
                <span className="text-[10px] tracking-[4px] uppercase font-semibold text-white bg-black/80 backdrop-blur-md px-5 py-2.5 border border-white/10 rounded-xs">
                  Sold Out
                </span>
              ) : (
                <motion.div 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 15, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center"
                >
                  <span className="text-[8px] tracking-[3px] uppercase font-semibold text-neutral-200 block mb-3">
                    Quick Add Size
                  </span>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {availableSizes.map((sm) => (
                      <button
                        key={sm.dbValue}
                        onClick={(e) => handleQuickAdd(e, sm.dbValue)}
                        className="w-8.5 h-8.5 rounded-full border border-white/20 bg-neutral-950/80 hover:bg-[#faf9f6] hover:text-black hover:border-[#faf9f6] backdrop-blur-xs text-[10px] font-semibold text-white flex items-center justify-center transition-all duration-300 cursor-pointer scale-95 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                        title={`Quick Add UK ${sm.label}`}
                        aria-label={`Quick add ${product.name} in size UK ${sm.label}`}
                      >
                        {sm.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-[4px] text-neutral-400 font-semibold">
          {product.category}
        </span>
        <h3 className="text-xs uppercase tracking-[2px] text-neutral-900 font-medium truncate group-hover:underline underline-offset-4 decoration-neutral-300 transition-all">
          {product.name}
        </h3>
        <p className="text-[11px] font-medium text-neutral-600 font-sans mt-0.5">
          {product.price}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;