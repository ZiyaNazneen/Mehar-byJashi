"use client";

import { useState } from "react";
import { Mail, Sparkles, Check, Info } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("submitted");
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="py-16 sm:py-24 bg-white border-t border-cream-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>The Atelier Society</span>
        </div>

        {/* Heading */}
        <h2
          id="newsletter-heading"
          className="text-3xl sm:text-4xl font-serif font-normal text-espresso-950"
        >
          Invitations to Moments of Elegance
        </h2>

        {/* Narrative */}
        <p className="text-sm sm:text-base text-espresso-600 font-light leading-relaxed max-w-xl mx-auto">
          Subscribe for private collection previews, seasonal trunk show dates, and editorial journals from our design atelier.
        </p>

        {/* Subscription Form UI */}
        <div className="max-w-md mx-auto pt-2">
          {status === "submitted" ? (
            <div className="p-4 bg-cream-50 rounded-lg border border-gold-300 text-espresso-800 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-center gap-2 text-gold-700 font-medium text-sm">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Thank you for your interest</span>
              </div>
              <p className="text-xs text-espresso-600">
                Newsletter registration UI ready. Live dispatch integration will connect with our secure database in the next deployment phase.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="text-[11px] text-gold-700 underline hover:text-gold-900"
              >
                Reset form
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address for atelier society newsletter"
                    className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded text-xs sm:text-sm text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white rounded text-xs font-semibold tracking-widest uppercase transition-colors shrink-0 whitespace-nowrap"
                >
                  Join Society
                </button>
              </div>

              {/* Explicit Honest UI Notice */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso-500 pt-1">
                <Info className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                <span>
                  UI preview only — active database subscriptions activate in upcoming phase. We respect your privacy.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
