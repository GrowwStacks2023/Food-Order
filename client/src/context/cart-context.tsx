import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { MenuItem, CartItem, Recommendation } from "@shared/schema";

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  recommendations: Recommendation[];
  setRecommendations: (recs: Recommendation[]) => void;
  isRecommendationsOpen: boolean;
  setIsRecommendationsOpen: (open: boolean) => void;
  isLoadingRecommendations: boolean;
  setIsLoadingRecommendations: (loading: boolean) => void;
  lastAddedItem: MenuItem | null;
  setLastAddedItem: (item: MenuItem | null) => void;
  cartBounce: boolean;
  setCartBounce: (bounce: boolean) => void;
}

const TAX_RATE = 0.08;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<MenuItem | null>(null);
  const [cartBounce, setCartBounce] = useState(false);

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((current) => {
      const existingItem = current.find((item) => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return current.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { id: crypto.randomUUID(), menuItem, quantity: 1 }];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 300);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  }, [items]);

  const getTax = useCallback(() => {
    return getSubtotal() * TAX_RATE;
  }, [getSubtotal]);

  const getTotal = useCallback(() => {
    return getSubtotal() + getTax();
  }, [getSubtotal, getTax]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getTax,
        getTotal,
        isCartOpen,
        setIsCartOpen,
        recommendations,
        setRecommendations,
        isRecommendationsOpen,
        setIsRecommendationsOpen,
        isLoadingRecommendations,
        setIsLoadingRecommendations,
        lastAddedItem,
        setLastAddedItem,
        cartBounce,
        setCartBounce,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
