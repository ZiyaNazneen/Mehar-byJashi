import { Database } from "@/types/database";
import {
  Product,
  ProductCategory,
  ProductVariantInventory,
  ProductImage,
  ColorOption,
  ClothingSize,
} from "@/types/product";
import { paiseToRupees } from "@/lib/utils";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type VariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
type ImageRow = Database["public"]["Tables"]["product_images"]["Row"];

/**
 * Maps a database category row to the storefront ProductCategory interface.
 */
export function mapDbCategoryToProductCategory(
  row: CategoryRow,
  itemCount: number = 0
): ProductCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    imageUrl: row.image_url || "/images/placeholder-category.jpg",
    itemCount,
    tagline: row.tagline || "",
  };
}

/**
 * Maps a database product row with joined images and variants to the storefront Product interface.
 * Correctly converts minor currency units (paise) to display amounts (rupees).
 */
export function mapDbProductToProduct(
  productRow: ProductRow,
  images: ImageRow[] = [],
  variants: VariantRow[] = [],
  category?: { name: string; slug: string }
): Product {
  // Parse care instructions from JSONB safely
  let careInstructions: string[] = [];
  if (Array.isArray(productRow.care_instructions)) {
    careInstructions = productRow.care_instructions.filter(
      (item): item is string => typeof item === "string"
    );
  }

  // Sort images by display_order
  const sortedImages: ProductImage[] = images
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => ({
      id: img.id,
      url: img.public_url,
      alt: img.alt_text,
      isPrimary: img.is_primary,
      colorName: img.color_name || undefined,
    }));

  // Fallback placeholder image if none uploaded yet
  if (sortedImages.length === 0) {
    sortedImages.push({
      id: "placeholder",
      url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop",
      alt: productRow.name,
      isPrimary: true,
    });
  }

  // Map variants and extract available sizes and colors
  const mappedVariants: ProductVariantInventory[] = variants.map((v) => ({
    id: v.id,
    size: v.size as ClothingSize,
    colorName: v.color_name,
    colorHex: v.color_hex,
    sku: v.sku,
    stockQuantity: v.stock_quantity,
    isAvailable: v.is_available && v.stock_quantity > 0,
    priceModifier: v.price_modifier !== 0 ? paiseToRupees(v.price_modifier) : undefined,
  }));

  // Unique sizes in order of appearance
  const availableSizes = Array.from(
    new Set(mappedVariants.map((v) => v.size))
  ) as ClothingSize[];

  // Unique colors in order of appearance
  const colorMap = new Map<string, ColorOption>();
  for (const v of mappedVariants) {
    if (!colorMap.has(v.colorName)) {
      colorMap.set(v.colorName, {
        name: v.colorName,
        hex: v.colorHex,
      });
    }
  }
  const availableColors = Array.from(colorMap.values());

  // Aggregate stock
  const totalStock = mappedVariants.reduce((sum, v) => sum + v.stockQuantity, 0);

  return {
    id: productRow.id,
    slug: productRow.slug,
    name: productRow.name,
    subtitle: productRow.subtitle || "",
    description: productRow.description || "",
    fabric: productRow.fabric || "",
    craftsmanship: productRow.craftsmanship || "",
    careInstructions,
    basePrice: paiseToRupees(productRow.base_price),
    compareAtPrice: productRow.compare_at_price
      ? paiseToRupees(productRow.compare_at_price)
      : undefined,
    currency: productRow.currency,
    category: category?.name || "Luxury Pret",
    categorySlug: category?.slug || "luxury-pret",
    badge: productRow.badge || undefined,
    images: sortedImages,
    availableColors,
    availableSizes,
    variants: mappedVariants,
    totalStock,
    isNewArrival: productRow.is_new_arrival,
    isFeatured: productRow.is_featured,
  };
}
