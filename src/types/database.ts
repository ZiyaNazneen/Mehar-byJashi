export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductStatus = "draft" | "published" | "archived";
export type ProductBadge = "New Arrival" | "Bestseller" | "Limited Edition" | "Atelier Exclusive";
export type UserRole = "owner" | "staff" | "customer";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tagline: string | null;
          description: string | null;
          image_url: string | null;
          display_order: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          tagline?: string | null;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          tagline?: string | null;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          subtitle: string | null;
          description: string | null;
          fabric: string | null;
          craftsmanship: string | null;
          care_instructions: Json;
          base_price: number; // Integer minor units (paise)
          compare_at_price: number | null; // Integer minor units (paise)
          currency: string;
          status: ProductStatus;
          badge: ProductBadge | null;
          is_featured: boolean;
          is_new_arrival: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          subtitle?: string | null;
          description?: string | null;
          fabric?: string | null;
          craftsmanship?: string | null;
          care_instructions?: Json;
          base_price: number;
          compare_at_price?: number | null;
          currency?: string;
          status?: ProductStatus;
          badge?: ProductBadge | null;
          is_featured?: boolean;
          is_new_arrival?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          subtitle?: string | null;
          description?: string | null;
          fabric?: string | null;
          craftsmanship?: string | null;
          care_instructions?: Json;
          base_price?: number;
          compare_at_price?: number | null;
          currency?: string;
          status?: ProductStatus;
          badge?: ProductBadge | null;
          is_featured?: boolean;
          is_new_arrival?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_categories: {
        Row: {
          product_id: string;
          category_id: string;
          is_primary: boolean;
          display_order: number;
        };
        Insert: {
          product_id: string;
          category_id: string;
          is_primary?: boolean;
          display_order?: number;
        };
        Update: {
          product_id?: string;
          category_id?: string;
          is_primary?: boolean;
          display_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_categories_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          size: string;
          color_name: string;
          color_hex: string;
          stock_quantity: number;
          price_modifier: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          size: string;
          color_name: string;
          color_hex: string;
          stock_quantity?: number;
          price_modifier?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          size?: string;
          color_name?: string;
          color_hex?: string;
          stock_quantity?: number;
          price_modifier?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          public_url: string;
          alt_text: string;
          display_order: number;
          is_primary: boolean;
          color_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          public_url: string;
          alt_text: string;
          display_order?: number;
          is_primary?: boolean;
          color_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          public_url?: string;
          alt_text?: string;
          display_order?: number;
          is_primary?: boolean;
          color_name?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: UserRole;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_staff_or_owner: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_owner: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      product_status: ProductStatus;
      product_badge: ProductBadge;
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
