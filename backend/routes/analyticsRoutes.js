import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getOverview,
  getRevenueAnalytics,
  getOrderAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Apply auth protection & admin guards to all analytics routes
router.use(protect);
router.use(admin);

router.get("/overview", getOverview);
router.get("/revenue", getRevenueAnalytics);
router.get("/orders", getOrderAnalytics);
router.get("/products", getProductAnalytics);
router.get("/customers", getCustomerAnalytics);

export default router;
