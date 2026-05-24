import express from "express";
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getSingleProduct).put(updateProduct).delete(deleteProduct);

export default router;
