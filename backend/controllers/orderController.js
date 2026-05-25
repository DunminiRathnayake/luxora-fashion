import mongoose from "mongoose";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sampleOrders } from "../data/orders.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    orderItems,
    subtotal,
    shippingFee,
    totalAmount,
    whatsappConfirmed,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  if (mongoose.connection.readyState === 1) {
    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      orderItems,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      totalAmount: Number(totalAmount),
      whatsappConfirmed: whatsappConfirmed !== undefined ? !!whatsappConfirmed : true,
      orderStatus: "Pending",
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } else {
    console.log("MongoDB is offline. Creating in-memory fallback order.");
    const newOrder = {
      _id: new mongoose.Types.ObjectId().toString(),
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      orderItems,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      totalAmount: Number(totalAmount),
      whatsappConfirmed: whatsappConfirmed !== undefined ? !!whatsappConfirmed : true,
      orderStatus: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sampleOrders.unshift(newOrder); // Add to beginning of array
    return res.status(201).json(newOrder);
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } else {
    console.log("MongoDB is offline. Serving fallback sample orders.");
    res.json(sampleOrders);
  }
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getSingleOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  if (mongoose.connection.readyState === 1) {
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      const order = await Order.findById(orderId);
      if (order) {
        return res.json(order);
      }
    }
  }

  const sampleOrder = sampleOrders.find((o) => o._id === orderId);
  if (sampleOrder) {
    res.json(sampleOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const validStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status value");
  }

  if (mongoose.connection.readyState === 1) {
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      const order = await Order.findById(orderId);
      if (order) {
        order.orderStatus = status;
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    }
  }

  const sampleOrder = sampleOrders.find((o) => o._id === orderId);
  if (sampleOrder) {
    sampleOrder.orderStatus = status;
    sampleOrder.updatedAt = new Date().toISOString();
    return res.json(sampleOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Delete/Cancel order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  if (mongoose.connection.readyState === 1) {
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      const order = await Order.findById(orderId);
      if (order) {
        await Order.deleteOne({ _id: orderId });
        return res.json({ message: "Order removed successfully" });
      }
    }
  }

  const index = sampleOrders.findIndex((o) => o._id === orderId);
  if (index !== -1) {
    sampleOrders.splice(index, 1);
    return res.json({ message: "Order removed successfully from fallback database" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Public
export const getMyOrders = asyncHandler(async (req, res) => {
  const email = req.query.email || req.headers["x-user-email"];

  if (!email) {
    res.status(400);
    throw new Error("Email parameter is required to retrieve customer order records");
  }

  if (mongoose.connection.readyState === 1) {
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.json(orders);
  } else {
    console.log(`MongoDB is offline. Filtering fallback orders for email: ${email}`);
    const filtered = sampleOrders.filter(
      (o) => o.customerEmail.toLowerCase() === email.toLowerCase()
    );
    res.json(filtered);
  }
});
