export type ClothingSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Custom";

export interface ColorOption {
  name: string;
  hex: string;
  label?: string;
}

export interface ProductVariantInventory {
  id: string;
  size: ClothingSize;
  colorName: string;
  colorHex: string;
  sku: string;
  stockQuantity: number;
  isAvailable: boolean;
  priceModifier?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  colorName?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  tagline: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  fabric: string;
  craftsmanship: string;
  careInstructions: string[];
  basePrice: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  categorySlug: string;
  badge?: "New Arrival" | "Bestseller" | "Limited Edition" | "Atelier Exclusive";
  images: ProductImage[];
  availableColors: ColorOption[];
  availableSizes: ClothingSize[];
  variants: ProductVariantInventory[];
  totalStock: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  size: ClothingSize;
  colorName: string;
  colorHex: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
