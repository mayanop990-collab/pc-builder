"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image_url: string | null;
  icon: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "pcbuilder-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<{ key: number; name: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Ignore unreadable storage and start with an empty cart.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private mode); the cart still works for this visit.
    }
  }, [items, loaded]);

  const addItem = useCallback<CartContextValue["addItem"]>((item, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === item.id);
      if (existing) {
        return current.map((i) =>
          i.id === item.id ? { ...i, ...item, quantity: Math.min(i.quantity + quantity, item.stock) } : i,
        );
      }
      return [...current, { ...item, quantity: Math.min(quantity, item.stock) }];
    });
    setToast({ key: Date.now(), name: item.name });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, addItem, updateQuantity, removeItem, clear],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div
          key={toast.key}
          role="status"
          className="toast-enter fixed bottom-6 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-neon/40 bg-surface/95 p-4 shadow-[0_20px_50px_-15px_var(--color-neon)] backdrop-blur-xl sm:left-auto sm:right-24 sm:translate-x-0"
        >
          <CheckCircle2 className="size-6 shrink-0 text-ok" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{toast.name}</p>
            <p className="text-xs text-muted">Added to your cart</p>
          </div>
          <Link
            href="/cart"
            onClick={() => setToast(null)}
            className="shrink-0 rounded-lg bg-gradient-to-r from-neon to-neon-2 px-3 py-1.5 text-xs font-bold text-bg transition-transform hover:scale-105"
          >
            View cart
          </Link>
          <button type="button" aria-label="Dismiss" onClick={() => setToast(null)} className="text-muted hover:text-text">
            <X className="size-4" />
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
