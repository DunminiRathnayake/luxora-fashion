import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// File filter validation for supported image extensions
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/i;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (.jpg, .jpeg, .png, .webp) are allowed"), false);
  }
};

// Select storage engine dynamically depending on whether Cloudinary is configured
let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "luxora/products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ],
      public_id: (req, file) => {
        // Clean original file name for clean URL slugs
        const parsed = path.parse(file.originalname);
        const nameSlug = parsed.name
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "-") // replace spaces and special characters with -
          .replace(/-+/g, "-"); // merge multiple dashes
        return `${nameSlug}-${Date.now()}`;
      },
    },
  });
} else {
  // Graceful fallback for local development/offline testing
  storage = multer.memoryStorage();
}

const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
