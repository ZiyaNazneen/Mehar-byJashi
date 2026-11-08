"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, RotateCcw, ArrowLeft } from "lucide-react";

interface ProductErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ProductErrorProps) {
  useEffect(() => {
    console.error("Product route runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[65vh] flex items-center justify-center bg-cream-50 px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 border border-gold-300 text-gold-700 text-xs uppercase tracking-widest font-medium">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Atelier Concierge</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-light text-espresso-950">
          Ensemble Unavailable
        </h1>

        <p className="text-sm text-espresso-600 font-light leading-relaxed">
          We experienced an unexpected interruption while preparing this atelier piece. Please try again or return to our homepage collection.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white rounded text-xs font-semibold tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-gold-500"
          >
            <RotateCcw className="w-4 h-4 text-gold-400" aria-hidden="true" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-cream-100 text-espresso-900 border border-cream-300 rounded text-xs font-semibold tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-gold-500"
          >
            <ArrowLeft className="w-4 h-4 text-gold-600" aria-hidden="true" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
