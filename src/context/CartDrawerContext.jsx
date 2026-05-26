import { createContext, useContext, useState, useCallback, useRef } from "react";

const CartDrawerContext = createContext();

export const useCartDrawer = () => {
  const context = useContext(CartDrawerContext);
  if (!context) {
    throw new Error("useCartDrawer must be used within a CartDrawerProvider");
  }
  return context;
};

export const CartDrawerProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bounceCartIcon, setBounceCartIcon] = useState(false);
  const [toast, setToast] = useState(null);

  const toastTimerRef = useRef(null);
  const bounceTimerRef = useRef(null);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const triggerCartAddFeedback = useCallback((item) => {
    // Clear previous timers
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);

    // Set states
    setToast(item);
    setBounceCartIcon(true);
    setIsCartOpen(true);

    // Bounce animation reset
    bounceTimerRef.current = setTimeout(() => {
      setBounceCartIcon(false);
    }, 1200);

    // Toast auto-clear
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  return (
    <CartDrawerContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        bounceCartIcon,
        toast,
        setToast,
        triggerCartAddFeedback,
      }}
    >
      {children}
    </CartDrawerContext.Provider>
  );
};
