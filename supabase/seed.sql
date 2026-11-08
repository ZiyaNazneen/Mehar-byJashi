-- =============================================================================
-- Mehar by Jashi — Seed Data Script
-- File: supabase/seed.sql
-- Description:
--   Populates the database with the initial 4 categories, 8 luxury products,
--   variants, inventory, and imagery from the approved storefront.
--   Prices are stored in integer minor units (paise; ₹1 = 100 paise).
--   Run this in the Supabase SQL Editor once your project is created.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Insert Categories
-- -----------------------------------------------------------------------------
INSERT INTO public.categories (id, name, slug, tagline, description, image_url, display_order, is_visible)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Luxury Pret',
    'luxury-pret',
    'Day-to-Evening Sophistication',
    'Effortless silhouettes adorned with delicate resham threadwork and subtle gold accents for everyday elegance.',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
    1,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Festive Couture',
    'festive-couture',
    'Regal Celebrations',
    'Grand heirlooms embellished with intricate dabka, zardozi, and hand-embroidered metallic florets.',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
    2,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Silk & Organza',
    'silk-organza',
    'Fluid & Luminous',
    'Featherlight pure silk organza dupattas and fluid chanderi kurtas bathed in ethereal champagne tones.',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop',
    3,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'Contemporary Co-ords',
    'contemporary-coords',
    'Modern Fusion Tailoring',
    'Modern tailored jacket sets, flared palazzos, and fusion tunics with minimalist artisanal detailing.',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
    4,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- -----------------------------------------------------------------------------
-- 2. Insert Products
-- -----------------------------------------------------------------------------
INSERT INTO public.products (
  id, name, slug, subtitle, description, fabric, craftsmanship,
  care_instructions, base_price, compare_at_price, currency, status,
  badge, is_featured, is_new_arrival
)
VALUES
  (
    'b2000000-0000-0000-0000-000000000001',
    'Zarina Raw Silk Ensemble',
    'zarina-hand-embroidered-raw-silk-kurta-set',
    'Champagne Raw Silk with Hand-Sewn Zardozi & Mukaish',
    'A masterpiece of timeless regal fashion. Crafted from lustrous hand-loomed raw silk in champagne gold, featuring intricate marodi thread embroidery along the split neckline and sleeves, accompanied by tailored cigarette trousers and an airy organza dupatta.',
    '100% Hand-Spun Mulberry Raw Silk with Pure Silk Organza Dupatta',
    'Hand-embroidery by master Lucknowi karigars taking over 48 hours per garment',
    '["Specialist dry clean only", "Iron inside out on silk setting", "Store in breathable cotton garment bag"]'::jsonb,
    2850000, -- ₹28,500.00
    3200000, -- ₹32,000.00
    'INR',
    'published',
    'Atelier Exclusive',
    true,
    true
  ),
  (
    'b2000000-0000-0000-0000-000000000002',
    'Noor Chanderi Angrakha',
    'noor-e-chanderi-angrakha-suit',
    'Ivory Chanderi Silk with Gota Patti & Tassel Accents',
    'A classic Mughal-inspired asymmetrical silhouette rendered in gossamer ivory Chanderi silk. Accented with subtle golden gotta patti borders, delicate pearl tassels, and flared kalis that drape with poetic fluidity.',
    'Chanderi Silk-Cotton blend with mulmul lining',
    'Gota patti appliqué and hand-stitched silk potli buttons',
    '["Gentle dry clean recommended", "Do not wring", "Steam press on low"]'::jsonb,
    2400000, -- ₹24,000.00
    NULL,
    'INR',
    'published',
    'New Arrival',
    true,
    true
  ),
  (
    'b2000000-0000-0000-0000-000000000003',
    'Shahana Tissue Organza Sari',
    'shahana-embroidered-tissue-organza-sari',
    'Liquid Gold Tissue Silk with Scalloped Embroidered Border',
    'Draped like pure liquid gold, this tissue organza sari shimmers delicately under warm evening light. Features hand-cut scalloped borders with resham florets and comes with an unstitched heavy brocade blouse piece.',
    'Pure Tissue Organza with Silk Warp',
    'Hand-scalloped borders with micro-sequin and thread embroidery',
    '["Dry clean only", "Do not spray perfume directly on zari work"]'::jsonb,
    3450000, -- ₹34,500.00
    NULL,
    'INR',
    'published',
    'Limited Edition',
    false,
    true
  ),
  (
    'b2000000-0000-0000-0000-000000000004',
    'Aalia Tailored Co-ord Set',
    'aalia-tailored-tuxedo-jacket-coord-set',
    'Warm Cream Crepe with Gilded Hand-Embroidered Lapel',
    'A modern reinterpretation of power dressing through an Eastern artisanal lens. Tailored from substantial double-crepe in warm cream with hand-couched gold zari running across the peak lapel, paired with structured wide-leg trousers.',
    'High-grade Viscose Double Crepe with Satin Cupro Lining',
    'Sartorial tailoring with bespoke hand-worked metal bullion wire lapel',
    '["Specialist dry clean only", "Professional steam press"]'::jsonb,
    2650000, -- ₹26,500.00
    2950000, -- ₹29,500.00
    'INR',
    'published',
    'Bestseller',
    true,
    false
  ),
  (
    'b2000000-0000-0000-0000-000000000005',
    'Mahirah Chikankari Anarkali',
    'mahirah-chikankari-ivory-anarkali',
    'Pure Georgette with Shadow Work & Fine Mukaish Badla',
    'Timeless grace captured in a 16-kali floor-length silhouette. Pure georgette intricately hand-embroidered with authentic Lucknowi shadow work and dusted with starry silver and gold mukaish badla points.',
    '100% Pure Silk Georgette with Pure Cotton Slip',
    'Authentic hand-embroidery by women artisan cooperatives in Awadh',
    '["Specialist dry clean only", "Avoid sharp jewelry friction"]'::jsonb,
    3800000, -- ₹38,000.00
    NULL,
    'INR',
    'published',
    'Atelier Exclusive',
    true,
    true
  ),
  (
    'b2000000-0000-0000-0000-000000000006',
    'Layla Draped Silk Kaftan',
    'layla-minimalist-draped-kaftan-dress',
    'Heavy Sand-Washed Silk with Gilded Threaded Tassels',
    'Effortless luxury in motion. An architectural draped kaftan cut from sand-washed silk that falls like water. Features a soft V-neckline framed by delicate gold zari couching and weighted silk tassels.',
    '100% Sand-Washed Habotai Silk (32 momme)',
    'French seams and artisanal gold metallic corded edges',
    '["Dry clean or gentle hand wash in cold water with silk detergent", "Lay flat in shade to dry"]'::jsonb,
    2150000, -- ₹21,500.00
    NULL,
    'INR',
    'published',
    'New Arrival',
    false,
    true
  ),
  (
    'b2000000-0000-0000-0000-000000000007',
    'Yasmeen Brocade Jacket Set',
    'yasmeen-banarasi-brocade-cropped-jacket-set',
    'Vintage Banarasi Kadwa Weave with Pleated Silk Trousers',
    'An heirloom piece blending regal Indian heritage with contemporary couture proportions. Woven in Varanasi on antique jacquard looms with real gold zari threads, paired with ankle-skimming cigarette pants.',
    'Pure Katan Silk Banarasi Brocade with Silk Organza accents',
    'Authentic Kadwa handloom technique taking 22 days of weaving',
    '["Specialist dry clean only", "Preserve in acid-free tissue paper"]'::jsonb,
    4200000, -- ₹42,000.00
    NULL,
    'INR',
    'published',
    'Limited Edition',
    true,
    false
  ),
  (
    'b2000000-0000-0000-0000-000000000008',
    'Tarana Kalamkari Cape',
    'tarana-hand-painted-kalamkari-trench-cape',
    'Hand-Painted Natural Dyes on Ahimsa Silk with Gold Piping',
    'Wearable art celebrating botanical natural dyes. Hand-painted with tamarind pens and natural minerals onto cruelty-free peace silk, finished with subtle champagne metallic piping along the cascade drape.',
    '100% Ahimsa Peace Silk with Natural Mineral Pigments',
    'Authentic Srikalahasti kalamkari freehand drawing and organic washing',
    '["Dry clean only", "Keep away from direct sunlight when not in use"]'::jsonb,
    2900000, -- ₹29,000.00
    NULL,
    'INR',
    'published',
    'Atelier Exclusive',
    false,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  craftsmanship = EXCLUDED.craftsmanship,
  care_instructions = EXCLUDED.care_instructions,
  base_price = EXCLUDED.base_price,
  compare_at_price = EXCLUDED.compare_at_price,
  currency = EXCLUDED.currency,
  status = EXCLUDED.status,
  badge = EXCLUDED.badge,
  is_featured = EXCLUDED.is_featured,
  is_new_arrival = EXCLUDED.is_new_arrival;

-- -----------------------------------------------------------------------------
-- 3. Link Products to Categories
-- -----------------------------------------------------------------------------
INSERT INTO public.product_categories (product_id, category_id, is_primary, display_order)
VALUES
  ('b2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', true, 1), -- Zarina -> Festive Couture
  ('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', true, 1), -- Noor -> Luxury Pret
  ('b2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', true, 1), -- Shahana -> Silk & Organza
  ('b2000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', true, 1), -- Aalia -> Contemporary Co-ords
  ('b2000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', true, 2), -- Mahirah -> Festive Couture
  ('b2000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', true, 2), -- Layla -> Luxury Pret
  ('b2000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', true, 3), -- Yasmeen -> Festive Couture
  ('b2000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004', true, 2)  -- Tarana -> Contemporary Co-ords
ON CONFLICT (product_id, category_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Insert Product Variants & Inventory
-- -----------------------------------------------------------------------------
INSERT INTO public.product_variants (product_id, sku, size, color_name, color_hex, stock_quantity, price_modifier, is_available)
VALUES
  -- Zarina variants
  ('b2000000-0000-0000-0000-000000000001', 'MBJ-ZAR-CG-XS', 'XS', 'Champagne Gold', '#E3CCA2', 4, 0, true),
  ('b2000000-0000-0000-0000-000000000001', 'MBJ-ZAR-CG-S',  'S',  'Champagne Gold', '#E3CCA2', 6, 0, true),
  ('b2000000-0000-0000-0000-000000000001', 'MBJ-ZAR-CG-M',  'M',  'Champagne Gold', '#E3CCA2', 5, 0, true),
  ('b2000000-0000-0000-0000-000000000001', 'MBJ-ZAR-CG-L',  'L',  'Champagne Gold', '#E3CCA2', 3, 0, true),
  ('b2000000-0000-0000-0000-000000000001', 'MBJ-ZAR-CG-XL', 'XL', 'Champagne Gold', '#E3CCA2', 2, 0, true),
  ('b2000000-0000-0000-0000-000000000001', 'MBJ-ZAR-CG-CUST', 'Custom', 'Champagne Gold', '#E3CCA2', 10, 0, true),
  
  -- Noor variants
  ('b2000000-0000-0000-0000-000000000002', 'MBJ-NOOR-IV-S', 'S', 'Ivory Pearl', '#FDFBF7', 5, 0, true),
  ('b2000000-0000-0000-0000-000000000002', 'MBJ-NOOR-IV-M', 'M', 'Ivory Pearl', '#FDFBF7', 7, 0, true),
  ('b2000000-0000-0000-0000-000000000002', 'MBJ-NOOR-IV-L', 'L', 'Ivory Pearl', '#FDFBF7', 4, 0, true),
  
  -- Shahana variants
  ('b2000000-0000-0000-0000-000000000003', 'MBJ-SHAH-LC-CUST', 'Custom', 'Liquid Champagne', '#DFC38A', 8, 0, true),
  
  -- Aalia variants
  ('b2000000-0000-0000-0000-000000000004', 'MBJ-AAL-CR-XS', 'XS', 'Warm Cream', '#F5F0E8', 3, 0, true),
  ('b2000000-0000-0000-0000-000000000004', 'MBJ-AAL-CR-S',  'S',  'Warm Cream', '#F5F0E8', 8, 0, true),
  ('b2000000-0000-0000-0000-000000000004', 'MBJ-AAL-CR-M',  'M',  'Warm Cream', '#F5F0E8', 6, 0, true),
  
  -- Mahirah variants
  ('b2000000-0000-0000-0000-000000000005', 'MBJ-MAH-IV-S', 'S', 'Ivory Pearl', '#FCFBF8', 3, 0, true),
  ('b2000000-0000-0000-0000-000000000005', 'MBJ-MAH-IV-M', 'M', 'Ivory Pearl', '#FCFBF8', 4, 0, true),
  
  -- Layla variants
  ('b2000000-0000-0000-0000-000000000006', 'MBJ-LAY-WS-S', 'S', 'Warm Sand', '#E9DFCF', 7, 0, true),
  ('b2000000-0000-0000-0000-000000000006', 'MBJ-LAY-WS-M', 'M', 'Warm Sand', '#E9DFCF', 9, 0, true),
  
  -- Yasmeen variants
  ('b2000000-0000-0000-0000-000000000007', 'MBJ-YAS-RC-S', 'S', 'Royal Champagne', '#D6BF8E', 2, 0, true),
  ('b2000000-0000-0000-0000-000000000007', 'MBJ-YAS-RC-M', 'M', 'Royal Champagne', '#D6BF8E', 3, 0, true),
  
  -- Tarana variants
  ('b2000000-0000-0000-0000-000000000008', 'MBJ-TAR-EP-S', 'S', 'Earthy Parchment', '#E8E0D2', 4, 0, true),
  ('b2000000-0000-0000-0000-000000000008', 'MBJ-TAR-EP-M', 'M', 'Earthy Parchment', '#E8E0D2', 5, 0, true)
ON CONFLICT (sku) DO UPDATE SET
  stock_quantity = EXCLUDED.stock_quantity,
  is_available = EXCLUDED.is_available;

-- -----------------------------------------------------------------------------
-- 5. Insert Product Images
-- -----------------------------------------------------------------------------
INSERT INTO public.product_images (product_id, storage_path, public_url, alt_text, display_order, is_primary)
VALUES
  ('b2000000-0000-0000-0000-000000000001', 'products/zarina/primary.jpg', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop', 'Zarina Champagne Raw Silk Kurta Ensemble with handcrafted gold embroidery', 0, true),
  ('b2000000-0000-0000-0000-000000000001', 'products/zarina/detail.jpg', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop', 'Detail view of Zarina Raw Silk Ensemble zardozi cuff embroidery', 1, false),
  ('b2000000-0000-0000-0000-000000000002', 'products/noor/primary.jpg', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop', 'Noor Chanderi Angrakha in ivory and subtle gold gota borders', 0, true),
  ('b2000000-0000-0000-0000-000000000002', 'products/noor/detail.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop', 'Noor Chanderi Angrakha side angle showcase', 1, false),
  ('b2000000-0000-0000-0000-000000000003', 'products/shahana/primary.jpg', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop', 'Shahana Tissue Organza Sari draped with scalloped gold border', 0, true),
  ('b2000000-0000-0000-0000-000000000003', 'products/shahana/detail.jpg', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop', 'Close-up of Shahana sari pallu craftsmanship', 1, false),
  ('b2000000-0000-0000-0000-000000000004', 'products/aalia/primary.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop', 'Aalia Tailored Cream Co-ord set with gold embroidered lapel', 0, true),
  ('b2000000-0000-0000-0000-000000000004', 'products/aalia/detail.jpg', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop', 'Aalia Co-ord set back and fabric drape view', 1, false),
  ('b2000000-0000-0000-0000-000000000005', 'products/mahirah/primary.jpg', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=900&auto=format&fit=crop', 'Mahirah Chikankari Ivory Anarkali with intricate mukaish detailing', 0, true),
  ('b2000000-0000-0000-0000-000000000005', 'products/mahirah/detail.jpg', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop', 'Mahirah Chikankari sleeve and bodice embroidery close-up', 1, false),
  ('b2000000-0000-0000-0000-000000000006', 'products/layla/primary.jpg', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop', 'Layla Draped Silk Kaftan in warm sand with golden tassels', 0, true),
  ('b2000000-0000-0000-0000-000000000006', 'products/layla/detail.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop', 'Layla Draped Silk Kaftan movement view', 1, false),
  ('b2000000-0000-0000-0000-000000000007', 'products/yasmeen/primary.jpg', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop', 'Yasmeen Brocade cropped jacket set with heritage gold motifs', 0, true),
  ('b2000000-0000-0000-0000-000000000007', 'products/yasmeen/detail.jpg', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop', 'Yasmeen Banarasi brocade weave macro view', 1, false),
  ('b2000000-0000-0000-0000-000000000008', 'products/tarana/primary.jpg', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop', 'Tarana Hand-painted Kalamkari cape on ahimsa silk with champagne trim', 0, true),
ON CONFLICT (product_id, storage_path) DO UPDATE SET
  public_url = EXCLUDED.public_url,
  alt_text = EXCLUDED.alt_text,
  display_order = EXCLUDED.display_order,
  is_primary = EXCLUDED.is_primary;
