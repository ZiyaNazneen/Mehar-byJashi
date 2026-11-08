import { Product, ClothingSize } from "@/types/product";
import {
  getListedSizesForColor,
  getVariantAvailability,
} from "@/lib/product-availability";

interface SizeSelectorProps {
  product: Product;
  selectedColorName: string;
  selectedSize: ClothingSize | undefined;
  onSelectSize: (size: ClothingSize) => void;
}

export function SizeSelector({
  product,
  selectedColorName,
  selectedSize,
  onSelectSize,
}: SizeSelectorProps) {
  const variants = getListedSizesForColor(product, selectedColorName);

  if (variants.length === 0) {
    return null;
  }

  return (
    <div role="group" aria-labelledby="size-selector-label" className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span id="size-selector-label" className="text-espresso-700 font-medium">
          Size:{" "}
          <span className="text-espresso-950 font-semibold">
            {selectedSize || "Select a size"}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {variants.map((variant) => {
          const availability = getVariantAvailability(variant);
          const isSoldOut = availability === "sold_out";
          const isSelected = selectedSize === variant.size;
          const accessibleLabel = isSoldOut
            ? `${variant.size} - Sold out`
            : variant.size;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isSoldOut}
              onClick={() => onSelectSize(variant.size)}
              aria-pressed={isSelected}
              aria-label={accessibleLabel}
              className={`py-2.5 text-xs font-medium rounded-sm border transition-all text-center focus-visible:outline-2 focus-visible:outline-gold-500 ${
                isSoldOut
                  ? "bg-cream-100 text-espresso-400 border-cream-200 line-through opacity-60 cursor-not-allowed"
                  : isSelected
                  ? "bg-espresso-950 text-cream-50 border-espresso-950 shadow-xs"
                  : "bg-white text-espresso-800 border-cream-300 hover:border-gold-500 hover:bg-cream-50"
              }`}
            >
              {variant.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
