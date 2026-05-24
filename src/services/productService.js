const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper to map Mongoose _id to a simple frontend id key to avoid breaking context files
const mapProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
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
