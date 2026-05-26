import express from "express";
import {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.route("/my-orders").get(protect, getMyOrders);
router.route("/:id").get(protect, getSingleOrder).delete(protect, admin, deleteOrder);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

export default router;
