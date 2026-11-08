import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream-50 px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 border border-gold-300 text-gold-700 text-xs uppercase tracking-widest font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atelier Archive</span>
        </div>

        <h1 className="text-6xl font-serif font-light text-espresso-950">404</h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-espresso-900">
            Page Not Found
          </h2>
          <p className="text-sm text-espresso-600 font-light leading-relaxed">
            The collection piece or atelier salon page you are seeking may have moved or is temporarily in archive.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-espresso-950 hover:bg-espresso-900 text-cream-100 hover:text-white rounded text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gold-400" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
