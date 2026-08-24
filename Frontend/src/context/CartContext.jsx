import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { axiosCart, CART_ENDPOINTS } from "../api/cartConfig";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : { items: [] };
  });

  const syncTimer = useRef(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPendingSync, setIsPendingSync] = useState(false);
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const triggerBackendSync = () => {
    setIsPendingSync(true);
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(syncToBackend, 1000);
  };

  const syncToBackend = async () => {
    try {
      setIsSyncing(true);
      setSyncError(false);
      await axiosCart.post(CART_ENDPOINTS.sync, { items: cart.items });
    } catch (err) {
      console.error("Cart sync failed:", err.message);
      setSyncError(true);
    } finally {
      setIsSyncing(false);
      setIsPendingSync(false);
    }
  };

  useEffect(() => {
    return () => clearTimeout(syncTimer.current);
  }, []);

  const addToCart = (productId, newQty = 1, productData = null) => {
    setCart((prevCart) => {
      const updatedItems = [...prevCart.items];
      const existing = updatedItems.find(
        (item) => item.product?._id === productId || item.product === productId
      );

      if (existing) {
        if (newQty <= 0) {
          return {
            ...prevCart,
            items: updatedItems.filter((i) => i !== existing),
          };
        }
        existing.quantity = newQty;
        if (productData) existing.product = productData;
      } else {
        updatedItems.push({
          product: productData || { _id: productId },
          quantity: newQty,
        });
      }

      return { ...prevCart, items: updatedItems };
    });

    triggerBackendSync();
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter(
        (item) => item.product?._id !== productId && item.product !== productId
      ),
    }));

    triggerBackendSync();
  };

  const clearCart = async () => {
    try {
      setCart({ items: [] });
      localStorage.removeItem("cart");
      await axiosCart.post(CART_ENDPOINTS.sync, { items: [] });
    } catch (err) {
      console.error("Failed to clear backend cart:", err.message);
    }
  };

  const fetchCart = async () => {
    try {
      const { data } = await axiosCart.get(CART_ENDPOINTS.get);
      if (data?.cart && data.cart.items?.length > 0) {
        setCart(data.cart);
        localStorage.setItem("cart", JSON.stringify(data.cart));
      } else {
        setCart({ items: [] });
        localStorage.removeItem("cart");
      }
    } catch (err) {
      console.error("Error fetching cart:", err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
        syncToBackend,
        isSyncing,
        isPendingSync,
        syncError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
