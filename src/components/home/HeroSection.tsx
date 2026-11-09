import Image from "next/image";
import { Sparkles, ArrowRight, ShieldCheck, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <section aria-label="Hero Collection Showcase" className="relative bg-cream-50 overflow-hidden border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Subtle Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-100 border border-gold-300/60 text-espresso-800 text-xs tracking-widest uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Autumn / Festive 2026 Collection</span>
            </div>

            {/* Serif Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-espresso-950 font-normal leading-[1.15] tracking-tight">
              Where Timeless Craft Meets <span className="italic font-light text-gold-700">Modern Opulence</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-espresso-700 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Hand-cut pure mulberry silks, delicate chanderi angrakhas, and whispering organza saris. Designed in our atelier for celebrations that linger in memory.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#new-arrivals"
                className="w-full sm:w-auto px-8 py-4 bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white rounded text-xs font-semibold tracking-widest uppercase transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Explore New Arrivals</span>
                <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#featured"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-cream-100 text-espresso-900 border border-cream-300 hover:border-gold-400 rounded text-xs font-semibold tracking-widest uppercase transition-all duration-200 flex items-center justify-center"
              >
                View The Noor Edit
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 border-t border-cream-200 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-espresso-600">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold-600" />
                <span>Worldwide Shipping</span>
              </div>
              <span className="text-cream-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                <span>Ready-to-Ship Pieces</span>
              </div>
            </div>
          </div>

          {/* Right Hero Fashion Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative subtle gold hairline frame */}
              <div className="absolute -inset-2.5 rounded-lg border border-gold-300/40 -rotate-1 pointer-events-none hidden sm:block" />

              {/* Main Image Container */}
              <div className="relative aspect-4/5 sm:aspect-3/4 rounded-lg overflow-hidden bg-cream-200 shadow-xl border border-cream-200">
                <Image
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
                  alt="Model wearing Mehar by Jashi handcrafted raw silk festive ensemble in champagne gold"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top hover:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Floating Atelier Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded border border-cream-200 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold">
                        Spotlight Feature
                      </p>
                      <p className="text-xs font-serif text-espresso-950 font-normal">
                        The Zarina Raw Silk Ensemble
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-espresso-600 mt-1 line-clamp-1">
                    Hand-embroidered zardozi with pure organza dupatta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
