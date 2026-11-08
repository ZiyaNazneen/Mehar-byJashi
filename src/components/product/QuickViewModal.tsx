"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, ClothingSize, ColorOption } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  Check,
  Sparkles,
  ShoppingBag,
  Ruler,
  Truck,
} from "lucide-react";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function QuickViewDialog({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(
    product.availableColors[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(
    product.availableSizes[0] || "M"
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);

  // Find variant matching selected size and color
  const matchedVariant = product.variants.find(
    (v) =>
      v.size === selectedSize &&
      (!selectedColor || v.colorName === selectedColor.name)
  );

  const stockCount = matchedVariant?.stockQuantity ?? product.totalStock;

  const handleAddToBag = () => {
    setAddedToBag(true);
    setTimeout(() => {
      setAddedToBag(false);
    }, 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl border border-cream-200 overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product quick view"
          className="absolute top-4 right-4 z-20 p-2 text-espresso-600 hover:text-espresso-950 bg-white/80 backdrop-blur-sm rounded-full transition-colors border border-cream-200"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Product Image Gallery Column */}
        <div className="w-full md:w-1/2 bg-cream-50 flex flex-col justify-between p-6">
          <div className="relative aspect-3/4 w-full rounded-md overflow-hidden bg-cream-100 border border-cream-200">
            <Image
              src={product.images[activeImageIndex]?.url || product.images[0].url}
              alt={product.images[activeImageIndex]?.alt || product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-all duration-300"
              priority
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-espresso-950/90 text-gold-300 text-[10px] tracking-widest uppercase font-medium px-2.5 py-1 rounded">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 rounded border-2 overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-gold-500 ring-1 ring-gold-500"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Selection Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-gold-600 font-semibold">
                {product.category}
              </span>
              <h3
                id="quick-view-title"
                className="text-2xl font-serif font-normal text-espresso-950"
              >
                {product.name}
              </h3>
              <p className="text-xs text-espresso-600">{product.subtitle}</p>
            </div>

            {/* Pricing */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-xl font-medium text-espresso-950">
                {formatCurrency(product.basePrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-espresso-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
              <span className="text-[11px] text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full font-medium">
                Made-to-Order
              </span>
            </div>

            {/* Color Selection */}
            {product.availableColors.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-espresso-700 font-medium">
                    Colour:{" "}
                    <span className="text-espresso-950 font-semibold">
                      {selectedColor?.name}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.availableColors.map((color) => {
                    const isSelected = selectedColor?.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select color ${color.name}`}
                        className={`group relative p-1 rounded-full transition-all ${
                          isSelected
                            ? "ring-2 ring-gold-600 ring-offset-2"
                            : "hover:ring-1 hover:ring-cream-300"
                        }`}
                        title={color.name}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-cream-300 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-espresso-700 font-medium">
                  Select Size:{" "}
                  <span className="text-espresso-950 font-semibold">
                    {selectedSize}
                  </span>
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[11px] text-gold-700 hover:text-gold-900 underline underline-offset-2"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size & Fit Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs font-medium rounded border transition-all text-center ${
                        isSelected
                          ? "bg-espresso-950 text-cream-50 border-espresso-950"
                          : "bg-white text-espresso-800 border-cream-300 hover:border-gold-500"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  stockCount > 0 ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span className="text-espresso-600">
                {stockCount > 0
                  ? `In Stock (${stockCount} available for immediate atelier cut)`
                  : "Made on Pre-Order (Estimated 14 days)"}
              </span>
            </div>

            {/* Short Craft Narrative */}
            <div className="mt-6 p-3.5 bg-cream-50 rounded border border-cream-200 text-xs text-espresso-700 space-y-1">
              <div className="font-medium text-espresso-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Craft & Noble Fabric</span>
              </div>
              <p className="text-[11px] text-espresso-600 leading-relaxed">
                {product.fabric}. {product.craftsmanship}.
              </p>
            </div>
          </div>

          {/* Add to Bag CTA */}
          <div className="mt-8 pt-6 border-t border-cream-200">
            <button
              onClick={handleAddToBag}
              disabled={addedToBag}
              className={`w-full py-3.5 px-6 rounded font-medium text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                addedToBag
                  ? "bg-emerald-700 text-white"
                  : "bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white"
              }`}
            >
              {addedToBag ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Your Atelier Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-gold-300" />
                  <span>Add to Bag • {formatCurrency(product.basePrice)}</span>
                </>
              )}
            </button>
            <p className="mt-2.5 text-center text-[10px] text-espresso-500 flex items-center justify-center gap-1">
              <Truck className="w-3 h-3 text-gold-600" />
              <span>Complimentary insured worldwide shipping on this piece</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return <QuickViewDialog key={product.id} product={product} onClose={onClose} />;
}
