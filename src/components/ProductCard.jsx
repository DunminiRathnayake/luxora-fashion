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
      <div className="overflow-hidden relative aspect-[3/4] bg-neutral-50 border border-neutral-100 rounded-sm">
        <img
          src={getOptimizedImageUrl(product.image, 400)}
          alt={product.name}
          className="w-full h-full object-cover transition duration-750 ease-out group-hover:scale-103"
          loading="lazy"
        />
        
        {/* Heart Wishlist Overlay */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlistClick}
          className="absolute top-3.5 right-3.5 z-20 w-8.5 h-8.5 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm border border-neutral-100 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
          title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors duration-300 ${
              isSaved ? "fill-black text-black" : "text-neutral-500 hover:text-black"
            }`}
          />
        </motion.button>

        {/* Quick Add Overlay on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 pt-12 flex flex-col justify-end items-center"
            >
              {isOutOfStock ? (
                <span className="text-[10px] tracking-[4px] uppercase font-semibold text-white bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 rounded-sm">
                  Sold Out
                </span>
              ) : (
                <div className="w-full text-center">
                  <span className="text-[8px] tracking-[3px] uppercase font-bold text-neutral-300 block mb-2.5">
                    Quick Add Size
                  </span>
                  <div className="flex gap-2.5 justify-center flex-wrap">
                    {availableSizes.map((sm) => (
                      <button
                        key={sm.dbValue}
                        onClick={(e) => handleQuickAdd(e, sm.dbValue)}
                        className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-black hover:border-white backdrop-blur-md text-[10px] font-semibold text-white flex items-center justify-center transition-all duration-300 cursor-pointer scale-95 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                        title={`Quick Add UK ${sm.label}`}
                        aria-label={`Quick add ${product.name} in size UK ${sm.label}`}
                      >
                        {sm.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-900 truncate">
          {product.name}
        </h2>
        <p className="text-neutral-500 text-xs font-light mt-1">
          {product.price}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;