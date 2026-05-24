import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../../services/productService";
import * as adminService from "../services/adminProductService";

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load catalog products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData) => {
    try {
      const newProduct = await adminService.createProduct(productData);
      await fetchProducts();
      return newProduct;
    } catch (err) {
      throw new Error(err.message || "Failed to create product");
    }
  };

  const editProduct = async (id, productData) => {
    try {
      const updatedProduct = await adminService.updateProduct(id, productData);
      await fetchProducts();
      return updatedProduct;
    } catch (err) {
      throw new Error(err.message || "Failed to update product");
    }
  };

  const removeProduct = async (id) => {
    try {
      await adminService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      throw new Error(err.message || "Failed to delete product");
    }
  };

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
}
export default useAdminProducts;
