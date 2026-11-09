import { FOOTER_SECTIONS, BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { Sparkles, Globe, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-espresso-950 text-cream-100 border-t border-espresso-800">
      {/* Upper Footer: Brand Statement & Service Highlights */}
      <div className="border-b border-espresso-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-espresso-900 border border-gold-600/40 flex items-center justify-center text-gold-400">
                <Globe className="w-5 h-5" aria-hidden="true" />
              </div>
              <h4 className="text-base font-serif tracking-wide text-cream-50">
                Worldwide Shipping
              </h4>
              <p className="text-xs text-cream-300 leading-relaxed max-w-xs">
                Worldwide shipping, charged  at checkout.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-espresso-900 border border-gold-600/40 flex items-center justify-center text-gold-400">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <h4 className="text-base font-serif tracking-wide text-cream-50">
                Master Karigar Heritage
              </h4>
              <p className="text-xs text-cream-300 leading-relaxed max-w-xs">
                Authentic hand-embroidery, pure mulberry raw silk, and artisanal handlooms preserved in every silhouette.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-espresso-900 border border-gold-600/40 flex items-center justify-center text-gold-400">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h4 className="text-base font-serif tracking-wide text-cream-50">
                Ready-to-Ship Pieces
              </h4>
              <p className="text-xs text-cream-300 leading-relaxed max-w-xs">
                Pieces are ready to ship from stock; custom sizing and bespoke tailoring are not available.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-cream-50 font-normal uppercase">
                Mehar
              </span>
              <span className="block text-[10px] tracking-[0.3em] uppercase text-gold-400 font-medium">
                by Jashi
              </span>
            </div>
            <p className="text-xs text-cream-300 leading-relaxed max-w-sm">
              {BRAND_TAGLINE}. Designed for the modern woman who cherishes classical craftsmanship, poetic silhouettes, and serene quiet luxury.
            </p>
            <div className="pt-2 text-xs text-cream-400 space-y-1">
              <p>Atelier: Flagship Studio & Private Salon</p>
              <p>Email: <a href="mailto:concierge@meharbyjashi.com" className="text-gold-300 hover:underline">concierge@meharbyjashi.com</a></p>
              <p>International: +1 (800) 924-MEHAR</p>
            </div>
          </div>

          {/* Nav Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                {section.title}
              </h5>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-cream-300 hover:text-gold-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Lower Footer Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-espresso-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-cream-400">
          <p>
            © 2026 {BRAND_NAME}. All rights reserved. Handcrafted luxury fashion.
          </p>

          {/* Policy Links */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] text-cream-400">
            <a href="#" className="hover:text-gold-300 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gold-300 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gold-300 transition-colors">
              Shipping & Duties
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gold-300 transition-colors">
              Accessibility
            </a>
          </div>

          {/* Secure International Payment Mock Badges */}
          <div className="flex items-center gap-2 text-[10px] tracking-wider text-cream-400 uppercase">
            <span className="px-2 py-0.5 rounded bg-espresso-900 border border-espresso-800">
              Visa
            </span>
            <span className="px-2 py-0.5 rounded bg-espresso-900 border border-espresso-800">
              Mastercard
            </span>
            <span className="px-2 py-0.5 rounded bg-espresso-900 border border-espresso-800">
              Amex
            </span>
            <span className="px-2 py-0.5 rounded bg-espresso-900 border border-espresso-800">
              Apple Pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
