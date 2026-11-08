import type { CartItem, ClothingSize } from "@/types/product";

export const CART_STORAGE_KEY = "mehar-cart";
export const CART_STORAGE_VERSION = 1;

const CLOTHING_SIZES: readonly ClothingSize[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Custom",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isClothingSize(value: unknown): value is ClothingSize {
  return (
    typeof value === "string" &&
    CLOTHING_SIZES.some((size) => size === value)
  );
}

function parseCartItem(value: unknown): CartItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    variantId,
    productId,
    productName,
    productSlug,
    size,
    colorName,
    colorHex,
    imageUrl,
    unitPrice,
    quantity,
    maxQuantity,
  } = value;

  if (
    typeof variantId !== "string" ||
    typeof productId !== "string" ||
    typeof productName !== "string" ||
    typeof productSlug !== "string" ||
    !isClothingSize(size) ||
    typeof colorName !== "string" ||
    typeof colorHex !== "string" ||
    !(typeof imageUrl === "string" || imageUrl === null) ||
    typeof unitPrice !== "number" ||
    !Number.isFinite(unitPrice) ||
    unitPrice < 0 ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    typeof maxQuantity !== "number" ||
    !Number.isInteger(maxQuantity) ||
    maxQuantity <= 0 ||
    maxQuantity > 5
  ) {
    return null;
  }

  return {
    variantId,
    productId,
    productName,
    productSlug,
    size,
    colorName,
    colorHex,
    imageUrl,
    unitPrice,
    quantity: Math.min(quantity, maxQuantity),
    maxQuantity,
  };
}

export function parseStoredCart(raw: string | null): CartItem[] {
  if (raw === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      parsed.version !== CART_STORAGE_VERSION ||
      !Array.isArray(parsed.items)
    ) {
      return [];
    }

    const items: CartItem[] = [];
    const variantIds = new Set<string>();

    for (const candidate of parsed.items) {
      const item = parseCartItem(candidate);
      if (item && !variantIds.has(item.variantId)) {
        items.push(item);
        variantIds.add(item.variantId);
      }
    }

    return items;
  } catch {
    return [];
  }
}

export function serializeCart(items: CartItem[]): string {
  return JSON.stringify({ version: CART_STORAGE_VERSION, items });
}

export function readCartFromStorage(): CartItem[] {
  try {
    if (typeof window === "undefined") {
      return [];
    }
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]): boolean {
  try {
    if (typeof window === "undefined") {
      return false;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
    return true;
  } catch {
    return false;
  }
}
