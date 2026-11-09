import type { CartItem, Product, ProductVariantInventory } from "@/types/product";
import {
  getEffectivePrice,
  getMaxPurchasableQuantity,
} from "@/lib/product-availability";

export function createCartItemSnapshot(
  product: Product,
  variant: ProductVariantInventory
): Omit<CartItem, "quantity"> {
  const image =
    product.images.find((candidate) => candidate.colorName === variant.colorName) ??
    product.images[0];

  // All cart values are display snapshots, not authoritative checkout values.
  return {
    variantId: variant.id,
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    size: variant.size,
    colorName: variant.colorName,
    colorHex: variant.colorHex,
    imageUrl: image?.url ?? null,
    unitPrice: getEffectivePrice(product, variant),
    maxQuantity: getMaxPurchasableQuantity(variant),
  };
}
