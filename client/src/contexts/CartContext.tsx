import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SHOP_PRODUCTS } from "@shared/payments";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  variant?: string;
  quantity: number;
  /** Display-only — authoritative price lives server-side in SHOP_PRODUCTS */
  name: string;
  price: number; // cents
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  /** Total number of items (sum of quantities) */
  count: number;
  /** Total price in cents */
  total: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const STORAGE_KEY = "psychedbox_cart";

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    // Re-validate prices against authoritative catalog
    return parsed
      .map((item) => {
        const catalogProduct = SHOP_PRODUCTS.find((p) => p.id === item.productId);
        if (!catalogProduct) return null;
        return { ...item, price: catalogProduct.price, name: catalogProduct.name };
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded — ignore
  }
}

function itemKey(productId: string, variant?: string) {
  return variant ? `${productId}::${variant}` : productId;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  // Persist whenever items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const key = itemKey(item.productId, item.variant);
      const existing = prev.find(
        (i) => itemKey(i.productId, i.variant) === key
      );
      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.variant) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variant?: string) => {
    const key = itemKey(productId, variant);
    setItems((prev) =>
      prev.filter((i) => itemKey(i.productId, i.variant) !== key)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variant?: string) => {
      const key = itemKey(productId, variant);
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => itemKey(i.productId, i.variant) !== key)
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          itemKey(i.productId, i.variant) === key
            ? { ...i, quantity: Math.min(quantity, 10) }
            : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      total,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [items, count, total, isOpen, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}
