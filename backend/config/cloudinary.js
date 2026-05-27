import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer directly to Cloudinary folder.
 * @param {Buffer} fileBuffer 
 * @returns {Promise<Object>} Cloudinary API response
 */
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "luxora_products",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Destroys a Cloudinary asset by public_id.
 * @param {string} publicId 
 * @returns {Promise<Object>} Cloudinary API response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary deletion failed for public_id:", publicId, error);
    throw error;
  }
};

/**
 * Extracts Cloudinary public_id (including folder path) from a secure URL.
 * @param {string} url 
 * @returns {string|null} public_id or null
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    // Everything after /upload/
    const afterUpload = parts.slice(uploadIndex + 1);

    // Shift off version number if present (e.g. v12345678)
    if (afterUpload[0] && afterUpload[0].startsWith("v")) {
      afterUpload.shift();
    }

    const filenameWithExt = afterUpload.join("/");
    const lastDotIndex = filenameWithExt.lastIndexOf(".");
    if (lastDotIndex === -1) return filenameWithExt;

    return filenameWithExt.substring(0, lastDotIndex);
  } catch (error) {
    console.error("Failed to parse public_id from Cloudinary URL:", url, error);
    return null;
  }
};

export default cloudinary;
