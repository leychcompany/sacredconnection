"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Cart } from "@/lib/woo/types";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  refreshing: boolean;
  itemsCount: number;
  refresh: () => Promise<void>;
  addItem: (
    id: number,
    quantity?: number,
    variation?: Array<{ attribute: string; value: string }>
  ) => Promise<void>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function cartRequest(body?: Record<string, unknown>): Promise<Cart> {
  const res = await fetch("/api/cart", {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Cart request failed");
  return data as Cart;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const next = await cartRequest();
      setCart(next);
    } catch {
      /* keep previous cart on soft failure */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (
      id: number,
      quantity = 1,
      variation?: Array<{ attribute: string; value: string }>
    ) => {
      setRefreshing(true);
      try {
        const next = await cartRequest({
          action: "add",
          id,
          quantity,
          variation,
        });
        setCart(next);
      } finally {
        setRefreshing(false);
      }
    },
    []
  );

  const updateItem = useCallback(async (key: string, quantity: number) => {
    setRefreshing(true);
    try {
      const next = await cartRequest({ action: "update", key, quantity });
      setCart(next);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const removeItem = useCallback(async (key: string) => {
    setRefreshing(true);
    try {
      const next = await cartRequest({ action: "remove", key });
      setCart(next);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      refreshing,
      itemsCount: cart?.items_count ?? 0,
      refresh,
      addItem,
      updateItem,
      removeItem,
    }),
    [cart, loading, refreshing, refresh, addItem, updateItem, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
