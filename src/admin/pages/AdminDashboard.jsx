import { useProducts } from "../../hooks/useProducts";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Star,
  AlertCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";

function AdminDashboard() {
  const { products, loading, error } = useProducts();

  // Compute product stats dynamically from the actual fetched backend products!
  const totalProducts = products.length;
  const featuredProducts = products.filter((p) => p.featured).length;
  
  // We check for stock threshold of <= 10
  const lowStockProducts = products.filter((p) => (p.stock !== undefined ? p.stock <= 10 : true)).length;

  // Mock static stats for orders & revenue
  const totalOrders = 142;
  const totalRevenue = "Rs. 1,284,500";

  // Mock Chart Data for Luxury SVG visualization
  const salesHistory = [
    { month: "Jan", sales: 180000 },
    { month: "Feb", sales: 240000 },
    { month: "Mar", sales: 320000 },
    { month: "Apr", sales: 280000 },
    { month: "May", sales: 420000 },
    { month: "Jun", sales: 510000 },
    { month: "Jul", sales: 620000 },
  ];

  // Map values to 0-100 coordinates for SVG drawing
  const maxSales = Math.max(...salesHistory.map((s) => s.sales));
  const minSales = Math.min(...salesHistory.map((s) => s.sales));
  const range = maxSales - minSales;

  const points = salesHistory
    .map((s, index) => {
      const x = (index / (salesHistory.length - 1)) * 500; // SVG Width: 500
      const y = 200 - ((s.sales - minSales) / range) * 150; // SVG Height: 200, padding 50
      return `${x},${y}`;
    })
    .join(" ");

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  const recentOrders = [
    { id: "LX-9082", customer: "Sophia Sterling", items: "Midnight Satin Dress (S)", status: "Completed", amount: "Rs. 8,500" },
    { id: "LX-9081", customer: "Julian Mercer", items: "Classic Black Blazer (M)", status: "In Route", amount: "Rs. 12,000" },
    { id: "LX-9080", customer: "Clara Hawthorne", items: "Elegant White Top (XS) x2", status: "Processing", amount: "Rs. 8,400" },
    { id: "LX-9079", customer: "Oliver Vance", items: "Chiffon Maxi Dress (L)", status: "Completed", amount: "Rs. 9,800" },
  ];

  return (
    <div className="space-y-10">
      
      {/* Dashboard Headline & Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            System Overview
          </span>
          <h1 className="text-2xl md:text-3xl font-light uppercase tracking-widest text-neutral-100">
            Curator Dashboard
          </h1>
        </div>
        
        {/* Status refresh indicators */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-800 bg-[#111] hover:border-white transition-all text-xs uppercase tracking-wider font-light cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-neutral-400" />
            Refresh Feed
          </button>
        </div>
      </div>

      {/* Stats Summary Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        
        {/* Total Products */}
        <motion.div
          variants={cardVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#111] border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Total Catalog
            </span>
            <ShoppingBag className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-3xl font-light tracking-tight mb-1 text-white">
              {loading ? "..." : totalProducts}
            </h3>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light">
              Active Store SKU count
            </p>
          </div>
        </motion.div>

        {/* Featured Products */}
        <motion.div
          variants={cardVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#111] border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Featured Pieces
            </span>
            <Star className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-3xl font-light tracking-tight mb-1 text-white">
              {loading ? "..." : featuredProducts}
            </h3>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light">
              High-visibility listings
            </p>
          </div>
        </motion.div>

        {/* Low Stock Products */}
        <motion.div
          variants={cardVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#111] border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Restock Alerts
            </span>
            <AlertCircle className="w-4 h-4 text-red-500/80 group-hover:text-red-400 transition-colors" />
          </div>
          <div>
            <h3 className={`text-3xl font-light tracking-tight mb-1 ${lowStockProducts > 0 ? "text-red-400" : "text-white"}`}>
              {loading ? "..." : lowStockProducts}
            </h3>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light">
              SKUs with stock &le; 10
            </p>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          variants={cardVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#111] border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Total Orders
            </span>
            <CreditCard className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-3xl font-light tracking-tight mb-1 text-white">
              {totalOrders}
            </h3>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light">
              Inquiries + purchases
            </p>
          </div>
        </motion.div>

        {/* Revenue */}
        <motion.div
          variants={cardVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#111] border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Revenue Yield
            </span>
            <DollarSign className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-2xl font-light tracking-tight mb-2 text-white">
              {totalRevenue}
            </h3>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light">
              Store billing metrics
            </p>
          </div>
        </motion.div>

      </motion.div>

      {/* Main Section split: Sales curve & Recent activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Sales Line Chart (Luxury SVG Style) */}
        <div className="lg:col-span-2 bg-[#111] border border-neutral-900 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[9px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
                Trend analysis
              </span>
              <h2 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                Revenue Growth Curve
              </h2>
            </div>
            <div className="flex items-center gap-2 text-green-500 text-xs font-light">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this quarter</span>
            </div>
          </div>

          {/* SVG Custom Line Draw */}
          <div className="relative w-full h-[220px] bg-[#0C0C0C] border border-neutral-900 rounded-sm overflow-hidden flex items-end">
            <svg
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
              className="w-full h-full absolute inset-0"
            >
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#1c1c1c" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1c1c1c" strokeWidth="0.5" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#1c1c1c" strokeWidth="0.5" />
              
              {/* Fill Area Under the Curve */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0,200 L ${points} L 500,200 Z`}
                fill="url(#chartGradient)"
              />

              {/* Glowing Line */}
              <path
                d={`M ${points}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Data Node Dots */}
              {salesHistory.map((s, index) => {
                const x = (index / (salesHistory.length - 1)) * 500;
                const y = 200 - ((s.sales - minSales) / range) * 150;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3.5"
                    className="fill-[#111] stroke-white stroke-2 hover:r-5 transition-all cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>

          {/* Month markers */}
          <div className="flex justify-between items-center mt-4 px-2 text-[10px] text-neutral-500 uppercase tracking-widest">
            {salesHistory.map((s) => (
              <span key={s.month}>{s.month}</span>
            ))}
          </div>
        </div>

        {/* Right Side: Recent Activity Feed */}
        <div className="bg-[#111] border border-neutral-900 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[9px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
                  Activity Feed
                </span>
                <h2 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                  Recent Inquiries
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-[#0A0A0A] border border-neutral-900 hover:border-neutral-800 transition-colors flex justify-between items-start rounded-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 border border-neutral-800 rounded">
                        {order.id}
                      </span>
                      <span className="text-xs text-neutral-200 font-medium">
                        {order.customer}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-light truncate max-w-[150px] sm:max-w-xs">
                      {order.items}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs text-neutral-300 font-medium block">
                      {order.amount}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-light block">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-900">
            <button
              onClick={() => window.alert("Order details interface under development.")}
              className="w-full py-3 bg-[#181818] text-neutral-300 text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors text-center block font-medium cursor-pointer"
            >
              Monitor All Bookings
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
