/**
 * Optimizes image delivery URLs for Cloudinary and Unsplash dynamically.
 * Adds format auto-selection, compression quality, and responsive width limits.
 * 
 * @param {string} url - Original image URL
 * @param {number} [width=800] - Desired width transformation (optional)
 * @returns {string} Optimized URL or fallback placeholder
 */
export const getOptimizedImageUrl = (url, width = 800) => {
  const defaultPlaceholder = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80";
  if (!url) return defaultPlaceholder;

  try {
    // 1. Cloudinary Optimization
    if (url.includes("cloudinary.com")) {
      const parts = url.split("/upload");
      if (parts.length === 2) {
        // Build transformation string
        // q_auto: automatic compression quality
        // f_auto: automatic format detection (webp, avif, etc.)
        // c_limit: limit sizes to bounds
        const transformString = `/upload/q_auto,f_auto,w_${width},c_limit`;
        return `${parts[0]}${transformString}${parts[1]}`;
      }
    }

    // 2. Unsplash Optimization (fallback & seed images)
    if (url.includes("images.unsplash.com")) {
      const urlObj = new URL(url);
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("q", "80"); // Good balance of compression/quality
      urlObj.searchParams.set("w", String(width));
      return urlObj.toString();
    }
  } catch (error) {
    console.error("Error optimizing image URL:", url, error);
  }

  return url;
};

export default getOptimizedImageUrl;
