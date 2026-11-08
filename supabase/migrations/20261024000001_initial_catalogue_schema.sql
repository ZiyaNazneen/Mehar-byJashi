-- =============================================================================
-- Mehar by Jashi — Initial Catalogue & Security Schema Migration
-- Migration: 20261024000001_initial_catalogue_schema.sql
-- Description:
--   Creates core tables for categories, products, product_categories,
--   product_variants, product_images, and user_roles.
--   Enforces Row Level Security (RLS), integrity constraints, non-negative stock,
--   integer minor units for prices (paise for INR; 100 paise = ₹1.00),
--   least-privilege table grants, and recursion-free role validation functions.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Helper Trigger Function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 2. Categories Table
-- Dynamic categories supporting reordering, visibility toggles, and safe deletion.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_visible_order ON public.categories(is_visible, display_order);

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Products Table
-- Core catalogue table. Prices stored in integer minor units (paise; ₹1 = 100 paise).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  description TEXT,
  fabric TEXT,
  craftsmanship TEXT,
  care_instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  base_price INTEGER NOT NULL CHECK (base_price >= 0),
  compare_at_price INTEGER CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  badge TEXT CHECK (badge IS NULL OR badge IN ('New Arrival', 'Bestseller', 'Limited Edition', 'Atelier Exclusive')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.products.base_price IS 'Base price in minor currency units (paise for INR; e.g. 2850000 = ₹28,500.00)';
COMMENT ON COLUMN public.products.compare_at_price IS 'Optional strike-through compare price in minor units';

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status_created ON public.products(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_new_arrivals ON public.products(status, is_new_arrival) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(status, is_featured) WHERE status = 'published';

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Product-Categories Join Table (Many-to-Many)
-- ON DELETE RESTRICT on category_id ensures a category with assigned products
-- cannot be deleted accidentally without reassigning or soft-hiding first.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_product_categories_category ON public.product_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_product ON public.product_categories(product_id);

-- -----------------------------------------------------------------------------
-- 5. Product Variants Table (Size, Color, SKU & Stock Matrix)
-- Enforces non-negative stock quantity and unique size/color per product.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  size TEXT NOT NULL,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  price_modifier INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_product_size_color UNIQUE (product_id, size, color_name)
);

COMMENT ON COLUMN public.product_variants.stock_quantity IS 'Available inventory count (enforced non-negative)';
COMMENT ON COLUMN public.product_variants.price_modifier IS 'Price adjustment in minor currency units (+/- paise)';

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);

DROP TRIGGER IF EXISTS set_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER set_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 6. Product Images Table
-- Stores gallery images linked to Supabase Storage.
-- UNIQUE (product_id, storage_path) guarantees idempotent seeding and uploads.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  color_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_product_image_storage UNIQUE (product_id, storage_path)
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_order ON public.product_images(product_id, display_order);

-- -----------------------------------------------------------------------------
-- 7. User Roles Table
-- Strictly separates authorization from client-editable user profile data.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'staff', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);

-- -----------------------------------------------------------------------------
-- 8. Security Definer Role Check Functions
-- Bypasses RLS internally with fixed search_path to evaluate roles safely
-- without triggering infinite recursion on the user_roles table.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff_or_owner()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'staff')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'owner'
  );
$$;

-- Ensure any legacy client-callable bootstrap function is dropped
DROP FUNCTION IF EXISTS public.bootstrap_initial_owner(UUID);

-- Restrict execution grants on security functions
-- Only authenticated users may execute role check helpers. Anonymous users are revoked.
REVOKE ALL ON FUNCTION public.is_staff_or_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff_or_owner() TO authenticated;

REVOKE ALL ON FUNCTION public.is_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;

-- -----------------------------------------------------------------------------
-- 9. Explicit Table Permissions (Least Privilege)
-- -----------------------------------------------------------------------------
REVOKE ALL ON TABLE public.user_roles FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.user_roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.user_roles TO authenticated;

GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;

GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;

GRANT SELECT ON TABLE public.product_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_categories TO authenticated;

GRANT SELECT ON TABLE public.product_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_variants TO authenticated;

GRANT SELECT ON TABLE public.product_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_images TO authenticated;

-- -----------------------------------------------------------------------------
-- 10. Row Level Security (RLS) Policies
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- -------------------------
-- Categories RLS
-- -------------------------
DROP POLICY IF EXISTS "Anon can view visible categories" ON public.categories;
CREATE POLICY "Anon can view visible categories"
  ON public.categories FOR SELECT
  TO anon
  USING (is_visible = true);

DROP POLICY IF EXISTS "Authenticated can view visible or staff categories" ON public.categories;
CREATE POLICY "Authenticated can view visible or staff categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (is_visible = true OR public.is_staff_or_owner());

DROP POLICY IF EXISTS "Staff or owner can manage categories" ON public.categories;
CREATE POLICY "Staff or owner can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.is_staff_or_owner())
  WITH CHECK (public.is_staff_or_owner());

-- -------------------------
-- Products RLS
-- -------------------------
DROP POLICY IF EXISTS "Anon can view published products" ON public.products;
CREATE POLICY "Anon can view published products"
  ON public.products FOR SELECT
  TO anon
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated can view published or staff products" ON public.products;
CREATE POLICY "Authenticated can view published or staff products"
  ON public.products FOR SELECT
  TO authenticated
  USING (status = 'published' OR public.is_staff_or_owner());

DROP POLICY IF EXISTS "Staff or owner can manage products" ON public.products;
CREATE POLICY "Staff or owner can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.is_staff_or_owner())
  WITH CHECK (public.is_staff_or_owner());

-- -------------------------
-- Product-Categories RLS
-- -------------------------
DROP POLICY IF EXISTS "Anon can view categories of published products" ON public.product_categories;
CREATE POLICY "Anon can view categories of published products"
  ON public.product_categories FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_categories.product_id
        AND p.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Authenticated can view categories of accessible products" ON public.product_categories;
CREATE POLICY "Authenticated can view categories of accessible products"
  ON public.product_categories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_categories.product_id
        AND (p.status = 'published' OR public.is_staff_or_owner())
    )
  );

DROP POLICY IF EXISTS "Staff or owner can manage product categories" ON public.product_categories;
CREATE POLICY "Staff or owner can manage product categories"
  ON public.product_categories FOR ALL
  TO authenticated
  USING (public.is_staff_or_owner())
  WITH CHECK (public.is_staff_or_owner());

-- -------------------------
-- Product Variants RLS
-- -------------------------
DROP POLICY IF EXISTS "Anon can view variants of published products" ON public.product_variants;
CREATE POLICY "Anon can view variants of published products"
  ON public.product_variants FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
        AND p.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Authenticated can view variants of accessible products" ON public.product_variants;
CREATE POLICY "Authenticated can view variants of accessible products"
  ON public.product_variants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
        AND (p.status = 'published' OR public.is_staff_or_owner())
    )
  );

DROP POLICY IF EXISTS "Staff or owner can manage product variants" ON public.product_variants;
CREATE POLICY "Staff or owner can manage product variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (public.is_staff_or_owner())
  WITH CHECK (public.is_staff_or_owner());

-- -------------------------
-- Product Images RLS
-- -------------------------
DROP POLICY IF EXISTS "Anon can view images of published products" ON public.product_images;
CREATE POLICY "Anon can view images of published products"
  ON public.product_images FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
        AND p.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Authenticated can view images of accessible products" ON public.product_images;
CREATE POLICY "Authenticated can view images of accessible products"
  ON public.product_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
        AND (p.status = 'published' OR public.is_staff_or_owner())
    )
  );

DROP POLICY IF EXISTS "Staff or owner can manage product images" ON public.product_images;
CREATE POLICY "Staff or owner can manage product images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (public.is_staff_or_owner())
  WITH CHECK (public.is_staff_or_owner());

-- -------------------------
-- User Roles RLS (Self-Elevation Prevention & Safe Recursion)
-- -------------------------
DROP POLICY IF EXISTS "Users can view their own role assignments" ON public.user_roles;
CREATE POLICY "Users can view their own role assignments"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Only existing owners can view all user roles" ON public.user_roles;
CREATE POLICY "Only existing owners can view all user roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.is_owner());

DROP POLICY IF EXISTS "Only existing owners can modify user roles" ON public.user_roles;
CREATE POLICY "Only existing owners can modify user roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_owner());

DROP POLICY IF EXISTS "Only existing owners can update user roles" ON public.user_roles;
CREATE POLICY "Only existing owners can update user roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.is_owner())
  WITH CHECK (public.is_owner());

DROP POLICY IF EXISTS "Only existing owners can delete user roles" ON public.user_roles;
CREATE POLICY "Only existing owners can delete user roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.is_owner());
