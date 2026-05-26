import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Heart, ChevronDown, Star, MessageSquare, Upload, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCartDrawer } from "../context/CartDrawerContext";

// Local lookups for curated multi-angle galleries & swatches to establish real brand layouts
const PRODUCT_GALLERIES = {
  "66504bc0f252cfb159f80c01": [ // Midnight Satin Dress
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
  ],
  "66504bc0f252cfb159f80c02": [ // Elegant White Top
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
  ],
  "66504bc0f252cfb159f80c03": [ // Classic Black Blazer
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
  ],
  "66504bc0f252cfb159f80c04": [ // Emerald Velvet Gown
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
  ],
  "66504bc0f252cfb159f80c05": [ // Chiffon Maxi Dress
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
  ],
  "66504bc0f252cfb159f80c06": [ // Oversized Linen Shirt
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
  ],
  "66504bc0f252cfb159f80c07": [ // Camel Tailored Blazer
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
  ],
  "66504bc0f252cfb159f80c08": [ // Sequined Silk Top
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
  ]
};

const PRODUCT_COLORS = {
  "66504bc0f252cfb159f80c01": [
    { name: "Midnight Black", hex: "#0c0c0c" },
    { name: "Emerald Green", hex: "#0b3c2e" },
    { name: "Classic Navy", hex: "#152238" }
  ],
  "66504bc0f252cfb159f80c02": [
    { name: "Pristine White", hex: "#f8f9fa" },
    { name: "Soft Ivory", hex: "#f7f1e5" }
  ],
  "66504bc0f252cfb159f80c03": [
    { name: "Ink Black", hex: "#1a1a1a" },
    { name: "Camel Beige", hex: "#c19a6b" }
  ],
  "66504bc0f252cfb159f80c04": [
    { name: "Emerald Green", hex: "#0b3c2e" },
    { name: "Crimson Wine", hex: "#58181f" }
  ],
  "66504bc0f252cfb159f80c05": [
    { name: "Floral Cream", hex: "#faf5ec" },
    { name: "Dusk Pink", hex: "#dcb4b4" }
  ],
  "66504bc0f252cfb159f80c06": [
    { name: "Flax Linen", hex: "#dfd2c0" },
    { name: "Light Indigo", hex: "#a4b3c6" },
    { name: "Optical White", hex: "#ffffff" }
  ],
  "66504bc0f252cfb159f80c07": [
    { name: "Camel Beige", hex: "#c19a6b" },
    { name: "Classic Onyx", hex: "#111111" }
  ],
  "66504bc0f252cfb159f80c08": [
    { name: "Champagne Gold", hex: "#e5d3b3" },
    { name: "Sterling Silver", hex: "#d8d8d8" }
  ]
};

const SIZE_MAPPING = [
  { dbValue: "XS", label: "UK 8" },
  { dbValue: "S", label: "UK 10" },
  { dbValue: "M", label: "UK 12" },
  { dbValue: "L", label: "UK 14" },
  { dbValue: "XL", label: "UK 16" }
];

const getProductImages = (product) => {
  if (product && PRODUCT_GALLERIES[product.id]) {
    return PRODUCT_GALLERIES[product.id];
  }
  if (product && product.images && product.images.length > 1) {
    return product.images;
  }
  const mainImg = product?.image || (product?.images && product.images[0]) || "";
  return mainImg ? [mainImg] : [];
};

function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white pb-24 pt-8 md:pt-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="h-4 bg-neutral-100 rounded w-1/4 mb-8 md:mb-12"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 flex gap-4">
            <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-24 bg-neutral-100 rounded-sm"></div>
              ))}
            </div>
            <div className="bg-neutral-100 aspect-[3/4] flex-grow rounded-sm"></div>
          </div>
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="h-3 bg-neutral-100 rounded w-1/6"></div>
            <div className="h-8 bg-neutral-100 rounded w-3/4"></div>
            <div className="h-6 bg-neutral-100 rounded w-1/4"></div>
            <div className="h-12 bg-neutral-100 rounded w-full"></div>
            <div className="h-24 bg-neutral-100 rounded w-full"></div>
            <div className="h-10 bg-neutral-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { products: allProducts, loading: allLoading } = useProducts();
  const { addToCart } = useCart();
  const { triggerCartAddFeedback } = useCartDrawer();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);

  // Customer Reviews state (Frontend only)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Sajini Perera",
      rating: 5,
      comment: "Absolutely stunning piece. The drape of the fabric is incredible and it fits like a glove. Will definitely purchase from Luxora again!",
      date: "May 15, 2026",
      image: null
    },
    {
      id: 2,
      name: "Hiruni de Silva",
      rating: 4,
      comment: "Beautiful tailoring. Very luxurious fabric. Sizing corresponds accurately to the size chart.",
      date: "May 3, 2026",
      image: null
    }
  ]);
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewPhone, setReviewPhone] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const isSaved = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize("");
    setQuantity(1);
    setIsAdded(false);
    setSizeError(false);
    setOpenAccordion(0);
    setFormSuccess(false);
    setFormErrors({});
  }, [id]);

  useEffect(() => {
    if (product) {
      const imgs = getProductImages(product);
      if (imgs.length > 0) {
        setActiveImage(imgs[0]);
      }
      const cols = PRODUCT_COLORS[product.id] || [{ name: "Signature Ivory" }];
      setSelectedColor(cols[0].name);
    }
  }, [product]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-4 text-black">
          Connection Error
        </h2>
        <p className="text-gray-500 font-light text-sm max-w-sm mb-8">
          We are currently experiencing connection difficulties. Please check your server or try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block bg-black text-white text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors duration-300 font-medium cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-4 text-black">
          Piece Not Found
        </h2>
        <p className="text-gray-500 font-light text-sm max-w-sm mb-8">
          The exclusive item you are seeking is either unavailable or has sold out.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-black text-white text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors duration-300 font-medium no-underline"
        >
          Return To Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = allProducts
    ? allProducts.filter((p) => p.id !== product.id).slice(0, 3)
    : [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    triggerCartAddFeedback({
      name: product.name,
      size: selectedSize,
      image: product.image
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const selectSize = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const productImages = getProductImages(product);

  const getNumericPrice = (priceVal) => {
    if (typeof priceVal === "number") return priceVal;
    if (!priceVal) return 0;
    return parseInt(priceVal.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const getInstallmentAmount = (priceVal) => {
    const numPrice = getNumericPrice(priceVal);
    const installment = Math.ceil(numPrice / 3);
    return `Rs. ${installment.toLocaleString("en-IN")}`;
  };

  const sku = product._id
    ? `LX-${product._id.substring(18).toUpperCase()}-${product.category[0].toUpperCase()}`
    : `LX-MOCK-${product.id}`;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleWhatsAppInquiry = () => {
    const activeUKSizeLabel = SIZE_MAPPING.find((sm) => sm.dbValue === selectedSize)?.label || "Not selected";
    const message = encodeURIComponent(
      `Hello Luxora, I'm interested in inquiring about the "${product.name}" (${product.category}) priced at ${product.price}.
Color: ${selectedColor}
Size: ${activeUKSizeLabel}
Product Code: ${sku}`
    );
    window.open(`https://wa.me/94770000000?text=${message}`, "_blank");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewImage(file);
      setReviewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!reviewName.trim()) errors.name = "Name is required";
    if (!reviewEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewEmail)) {
      errors.email = "Invalid email format";
    }
    if (!reviewComment.trim()) errors.comment = "Review description is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      image: reviewImagePreview
    };

    setReviews([newReview, ...reviews]);
    setFormSuccess(true);

    setReviewName("");
    setReviewEmail("");
    setReviewPhone("");
    setReviewRating(5);
    setReviewComment("");
    setReviewImage(null);
    setReviewImagePreview(null);
    setFormErrors({});

    setTimeout(() => {
      setFormSuccess(false);
    }, 4000);
  };

  const colors = PRODUCT_COLORS[product.id] || [
    { name: "Signature Ivory", hex: "#fbf9f4" },
    { name: "Midnight Black", hex: "#121212" }
  ];

  const availableSizes = SIZE_MAPPING.filter((sm) =>
    (product.sizes || ["XS", "S", "M", "L", "XL"]).includes(sm.dbValue)
  );

  return (
    <div className="min-h-screen bg-white pb-24 pt-8 md:pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* 1. Breadcrumbs */}
        <div className="text-[10px] tracking-[4px] text-neutral-400 uppercase mb-8 md:mb-12 font-medium">
          <Link to="/" className="hover:text-black transition-colors no-underline">Home</Link>
          <span className="mx-2.5 text-neutral-300">/</span>
          <Link to="/shop" className="hover:text-black transition-colors no-underline">Shop</Link>
          <span className="mx-2.5 text-neutral-300">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-black transition-colors no-underline">
            {product.category}
          </Link>
          <span className="mx-2.5 text-neutral-300">/</span>
          <span className="text-black font-semibold">{product.name}</span>
        </div>

        {/* Product Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* 2. Image Gallery (Left Column) */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              
              {/* Vertical Thumbnails (Desktop) / Horizontal (Mobile) */}
              {productImages.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] scrollbar-none shrink-0 py-1">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-18 md:w-18 md:h-24 border rounded-sm overflow-hidden shrink-0 transition-all ${
                        activeImage === img ? "border-black ring-1 ring-black scale-102" : "border-neutral-200 hover:border-neutral-450"
                      }`}
                    >
                      <img src={img} alt={`view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image View */}
              <div className="flex-grow aspect-[3/4] bg-neutral-50 overflow-hidden relative border border-neutral-100 rounded-sm">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-108"
                  />
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* 3. Details Panel (Right Column) */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Brand and SKU */}
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                LUXORA CURATIONS
              </span>
              <span className="text-[9px] font-mono text-neutral-400 uppercase">
                CODE: {sku}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl lg:text-3xl font-light tracking-widest text-neutral-900 uppercase mb-3">
              {product.name}
            </h1>

            {/* Price & Installments */}
            <div className="mb-4">
              <span className="text-xl text-neutral-800 font-semibold">{product.price}</span>
              
              {/* Installment payment note UI */}
              <div className="mt-2.5 p-3 bg-neutral-50 border border-neutral-150 rounded flex items-center justify-between text-[10px] text-neutral-600 font-light tracking-wide">
                <span className="font-semibold text-black">{getInstallmentAmount(product.price)}</span>
                
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              {isOutOfStock ? (
                <span className="text-[9px] tracking-widest uppercase font-semibold text-red-700 bg-red-950/5 border border-red-900/10 px-3 py-1 rounded-sm inline-block">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="text-[9px] tracking-widest uppercase font-semibold text-amber-700 bg-amber-950/5 border border-amber-900/10 px-3 py-1 rounded-sm inline-block">
                  Low Stock — Only {product.stock} items remaining
                </span>
              ) : (
                <span className="text-[9px] tracking-widest uppercase font-semibold text-green-700 bg-green-950/5 border border-green-900/10 px-3 py-1 rounded-sm inline-block">
                  In Stock — Handcrafted Capsule
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-600 font-light text-xs leading-relaxed mb-8 border-b border-neutral-100 pb-6">
              {product.description || "Tailored impeccably from signature materials, this edit represents luxury minimalism. Form-fitting contouring lines paired with premium detailing deliver an absolute wardrobe favorite for upscale collections."}
            </p>

            {/* Color swatches */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">Color:</span>
                <span className="text-xs text-neutral-850 font-medium">{selectedColor}</span>
              </div>
              <div className="flex gap-3">
                {colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                        isSelected ? "border-black scale-108 ring-1 ring-neutral-350" : "border-neutral-200 hover:border-neutral-450"
                      }`}
                      style={{ padding: "2px" }}
                      title={color.name}
                    >
                      <div
                        className="w-full h-full rounded-full border border-black/5"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizing selectors */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">Size:</span>
                  {selectedSize && (
                    <span className="text-xs text-black font-semibold">
                      {SIZE_MAPPING.find((sm) => sm.dbValue === selectedSize)?.label} ({selectedSize})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((sm) => {
                  const isSelected = selectedSize === sm.dbValue;
                  return (
                    <button
                      key={sm.dbValue}
                      onClick={() => selectSize(sm.dbValue)}
                      className={`px-3 py-2 border rounded-sm transition-all duration-300 flex flex-col items-center justify-center min-w-16 cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-black"
                          : "bg-transparent text-neutral-600 border-neutral-200 hover:text-black hover:border-black"
                      }`}
                    >
                      <span className="text-xs font-semibold">{sm.label}</span>
                      <span className={`text-[8px] uppercase tracking-wider mt-0.5 ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>
                        ({sm.dbValue})
                      </span>
                    </button>
                  );
                })}
              </div>
              {sizeError && (
                <span className="text-[10px] text-red-500 font-light mt-2 block">
                  Please select a size to proceed with adding to bag.
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-8 border-b border-neutral-100 pb-6">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-3">
                Quantity
              </span>
              <div className="flex items-center border border-neutral-250 rounded-full w-28 justify-between py-0.5 px-0.5 bg-neutral-50 shadow-inner">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className={`w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer ${
                    quantity <= 1 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <Minus className="w-3 h-3 text-neutral-600" />
                </button>
                <span className="text-xs font-semibold text-neutral-850 w-7 text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Actions CTAs */}
            <div className="flex flex-col gap-3">
              
              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-widest font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="block text-center font-bold text-green-600"
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

              {/* Confirm via WhatsApp CTA */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-4 bg-transparent text-neutral-800 text-[10px] uppercase tracking-widest font-semibold border border-neutral-200 hover:border-black transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current text-neutral-700"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Confirm via WhatsApp
              </button>

              {/* Save to Wishlist CTA */}
              <button
                onClick={() => toggleWishlist(product)}
                className="w-full py-4 bg-transparent text-neutral-800 text-[10px] uppercase tracking-widest font-semibold border border-neutral-200 hover:border-black transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    isSaved ? "fill-black text-black" : "text-neutral-700"
                  }`}
                />
                {isSaved ? "Saved In Wishlist" : "Save To Wishlist"}
              </button>

            </div>

            {/* 6. Accordions (Product Info, Size Guide table, Delivery) */}
            <div className="mt-8 border-t border-neutral-150">
              {[
                {
                  title: "Product Information",
                  content: (
                    <div className="space-y-2.5 text-xs text-neutral-600 font-light leading-relaxed">
                      <p>
                        <strong className="font-semibold text-neutral-800 uppercase tracking-wider text-[9px] block mb-0.5">Composition & Fit</strong>
                        Exquisitely crafted from a premium {product.category === "Dresses" || product.category === "Evening Wear" ? "silk-satin material blend" : "luxury natural cotton flax weave"}, featuring a structured profile that offers an elegant drape and comfortable contour.
                      </p>
                      <p>
                        <strong className="font-semibold text-neutral-800 uppercase tracking-wider text-[9px] block mb-0.5">Care Guidelines</strong>
                        Dry clean recommended to preserve sheen and fabric weave structure. Alternatively, hand wash cold and steam iron gently.
                      </p>
                    </div>
                  )
                },
                {
                  title: "Size Guide",
                  content: (
                    <div className="overflow-x-auto py-1">
                      <table className="w-full text-left text-xs font-light text-neutral-600 border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-800 font-semibold text-[10px] uppercase tracking-wider">
                            <th className="py-2 pr-3">Size</th>
                            <th className="py-2 px-3">Bust (in)</th>
                            <th className="py-2 px-3">Waist (in)</th>
                            <th className="py-2 px-3">Hips (in)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-neutral-100">
                            <td className="py-2 pr-3 font-semibold text-black">UK 8 / XS</td>
                            <td className="py-2 px-3">32"</td>
                            <td className="py-2 px-3">25"</td>
                            <td className="py-2 px-3">35"</td>
                          </tr>
                          <tr className="border-b border-neutral-100">
                            <td className="py-2 pr-3 font-semibold text-black">UK 10 / S</td>
                            <td className="py-2 px-3">34"</td>
                            <td className="py-2 px-3">27"</td>
                            <td className="py-2 px-3">37"</td>
                          </tr>
                          <tr className="border-b border-neutral-100">
                            <td className="py-2 pr-3 font-semibold text-black">UK 12 / M</td>
                            <td className="py-2 px-3">36"</td>
                            <td className="py-2 px-3">29"</td>
                            <td className="py-2 px-3">39"</td>
                          </tr>
                          <tr className="border-b border-neutral-100">
                            <td className="py-2 pr-3 font-semibold text-black">UK 14 / L</td>
                            <td className="py-2 px-3">38"</td>
                            <td className="py-2 px-3">31"</td>
                            <td className="py-2 px-3">41"</td>
                          </tr>
                          <tr className="border-b border-neutral-100">
                            <td className="py-2 pr-3 font-semibold text-black">UK 16 / XL</td>
                            <td className="py-2 px-3">40"</td>
                            <td className="py-2 px-3">33"</td>
                            <td className="py-2 px-3">43"</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                },
                {
                  title: "Delivery & Returns",
                  content: (
                    <div className="space-y-2.5 text-xs text-neutral-600 font-light leading-relaxed">
                      <p>
                        <strong className="font-semibold text-neutral-800 uppercase tracking-wider text-[9px] block mb-0.5">Shipping Timelines</strong>
                        Colombo and suburban locales: 1-2 business days. Outstation island-wide delivery: 3-5 business days. Cash on delivery options available at checkout.
                      </p>
                      <p>
                        <strong className="font-semibold text-neutral-800 uppercase tracking-wider text-[9px] block mb-0.5">Returns & Exchanges</strong>
                        Exchanges are accepted within 7 days of package delivery in unworn, tag-secured condition. Courier fees apply for replacement processing.
                      </p>
                    </div>
                  )
                }
              ].map((acc, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div key={idx} className="border-b border-neutral-150 py-3.5">
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-xs uppercase tracking-widest text-neutral-800 hover:text-black font-semibold text-left focus:outline-none cursor-pointer"
                    >
                      <span>{acc.title}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          {acc.content}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* 7. Guest Reviews Section */}
        <div className="mt-20 pt-16 border-t border-neutral-150">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Reviews List */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-8 border-b pb-4 border-neutral-150">
                <div>
                  <h2 className="text-lg font-light tracking-widest uppercase text-black">Guest Reviews</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-black text-black" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500 font-light">({reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((rev) => (
                    <motion.div
                      key={rev.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-50 p-6 border border-neutral-150 rounded"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">{rev.name}</h4>
                          <span className="text-[9px] text-neutral-400 font-light block mt-0.5">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= rev.rating ? "fill-black text-black" : "text-neutral-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed">{rev.comment}</p>
                      
                      {rev.image && (
                        <div className="mt-4 w-20 h-24 border border-neutral-200 overflow-hidden bg-white">
                          <img src={rev.image} alt="Review upload" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-neutral-200 rounded">
                  <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                  <p className="text-xs text-neutral-500 font-light">No reviews posted yet. Be the first to share your thoughts.</p>
                </div>
              )}
            </div>

            {/* Leave Review Form */}
            <div className="lg:col-span-5 bg-neutral-50 p-6 border border-neutral-150 rounded">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-black mb-4">Share Your Experience</h3>
              
              <AnimatePresence>
                {formSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-50 border border-green-150 text-green-700 text-xs font-light rounded"
                  >
                    Thank you! Your feedback has been listed below.
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none cursor-pointer hover:scale-105 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? "fill-black text-black" : "text-neutral-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="rev-name" className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Full Name
                  </label>
                  <input
                    id="rev-name"
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border outline-none text-xs font-light transition-all rounded-sm ${
                      formErrors.name ? "border-red-400" : "border-neutral-250 focus:border-black"
                    }`}
                    placeholder="Enter your name"
                  />
                  {formErrors.name && (
                    <span className="text-[9px] text-red-500 font-light mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="rev-email" className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Email Address
                  </label>
                  <input
                    id="rev-email"
                    type="email"
                    value={reviewEmail}
                    onChange={(e) => setReviewEmail(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border outline-none text-xs font-light transition-all rounded-sm ${
                      formErrors.email ? "border-red-400" : "border-neutral-250 focus:border-black"
                    }`}
                    placeholder="name@domain.com"
                  />
                  {formErrors.email && (
                    <span className="text-[9px] text-red-500 font-light mt-1 block">{formErrors.email}</span>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="rev-phone" className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    id="rev-phone"
                    type="tel"
                    value={reviewPhone}
                    onChange={(e) => setReviewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-250 focus:border-black outline-none text-xs font-light transition-all rounded-sm"
                    placeholder="+94 77 123 4567"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="rev-comment" className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Review Description
                  </label>
                  <textarea
                    id="rev-comment"
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className={`w-full px-3 py-2 bg-white border outline-none text-xs font-light transition-all resize-none rounded-sm ${
                      formErrors.comment ? "border-red-400" : "border-neutral-250 focus:border-black"
                    }`}
                    placeholder="Write details of your experience..."
                  />
                  {formErrors.comment && (
                    <span className="text-[9px] text-red-500 font-light mt-1 block">{formErrors.comment}</span>
                  )}
                </div>

                {/* Optional Image upload UI */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
                    Upload Photo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 border border-neutral-200 hover:border-black bg-white text-xs font-medium uppercase tracking-wider rounded cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Select File</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {reviewImagePreview && (
                      <div className="w-12 h-16 border border-neutral-200 overflow-hidden relative rounded-sm bg-white">
                        <img src={reviewImagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setReviewImage(null);
                            setReviewImagePreview(null);
                          }}
                          className="absolute top-0.5 right-0.5 bg-black/80 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[7px]"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-widest font-semibold border border-black hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-sm rounded-sm"
                >
                  Submit Review
                </button>

              </form>
            </div>

          </div>
        </div>

        {/* 8. You May Also Like Section */}
        {allLoading ? (
          <div className="mt-24 pt-16 border-t border-neutral-150">
            <h2 className="text-lg font-light tracking-widest text-center uppercase mb-12">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="mt-24 pt-16 border-t border-neutral-150">
            <h2 className="text-lg font-light tracking-widest text-center uppercase mb-12">
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
        ) : null}

      </div>
    </div>
  );
}

export default ProductDetails;