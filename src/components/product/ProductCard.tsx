"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Heart, Eye, Sparkles } from "lucide-react";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primaryImage = product.images[0];
  const hoverImage = product.images[1] || primaryImage;

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setIsModalOpen(true);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <>
      <article
        className="group relative flex flex-col transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Card Container */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-cream-100 rounded-sm border border-cream-200/80">
          {/* Primary & Hover Image */}
          <div className="relative w-full h-full">
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover object-top transition-all duration-700 ease-out ${
                isHovered && hoverImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
            />
            {hoverImage && (
              <Image
                src={hoverImage.url}
                alt={hoverImage.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover object-top transition-all duration-700 ease-out absolute inset-0 ${
                  isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
              />
            )}
          </div>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-xs text-espresso-900 border border-gold-300/50 text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-gold-600" />
                {product.badge}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-espresso-800 backdrop-blur-xs transition-colors shadow-xs"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted
                  ? "fill-rose-600 text-rose-600"
                  : "text-espresso-700 hover:text-gold-600"
              }`}
            />
          </button>

          {/* Quick View Button Hover Overlay */}
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={handleQuickViewClick}
              className="w-full py-2.5 px-4 bg-espresso-950/90 hover:bg-espresso-950 text-cream-50 text-xs uppercase tracking-widest font-medium rounded-sm backdrop-blur-xs shadow-md flex items-center justify-center gap-2 transition-transform transform translate-y-2 group-hover:translate-y-0"
            >
              <Eye className="w-3.5 h-3.5 text-gold-400" />
              <span>Quick View & Select Size</span>
            </button>
          </div>
        </div>

        {/* Product Meta & Details */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-espresso-500">
            <span className="uppercase tracking-widest text-[10px] font-medium text-gold-700">
              {product.category}
            </span>
            <span className="text-[11px] font-light">
              {product.availableSizes.join(" • ")}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-serif text-espresso-950 font-normal group-hover:text-gold-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-espresso-600 line-clamp-1">
            {product.subtitle}
          </p>

          {/* Price & Color Swatches */}
          <div className="pt-1 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-espresso-950">
                {formatCurrency(product.basePrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-espresso-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Color Swatch Dots */}
            {product.availableColors.length > 0 && (
              <div className="flex items-center gap-1.5" aria-label="Available colours">
                {product.availableColors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColorIndex(idx);
                    }}
                    title={color.name}
                    className={`w-3.5 h-3.5 rounded-full border border-cream-300 transition-transform ${
                      selectedColorIndex === idx ? "scale-125 ring-1 ring-gold-600" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Embedded modal if not managed by parent grid */}
      {!onQuickView && (
        <QuickViewModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
