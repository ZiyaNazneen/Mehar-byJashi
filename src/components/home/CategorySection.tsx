import Image from "next/image";
import { MOCK_CATEGORIES } from "@/data/mock-categories";
import { ProductCategory } from "@/types/product";
import { ArrowUpRight } from "lucide-react";

interface CategorySectionProps {
  categories?: ProductCategory[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  const displayCategories = categories && categories.length > 0 ? categories : MOCK_CATEGORIES;

  return (
    <section id="categories" aria-labelledby="categories-heading" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">
            The Collections
          </span>
          <h2
            id="categories-heading"
            className="text-3xl sm:text-4xl font-serif font-normal text-espresso-950"
          >
            Explore by Silhouette & Occasion
          </h2>
          <p className="text-sm text-espresso-600 font-light leading-relaxed">
            From ceremonial festive heirlooms to modern fluid pret, browse our distinct chapters of artisanal womenswear.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayCategories.map((category) => (
            <a
              key={category.id}
              href="#new-arrivals"
              className="group relative flex flex-col overflow-hidden rounded-md bg-cream-50 border border-cream-200/90 shadow-xs hover:shadow-md transition-all duration-300"
            >
              {/* Category Image with Zoom on Hover */}
              <div className="relative aspect-3/4 w-full overflow-hidden bg-cream-200">
                <Image
                  src={category.imageUrl}
                  alt={`Explore ${category.name} collection`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-espresso-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 rounded bg-white/90 text-espresso-900 backdrop-blur-xs">
                    {category.itemCount} Designs
                  </span>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute inset-x-4 bottom-4 text-cream-50 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-300 font-medium">
                      {category.tagline}
                    </span>
                    <h3 className="text-xl font-serif font-normal text-white group-hover:text-gold-200 transition-colors">
                      {category.name}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-espresso-950 transition-all">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Description preview */}
              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <p className="text-xs text-espresso-600 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-3 pt-2 border-t border-cream-100 flex items-center justify-between text-[11px] font-medium text-gold-700 group-hover:text-gold-900">
                  <span className="uppercase tracking-wider">Explore Pieces</span>
                  <span className="text-espresso-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
