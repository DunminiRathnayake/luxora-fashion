import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize("");
    setQuantity(1);
    setIsAdded(false);
    setSizeError(false);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-4 text-black"
        >
          Piece Not Found
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 font-light text-sm max-w-sm mb-8"
        >
          The exclusive item you are seeking is either unavailable or has sold out.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/shop"
            className="inline-block bg-black text-white text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors duration-300 font-medium"
          >
            Return To Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  // Get 3 related products (excluding current)
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const selectSize = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hello Luxora, I am interested in inquiring about the "${product.name}" (${product.category}) priced at ${product.price}. Size: ${selectedSize || "Not selected"}.`
    );
    window.open(`https://wa.me/94770000000?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white pb-24 pt-8 md:pt-16">
      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Breadcrumbs */}
        <div className="text-xs tracking-widest text-gray-400 uppercase mb-8 md:mb-12">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        {/* Product Workspace Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Image Reveal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="overflow-hidden bg-neutral-50 relative aspect-[3/4]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          {/* Right Column: Info & Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            {/* Category tag */}
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-light tracking-wide text-neutral-900 uppercase mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-xl text-neutral-800 font-medium mb-4">
              {product.price}
            </p>

            {/* Stock Notification */}
            <div className="mb-6">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-full inline-block">
                Exclusive Piece — Limited Quantity Available
              </span>
            </div>

            {/* Editorial Description */}
            <p className="text-gray-600 font-light text-sm leading-relaxed mb-8">
              Exquisitely tailored from premium materials, this piece defines modern luxury. Featuring a structured silhouette and exceptional drape, it offers a sophisticated profile for day-to-night styling. Designed with a focus on meticulous craftsmanship and timeless elegance.
            </p>

            <div className="border-t border-b border-neutral-100 py-6 mb-8">
              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase tracking-widest font-semibold text-neutral-800">
                    Select Size
                  </span>
                  {selectedSize && (
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">
                      Selected: {selectedSize}
                    </span>
                  )}
                </div>
                <div className="flex gap-2.5">
                  {["XS", "S", "M", "L", "XL"].map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => selectSize(size)}
                        className={`w-12 h-12 text-xs font-medium tracking-wider border rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-transparent text-neutral-600 border-neutral-200 hover:text-black hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {sizeError && (
                  <span className="text-xs text-red-500 font-light mt-2 block">
                    Please select a size before adding to your bag.
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-neutral-800 block mb-3">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-200 rounded-full w-32 justify-between py-1 px-1 bg-neutral-50">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer ${
                      quantity <= 1 ? "opacity-35 cursor-not-allowed" : ""
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5 text-neutral-600" />
                  </button>
                  <span className="text-sm font-medium text-neutral-850 w-8 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-neutral-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-3">
              {/* Add to Cart (Black-White inversion hover) */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-medium border border-black hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="block text-center font-semibold text-green-600"
                    >
                      Added To Bag
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="block"
                    >
                      Add To Bag
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* WhatsApp Inquiry */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-4 bg-transparent text-neutral-800 text-xs uppercase tracking-widest font-medium border border-neutral-200 hover:border-black transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {/* Custom SVG WhatsApp icon for premium look */}
                <svg
                  className="w-4 h-4 fill-current text-neutral-700"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Ask on WhatsApp
              </button>
            </div>
          </motion.div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-neutral-100">
            <h2 className="text-xl md:text-2xl font-light tracking-widest text-center uppercase mb-12">
              You May Also Like
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {relatedProducts.map((p) => (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetails;