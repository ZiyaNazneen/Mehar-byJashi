import Image from "next/image";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function FeaturedCollection() {
  return (
    <section id="featured" aria-labelledby="featured-heading" className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-100/70 rounded-2xl border border-cream-200 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle decorative background watermark text */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] sm:text-[180px] font-serif font-light text-cream-200/50 select-none pointer-events-none -mr-16">
            NOOR
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Visual Showcase */}
            <div className="lg:col-span-6">
              <div className="relative aspect-4/5 rounded-xl overflow-hidden shadow-xl border border-cream-200 bg-cream-200">
                <Image
                  src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop"
                  alt="Editorial feature of The Noor Collection by Mehar by Jashi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top hover:scale-103 transition-transform duration-700"
                />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 bg-espresso-950/90 text-gold-300 text-[11px] font-medium tracking-widest uppercase px-3 py-1.5 rounded-sm backdrop-blur-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>Signature Editorial 2026</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Narrative & Highlights */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                  Featured Chapter
                </span>
                <h2
                  id="featured-heading"
                  className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-espresso-950 leading-tight"
                >
                  The Noor Collection: <br className="hidden sm:inline" />
                  <span className="italic font-light text-gold-800">Light in Every Thread</span>
                </h2>
              </div>

              <p className="text-sm sm:text-base text-espresso-700 font-light leading-relaxed">
                Named after the eternal luminosity of dawn, the Noor edit represents our most intricate textile dialogue between ancestral Awadh embroidery and featherlight modern silhouettes. Every ensemble is bathed in warm champagnes, pearlescent ivories, and gossamer gold dustings.
              </p>

              {/* Craft Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso-900">
                      Authentic Awadhi Mukaish & Zardozi
                    </h3>
                    <p className="text-xs text-espresso-600">
                      Hand-flattened metallic wires knotted directly into sheer silk organza.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso-900">
                      Zero-Synthetics Noble Silks
                    </h3>
                    <p className="text-xs text-espresso-600">
                      Hand-loomed katan, mulberry raw silk, and certified handloom chanderi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso-900">
                      Individual Atelier Numbering
                    </h3>
                    <p className="text-xs text-espresso-600">
                      Each piece bears a hand-sewn satin label signed by the lead craft master.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#new-arrivals"
                  className="px-8 py-3.5 bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white rounded text-xs font-semibold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm"
                >
                  <span>Shop The Noor Chapter</span>
                  <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                </a>

                <span className="text-xs text-espresso-600 text-center sm:text-left">
                  Pieces start from <span className="font-semibold text-espresso-900">{formatCurrency(24000)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
