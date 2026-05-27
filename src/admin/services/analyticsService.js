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

export const fetchOverview = async () => {
  const response = await fetch(`${API_URL}/api/analytics/overview`, {
    method: "GET",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch overview analytics");
  }

  return await response.json();
};

export const fetchRevenueData = async () => {
  const response = await fetch(`${API_URL}/api/analytics/revenue`, {
    method: "GET",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch revenue analytics data");
  }

  return await response.json();
};

export const fetchOrderStatusData = async () => {
  const response = await fetch(`${API_URL}/api/analytics/orders`, {
    method: "GET",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch order status analytics data");
  }

  return await response.json();
};

export const fetchProductInventoryData = async () => {
  const response = await fetch(`${API_URL}/api/analytics/products`, {
    method: "GET",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch product inventory analytics data");
  }

  return await response.json();
};

export const fetchCustomerInsights = async () => {
  const response = await fetch(`${API_URL}/api/analytics/customers`, {
    method: "GET",
    headers: getHeaders({
      "Content-Type": "application/json",
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch customer insights data");
  }

  return await response.json();
};
