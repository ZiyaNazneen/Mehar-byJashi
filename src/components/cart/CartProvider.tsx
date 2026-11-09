"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { CartItem } from "@/types/product";
import {
  CART_STORAGE_KEY,
  readCartFromStorage,
  writeCartToStorage,
} from "@/lib/cart-storage";

export type AddResult = {
  status: "added" | "capped" | "at_limit" | "not_ready";
  quantityInCart: number;
};

interface CartSnapshot {
  items: CartItem[];
  isReady: boolean;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isReady: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => AddResult;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const INITIAL_SNAPSHOT: CartSnapshot = { items: [], isReady: false };
let snapshot = INITIAL_SNAPSHOT;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function updateItems(items: CartItem[]) {
  if (!snapshot.isReady || items === snapshot.items) {
    return;
  }

  snapshot = { items, isReady: true };
  writeCartToStorage(items);
  notifyListeners();
}

function handleStorage(event: StorageEvent) {
  if (event.key !== CART_STORAGE_KEY) {
    return;
  }

  snapshot = { items: readCartFromStorage(), isReady: true };
  notifyListeners();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("storage", handleStorage);
    if (!snapshot.isReady) {
      snapshot = { items: readCartFromStorage(), isReady: true };
      notifyListeners();
    }
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return INITIAL_SNAPSHOT;
}

function addItem(
  item: Omit<CartItem, "quantity">,
  quantity = 1
): AddResult {
  if (!snapshot.isReady) {
    return { status: "not_ready", quantityInCart: 0 };
  }

  const existing = snapshot.items.find(
    (cartItem) => cartItem.variantId === item.variantId
  );
  if (existing && existing.quantity >= item.maxQuantity) {
    return { status: "at_limit", quantityInCart: existing.quantity };
  }

  const amountToAdd = Number.isFinite(quantity)
    ? Math.max(1, Math.floor(quantity))
    : 1;
  const requestedTotal = (existing?.quantity ?? 0) + amountToAdd;
  const nextQuantity = Math.min(requestedTotal, item.maxQuantity);
  const nextItem: CartItem = existing
    ? {
        ...existing,
        productName: item.productName,
        imageUrl: item.imageUrl,
        unitPrice: item.unitPrice,
        maxQuantity: item.maxQuantity,
        quantity: nextQuantity,
      }
    : { ...item, quantity: nextQuantity };

  const nextItems = existing
    ? snapshot.items.map((cartItem) =>
        cartItem.variantId === item.variantId ? nextItem : cartItem
      )
    : [...snapshot.items, nextItem];
  updateItems(nextItems);

  return {
    status: requestedTotal > item.maxQuantity ? "capped" : "added",
    quantityInCart: nextQuantity,
  };
}

function removeItem(variantId: string) {
  const nextItems = snapshot.items.filter(
    (item) => item.variantId !== variantId
  );
  if (nextItems.length !== snapshot.items.length) {
    updateItems(nextItems);
  }
}

function updateQuantity(variantId: string, quantity: number) {
  if (quantity <= 0) {
    removeItem(variantId);
    return;
  }

  const existing = snapshot.items.find((item) => item.variantId === variantId);
  if (!existing) {
    return;
  }

  const nextQuantity = Math.min(
    Math.max(1, Math.floor(quantity)),
    existing.maxQuantity
  );
  if (!Number.isFinite(nextQuantity) || nextQuantity === existing.quantity) {
    return;
  }

  updateItems(
    snapshot.items.map((item) =>
      item.variantId === variantId
        ? { ...item, quantity: nextQuantity }
        : item
    )
  );
}

function clearCart() {
  if (snapshot.items.length > 0) {
    updateItems([]);
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = cartSnapshot.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const subtotal = cartSnapshot.items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );

    return {
      items: cartSnapshot.items,
      count,
      subtotal,
      isReady: cartSnapshot.isReady,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    };
  }, [cartSnapshot, isDrawerOpen, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return cart;
}
