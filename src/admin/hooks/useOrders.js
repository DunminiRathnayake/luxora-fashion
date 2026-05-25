import { useState, useEffect, useCallback } from "react";
import * as orderService from "../../services/orderService";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      await fetchOrders(); // Reload orders to sync UI
    } catch (err) {
      throw new Error(err.message || "Failed to update order status");
    }
  };

  const removeOrder = async (id) => {
    try {
      await orderService.deleteOrder(id);
      await fetchOrders(); // Reload orders to sync UI
    } catch (err) {
      throw new Error(err.message || "Failed to delete order");
    }
  };

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
    updateStatus,
    removeOrder,
  };
}

export default useOrders;
