import { Product, ProductVariantInventory } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  getEffectivePrice,
  getComparePriceToShow,
} from "@/lib/product-availability";

interface PriceDisplayProps {
  product: Product;
  selectedVariant?: ProductVariantInventory;
}

export function PriceDisplay({ product, selectedVariant }: PriceDisplayProps) {
  const effectivePrice = getEffectivePrice(product, selectedVariant);
  const comparePrice = getComparePriceToShow(product, effectivePrice);
  const currency =
    (product.currency as "INR" | "USD" | "AED" | "GBP" | "EUR") || "INR";

  return (
    <div className="pt-2 pb-3 border-y border-cream-200 flex flex-wrap items-baseline gap-3">
      <span className="text-2xl sm:text-3xl font-serif text-espresso-950 font-normal">
        {formatCurrency(effectivePrice, currency)}
      </span>

      {comparePrice !== undefined && (
        <span className="text-sm text-espresso-400 line-through">
          {formatCurrency(comparePrice, currency)}
        </span>
      )}
    </div>
  );
}
