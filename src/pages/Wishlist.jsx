import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, Eye, Heart, ArrowRight } from "lucide-react";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    // Pushes item to cart with default size "S" and quantity 1
    addToCart(product, "S", 1);
    // Removes the item from wishlist
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-white pb-24 pt-8 md:pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-12 border-b pb-6 border-neutral-100 flex items-center gap-3">
          <Heart className="w-6 h-6 text-black fill-black/10" />
          Saved Favorites
        </h1>

        <AnimatePresence mode="wait">
          {wishlistItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-20 text-center max-w-md mx-auto"
            >
              <div className="w-16 h-16 border border-dashed border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-5 h-5 text-neutral-400" />
              </div>
              <h2 className="text-xl font-light tracking-widest uppercase mb-3">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-500 font-light text-sm leading-relaxed mb-8">
                Your curated favorites will appear here. Explore the shop to save timeless statement pieces.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-black text-white text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-white hover:text-black border border-black transition-all duration-300 font-medium cursor-pointer"
              >
                Explore Collection
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="wishlist-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12"
            >
              <AnimatePresence mode="popLayout">
                {wishlistItems.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group border border-neutral-100 p-4 rounded-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative bg-white"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="overflow-hidden relative aspect-[3/4] bg-neutral-50 mb-4 rounded-sm">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s]"
                        />
                        {/* Remove absolute button */}
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm cursor-pointer z-10"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                        {product.category}
                      </span>
                      <h2 className="text-sm font-medium text-neutral-900 uppercase tracking-wide mt-1 truncate">
                        {product.name}
                      </h2>
                      <p className="text-xs text-neutral-600 font-medium mt-1">
                        {product.price}
                      </p>
                    </div>

                    {/* Action Panel */}
                    <div className="mt-6 space-y-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="w-full py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Move To Bag
                      </button>

                      <Link
                        to={`/product/${product.id}`}
                        className="w-full py-2.5 bg-transparent text-neutral-800 text-[10px] uppercase tracking-widest font-semibold border border-neutral-200 hover:border-black transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer no-underline"
                      >
                        <Eye className="w-3 h-3" />
                        View Piece
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default Wishlist;
