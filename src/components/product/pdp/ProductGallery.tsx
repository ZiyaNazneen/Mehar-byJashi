"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle zero images case with neutral cream placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-3/4 bg-cream-100 rounded-sm border border-cream-200 flex flex-col items-center justify-center p-6 text-center">
        <span className="font-serif text-lg text-espresso-800 font-normal">
          {productName}
        </span>
        <span className="text-xs text-espresso-500 mt-1 uppercase tracking-widest">
          Atelier Imagery In Preparation
        </span>
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];
  const activeAlt = activeImage.alt || `${productName} view ${activeIndex + 1}`;
  const hasMultipleImages = images.length > 1;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails: horizontal row on mobile, vertical column on lg+ */}
      {hasMultipleImages && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[640px] shrink-0 pb-2 lg:pb-0">
          {images.map((img, idx) => {
            const isActive = activeIndex === idx;
            const thumbAlt = img.alt || `${productName} thumbnail ${idx + 1}`;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1} of ${productName}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative w-20 h-26 sm:w-24 sm:h-32 rounded-sm overflow-hidden border-2 transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-gold-500 ${
                  isActive
                    ? "border-gold-600 ring-1 ring-gold-600 shadow-xs"
                    : "border-cream-200 opacity-75 hover:opacity-100 hover:border-gold-400"
                }`}
              >
                <Image
                  src={img.url}
                  alt={thumbAlt}
                  fill
                  sizes="96px"
                  className="object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Viewport */}
      <div className="relative flex-1 aspect-3/4 rounded-sm overflow-hidden bg-cream-100 border border-cream-200/90 shadow-xs">
        <Image
          src={activeImage.url}
          alt={activeAlt}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-700 ease-out"
        />

        {/* Prev / Next navigation buttons (only when multiple images) */}
        {hasMultipleImages && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="pointer-events-auto p-2 rounded-full bg-white/80 hover:bg-white text-espresso-900 shadow-sm backdrop-blur-xs transition-colors focus-visible:outline-2 focus-visible:outline-gold-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="pointer-events-auto p-2 rounded-full bg-white/80 hover:bg-white text-espresso-900 shadow-sm backdrop-blur-xs transition-colors focus-visible:outline-2 focus-visible:outline-gold-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
