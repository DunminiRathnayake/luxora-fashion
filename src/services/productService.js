const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return ""; // Same-origin relative route on production
  }
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
};

const API_URL = getApiUrl();

// Helper to map Mongoose _id to a simple frontend id key to avoid breaking context files
const mapProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    image: p.image || (p.images && p.images[0]) || "",
    price: typeof p.price === "number" ? `Rs. ${p.price.toLocaleString("en-IN")}` : p.price,
  };
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.map(mapProduct);
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/api/products/${id}`);
  if (!response.ok) {
    throw new Error("Product not found");
  }
  const data = await response.json();
  return mapProduct(data);
};
