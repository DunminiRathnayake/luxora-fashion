import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    try {
      // Graceful fallback for offline testing if Cloudinary credentials are not set
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn("Cloudinary configuration missing. Mocking image upload.");
        return res.json({
          imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
          public_id: "mock_cloudinary_public_id",
          message: "Mock upload success. Set up Cloudinary keys in .env for actual storage."
        });
      }

      // With multer-storage-cloudinary, the upload is done automatically.
      // req.file.path holds the secure URL and req.file.filename holds the public_id.
      return res.json({
        imageUrl: req.file.path,
        public_id: req.file.filename,
      });
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return res.status(500).json({
        message: error.message || "Failed to upload image to Cloudinary",
      });
    }
  });
});

export default router;
