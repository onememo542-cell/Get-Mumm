import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  imageUrl: string;
  chefName: string;
  chefNameAr: string;
}

interface CartEntry extends CartItem {
  qty: number;
}

export interface PlacedOrder {
  id: string;
  items: CartEntry[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  phone: string;
  area: string;
  street: string;
  building: string;
  notes: string;
  placedAt: string;
}

interface CartContextValue {
  items: CartEntry[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  lastOrder: PlacedOrder | null;
  setLastOrder: (order: PlacedOrder) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const DELIVERY_FEE = 25;
const FREE_DELIVERY_THRESHOLD = 150;
const CART_STORAGE_KEY = "get-mumm:cart";
const ORDER_STORAGE_KEY = "get-mumm:last-order";

function readCartFromStorage(): CartEntry[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readOrderFromStorage(): PlacedOrder | null {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>(readCartFromStorage);
  const [isOpen, setIsOpen] = useState(false);
  const [lastOrder, setLastOrderState] = useState<PlacedOrder | null>(readOrderFromStorage);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((e) => e.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setItems((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (idx < 0) return prev;
      const newQty = prev[idx].qty + delta;
      if (newQty <= 0) return prev.filter((e) => e.id !== id);
      const next = [...prev];
      next[idx] = { ...next[idx], qty: newQty };
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(CART_STORAGE_KEY); } catch {}
  }, []);

  const openCart  = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const setLastOrder = useCallback((order: PlacedOrder) => {
    setLastOrderState(order);
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch {}
  }, []);

  return (
    <CartContext.Provider value={{
      items, totalItems, subtotal, deliveryFee, total,
      addItem, removeItem, updateQty, clearCart,
      isOpen, openCart, closeCart,
      lastOrder, setLastOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD };
