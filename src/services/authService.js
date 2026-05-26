const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return "";
  }
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
};

const API_URL = getApiUrl();

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }

  return await response.json();
};

export const register = async (name, email, password, role = "customer") => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Registration failed");
  }

  return await response.json();
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/api/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch user profile");
  }

  return await response.json();
};
