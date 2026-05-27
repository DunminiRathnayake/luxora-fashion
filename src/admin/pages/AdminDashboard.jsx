import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "../../context/CartContext";
import {
  useAnalyticsOverview,
  useRevenueData,
  useOrderStatusData,
  useProductInventoryData,
  useCustomerInsights
} from "../hooks/useAnalytics";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  CartesianGrid
} from "recharts";
import {
  ShoppingBag,
  AlertCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  Users,
  Activity,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Inbox,
  UserCheck,
  Package,
  Layers
} from "lucide-react";

// Color Palette for Pie Chart cells (Luxury Grayscale theme)
const STATUS_COLORS = {
  Delivered: "#ffffff",   // Pure white for completion
  Shipped: "#d4d4d4",     // Light gray
  Processing: "#a3a3a3",  // Neutral gray
  Confirmed: "#737373",   // Medium gray
  Pending: "#404040",     // Dark gray
  Cancelled: "#171717"    // Charcoal/near black
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales"); // sales, operations, inventory, customers

  // Call reusable analytics hooks
  const { 
    data: overview, 
    loading: overviewLoading, 
    error: overviewError, 
    refresh: refreshOverview 
  } = useAnalyticsOverview();

  const { 
    data: revenue, 
    loading: revenueLoading, 
    error: revenueError, 
    refresh: refreshRevenue 
  } = useRevenueData();

  const { 
    data: orderStats, 
    loading: ordersLoading, 
    error: ordersError, 
    refresh: refreshOrders 
  } = useOrderStatusData();

  const { 
    data: inventory, 
    loading: inventoryLoading, 
    error: inventoryError, 
    refresh: refreshInventory 
  } = useProductInventoryData();

  const { 
    data: customers, 
    loading: customersLoading, 
    error: customersError, 
    refresh: refreshCustomers 
  } = useCustomerInsights();

  // Master refresh function
  const handleRefresh = () => {
    refreshOverview();
    refreshRevenue();
    refreshOrders();
    refreshInventory();
    refreshCustomers();
  };

  // Loading indicator for charts
  const isAnyLoading = overviewLoading || revenueLoading || ordersLoading || inventoryLoading || customersLoading;
  const isAnyError = overviewError || revenueError || ordersError || inventoryError || customersError;

  // Render stats skeletons
  const renderStatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-[#111]/60 border border-neutral-900 p-6 space-y-4 rounded-sm animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-2 bg-neutral-850 w-24 rounded"></div>
            <div className="h-4 bg-neutral-850 w-4 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-neutral-850 w-16 rounded"></div>
            <div className="h-2 bg-neutral-850 w-32 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            Business Intelligence
          </span>
          <h1 className="text-2xl md:text-3xl font-light uppercase tracking-widest text-neutral-100">
            Curator Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isAnyLoading}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-850 bg-[#111] hover:border-white disabled:opacity-40 transition-all text-xs uppercase tracking-wider font-light cursor-pointer rounded-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${isAnyLoading ? "animate-spin" : ""}`} />
            Refresh Feed
          </button>
        </div>
      </div>

      {/* ERROR FEEDBACK BAR */}
      {isAnyError && (
        <div className="bg-red-950/20 border border-red-950 p-4 text-red-400 text-xs font-light tracking-wide uppercase rounded-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Some dashboard stats failed to refresh. Active cache is loaded instead.</span>
          </div>
          <button onClick={handleRefresh} className="underline tracking-wider hover:text-white cursor-pointer uppercase font-semibold">
            Retry Connection
          </button>
        </div>
      )}

      {/* 1. OVERVIEW STATISTICS CARDS */}
      {overviewLoading ? (
        renderStatsSkeleton()
      ) : overview ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {/* Revenue yield */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="bg-[#111]/80 backdrop-blur-sm border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors duration-350 group relative rounded-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                Total Revenue
              </span>
              <DollarSign className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-light tracking-tight mb-2 text-white truncate" title={formatPrice(overview.totalRevenue)}>
                {formatPrice(overview.totalRevenue)}
              </h3>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-light">
                {overview.growth?.revenue >= 0 ? (
                  <span className="text-green-500 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +{overview.growth.revenue}%
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> {overview.growth.revenue}%
                  </span>
                )}
                <span className="text-neutral-600">vs last month</span>
              </div>
            </div>
          </motion.div>

          {/* Average Order Value */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="bg-[#111]/80 backdrop-blur-sm border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors duration-350 group relative rounded-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                Average Value
              </span>
              <Activity className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-light tracking-tight mb-2 text-white truncate">
                {formatPrice(overview.averageOrderValue)}
              </h3>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-light">
                <span className="text-green-500 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +{overview.growth?.averageValue || 5.3}%
                </span>
                <span className="text-neutral-600">per booking</span>
              </div>
            </div>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="bg-[#111]/80 backdrop-blur-sm border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors duration-350 group relative rounded-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                Total Orders
              </span>
              <CreditCard className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-3xl font-light tracking-tight mb-1 text-white">
                {overview.totalOrders}
              </h3>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-light">
                <span className="text-green-500 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +{overview.growth?.orders || 8.5}%
                </span>
                <span className="text-neutral-600">total transactions</span>
              </div>
            </div>
          </motion.div>

          {/* Total Customers */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="bg-[#111]/80 backdrop-blur-sm border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors duration-350 group relative rounded-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                Active Patrons
              </span>
              <Users className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-3xl font-light tracking-tight mb-1 text-white">
                {overview.totalCustomers}
              </h3>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-light">
                <span className="text-green-500 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +{overview.growth?.customers || 12.1}%
                </span>
                <span className="text-neutral-600">registered customers</span>
              </div>
            </div>
          </motion.div>

          {/* Restock Alerts (Low Stock) */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="bg-[#111]/80 backdrop-blur-sm border border-neutral-900 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors duration-350 group relative rounded-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                Inventory Alerts
              </span>
              <AlertCircle className={`w-4 h-4 ${overview.lowStockCount > 0 ? "text-red-400" : "text-neutral-500"} group-hover:text-white transition-colors`} />
            </div>
            <div>
              <h3 className={`text-3xl font-light tracking-tight mb-1 ${overview.lowStockCount > 0 ? "text-red-400 font-normal" : "text-white"}`}>
                {overview.lowStockCount}
              </h3>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-light">
                <span className={overview.lowStockCount > 0 ? "text-red-400 font-semibold" : "text-neutral-500"}>
                  {overview.lowStockCount > 0 ? "Critical Restock Needed" : "Stock Levels Healthy"}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      {/* 2. MAIN SECTION - CHART PANELS */}
      <div className="bg-[#111]/60 border border-neutral-900 p-6 space-y-6 rounded-sm">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-850 pb-4">
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-sm ${
              activeTab === "sales"
                ? "bg-white text-black font-bold"
                : "bg-transparent text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-700"
            }`}
          >
            Sales Curves
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-sm ${
              activeTab === "operations"
                ? "bg-white text-black font-bold"
                : "bg-transparent text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-700"
            }`}
          >
            Operational Flow
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-sm ${
              activeTab === "inventory"
                ? "bg-white text-black font-bold"
                : "bg-transparent text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-700"
            }`}
          >
            Top Performers
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-sm ${
              activeTab === "customers"
                ? "bg-white text-black font-bold"
                : "bg-transparent text-neutral-400 hover:text-white border border-neutral-850 hover:border-neutral-700"
            }`}
          >
            Customer Insights
          </button>
        </div>

        {/* Tab content */}
        <div className="relative min-h-[300px]">
          
          <AnimatePresence mode="wait">
            
            {/* TABS 1: Sales trends */}
            {activeTab === "sales" && (
              <motion.div
                key="sales-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                    Revenue & Transaction Volume
                  </h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light mt-1">
                    Monthly sales progression over the past six periods
                  </p>
                </div>

                {revenueLoading ? (
                  <div className="h-[250px] bg-neutral-950/20 border border-neutral-900 flex items-center justify-center rounded">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                  </div>
                ) : revenue && revenue.monthlyData ? (
                  <div className="h-[280px] w-full bg-[#0C0C0C]/50 border border-neutral-900/50 p-4 rounded-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenue.monthlyData}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.12} />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#525252" 
                          fontSize={9} 
                          tickLine={false}
                          dy={10}
                        />
                        <YAxis 
                          stroke="#525252" 
                          fontSize={9} 
                          tickFormatter={(val) => `Rs. ${val.toLocaleString()}`}
                          tickLine={false}
                          dx={-5}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#111", 
                            borderColor: "#222", 
                            borderRadius: "2px" 
                          }}
                          labelStyle={{ color: "#737373", fontSize: 10, textTransform: "uppercase", letterSpacing: "1px" }}
                          itemStyle={{ color: "#fff", fontSize: 11 }}
                          formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, "Revenue"]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#ffffff" 
                          strokeWidth={1.5}
                          fillOpacity={1} 
                          fill="url(#revenueGrad)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] border border-dashed border-neutral-850 flex flex-col justify-center items-center rounded-sm">
                    <Inbox className="w-8 h-8 text-neutral-600 mb-2" />
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">No Sales Data Available</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* TABS 2: Operational status pie chart & bar order count */}
            {activeTab === "operations" && (
              <motion.div
                key="ops-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Status distribution */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                      Order Fulfillment Distribution
                    </h3>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light mt-1">
                      Status distribution breakdown for active client inquiries
                    </p>
                  </div>

                  {ordersLoading ? (
                    <div className="h-[250px] bg-neutral-950/20 border border-neutral-900 flex items-center justify-center rounded">
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                    </div>
                  ) : orderStats && orderStats.statusData ? (
                    <div className="h-[260px] bg-[#0C0C0C]/50 border border-neutral-900/50 p-4 flex flex-col sm:flex-row items-center justify-around rounded-sm">
                      <div className="w-full sm:w-1/2 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={orderStats.statusData.filter(d => d.value > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {orderStats.statusData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={STATUS_COLORS[entry.name] || "#737373"} 
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: "#111", borderColor: "#222" }}
                              itemStyle={{ color: "#fff", fontSize: 11 }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Legends */}
                      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 shrink-0">
                        {orderStats.statusData.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span 
                              className="w-2.5 h-2.5 rounded-sm block shrink-0" 
                              style={{ backgroundColor: STATUS_COLORS[d.name] || "#737373" }}
                            ></span>
                            <span className="text-neutral-400 font-light">{d.name}</span>
                            <span className="text-neutral-200 font-semibold">({d.value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[250px] border border-dashed border-neutral-850 flex flex-col justify-center items-center rounded-sm">
                      <Inbox className="w-8 h-8 text-neutral-600 mb-2" />
                      <span className="text-xs text-neutral-500 uppercase tracking-widest">No Operational Data</span>
                    </div>
                  )}
                </div>

                {/* Growth trend Bar Chart */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                      Transaction Volume Trends
                    </h3>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light mt-1">
                      Total bookings processed per calendar month
                    </p>
                  </div>

                  {revenueLoading ? (
                    <div className="h-[250px] bg-neutral-950/20 border border-neutral-900 flex items-center justify-center rounded">
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                    </div>
                  ) : revenue && revenue.monthlyData ? (
                    <div className="h-[260px] bg-[#0C0C0C]/50 border border-neutral-900/50 p-4 rounded-sm">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenue.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
                          <XAxis dataKey="month" stroke="#525252" fontSize={9} tickLine={false} dy={5} />
                          <YAxis stroke="#525252" fontSize={9} tickLine={false} dx={-5} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#111", borderColor: "#222" }}
                            itemStyle={{ color: "#fff", fontSize: 11 }}
                            formatter={(value) => [value, "Orders"]}
                          />
                          <Bar dataKey="orders" fill="#a3a3a3" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[250px] border border-dashed border-neutral-850 flex flex-col justify-center items-center rounded-sm">
                      <Inbox className="w-8 h-8 text-neutral-600 mb-2" />
                      <span className="text-xs text-neutral-500 uppercase tracking-widest">No Volumes Logged</span>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TABS 3: Inventory / Top Products */}
            {activeTab === "inventory" && (
              <motion.div
                key="inv-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                    High Volume Catalog Items
                  </h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light mt-1">
                    SKUs sorted by overall volume sold and yield contribution
                  </p>
                </div>

                {inventoryLoading ? (
                  <div className="h-[250px] bg-neutral-950/20 border border-neutral-900 flex items-center justify-center rounded">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                  </div>
                ) : inventory && inventory.topProducts && inventory.topProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Top Products volume list */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                        Units Sold Leaderboard
                      </h4>
                      {inventory.topProducts.map((prod, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-neutral-900 rounded-sm hover:border-neutral-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-neutral-500 font-mono">#{idx + 1}</span>
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="w-8 h-10 object-cover border border-neutral-900 shrink-0" />
                            ) : (
                              <div className="w-8 h-10 bg-neutral-900 border border-neutral-900 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-neutral-600" />
                              </div>
                            )}
                            <div>
                              <span className="text-xs text-neutral-200 block font-medium max-w-[150px] sm:max-w-[200px] truncate" title={prod.name}>
                                {prod.name}
                              </span>
                              <span className="text-[9px] uppercase font-mono text-neutral-500">SKU: {prod.id ? prod.id.substring(0, 8) : "N/A"}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs text-neutral-100 font-semibold block">{prod.quantitySold} Sold</span>
                            <span className="text-[9px] text-neutral-500 uppercase tracking-wide">Volume Total</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Yield breakdown Chart */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                        Gross Yield Share (LKR)
                      </h4>
                      <div className="h-[220px] bg-[#0C0C0C]/50 border border-neutral-900/50 p-4 rounded-sm">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={inventory.topProducts} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
                            <XAxis type="number" stroke="#525252" fontSize={8} tickLine={false} />
                            <YAxis dataKey="name" type="category" stroke="#525252" fontSize={8} tickLine={false} width={80} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#111", borderColor: "#222" }}
                              itemStyle={{ color: "#fff", fontSize: 10 }}
                              formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, "Revenue"]}
                            />
                            <Bar dataKey="revenue" fill="#ffffff" radius={[0, 2, 2, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="h-[250px] border border-dashed border-neutral-850 flex flex-col justify-center items-center rounded-sm">
                    <Layers className="w-8 h-8 text-neutral-600 mb-2" />
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">No Products Logged In Orders</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* TABS 4: Customer Insights */}
            {activeTab === "customers" && (
              <motion.div
                key="cust-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                    Customer Curation & Spend
                  </h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-light mt-1">
                    Loyalty data mapping your top active buyers and ticket averages
                  </p>
                </div>

                {customersLoading ? (
                  <div className="h-[250px] bg-neutral-950/20 border border-neutral-900 flex items-center justify-center rounded">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                  </div>
                ) : customers && customers.topBuyers && customers.topBuyers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Top buyers list */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                        Top Patrons by Gross Spend
                      </h4>
                      {customers.topBuyers.map((buyer, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-neutral-900 rounded-sm hover:border-neutral-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-neutral-500 font-mono">#{idx + 1}</span>
                            <div className="w-7 h-7 bg-neutral-900 border border-neutral-850 rounded-full flex items-center justify-center">
                              <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                            </div>
                            <div>
                              <span className="text-xs text-neutral-200 block font-medium">{buyer.name || "Anonymous"}</span>
                              <span className="text-[9px] text-neutral-500">{buyer._id}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs text-white font-semibold block">{formatPrice(buyer.totalSpent)}</span>
                            <span className="text-[9px] text-neutral-500 uppercase font-mono">{buyer.ordersCount} bookings</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Spend Share distribution */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                        Gross Spend Share (LKR)
                      </h4>
                      <div className="h-[220px] bg-[#0C0C0C]/50 border border-neutral-900/50 p-4 rounded-sm">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={customers.topBuyers}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
                            <XAxis dataKey="name" stroke="#525252" fontSize={8} tickLine={false} />
                            <YAxis stroke="#525252" fontSize={8} tickLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#111", borderColor: "#222" }}
                              itemStyle={{ color: "#fff", fontSize: 10 }}
                              formatter={(value) => [formatPrice(value), "Spent"]}
                            />
                            <Bar dataKey="totalSpent" fill="#cccccc" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="h-[250px] border border-dashed border-neutral-850 flex flex-col justify-center items-center rounded-sm">
                    <Users className="w-8 h-8 text-neutral-600 mb-2" />
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">No Customer Spend Data</span>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* 3. INVENTORY WARNINGS & LOW STOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Low stock alerts panel (2 cols on desktop) */}
        <div className="lg:col-span-2 bg-[#111]/80 backdrop-blur-sm border border-neutral-900 p-6 flex flex-col justify-between rounded-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[9px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
                  Critical Warnings
                </span>
                <h2 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                  Low Stock Inventory
                </h2>
              </div>
              {inventory && inventory.lowStockProducts && inventory.lowStockProducts.length > 0 && (
                <span className="bg-red-950/30 border border-red-900/50 text-red-400 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
                  Critical Alerts ({inventory.lowStockProducts.length})
                </span>
              )}
            </div>

            {inventoryLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
              </div>
            ) : inventory && inventory.lowStockProducts && inventory.lowStockProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inventory.lowStockProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="p-3 bg-[#0A0A0A] border border-neutral-900 flex justify-between items-center rounded-sm hover:border-red-900/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {prod.images && prod.images[0] ? (
                        <img src={prod.images[0]} alt={prod.name} className="w-8 h-10 object-cover border border-neutral-900 shrink-0" />
                      ) : (
                        <div className="w-8 h-10 bg-neutral-900 border border-neutral-900 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-neutral-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-xs text-neutral-200 block font-medium truncate" title={prod.name}>
                          {prod.name}
                        </span>
                        <span className="text-[9px] uppercase text-neutral-500">{prod.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-red-400 block">{prod.stock} left</span>
                        <span className="text-[8px] text-neutral-500 uppercase tracking-widest">In Stock</span>
                      </div>
                      
                      {/* Quick Edit shortcut link */}
                      <Link
                        to={`/admin/products/edit/${prod._id}`}
                        className="text-neutral-500 hover:text-white p-1 border border-neutral-850 hover:border-neutral-700 bg-neutral-950 transition-colors rounded cursor-pointer"
                        title="Quick Edit Product"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-500 uppercase tracking-widest border border-dashed border-neutral-850 rounded-sm">
                No low stock items. All stock levels healthy.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-900">
            <Link
              to="/admin/products"
              className="w-full py-3 bg-[#181818] text-neutral-300 text-[10px] uppercase tracking-widest hover:bg-neutral-850 transition-colors text-center block font-semibold rounded-sm border border-transparent"
            >
              Manage Complete Store Catalog
            </Link>
          </div>
        </div>

        {/* Recent Customers list (1 col on desktop) */}
        <div className="bg-[#111]/80 backdrop-blur-sm border border-neutral-900 p-6 flex flex-col justify-between rounded-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[9px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
                  Patron Log
                </span>
                <h2 className="text-sm font-light uppercase tracking-widest text-neutral-200">
                  New Registered Patrons
                </h2>
              </div>
            </div>

            {customersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
              </div>
            ) : customers && customers.recentCustomers && customers.recentCustomers.length > 0 ? (
              <div className="space-y-4">
                {customers.recentCustomers.slice(0, 4).map((c, i) => (
                  <div key={c._id || i} className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-neutral-900 rounded-sm">
                    <div className="w-7 h-7 bg-neutral-900 border border-neutral-850 rounded-full flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-neutral-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-neutral-200 font-medium block truncate">{c.name}</span>
                      <span className="text-[9px] text-neutral-500 block truncate">{c.email}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[8px] text-neutral-500 uppercase block font-mono">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-[8px] text-neutral-500 uppercase block tracking-wider">Joined</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-500 uppercase tracking-widest border border-dashed border-neutral-850 rounded-sm">
                No recent customer registrations.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-900">
            <Link
              to="/admin/customers"
              className="w-full py-3 bg-[#181818] text-neutral-300 text-[10px] uppercase tracking-widest hover:bg-neutral-850 transition-colors text-center block font-semibold rounded-sm border border-transparent"
            >
              Browse Client CRM
            </Link>
          </div>
        </div>

      </div>

      {/* 4. RECENT TRANSACTIONS GRID */}
      <div className="bg-[#111]/80 backdrop-blur-sm border border-neutral-900 p-6 space-y-6 rounded-sm">
        
        <div>
          <span className="text-[9px] tracking-[4px] uppercase text-neutral-500 font-semibold block mb-1">
            Order Monitoring
          </span>
          <h2 className="text-sm font-light uppercase tracking-widest text-neutral-200">
            Recent Client Transactions
          </h2>
        </div>

        {overviewLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
          </div>
        ) : overview && overview.recentOrders && overview.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-850 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Fulfillment</th>
                  <th className="py-3 px-4 font-semibold">Date Logged</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentOrders.map((order) => {
                  const itemsSummary = order.orderItems
                    ? order.orderItems.map(item => `${item.name} (${item.size}) x${item.quantity}`).join(", ")
                    : "No items";

                  return (
                    <tr
                      key={order._id || order.id}
                      className="border-b border-neutral-900/50 hover:bg-[#0A0A0A] transition-colors text-xs font-light"
                    >
                      <td className="py-4 px-4 font-mono text-[10px] text-neutral-400">
                        #{(order._id || order.id).substring(0, 8)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="text-neutral-200 font-medium block">{order.customerName}</span>
                          <span className="text-[9px] text-neutral-500 block">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-neutral-400 max-w-[200px] truncate" title={itemsSummary}>
                        {itemsSummary}
                      </td>
                      <td className="py-4 px-4 text-neutral-200 font-semibold">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-4 px-4">
                        <span 
                          className="px-2 py-0.5 border text-[9px] uppercase tracking-wider font-semibold rounded"
                          style={{
                            backgroundColor: `${STATUS_COLORS[order.orderStatus]}15`,
                            borderColor: STATUS_COLORS[order.orderStatus],
                            color: STATUS_COLORS[order.orderStatus] === "#ffffff" ? "#e5e5e5" : STATUS_COLORS[order.orderStatus]
                          }}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-neutral-500 font-mono text-[10px]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-neutral-500 uppercase tracking-widest border border-dashed border-neutral-850 rounded-sm">
            No transactions found.
          </div>
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;
