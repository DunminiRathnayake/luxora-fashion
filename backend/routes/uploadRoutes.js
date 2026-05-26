import express from "express";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;

    if (isProduction) {
      // In production serverless functions, local filesystem writes are ephemeral.
      // TODO: Integrate Cloudinary or Vercel Blob storage here.
      // For Vercel Blob integration:
      // 1. Install package: npm install @vercel/blob
      // 2. Import: import { put } from "@vercel/blob";
      // 3. Upload:
      //    const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
      //    return res.json({ imageUrl: blob.url });
      
      console.warn("Production serverless function environment detected. Mocking local file upload by returning a curated fashion backdrop.");
      return res.json({
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
        message: "Demo fallback: Image upload mocked successfully in production serverless container. Setup Cloudinary/Vercel Blob in uploadRoutes.js for actual file preservation."
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Return the relative URL so it can be served statically
    res.json({
      imageUrl: `/uploads/${req.file.filename}`,
    });
  });
});

export default router;
