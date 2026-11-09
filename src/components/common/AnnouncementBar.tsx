"use client";

import { useState } from "react";
import { ANNOUNCEMENT_MESSAGES } from "@/lib/constants";
import { ChevronRight, Sparkles, X } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isVisible) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
  };

  return (
    <aside
      aria-label="Store announcement"
      className="relative z-50 bg-espresso-950 text-cream-100 text-xs tracking-wider transition-all duration-300 border-b border-espresso-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left spacer for optical center alignment */}
        <div className="hidden md:flex items-center gap-2 text-gold-300 text-[11px] font-medium tracking-widest uppercase">
          <Sparkles className="w-3 h-3 text-gold-400" aria-hidden="true" />
          <span>Haute Couture & Pret</span>
        </div>

        {/* Center message rotator */}
        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <button
            onClick={handleNext}
            className="group inline-flex items-center gap-2 hover:text-gold-200 transition-colors focus:outline-none"
            title="Click for next announcement"
          >
            <span className="font-light tracking-wide text-center">
              {ANNOUNCEMENT_MESSAGES[currentIndex]}
            </span>
            <ChevronRight
              className="w-3 h-3 text-gold-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Right close & currency pill */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[11px] font-light text-cream-300">
            INR (₹) • Worldwide Shipping
          </span>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement bar"
            className="text-cream-400 hover:text-cream-100 transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-gold-400"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
