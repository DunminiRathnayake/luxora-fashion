import { useState, useEffect } from "react";
import { getProductById } from "../services/productService";

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        if (isMounted) {
          setProduct(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load product");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
}
