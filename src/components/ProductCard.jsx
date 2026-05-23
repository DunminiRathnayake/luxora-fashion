import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="block group cursor-pointer text-black no-underline">

      <div className="overflow-hidden relative aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-750 ease-out"
        />
        
        {/* Heart Wishlist overlay button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm border border-neutral-100 cursor-pointer"
          title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isSaved ? "fill-black text-black" : "text-neutral-500 hover:text-black"
            }`}
          />
        </motion.button>
      </div>

      <div className="mt-4">
        <h2 className="text-sm font-medium tracking-wide uppercase text-neutral-900">
          {product.name}
        </h2>

        <p className="text-neutral-500 text-xs font-medium mt-1">
          {product.price}
        </p>
      </div>

    </Link>
  );
}

export default ProductCard;