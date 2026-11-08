import Image from "next/image";
import { Sparkles, Feather, Scissors, HeartHandshake } from "lucide-react";

export function BrandStorySection() {
  return (
    <section id="brand-story" aria-labelledby="brand-story-heading" className="py-20 sm:py-28 bg-cream-50 border-t border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Philosophy Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
                The Maison Philosophy
              </span>
              <h2
                id="brand-story-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-espresso-950 leading-tight"
              >
                A Symphony of Craft, Memory, & <span className="italic font-light text-gold-800">Quiet Grace</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-espresso-700 font-light leading-relaxed">
              Founded on the belief that clothing is emotional architecture, <strong className="font-medium text-espresso-900">Mehar by Jashi</strong> was born to revive classical Eastern couture through a serene, contemporary lens.
            </p>

            <p className="text-sm sm:text-base text-espresso-700 font-light leading-relaxed">
              We reject the transient rush of seasonal disposability. Instead, we work with generational weaver families and master embroidery karigars in India, creating garments intended to become cherished family heirlooms. Every stitch of zardozi, every hand-frayed hem, and every dyed silk thread honors the rhythm of patient human devotion.
            </p>

            {/* Three Brand Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-cream-200">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-cream-100 border border-gold-300 flex items-center justify-center text-gold-700">
                  <Scissors className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso-900">
                  Couture Tailoring
                </h3>
                <p className="text-[11px] text-espresso-600 leading-relaxed">
                  Cut individually by senior patternmakers for balanced posture and movement.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-cream-100 border border-gold-300 flex items-center justify-center text-gold-700">
                  <Feather className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso-900">
                  Pure Handlooms
                </h3>
                <p className="text-[11px] text-espresso-600 leading-relaxed">
                  Breathable mulberry silks, khadi organzas, and natural plant-derived dyes.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-cream-100 border border-gold-300 flex items-center justify-center text-gold-700">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso-900">
                  Artisan Fair-Trade
                </h3>
                <p className="text-[11px] text-espresso-600 leading-relaxed">
                  Fair living wages, healthcare, and artisanal community equity programs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Artisan Imagery Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="relative aspect-4/5 rounded-lg overflow-hidden bg-cream-200 shadow-xl border border-cream-300">
                <Image
                  src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop"
                  alt="Atelier craft master working on authentic handwoven gold embroidery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Floating Quote Card */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-8 bg-white p-5 rounded-md border border-cream-200 shadow-lg max-w-xs">
                <div className="flex items-center gap-1.5 text-gold-600 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">
                    The Atelier Oath
                  </span>
                </div>
                <p className="text-xs font-serif italic text-espresso-800 leading-relaxed">
                  &ldquo;We do not merely make attire; we preserve an endangered tapestry of human hands and quiet beauty.&rdquo;
                </p>
                <p className="text-[10px] text-espresso-500 uppercase tracking-widest mt-2">
                  — Jashi, Creative Director
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
