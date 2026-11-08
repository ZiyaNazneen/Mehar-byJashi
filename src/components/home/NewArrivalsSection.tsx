import { MOCK_PRODUCTS } from "@/data/mock-products";
import { Product } from "@/types/product";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Sparkles } from "lucide-react";

interface NewArrivalsSectionProps {
  products?: Product[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const displayProducts = products && products.length > 0 ? products : MOCK_PRODUCTS;
  return (
    <section id="new-arrivals" aria-labelledby="new-arrivals-heading" className="py-16 sm:py-24 bg-cream-50 border-y border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Latest Atelier Creations</span>
          </div>
          <h2
            id="new-arrivals-heading"
            className="text-3xl sm:text-4xl font-serif font-normal text-espresso-950"
          >
            New Arrivals & Handcrafted Exclusives
          </h2>
          <p className="text-sm text-espresso-600 font-light leading-relaxed">
            Each silhouette is tailored in limited micro-batches with meticulous attention to fabric weight, hand-embroidery, and contemporary comfort.
          </p>
        </div>

        {/* Product Grid with Category Filter Tabs */}
        <ProductGrid products={displayProducts} columns={4} showFilters={true} />
      </div>
    </section>
  );
}
