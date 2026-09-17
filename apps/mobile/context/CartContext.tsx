import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "supplyr_cart_v1";

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  add: (product: Product, qty?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  subtotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw) as CartItem[];
          if (Array.isArray(parsed)) setItems(parsed);
        } catch {
          /* ignore */
        }
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, ready]);

  const add = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          quantity: qty,
          name: product.name,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          imageEmoji: product.imageEmoji,
          slug: product.slug,
          unit: product.unit,
        },
      ];
    });
  }, []);

  const setQty = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity < 1) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );
  const subtotalCents = useMemo(
    () => items.reduce((s, i) => s + (i.priceCents || 0) * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      ready,
      count,
      add,
      setQty,
      remove,
      clear,
      subtotalCents,
    }),
    [items, ready, count, add, setQty, remove, clear, subtotalCents]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
