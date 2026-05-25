const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create order");
  }

  return await response.json();
};

export const getOrders = async () => {
  const response = await fetch(`${API_URL}/api/orders`);
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to retrieve orders");
  }

  return await response.json();
};

export const getSingleOrder = async (id) => {
  const response = await fetch(`${API_URL}/api/orders/${id}`);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to retrieve order details");
  }

  return await response.json();
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update order status");
  }

  return await response.json();
};

export const deleteOrder = async (id) => {
  const response = await fetch(`${API_URL}/api/orders/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to delete order");
  }

  return await response.json();
};

export const getMyOrders = async (email) => {
  const response = await fetch(`${API_URL}/api/orders/my-orders?email=${encodeURIComponent(email)}`);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to retrieve your order history");
  }

  return await response.json();
};
