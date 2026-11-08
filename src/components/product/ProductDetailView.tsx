"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ClothingSize, ColorOption } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Ruler,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  Scissors,
  Clock,
  ArrowLeft,
  X,
} from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(
    product.availableColors[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(
    product.availableSizes[0] || "M"
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>("fabric");

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  // Find variant matching selected size and color
  const matchedVariant = product.variants.find(
    (v) =>
      v.size === selectedSize &&
      (!selectedColor || v.colorName === selectedColor.name)
  );

  const stockCount = matchedVariant?.stockQuantity ?? product.totalStock;
  const isAvailable = matchedVariant ? matchedVariant.isAvailable : stockCount > 0;

  const handleAddToBag = () => {
    setAddedToBag(true);
    setTimeout(() => {
      setAddedToBag(false);
    }, 2800);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${product.name} | Mehar by Jashi`,
          text: product.subtitle,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      // User cancelled or clipboard blocked
    }
  };

  const primaryImage = product.images[activeImageIndex] || product.images[0];

  return (
    <div className="bg-white">
      {/* Editorial Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="border-b border-cream-200 bg-cream-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-espresso-600">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link
              href="/"
              className="hover:text-gold-700 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gold-600" />
              <span>Maison Mehar</span>
            </Link>
            <span className="text-cream-300">/</span>
            <Link
              href="/#categories"
              className="hover:text-gold-700 transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-cream-300">/</span>
            <span className="text-espresso-950 font-medium truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-espresso-700 hover:text-gold-700 transition-colors"
            title="Share this ensemble"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-gold-600" />
                <span>Share Piece</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* ========================================================= */}
          {/* LEFT: Image Gallery                                      */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail list (Desktop Left / Mobile Bottom) */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[680px] shrink-0 pb-2 md:pb-0 scrollbar-thin">
                {product.images.map((img, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-26 sm:w-24 sm:h-32 rounded-sm overflow-hidden border-2 transition-all shrink-0 ${
                        isActive
                          ? "border-gold-600 ring-1 ring-gold-600"
                          : "border-cream-200 opacity-75 hover:opacity-100"
                      }`}
                      aria-label={`View image ${idx + 1} of ${product.name}`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || `${product.name} thumbnail ${idx + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover object-top"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Primary Viewport */}
            <div className="relative flex-1 aspect-3/4 sm:aspect-4/5 rounded-md overflow-hidden bg-cream-100 border border-cream-200/90 shadow-xs">
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
              />

              {/* Badge overlay */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-espresso-950/90 backdrop-blur-xs text-gold-300 text-[10px] tracking-widest uppercase font-semibold px-3 py-1.5 rounded shadow-sm border border-gold-400/30">
                    <Sparkles className="w-3 h-3 text-gold-400" />
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-espresso-900 shadow-md backdrop-blur-xs transition-colors"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isWishlisted ? "fill-rose-600 text-rose-600" : "text-espresso-800 hover:text-gold-600"
                  }`}
                />
              </button>

              {/* Craft watermark banner */}
              <div className="absolute bottom-4 inset-x-4">
                <div className="bg-espresso-950/80 backdrop-blur-md rounded px-3.5 py-2 text-cream-100 text-[11px] flex items-center justify-between border border-cream-200/20">
                  <span className="font-light truncate">{product.fabric}</span>
                  <span className="text-gold-400 font-serif italic ml-2 shrink-0">Authentic Handloom</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: Product Meta, Selection & Purchase Actions        */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Collection Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.25em] text-gold-700 font-semibold">
                  {product.category}
                </span>
                <span className="text-[11px] text-espresso-500 font-light tracking-wider">
                  SKU: {matchedVariant?.sku || "MBJ-ATELIER-2026"}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-normal text-espresso-950 leading-tight">
                  {product.name}
                </h1>
                <p className="mt-1.5 text-sm text-espresso-600 font-light leading-relaxed">
                  {product.subtitle}
                </p>
              </div>

              {/* Pricing */}
              <div className="pt-2 pb-3 border-y border-cream-200 flex items-baseline gap-3">
                <span className="text-2xl font-serif text-espresso-950 font-normal">
                  {formatCurrency(product.basePrice)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-espresso-400 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-[11px] tracking-wide text-gold-800 bg-gold-100/90 border border-gold-300/60 px-2.5 py-0.5 rounded-full font-medium ml-auto">
                  Taxes Included • Worldwide Free Shipping
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed font-light">
                {product.description}
              </p>

              {/* ===================================================== */}
              {/* Color Selection                                       */}
              {/* ===================================================== */}
              {product.availableColors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-espresso-700 font-medium">
                      Atelier Shade:{" "}
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
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select color ${color.name}`}
                          className={`group relative p-1 rounded-full transition-all ${
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
              )}

              {/* ===================================================== */}
              {/* Size Selection                                        */}
              {/* ===================================================== */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-espresso-700 font-medium">
                    Select Silhouette Size:{" "}
                    <span className="text-espresso-950 font-semibold">
                      {selectedSize}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-gold-700 hover:text-gold-900 underline underline-offset-4"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Bespoke Fit Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {product.availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 text-xs font-medium rounded-sm border transition-all text-center ${
                          isSelected
                            ? "bg-espresso-950 text-cream-50 border-espresso-950 shadow-xs"
                            : "bg-white text-espresso-800 border-cream-300 hover:border-gold-500 hover:bg-cream-50"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock / Lead-Time Status Indicator */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    stockCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                <span className="text-espresso-700">
                  {stockCount > 0
                    ? `Ready for Atelier Dispatch (${stockCount} units hand-finished in studio)`
                    : "Made on Pre-Order — Individually cut & stitched in 12–14 days"}
                </span>
              </div>

              {/* ===================================================== */}
              {/* Purchase Actions                                      */}
              {/* ===================================================== */}
              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  disabled={addedToBag}
                  className={`w-full py-4 px-6 rounded font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm ${
                    addedToBag
                      ? "bg-emerald-700 text-white"
                      : "bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white"
                  }`}
                >
                  {addedToBag ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>Added to Atelier Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-gold-300" />
                      <span>Add to Bag • {formatCurrency(product.basePrice)}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex-1 py-3 px-4 border border-cream-300 hover:border-gold-400 bg-white hover:bg-cream-50 text-espresso-900 rounded text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? "fill-rose-600 text-rose-600" : "text-espresso-700"
                      }`}
                    />
                    <span>{isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
                  </button>

                  <a
                    href="mailto:concierge@meharbyjashi.com?subject=Inquiry: Zarina Raw Silk Ensemble"
                    className="flex-1 py-3 px-4 border border-cream-300 hover:border-gold-400 bg-white hover:bg-cream-50 text-espresso-900 rounded text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Scissors className="w-3.5 h-3.5 text-gold-600" />
                    <span>Bespoke Styling</span>
                  </a>
                </div>
              </div>

              {/* Service Highlights Strip */}
              <div className="pt-4 border-t border-cream-200 grid grid-cols-2 gap-3 text-xs text-espresso-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>Insured Express Worldwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>100% Pure Noble Silks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>Custom Alterations Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>48-Hour Concierge Response</span>
                </div>
              </div>

              {/* ===================================================== */}
              {/* Accordions: Craft, Care, Sizing, Shipping            */}
              {/* ===================================================== */}
              <div className="pt-6 border-t border-cream-200 space-y-3">
                {/* 1. Craftsmanship & Fabric */}
                <div className="border border-cream-200 rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("fabric")}
                    className="w-full px-4 py-3 bg-cream-50/70 hover:bg-cream-100/70 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-espresso-950 transition-colors"
                  >
                    <span>Artisanal Craftsmanship & Noble Fabrics</span>
                    {openAccordion === "fabric" ? (
                      <ChevronUp className="w-4 h-4 text-gold-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-espresso-500" />
                    )}
                  </button>
                  {openAccordion === "fabric" && (
                    <div className="p-4 bg-white text-xs text-espresso-700 space-y-2 leading-relaxed">
                      <p>
                        <strong className="text-espresso-900 font-medium">Textile Composition:</strong>{" "}
                        {product.fabric}
                      </p>
                      <p>
                        <strong className="text-espresso-900 font-medium">Embellishment Technique:</strong>{" "}
                        {product.craftsmanship}
                      </p>
                      <p className="text-espresso-600 text-[11px] pt-1">
                        Individually hand-loomed and embroidered by master artisans. Subtle natural slubs and thread variations are hallmarks of authentic hand-weaving, not imperfections.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Care Instructions */}
                <div className="border border-cream-200 rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("care")}
                    className="w-full px-4 py-3 bg-cream-50/70 hover:bg-cream-100/70 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-espresso-950 transition-colors"
                  >
                    <span>Garment Care & Heirloom Preservation</span>
                    {openAccordion === "care" ? (
                      <ChevronUp className="w-4 h-4 text-gold-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-espresso-500" />
                    )}
                  </button>
                  {openAccordion === "care" && (
                    <div className="p-4 bg-white text-xs text-espresso-700 space-y-1.5 leading-relaxed">
                      <ul className="list-disc pl-4 space-y-1 text-espresso-600">
                        {product.careInstructions.map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-espresso-500 pt-1">
                        Store in the provided breathable unbleached muslin garment bag away from direct sunlight.
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Bespoke Sizing Service */}
                <div className="border border-cream-200 rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("sizing")}
                    className="w-full px-4 py-3 bg-cream-50/70 hover:bg-cream-100/70 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-espresso-950 transition-colors"
                  >
                    <span>Bespoke Tailoring & Measurements</span>
                    {openAccordion === "sizing" ? (
                      <ChevronUp className="w-4 h-4 text-gold-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-espresso-500" />
                    )}
                  </button>
                  {openAccordion === "sizing" && (
                    <div className="p-4 bg-white text-xs text-espresso-700 space-y-2 leading-relaxed">
                      <p>
                        Selecting <strong>&ldquo;Custom&rdquo;</strong> triggers a dedicated atelier consultation. Our tailoring director will reach out via WhatsApp or email to collect your exact shoulder, bust, waist, and silhouette length requirements.
                      </p>
                      <p className="text-[11px] text-gold-800 bg-gold-50 p-2 rounded border border-gold-200">
                        Bespoke alterations add approximately 5–7 business days to your delivery timeline.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Shipping & Returns */}
                <div className="border border-cream-200 rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("shipping")}
                    className="w-full px-4 py-3 bg-cream-50/70 hover:bg-cream-100/70 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-espresso-950 transition-colors"
                  >
                    <span>Worldwide Express Delivery & Returns</span>
                    {openAccordion === "shipping" ? (
                      <ChevronUp className="w-4 h-4 text-gold-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-espresso-500" />
                    )}
                  </button>
                  {openAccordion === "shipping" && (
                    <div className="p-4 bg-white text-xs text-espresso-700 space-y-2 leading-relaxed">
                      <p>
                        <strong>Delivery:</strong> Dispatched via DHL Express / FedEx Priority. Tracking sent immediately upon packaging. International transit is typically 3–5 business days.
                      </p>
                      <p>
                        <strong>Duties & Taxes:</strong> Delivered Duty Paid (DDP) for USA, UK, UAE, and European Union destinations.
                      </p>
                      <p>
                        <strong>Returns:</strong> Unworn standard-size items are eligible for exchange or store credit within 14 days of delivery. Custom made-to-measure orders are final cut.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* Size Guide Modal                                             */}
      {/* ============================================================= */}
      {isSizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-espresso-950/70 backdrop-blur-xs"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-2xl border border-cream-200 p-6 sm:p-8 max-w-xl w-full z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-espresso-600 hover:text-espresso-950"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="border-b border-cream-200 pb-3">
                <span className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold">
                  Atelier Sizing Standard
                </span>
                <h3 className="text-xl font-serif text-espresso-950">
                  Size & Body Measurements
                </h3>
                <p className="text-xs text-espresso-600 mt-1">
                  Measurements are provided in inches for garment body fit.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-cream-300 bg-cream-50 text-espresso-900 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Bust (in)</th>
                      <th className="py-2.5 px-3">Waist (in)</th>
                      <th className="py-2.5 px-3">Hip (in)</th>
                      <th className="py-2.5 px-3">Standard Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100 text-espresso-700">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-espresso-950">XS (34)</td>
                      <td className="py-2 px-3">34</td>
                      <td className="py-2 px-3">28</td>
                      <td className="py-2 px-3">38</td>
                      <td className="py-2 px-3">48&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-espresso-950">S (36)</td>
                      <td className="py-2 px-3">36</td>
                      <td className="py-2 px-3">30</td>
                      <td className="py-2 px-3">40</td>
                      <td className="py-2 px-3">48&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-espresso-950">M (38)</td>
                      <td className="py-2 px-3">38</td>
                      <td className="py-2 px-3">32</td>
                      <td className="py-2 px-3">42</td>
                      <td className="py-2 px-3">49&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-espresso-950">L (40)</td>
                      <td className="py-2 px-3">40</td>
                      <td className="py-2 px-3">34</td>
                      <td className="py-2 px-3">44</td>
                      <td className="py-2 px-3">49&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-espresso-950">XL (42)</td>
                      <td className="py-2 px-3">42</td>
                      <td className="py-2 px-3">36</td>
                      <td className="py-2 px-3">46</td>
                      <td className="py-2 px-3">50&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-espresso-950">XXL (44)</td>
                      <td className="py-2 px-3">44</td>
                      <td className="py-2 px-3">38</td>
                      <td className="py-2 px-3">48</td>
                      <td className="py-2 px-3">50&quot;</td>
                    </tr>
                    <tr className="bg-gold-50/50">
                      <td className="py-2 px-3 font-semibold text-gold-900">Custom</td>
                      <td colSpan={4} className="py-2 px-3 text-gold-800 text-[11px]">
                        Tailored directly to your personal bespoke measurements at no extra fee.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-[11px] text-espresso-600 leading-relaxed space-y-1">
                <p>
                  <strong>How to measure:</strong> Measure bust around the fullest part, natural waist at the narrowest point, and hips around the widest curve.
                </p>
                <p>
                  Need personal assistance? Contact our sizing atelier at{" "}
                  <a href="mailto:concierge@meharbyjashi.com" className="text-gold-700 underline">
                    concierge@meharbyjashi.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
