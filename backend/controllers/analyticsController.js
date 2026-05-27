import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import sampleOrders from "../data/orders.js";
import { sampleProducts } from "../data/products.js";

// Helper to map month number to name
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Helper to get past 6 months list for chronological order
const getPast6Months = () => {
  const list = [];
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    list.push({
      year: m.getFullYear(),
      monthNum: m.getMonth() + 1,
      monthName: MONTH_NAMES[m.getMonth()],
      label: `${MONTH_NAMES[m.getMonth()]} ${m.getFullYear().toString().slice(-2)}`
    });
  }
  return list;
};

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private/Admin
export const getOverview = asyncHandler(async (req, res) => {
  const isOnline = mongoose.connection.readyState === 1;

  let totalRevenue = 0;
  let totalOrders = 0;
  let totalCustomers = 0;
  let averageOrderValue = 0;
  let lowStockCount = 0;
  let recentOrders = [];
  let recentCustomers = [];

  // Default growth values (simulated percentages)
  const growth = {
    revenue: 14.2,
    orders: 8.5,
    customers: 12.1,
    averageValue: 5.3,
  };

  if (isOnline) {
    // 1. Calculate Total Revenue (excluding Cancelled)
    const revenueRes = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    totalRevenue = revenueRes.length > 0 ? revenueRes[0].total : 0;

    // 2. Calculate Total Orders
    totalOrders = await Order.countDocuments();

    // 3. Calculate Total Customers
    totalCustomers = await User.countDocuments({ role: "customer" });

    // 4. Calculate Average Order Value
    averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

    // 5. Calculate Low Stock Count (stock <= 10)
    lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });

    // 6. Fetch Recent Orders
    recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Fetch Recent Customers
    recentCustomers = await User.find({ role: "customer" })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);
  } else {
    // OFFLINE MODE FALLBACK
    console.log("Serving offline overview analytics");
    
    totalRevenue = sampleOrders
      .filter(o => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    totalOrders = sampleOrders.length;
    totalCustomers = 18; // Synthetic static count
    averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;
    lowStockCount = sampleProducts.filter(p => p.stock <= 10).length;

    // Format mock recent orders
    recentOrders = sampleOrders.slice(0, 5);

    // Mock recent customers
    recentCustomers = [
      { _id: "u1", name: "Elena Rostova", email: "elena.r@luxora.com", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { _id: "u2", name: "Marcus Aurelius", email: "marcus.a@luxora.com", createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { _id: "u3", name: "Aria Montgomery", email: "aria.m@luxora.com", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { _id: "u4", name: "Viktor Vane", email: "viktor.v@luxora.com", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "u5", name: "Selena Gable", email: "selena@luxora.com", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
    ];
  }

  res.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    averageOrderValue,
    lowStockCount,
    recentOrders,
    recentCustomers,
    growth,
    isOffline: !isOnline
  });
});

// @desc    Get revenue charts data
// @route   GET /api/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const isOnline = mongoose.connection.readyState === 1;
  const pastMonths = getPast6Months();
  
  let monthlyData = [];

  if (isOnline) {
    // Aggregate revenue by month
    const aggregations = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" },
          ordersCount: { $sum: 1 }
        }
      }
    ]);

    // Align with past 6 months chronologically
    monthlyData = pastMonths.map(m => {
      const match = aggregations.find(a => a._id.year === m.year && a._id.month === m.monthNum);
      return {
        month: m.label,
        revenue: match ? match.revenue : 0,
        orders: match ? match.ordersCount : 0
      };
    });
  } else {
    // Generate realistic historical curve based on sampleOrders
    const sampleRevenue = sampleOrders
      .filter(o => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Dynamic curve simulating a premium scaling trajectory
    monthlyData = pastMonths.map((m, idx) => {
      const baseMultiplier = 0.4 + (idx * 0.12); // Steady progression
      const randOffset = Math.sin(idx) * 1500;
      return {
        month: m.label,
        revenue: Math.round(sampleRevenue * baseMultiplier + 10000 + randOffset),
        orders: Math.round(sampleOrders.length * baseMultiplier + 3 + (idx % 2))
      };
    });
  }

  res.json({
    monthlyData,
    isOffline: !isOnline
  });
});

// @desc    Get order charts analytics
// @route   GET /api/analytics/orders
// @access  Private/Admin
export const getOrderAnalytics = asyncHandler(async (req, res) => {
  const isOnline = mongoose.connection.readyState === 1;

  let statusData = [];

  if (isOnline) {
    const counts = await Order.aggregate([
      { $group: { _id: "$orderStatus", value: { $sum: 1 } } }
    ]);

    // Ensure all possible statuses are represented
    const allStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    statusData = allStatuses.map(status => {
      const match = counts.find(c => c._id === status);
      return {
        name: status,
        value: match ? match.value : 0
      };
    });
  } else {
    // Map offline sample orders status distributions
    const counts = {};
    sampleOrders.forEach(o => {
      counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1;
    });

    const allStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    statusData = allStatuses.map(status => ({
      name: status,
      value: counts[status] || 0
    }));
  }

  res.json({
    statusData,
    isOffline: !isOnline
  });
});

// @desc    Get product insights
// @route   GET /api/analytics/products
// @access  Private/Admin
export const getProductAnalytics = asyncHandler(async (req, res) => {
  const isOnline = mongoose.connection.readyState === 1;

  let lowStockProducts = [];
  let topProducts = [];

  if (isOnline) {
    // Low stock Alert products
    lowStockProducts = await Product.find({ stock: { $lte: 10 } })
      .select("name category price stock images")
      .limit(10);

    // Group order items to find top selling products
    const salesAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          quantitySold: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: {
              $multiply: [
                "$orderItems.quantity",
                // Convert price back to number if saved as LKR string
                { 
                  $toDouble: {
                    $replaceAll: {
                      input: {
                        $replaceAll: {
                          input: "$orderItems.price",
                          find: "Rs. ",
                          replacement: ""
                        }
                      },
                      find: ",",
                      replacement: ""
                    }
                  }
                }
              ]
            }
          }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 }
    ]);

    topProducts = salesAgg.map(s => ({
      id: s._id,
      name: s.name,
      image: s.image,
      quantitySold: s.quantitySold,
      revenue: s.revenue
    }));
  } else {
    // Offline mode lists
    lowStockProducts = sampleProducts
      .filter(p => p.stock <= 10)
      .map(p => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        images: p.images
      }));

    // Mock top performing products
    topProducts = sampleProducts.slice(0, 3).map((p, idx) => ({
      id: p._id,
      name: p.name,
      image: p.images[0],
      quantitySold: 12 - idx * 3,
      revenue: p.price * (12 - idx * 3)
    }));
  }

  res.json({
    lowStockProducts,
    topProducts,
    isOffline: !isOnline
  });
});

// @desc    Get customer analytics
// @route   GET /api/analytics/customers
// @access  Private/Admin
export const getCustomerAnalytics = asyncHandler(async (req, res) => {
  const isOnline = mongoose.connection.readyState === 1;

  let recentCustomers = [];
  let topBuyers = [];

  if (isOnline) {
    recentCustomers = await User.find({ role: "customer" })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    // Aggregate orders to find most active buyers
    topBuyers = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$customerEmail",
          name: { $first: "$customerName" },
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);
  } else {
    recentCustomers = [
      { _id: "u1", name: "Elena Rostova", email: "elena.r@luxora.com", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { _id: "u2", name: "Marcus Aurelius", email: "marcus.a@luxora.com", createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { _id: "u3", name: "Aria Montgomery", email: "aria.m@luxora.com", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { _id: "u4", name: "Viktor Vane", email: "viktor.v@luxora.com", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "u5", name: "Selena Gable", email: "selena@luxora.com", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    topBuyers = [
      { _id: "sophia@sterling.com", name: "Sophia Sterling", ordersCount: 4, totalSpent: 34000 },
      { _id: "julian.mercer@gmail.com", name: "Julian Mercer", ordersCount: 3, totalSpent: 26000 },
      { _id: "clara.h@hawthorne.io", name: "Clara Hawthorne", ordersCount: 2, totalSpent: 17800 },
      { _id: "oliver@vance.net", name: "Oliver Vance", ordersCount: 1, totalSpent: 10300 }
    ];
  }

  res.json({
    recentCustomers,
    topBuyers,
    isOffline: !isOnline
  });
});
