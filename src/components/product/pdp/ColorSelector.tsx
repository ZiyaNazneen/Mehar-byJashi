import { Product } from "@/types/product";
import { getListedColors } from "@/lib/product-availability";

interface ColorSelectorProps {
  product: Product;
  selectedColorName: string;
  onSelectColor: (colorName: string) => void;
}

export function ColorSelector({
  product,
  selectedColorName,
  onSelectColor,
}: ColorSelectorProps) {
  const colors = getListedColors(product);

  if (colors.length === 0) {
    return null;
  }

  // Single colour: show name only
  if (colors.length === 1) {
    return (
      <div className="space-y-1">
        <span className="text-xs text-espresso-700 font-medium">Colour</span>
        <p className="text-sm font-semibold text-espresso-950">
          {colors[0].name}
        </p>
      </div>
    );
  }

  // Multiple colours: swatch selector with accessible group role
  return (
    <div role="group" aria-labelledby="color-selector-label" className="space-y-2">
      <div id="color-selector-label" className="text-xs text-espresso-700 font-medium">
        Colour:{" "}
        <span className="text-espresso-950 font-semibold">
          {selectedColorName || "Select a colour"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {colors.map((color) => {
          const isSelected = selectedColorName === color.name;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelectColor(color.name)}
              aria-pressed={isSelected}
              aria-label={color.name}
              className={`group relative p-1 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-gold-500 ${
                isSelected
                  ? "ring-2 ring-gold-600 ring-offset-2 ring-offset-white"
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
  );
}
