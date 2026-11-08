"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
}

export function ProductGrid({
  products,
  columns = 4,
  showFilters = false,
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Extract unique categories
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const columnClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  return (
    <div>
      {/* Category Filter Pills (Optional) */}
      {showFilters && categories.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? "bg-espresso-950 text-cream-50 font-medium shadow-xs"
                    : "bg-cream-100 text-espresso-700 hover:bg-cream-200"
                }`}
              >
                {cat === "all" ? "View All Pieces" : cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-cream-50 rounded-lg border border-cream-200">
          <p className="text-espresso-600 text-sm">No products found in this category.</p>
        </div>
      ) : (
        <div className={`grid ${columnClass} gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12`}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setActiveModalProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Shared Quick View Modal */}
      <QuickViewModal
        product={activeModalProduct}
        isOpen={Boolean(activeModalProduct)}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
}
