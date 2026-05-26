import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Helper to convert "Rs. 8,500" -> 8500
export const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
};

// Helper to convert 8500 -> "Rs. 8,500"
export const formatPrice = (value) => {
  return `Rs. ${value.toLocaleString("en-IN")}`;
};

export const CartProvider = ({ children }) => {
  const { user, login: loginUser, logout: logoutUser } = useAuth();
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("luxora_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("luxora_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, quantity) => {
    setCartItems((prev) => {
      const itemKey = `${product.id}-${size}`;
      const existingItem = prev.find((item) => item.key === itemKey);

      if (existingItem) {
        return prev.map((item) =>
          item.key === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          size,
          quantity,
          key: itemKey,
        },
      ];
    });
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prev) => prev.filter((item) => item.key !== itemKey));
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === itemKey ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
