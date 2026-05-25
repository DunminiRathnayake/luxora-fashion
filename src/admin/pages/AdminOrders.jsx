import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { formatPrice } from "../../context/CartContext";
import { Search, Eye, Trash2, ExternalLink, Calendar, Mail, Phone, MapPin, AlertCircle, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AdminOrders() {
  const { orders, loading, error, updateStatus, removeOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Status update states
  const [updatingId, setUpdatingId] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [actionError, setActionError] = useState("");

  const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setErrorId(null);
    setActionError("");

    try {
      await updateStatus(id, newStatus);
    } catch (err) {
      setErrorId(id);
      setActionError(err.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to permanently delete this order inquiry?");
    if (!confirm) return;

    try {
      await removeOrder(id);
    } catch (err) {
      alert(err.message || "Failed to delete order.");
    }
  };

  // Filtration logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o._id || o.id).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || o.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-6 border-b border-neutral-900">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            Sales Monitor
          </span>
          <h1 className="text-xl md:text-2xl font-light uppercase tracking-widest text-neutral-100">
            Order Inquiries
          </h1>
        </div>
      </div>

      {/* Filter and Control Bars */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex items-center bg-[#111] border border-neutral-900 px-4 py-3 w-full md:w-80 rounded-full">
          <Search className="w-4 h-4 text-neutral-500 mr-2.5" />
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none w-full font-light"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {["All", ...statuses].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-[10px] uppercase tracking-wider font-medium transition-all duration-300 border rounded-full cursor-pointer ${
                  isActive
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-neutral-500 border-neutral-900 hover:text-white hover:border-neutral-700"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

      </div>

      {/* Orders Directory Table */}
      <div className="bg-[#111] border border-neutral-900 overflow-hidden relative">
        {loading && orders.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 uppercase tracking-widest text-[10px] animate-pulse">
            Retrieving orders log...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-400 uppercase tracking-widest text-[10px] px-6">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
            {error}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-900 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold bg-[#161616]/40">
                  <th className="px-6 py-4.5">Order Info</th>
                  <th className="px-6 py-4.5">Client Details</th>
                  <th className="px-6 py-4.5">Products Summary</th>
                  <th className="px-6 py-4.5">Bill</th>
                  <th className="px-6 py-4.5">Fulfillment Status</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-xs font-light text-neutral-300">
                {filteredOrders.map((o) => {
                  const formattedDate = new Date(o.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  const isUpdating = updatingId === (o._id || o.id);
                  const isError = errorId === (o._id || o.id);

                  return (
                    <tr key={o._id || o.id} className="hover:bg-neutral-900/30 transition-colors group">
                      
                      {/* ID and Date */}
                      <td className="px-6 py-4.5">
                        <div className="font-mono text-neutral-200 font-medium">{(o._id || o.id).substring(0, 8)}...</div>
                        <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="px-6 py-4.5">
                        <div className="font-medium text-neutral-200">{o.customerName}</div>
                        <div className="text-[10px] text-neutral-500 flex flex-col gap-0.5 mt-1 font-light">
                          <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" /> {o.customerEmail}</span>
                          <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" /> {o.customerPhone}</span>
                        </div>
                      </td>

                      {/* Items summaries */}
                      <td className="px-6 py-4.5 text-neutral-400">
                        <div className="max-w-[200px] space-y-1">
                          {o.orderItems.map((item, idx) => (
                            <div key={idx} className="truncate" title={`${item.name} (Size: ${item.size}, Qty: ${item.quantity})`}>
                              <span className="text-neutral-300 font-semibold">{item.quantity}x</span> {item.name} <span className="text-neutral-500 font-mono font-medium uppercase text-[9px] bg-neutral-900 border border-neutral-850 px-1 py-0.5 rounded">{item.size}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total bill */}
                      <td className="px-6 py-4.5">
                        <span className="text-neutral-200 font-semibold">{formatPrice(o.totalAmount)}</span>
                      </td>

                      {/* Status Dropdowns updates */}
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col gap-1.5">
                          <select
                            disabled={isUpdating}
                            value={o.orderStatus}
                            onChange={(e) => handleStatusChange(o._id || o.id, e.target.value)}
                            className="bg-[#181818] border border-neutral-800 text-[10px] uppercase tracking-wider font-semibold text-white px-2 py-1.5 focus:outline-none focus:border-white transition-colors cursor-pointer rounded-sm"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status} className="bg-[#111] text-white">
                                {status}
                              </option>
                            ))}
                          </select>
                          
                          {isError && (
                            <span className="text-[9px] text-red-400 block max-w-[120px] leading-tight">
                              {actionError}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex justify-end gap-2">
                          {/* WhatsApp Chat link */}
                          <button
                            onClick={() => window.open(`https://wa.me/${o.customerPhone.replace(/[^0-9]/g, "")}`, "_blank")}
                            title="Chat on WhatsApp"
                            className="p-2.5 text-neutral-500 hover:text-green-400 hover:bg-green-950/20 rounded transition-all cursor-pointer inline-flex border border-transparent"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          
                          {/* Delete order */}
                          <button
                            onClick={() => handleDelete(o._id || o.id)}
                            title="Delete Inquiry"
                            className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-all cursor-pointer inline-flex border border-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-2">
              No orders
            </span>
            <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto">
              No orders matched your active criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
