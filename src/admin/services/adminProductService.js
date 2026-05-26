const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return ""; // Same-origin relative route on production
  }
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
};

const API_URL = getApiUrl();

const getHeaders = (headers = {}) => {
  const token = localStorage.getItem("luxora_token");
  const authHeaders = { ...headers };
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }
  return authHeaders;
};

// Helper to map Mongoose _id to a simple frontend id key
const mapProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    image: p.image || (p.images && p.images[0]) || "",
    price: typeof p.price === "number" ? `Rs. ${p.price.toLocaleString("en-IN")}` : p.price,
  };
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create product");
  }

  const data = await response.json();
  return mapProduct(data);
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update product");
  }

  const data = await response.json();
  return mapProduct(data);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to delete product");
  }

  return await response.json();
};

export const uploadImage = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("image", file);

    xhr.open("POST", `${API_URL}/api/upload`);

    const token = localStorage.getItem("luxora_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          onProgress(percentCompleted);
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch (e) {
          reject(new Error("Failed to parse upload response"));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.message || "Upload failed"));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during file upload"));
    };

    xhr.send(formData);
  });
};
