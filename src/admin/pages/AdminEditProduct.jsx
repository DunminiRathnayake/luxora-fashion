import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { useProduct } from "../../hooks/useProduct";
import { uploadImage } from "../services/adminProductService";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Check, AlertCircle, RefreshCw } from "lucide-react";

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editProduct } = useAdminProducts();
  const { product, loading: fetchLoading, error: fetchError } = useProduct(id);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState([]);
  const [featured, setFeatured] = useState(false);
  
  // Image Upload States
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  // Submission & Form Errors
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const availableSizes = ["XS", "S", "M", "L", "XL"];
  const categories = ["Dresses", "Tops", "Blazers", "Evening Wear"];

  // Populate data when product loads
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategory(product.category || "");
      setDescription(product.description || "");
      
      // If price is stored as "Rs. 8,500" string, extract the number
      const numericPrice = typeof product.price === "string"
        ? parseInt(product.price.replace(/[^0-9]/g, ""), 10) || 0
        : product.price || 0;
      setPrice(numericPrice);
      
      setStock(product.stock !== undefined ? product.stock : 10);
      setSizes(product.sizes || ["XS", "S", "M", "L", "XL"]);
      setFeatured(!!product.featured);

      const img = product.image || (product.images && product.images[0]) || "";
      if (img) {
        setUploadedUrl(img);
        const API_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000");
        const fullUrl = img.startsWith("http") ? img : `${API_URL}${img}`;
        setPreviewUrl(fullUrl);
      }
    }
  }, [product]);

  const handleSizeChange = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = async (selectedFile) => {
    const filetypes = /jpe?g|png|webp/i;
    const isImage = filetypes.test(selectedFile.type) || filetypes.test(selectedFile.name);
    
    if (!isImage) {
      setUploadError("Format not supported. Please select JPG, PNG, or WEBP.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setUploadError("");
    setUploadProgress(0);
    setIsUploading(true);

    try {
      const res = await uploadImage(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      setUploadedUrl(res.imageUrl);
    } catch (err) {
      setUploadError(err.message || "Failed to upload image. Please try again.");
      setFile(null);
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl("");
    setUploadedUrl("");
    setUploadProgress(0);
    setUploadError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!name || !category || !description || !price || !stock) {
      setSubmitError("Please fill out all required parameters.");
      return;
    }

    if (!uploadedUrl) {
      setSubmitError("Please select and upload a product image.");
      return;
    }

    if (sizes.length === 0) {
      setSubmitError("Please select at least one available size.");
      return;
    }

    setIsSubmitting(true);

    const productPayload = {
      name,
      category,
      description,
      price: Number(price),
      stock: Number(stock),
      sizes,
      featured,
      image: uploadedUrl,
    };

    try {
      await editProduct(id, productPayload);
      navigate("/admin/products");
    } catch (err) {
      setSubmitError(err.message || "Failed to modify product in database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPreviewImage = () => {
    const API_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000");
    if (!previewUrl) return "";
    if (previewUrl.startsWith("blob:") || previewUrl.startsWith("http")) {
      return previewUrl;
    }
    return `${API_URL}${previewUrl}`;
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header block */}
      <div className="flex items-center gap-4 pb-6 border-b border-neutral-900">
        <Link
          to="/admin/products"
          className="text-neutral-500 hover:text-white p-2 border border-neutral-850 hover:border-neutral-700 bg-[#111] transition-colors rounded cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            Product Modification
          </span>
          <h1 className="text-xl md:text-2xl font-light uppercase tracking-widest text-neutral-100">
            Edit Catalog Piece
          </h1>
        </div>
      </div>

      {fetchLoading ? (
        <div className="py-20 text-center text-neutral-500 uppercase tracking-widest text-[10px] animate-pulse">
          Retrieving product properties...
        </div>
      ) : fetchError ? (
        <div className="bg-red-950/20 border border-red-900/50 p-6 text-center text-red-400 rounded-sm">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
          <p className="text-xs font-light uppercase tracking-wider mb-4">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-800 bg-[#111] hover:border-white transition-all text-xs uppercase tracking-wider font-light mx-auto cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Retry Loading
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column Form inputs */}
          <div className="space-y-6">
            
            {submitError && (
              <div className="bg-red-950/20 border border-red-900/50 p-4 text-red-400 text-xs font-light tracking-wide uppercase rounded-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Silk Evening Dress"
                className="w-full bg-[#111] border border-neutral-850 focus:border-white p-3 text-xs text-white focus:outline-none transition-colors duration-300 font-light rounded-sm"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                  Category *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#111] border border-neutral-850 focus:border-white p-3 text-xs text-white focus:outline-none transition-colors duration-300 font-light rounded-sm cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="8500"
                  className="w-full bg-[#111] border border-neutral-850 focus:border-white p-3 text-xs text-white focus:outline-none transition-colors duration-300 font-light rounded-sm"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                Inventory Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="12"
                className="w-full bg-[#111] border border-neutral-850 focus:border-white p-3 text-xs text-white focus:outline-none transition-colors duration-300 font-light rounded-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                Editorial Description *
              </label>
              <textarea
                required
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tailored from delicate satin silk..."
                className="w-full bg-[#111] border border-neutral-850 focus:border-white p-3 text-xs text-white focus:outline-none transition-colors duration-300 font-light rounded-sm resize-none"
              />
            </div>

            {/* Sizes */}
            <div className="space-y-3.5">
              <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                Available Sizes *
              </label>
              <div className="flex gap-2.5">
                {availableSizes.map((size) => {
                  const isSelected = sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`w-12 h-12 text-xs font-semibold tracking-wider border rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-neutral-500 border-neutral-850 hover:text-white hover:border-white"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-3 bg-[#111] border border-neutral-900 p-4 rounded-sm">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border flex items-center justify-center transition-colors duration-250 ${
                    featured
                      ? "bg-white border-white text-black"
                      : "bg-transparent border-neutral-800"
                  }`}
                >
                  {featured && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-200 block">
                    Promote to Featured
                  </span>
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-light mt-0.5">
                    Display prominently on home catalog grids
                  </span>
                </div>
              </label>
            </div>

          </div>

          {/* Right Column: Upload details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                Product Portrait Asset *
              </label>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border border-dashed rounded-sm aspect-[3/4] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-350 overflow-hidden ${
                  dragActive
                    ? "border-white bg-[#161616]"
                    : previewUrl
                    ? "border-neutral-850 bg-transparent"
                    : "border-neutral-850 bg-[#111] hover:border-neutral-700 hover:bg-[#161616]/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {previewUrl ? (
                  <>
                    <img
                      src={getPreviewImage()}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {isUploading && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex flex-col items-center justify-center p-4">
                        <div className="w-1/2 bg-neutral-900 h-1 rounded-full overflow-hidden mb-2 border border-neutral-800">
                          <div
                            className="bg-white h-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                          Uploading ({uploadProgress}%)
                        </span>
                      </div>
                    )}

                    {!isUploading && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center border border-neutral-800 transition-colors shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full border border-neutral-850 flex items-center justify-center bg-[#181818]/60">
                      <Upload className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-300 font-light">
                        Drag portrait picture here, or <span className="underline text-white font-medium">browse local files</span>
                      </p>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
                        supports JPG, PNG, WEBP — up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-xs text-red-500 font-light mt-2 flex items-center gap-1.5 justify-center">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {uploadError}
                </p>
              )}
            </div>

            {/* Form actions */}
            <div className="flex gap-4 pt-6 md:pt-0">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="flex-1 py-4 border border-neutral-850 hover:border-white text-neutral-400 hover:text-white text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex-1 py-4 bg-white text-black hover:bg-neutral-200 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-sm flex items-center justify-center gap-2 disabled:bg-neutral-800 disabled:text-neutral-500"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin h-3.5 w-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

          </div>
        </form>
      )}

    </div>
  );
}

export default AdminEditProduct;
