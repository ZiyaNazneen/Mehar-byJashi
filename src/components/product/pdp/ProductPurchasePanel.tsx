"use client";

import { useState } from "react";
import { Product, ClothingSize } from "@/types/product";
import {
  getListedColors,
  getListedSizesForColor,
  getListedVariants,
  findVariant,
  getVariantAvailability,
  isPurchasable,
} from "@/lib/product-availability";
import { ColorSelector } from "./ColorSelector";
import { SizeSelector } from "./SizeSelector";
import { StockStatus } from "./StockStatus";
import { PriceDisplay } from "./PriceDisplay";
import { ChevronDown } from "lucide-react";

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const listedColors = getListedColors(product);
  const initialColor = listedColors[0]?.name || "";

  const [selectedColorName, setSelectedColorName] = useState<string>(initialColor);
  const [selectedSize, setSelectedSize] = useState<ClothingSize | undefined>(undefined);

  const handleSelectColor = (newColorName: string) => {
    setSelectedColorName(newColorName);
    // If a size was already selected, reset it if it is not listed or is sold out for the new colour
    if (selectedSize) {
      const sizesForNewColor = getListedSizesForColor(product, newColorName);
      const matching = sizesForNewColor.find((v) => v.size === selectedSize);
      if (!matching || !isPurchasable(getVariantAvailability(matching))) {
        setSelectedSize(undefined);
      }
    }
  };

  const selectedVariant = selectedSize
    ? findVariant(product, selectedSize, selectedColorName)
    : undefined;

  const availability = selectedVariant
    ? getVariantAvailability(selectedVariant)
    : undefined;

  const listedVariants = getListedVariants(product);
  const hasListedVariants = listedVariants.length > 0;

  // CTA State determination
  let ctaLabel = "Select a size";
  let ctaDisabled = true;

  if (!hasListedVariants) {
    ctaLabel = "Currently unavailable";
    ctaDisabled = true;
  } else if (!selectedSize) {
    ctaLabel = "Select a size";
    ctaDisabled = true;
  } else if (availability === "sold_out") {
    ctaLabel = "Sold out";
    ctaDisabled = true;
  } else if (availability && isPurchasable(availability)) {
    // TODO(Sub-stage 2): wire to cart
    ctaLabel = "Add to Bag";
    ctaDisabled = true; // Disabled in Sub-stage 1 pending cart integration
  } else {
    ctaLabel = "Currently unavailable";
    ctaDisabled = true;
  }

  // Accordion data presence checks
  const hasFabricInfo = Boolean(product.fabric || product.craftsmanship);
  const hasCareInfo = Boolean(
    product.careInstructions && product.careInstructions.length > 0
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* Category, Title, Subtitle */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
          {product.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-espresso-950 font-normal leading-tight">
          {product.name}
        </h1>
        {product.subtitle && (
          <p className="text-sm text-espresso-600 font-light leading-relaxed">
            {product.subtitle}
          </p>
        )}
      </div>

      {/* Pricing */}
      <PriceDisplay product={product} selectedVariant={selectedVariant} />

      {/* Color Selection */}
      <ColorSelector
        product={product}
        selectedColorName={selectedColorName}
        onSelectColor={handleSelectColor}
      />

      {/* Size Selection */}
      <SizeSelector
        product={product}
        selectedColorName={selectedColorName}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />

      {/* Stock Status Indicator */}
      <StockStatus selectedVariant={selectedVariant} />

      {/* Product Description */}
      {product.description && (
        <div className="text-sm text-espresso-700 leading-relaxed font-light pt-2">
          <p>{product.description}</p>
        </div>
      )}

      {/* CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={ctaDisabled}
          aria-disabled={ctaDisabled}
          className={`w-full py-4 px-6 rounded text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
            ctaDisabled
              ? "bg-cream-200 text-espresso-500 cursor-not-allowed border border-cream-300"
              : "bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white"
          }`}
        >
          <span>{ctaLabel}</span>
        </button>
      </div>

      {/* Native Accordions from Database Fields ONLY */}
      <div className="pt-4 border-t border-cream-200 space-y-3">
        {hasFabricInfo && (
          <details className="border border-cream-200 rounded-sm group overflow-hidden">
            <summary className="px-4 py-3 bg-cream-50/70 hover:bg-cream-100/70 flex items-center justify-between cursor-pointer text-xs font-semibold uppercase tracking-wider text-espresso-950 transition-colors list-none">
              <span>Fabric & Craftsmanship</span>
              <ChevronDown className="w-4 h-4 text-espresso-500 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="p-4 bg-white text-xs text-espresso-700 space-y-2 leading-relaxed border-t border-cream-200">
              {product.fabric && (
                <p>
                  <strong className="text-espresso-900 font-medium">Fabric:</strong>{" "}
                  {product.fabric}
                </p>
              )}
              {product.craftsmanship && (
                <p>
                  <strong className="text-espresso-900 font-medium">
                    Craftsmanship:
                  </strong>{" "}
                  {product.craftsmanship}
                </p>
              )}
            </div>
          </details>
        )}

        {hasCareInfo && (
          <details className="border border-cream-200 rounded-sm group overflow-hidden">
            <summary className="px-4 py-3 bg-cream-50/70 hover:bg-cream-100/70 flex items-center justify-between cursor-pointer text-xs font-semibold uppercase tracking-wider text-espresso-950 transition-colors list-none">
              <span>Care Instructions</span>
              <ChevronDown className="w-4 h-4 text-espresso-500 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="p-4 bg-white text-xs text-espresso-700 leading-relaxed border-t border-cream-200">
              <ul className="list-disc pl-4 space-y-1.5 text-espresso-600">
                {product.careInstructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
