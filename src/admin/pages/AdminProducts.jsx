import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, Star, AlertCircle, AlertTriangle, ShieldCheck, X } from "lucide-react";

function AdminProducts() {
  const { products, loading, error, removeProduct } = useAdminProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const navigate = useNavigate();

  // Search logic
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    setDeleteError("");
    
    try {
      await removeProduct(deleteId);
      setDeleteId(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to remove product from catalog.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getProductImage = (p) => {
    const API_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000");
    if (!p.image) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
    if (p.image.startsWith("http")) return p.image;
    return `${API_URL}${p.image}`;
  };

  return (
    <div className="space-y-8">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-neutral-900">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            Store Inventory
          </span>
          <h1 className="text-xl md:text-2xl font-light uppercase tracking-widest text-neutral-100">
            Products Directory
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="flex items-center gap-2.5 px-6 py-3 bg-white text-black hover:bg-neutral-200 transition-colors text-xs uppercase tracking-widest font-semibold cursor-pointer no-underline self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> New Product
        </Link>
      </div>

      {/* Control bar */}
      <div className="flex items-center bg-[#111] border border-neutral-900 px-5 py-3.5 max-w-md rounded-full">
        <Search className="w-4.5 h-4.5 text-neutral-500 mr-2.5" />
        <input
          type="text"
          placeholder="Filter catalog products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm text-white focus:outline-none w-full font-light"
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-[#111] border border-neutral-900 overflow-hidden relative">
        
        {loading && products.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 uppercase tracking-widest text-[10px] animate-pulse">
            Retrieving stock catalog...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-400 uppercase tracking-widest text-[10px] px-6">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
            {error}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-900 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold bg-[#161616]/40">
                  <th className="px-6 py-4.5">Item Piece</th>
                  <th className="px-6 py-4.5">Category</th>
                  <th className="px-6 py-4.5">Price</th>
                  <th className="px-6 py-4.5">Stock Level</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-xs font-light text-neutral-300">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/30 transition-colors group">
                    <td className="px-6 py-4.5 flex items-center gap-3">
                      <div className="w-10 h-12 bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden">
                        <img
                          src={getProductImage(p)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-medium text-neutral-200 group-hover:text-white transition-colors block">
                          {p.name}
                        </span>
                        <span className="text-[9px] text-neutral-500 uppercase font-mono block mt-0.5">
                          ID: {p.id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-neutral-400">{p.category}</td>
                    <td className="px-6 py-4.5 text-neutral-300 font-medium">{p.price}</td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold rounded-full border ${
                          (p.stock !== undefined ? p.stock : 10) <= 10
                            ? "bg-red-950/20 text-red-400 border-red-900/30"
                            : "bg-neutral-800/40 text-neutral-400 border-neutral-800"
                        }`}
                      >
                        {p.stock !== undefined ? `${p.stock} units` : "10 units"}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold text-neutral-200 bg-neutral-850 px-2.5 py-1 rounded-full border border-neutral-700">
                          <Star className="w-3 h-3 fill-current text-neutral-300" /> Featured
                        </span>
                      ) : (
                        <span className="text-[9px] uppercase tracking-wider font-light text-neutral-600 block pl-2">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                          className="p-2.5 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded transition-all cursor-pointer inline-flex"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-all cursor-pointer inline-flex"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-2">
              Catalog Empty
            </span>
            <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto">
              No products found matching your active filter.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal Overlay */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Dark background glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[420px] bg-[#121212] border border-neutral-900 p-8 shadow-2xl z-10 rounded-sm"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-red-900/50 bg-red-950/25 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-sm font-medium uppercase tracking-widest text-neutral-100 mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed mb-6">
                  Are you sure you want to permanently remove this piece? This action will update the visitor store immediately and cannot be undone.
                </p>

                {deleteError && (
                  <div className="bg-red-950/20 border border-red-900/50 text-red-400 text-[10px] uppercase tracking-wider py-2.5 mb-4 rounded-sm">
                    {deleteError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    disabled={isDeleting}
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-3 border border-neutral-850 hover:border-white text-neutral-400 hover:text-white text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-sm disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="flex-1 py-3 bg-red-650 hover:bg-red-750 text-white text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-sm flex items-center justify-center gap-2 disabled:bg-neutral-800 disabled:text-neutral-500"
                  >
                    {isDeleting ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="animate-spin h-3.5 w-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Removing
                      </span>
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminProducts;
