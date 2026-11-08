import {
  Product,
  ProductVariantInventory,
  ColorOption,
  ClothingSize,
} from "@/types/product";

export type VariantAvailability =
  | "in_stock"
  | "low_stock"
  | "sold_out"
  | "unavailable";

export const LOW_STOCK_THRESHOLD = 3;

const SIZE_SORT_ORDER: Record<ClothingSize, number> = {
  XS: 0,
  S: 1,
  M: 2,
  L: 3,
  XL: 4,
  XXL: 5,
  Custom: 6,
};

/**
 * Evaluates the availability state for a variant.
 *
 * Stock-First Rule:
 * The data mapper maps `isAvailable = is_available && stock_quantity > 0`.
 * Therefore, we must inspect `stockQuantity <= 0` FIRST to classify the variant as "sold_out".
 * If `stockQuantity > 0` but `!isAvailable`, it indicates the shop owner explicitly
 * disabled the variant (`is_available = false` in the database), so it is classified as "unavailable".
 */
export function getVariantAvailability(
  variant: ProductVariantInventory | undefined
): VariantAvailability {
  if (!variant) {
    return "unavailable";
  }

  // 1. Stock check first: zero or negative stock is sold out
  if (variant.stockQuantity <= 0) {
    return "sold_out";
  }

  // 2. Disabled check: positive stock but owner marked unavailable
  if (!variant.isAvailable) {
    return "unavailable";
  }

  // 3. Low stock threshold (1-3 items)
  if (variant.stockQuantity <= LOW_STOCK_THRESHOLD) {
    return "low_stock";
  }

  // 4. Sufficient inventory
  return "in_stock";
}

/**
 * Returns true only for stock states that allow placing an order.
 */
export function isPurchasable(availability: VariantAvailability): boolean {
  return availability === "in_stock" || availability === "low_stock";
}

/**
 * Returns the effective price in Rupees, adding any variant price modifier.
 * If no variant is selected, basePrice is returned.
 */
export function getEffectivePrice(
  product: Product,
  variant?: ProductVariantInventory
): number {
  return product.basePrice + (variant?.priceModifier ?? 0);
}

/**
 * Compares compare-at price against the effective price.
 * Returned only if strictly greater than the effective price.
 */
export function getComparePriceToShow(
  product: Product,
  effectivePrice: number
): number | undefined {
  if (
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > effectivePrice
  ) {
    return product.compareAtPrice;
  }
  return undefined;
}

/**
 * Returns all variants that are not marked "unavailable" by the owner.
 */
export function getListedVariants(product: Product): ProductVariantInventory[] {
  return product.variants.filter(
    (v) => getVariantAvailability(v) !== "unavailable"
  );
}

/**
 * Returns colours having at least one listed variant, preserving original definition order.
 */
export function getListedColors(product: Product): ColorOption[] {
  const listed = getListedVariants(product);
  const colorNamesWithInventory = new Set(listed.map((v) => v.colorName));

  return product.availableColors.filter((c) =>
    colorNamesWithInventory.has(c.name)
  );
}

/**
 * Returns listed variants for the selected colour, sorted in luxury atelier size order:
 * XS, S, M, L, XL, XXL, Custom.
 */
export function getListedSizesForColor(
  product: Product,
  colorName: string
): ProductVariantInventory[] {
  const listed = getListedVariants(product);
  const forColor = listed.filter((v) => v.colorName === colorName);

  return forColor.sort((a, b) => {
    const orderA = SIZE_SORT_ORDER[a.size] ?? 99;
    const orderB = SIZE_SORT_ORDER[b.size] ?? 99;
    return orderA - orderB;
  });
}

/**
 * Finds the specific variant matching the given size and colour name.
 */
export function findVariant(
  product: Product,
  size: ClothingSize,
  colorName: string
): ProductVariantInventory | undefined {
  return product.variants.find(
    (v) => v.size === size && v.colorName === colorName
  );
}
