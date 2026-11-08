import { createClient } from "@/lib/supabase/server";
import { ProductCategory } from "@/types/product";
import { MOCK_CATEGORIES } from "@/data/mock-categories";
import { mapDbCategoryToProductCategory } from "./mappers";

/**
 * Retrieves all visible categories sorted by display_order.
 * Automatically falls back to mock data if Supabase is unconfigured or unavailable.
 */
export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_CATEGORIES;
    }

    const { data: categories, error } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        slug,
        tagline,
        description,
        image_url,
        display_order,
        is_visible,
        created_at,
        updated_at,
        product_categories(count)
      `)
      .eq("is_visible", true)
      .order("display_order", { ascending: true });

    if (error || !categories || categories.length === 0) {
      return MOCK_CATEGORIES;
    }

    return categories.map((cat) => {
      // Extract count from joined product_categories aggregate
      const countItem = Array.isArray(cat.product_categories)
        ? cat.product_categories[0]
        : (cat.product_categories as unknown as { count?: number } | undefined);
      const itemCount = (countItem && typeof countItem === "object" && "count" in countItem)
        ? (countItem.count as number)
        : 0;

      return mapDbCategoryToProductCategory(cat, itemCount);
    });
  } catch (err) {
    console.warn("Falling back to mock categories due to data error:", err);
    return MOCK_CATEGORIES;
  }
}

/**
 * Retrieves a single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
    }

    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_visible", true)
      .single();

    if (error || !category) {
      return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
    }

    return mapDbCategoryToProductCategory(category);
  } catch {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
  }
}
