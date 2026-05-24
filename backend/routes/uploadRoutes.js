import express from "express";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
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
