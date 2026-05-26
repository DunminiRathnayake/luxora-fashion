import multer from "multer";
import path from "path";
import fs from "fs";

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;
const uploadsDir = path.join(process.cwd(), "backend", "uploads");

if (!isProduction) {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (err) {
    console.error("Failed to create uploads directory:", err);
  }
}

// Memory storage in production/Vercel (stateless serverless environment), disk storage in local dev
const storage = isProduction
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination(req, file, cb) {
        cb(null, uploadsDir);
      },
      filename(req, file, cb) {
        // Unique naming
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
        );
      },
    });

// File filter validation
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (.jpg, .jpeg, .png, .webp) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
