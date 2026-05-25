import { useState, useEffect, useCallback } from "react";
import { getMyOrders } from "../services/orderService";
import { useCart } from "../context/CartContext";

export function useMyOrders() {
  const { user } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyOrders = useCallback(async () => {
    if (!user || !user.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMyOrders(user.email);
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load order history");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return {
    orders,
    loading,
    error,
    refresh: fetchMyOrders,
  };
}

export default useMyOrders;
