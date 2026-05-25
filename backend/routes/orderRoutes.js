import express from "express";
import {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/").post(createOrder).get(getOrders);
router.route("/my-orders").get(getMyOrders);
router.route("/:id").get(getSingleOrder).delete(deleteOrder);
router.route("/:id/status").put(updateOrderStatus);

export default router;
