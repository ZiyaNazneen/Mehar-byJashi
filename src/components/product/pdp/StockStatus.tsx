import { ProductVariantInventory } from "@/types/product";
import { getVariantAvailability } from "@/lib/product-availability";

interface StockStatusProps {
  selectedVariant?: ProductVariantInventory;
}

export function StockStatus({ selectedVariant }: StockStatusProps) {
  if (!selectedVariant) {
    return <div aria-live="polite" aria-atomic="true" />;
  }

  const availability = getVariantAvailability(selectedVariant);

  let label = "";
  let dotColor = "bg-espresso-400";

  switch (availability) {
    case "sold_out":
      label = "Sold out";
      dotColor = "bg-rose-500";
      break;
    case "low_stock":
      label = `Only ${selectedVariant.stockQuantity} left`;
      dotColor = "bg-amber-500";
      break;
    case "in_stock":
      label = "In stock";
      dotColor = "bg-emerald-500";
      break;
    case "unavailable":
      label = "Currently unavailable";
      dotColor = "bg-espresso-400";
      break;
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="flex items-center gap-2 text-xs text-espresso-700 min-h-5"
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
