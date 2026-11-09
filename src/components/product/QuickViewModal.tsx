"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product, ClothingSize } from "@/types/product";
import {
  findVariant,
  getListedColors,
  getListedSizesForColor,
  getListedVariants,
  getVariantAvailability,
  isPurchasable,
} from "@/lib/product-availability";
import { useCart } from "@/components/cart/CartProvider";
import { createCartItemSnapshot } from "@/lib/cart-item";
import { ColorSelector } from "@/components/product/pdp/ColorSelector";
import { SizeSelector } from "@/components/product/pdp/SizeSelector";
import { StockStatus } from "@/components/product/pdp/StockStatus";
import { PriceDisplay } from "@/components/product/pdp/PriceDisplay";
import {
  X,
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
  const { addItem, isReady, openDrawer } = useCart();
  const listedColors = getListedColors(product);
  const [selectedColorName, setSelectedColorName] = useState<string>(
    listedColors[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState<ClothingSize | undefined>(
    undefined
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const selectedVariant = selectedSize
    ? findVariant(product, selectedSize, selectedColorName)
    : undefined;
  const availability = selectedVariant
    ? getVariantAvailability(selectedVariant)
    : undefined;
  const hasListedVariants = getListedVariants(product).length > 0;

  const handleSelectColor = (newColorName: string) => {
    if (newColorName !== selectedColorName) {
      setStatusMessage("");
    }
    setSelectedColorName(newColorName);

    if (selectedSize) {
      const sizesForNewColor = getListedSizesForColor(product, newColorName);
      const matching = sizesForNewColor.find(
        (variant) => variant.size === selectedSize
      );
      if (!matching || !isPurchasable(getVariantAvailability(matching))) {
        setSelectedSize(undefined);
      }
    }
  };

  const handleSelectSize = (newSize: ClothingSize) => {
    if (newSize !== selectedSize) {
      setStatusMessage("");
    }
    setSelectedSize(newSize);
  };

  let ctaLabel = "Select a size";
  let ctaDisabled = true;

  if (!hasListedVariants) {
    ctaLabel = "Currently unavailable";
  } else if (!selectedSize) {
    ctaLabel = "Select a size";
  } else if (availability === "sold_out") {
    ctaLabel = "Sold out";
  } else if (availability && isPurchasable(availability)) {
    ctaLabel = "Add to Bag";
    ctaDisabled = !isReady;
  } else {
    ctaLabel = "Currently unavailable";
  }

  const handleAddToBag = () => {
    if (
      !selectedVariant ||
      !selectedSize ||
      !availability ||
      !isPurchasable(availability) ||
      !isReady
    ) {
      return;
    }

    const result = addItem(createCartItemSnapshot(product, selectedVariant));
    if (result.status === "added" || result.status === "capped") {
      onClose();
      openDrawer();
    } else if (result.status === "at_limit") {
      setStatusMessage(
        "You already have the maximum available in your bag."
      );
    }
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
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PriceDisplay
                product={product}
                selectedVariant={selectedVariant}
              />
              <span className="text-[11px] text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full font-medium">
                Made-to-Order
              </span>
            </div>

            {/* Color Selection */}
            {listedColors.length > 0 && (
              <div className="mt-6">
                <ColorSelector
                  product={product}
                  selectedColorName={selectedColorName}
                  onSelectColor={handleSelectColor}
                />
              </div>
            )}

            {/* Size Selection */}
            <div className="relative mt-6">
              <SizeSelector
                product={product}
                selectedColorName={selectedColorName}
                selectedSize={selectedSize}
                onSelectSize={handleSelectSize}
              />
              <button
                type="button"
                className="absolute right-0 top-0 inline-flex items-center gap-1 text-[11px] text-gold-700 underline underline-offset-2 hover:text-gold-900"
              >
                <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Size & Fit Guide</span>
              </button>
            </div>

            {/* Stock status indicator */}
            <div className="mt-4">
              <StockStatus selectedVariant={selectedVariant} />
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
              type="button"
              onClick={handleAddToBag}
              disabled={ctaDisabled}
              aria-disabled={ctaDisabled}
              className={`w-full py-3.5 px-6 rounded font-medium text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                ctaDisabled
                  ? "bg-cream-200 text-espresso-500 cursor-not-allowed"
                  : "bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white"
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-gold-300" aria-hidden="true" />
              <span>{ctaLabel}</span>
            </button>
            <div
              role="status"
              aria-live="polite"
              className="mt-2 text-sm text-espresso-700"
            >
              {statusMessage}
            </div>
            <p className="mt-2.5 text-center text-[10px] text-espresso-500 flex items-center justify-center gap-1">
              <Truck className="h-3 w-3 text-gold-600" aria-hidden="true" />
              <span>Shipping calculated at checkout.</span>
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
