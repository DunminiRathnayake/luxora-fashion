import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("luxora_token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = () => {
    localStorage.removeItem("luxora_token");
    setToken(null);
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile(token);
          setUser(profile);
        } catch (err) {
          console.error("Session verification failed, logging out:", err.message);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("luxora_token", data.token);
      setToken(data.token);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, role = "customer") => {
    setError(null);
    try {
      const data = await authService.register(name, email, password, role);
      localStorage.setItem("luxora_token", data.token);
      setToken(data.token);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
