import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { mapDbProductToProduct } from "./mappers";
import { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type VariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
type ImageRow = Database["public"]["Tables"]["product_images"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

interface RawJoinedProduct extends ProductRow {
  product_images: ImageRow[];
  product_variants: VariantRow[];
  product_categories: Array<{
    category_id: string;
    is_primary: boolean;
    categories: CategoryRow | null;
  }>;
}

/**
 * Transforms raw Supabase joined query rows into the storefront Product[] structure.
 */
function transformJoinedProducts(rawProducts: unknown[]): Product[] {
  return (rawProducts as RawJoinedProduct[]).map((raw) => {
    // Find primary or first assigned category
    const primaryLink =
      raw.product_categories?.find((pc) => pc.is_primary) ||
      raw.product_categories?.[0];
    const categoryInfo = primaryLink?.categories
      ? {
          name: primaryLink.categories.name,
          slug: primaryLink.categories.slug,
        }
      : undefined;

    return mapDbProductToProduct(
      raw,
      raw.product_images || [],
      raw.product_variants || [],
      categoryInfo
    );
  });
}

/**
 * Retrieves latest new arrival products with joined variants and images.
 * Falls back to mock products if database is unconfigured or empty.
 */
export async function getNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit);
    }

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (*),
        product_variants (*),
        product_categories (
          category_id,
          is_primary,
          categories (*)
        )
      `)
      .eq("status", "published")
      .eq("is_new_arrival", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit);
    }

    return transformJoinedProducts(data);
  } catch (err) {
    console.warn("Falling back to mock new arrivals due to error:", err);
    return MOCK_PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit);
  }
}

/**
 * Retrieves featured products for editorial showcases.
 */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
    }

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (*),
        product_variants (*),
        product_categories (
          category_id,
          is_primary,
          categories (*)
        )
      `)
      .eq("status", "published")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
    }

    return transformJoinedProducts(data);
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
  }
}

/**
 * Retrieves all published products for catalogue listing and search.
 */
export async function getAllPublishedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_PRODUCTS;
    }

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (*),
        product_variants (*),
        product_categories (
          category_id,
          is_primary,
          categories (*)
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS;
    }

    return transformJoinedProducts(data);
  } catch {
    return MOCK_PRODUCTS;
  }
}

/**
 * Retrieves a single published product by slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
    }

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (*),
        product_variants (*),
        product_categories (
          category_id,
          is_primary,
          categories (*)
        )
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
    }

    const transformed = transformJoinedProducts([data]);
    return transformed[0] || null;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}
