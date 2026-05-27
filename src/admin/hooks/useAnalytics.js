import { useState, useEffect, useCallback } from "react";
import {
  fetchOverview,
  fetchRevenueData,
  fetchOrderStatusData,
  fetchProductInventoryData,
  fetchCustomerInsights,
} from "../services/analyticsService";

export const useAnalyticsOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOverviewData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOverview();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load overview analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getOverviewData();
  }, [getOverviewData]);

  return { data, loading, error, refresh: getOverviewData };
};

export const useRevenueData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRevenueData();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRevenue();
  }, [getRevenue]);

  return { data, loading, error, refresh: getRevenue };
};

export const useOrderStatusData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrderStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrderStatusData();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load order status data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getOrderStatus();
  }, [getOrderStatus]);

  return { data, loading, error, refresh: getOrderStatus };
};

export const useProductInventoryData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProductInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProductInventoryData();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load product inventory data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProductInventory();
  }, [getProductInventory]);

  return { data, loading, error, refresh: getProductInventory };
};

export const useCustomerInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCustomerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCustomerInsights();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load customer insights");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCustomerData();
  }, [getCustomerData]);

  return { data, loading, error, refresh: getCustomerData };
};
