import multer from "multer";
import path from "path";

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

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
