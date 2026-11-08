"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { MobileNav } from "./MobileNav";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function Header() {
  const { count, isReady } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-cream-200"
            : "bg-white/90 backdrop-blur-xs border-b border-cream-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button (Left on Mobile) */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-espresso-800 hover:text-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-md"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 ml-1 text-espresso-800 hover:text-gold-600 focus:outline-none"
                aria-label="Search collection"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Brand Logo (Center on mobile, Left on Desktop) */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link
                href="/"
                className="inline-block group focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-sm"
              >
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-2xl sm:text-3xl tracking-wider text-espresso-950 font-normal uppercase group-hover:text-gold-700 transition-colors">
                    Mehar
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-gold-600 font-medium -mt-0.5">
                    by Jashi
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links (Center on Desktop) */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative group text-sm font-medium tracking-wide text-espresso-800 hover:text-gold-700 transition-colors py-2"
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-700 tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Action Icons (Right on all screens) */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Desktop Search trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-espresso-600 hover:text-gold-700 hover:bg-cream-50 rounded-full transition-colors border border-transparent hover:border-cream-200"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 text-gold-600" aria-hidden="true" />
                <span className="hidden xl:inline tracking-wider">Search...</span>
              </button>

              {/* Wishlist Icon */}
              <button
                type="button"
                className="p-2 text-espresso-800 hover:text-gold-600 hover:bg-cream-50 rounded-full transition-colors relative"
                aria-label="View wishlist (0 items)"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Account Icon */}
              <button
                type="button"
                className="p-2 text-espresso-800 hover:text-gold-600 hover:bg-cream-50 rounded-full transition-colors"
                aria-label="Client Account"
                title="Client Account"
              >
                <User className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Shopping Bag Icon with Badge */}
              <button
                type="button"
                className="p-2 text-espresso-950 hover:text-gold-700 hover:bg-cream-50 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-gold-400"
                aria-label={
                  isReady
                    ? `Shopping bag containing ${count} item${count === 1 ? "" : "s"}`
                    : "Shopping bag"
                }
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                <span
                  className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 text-espresso-950 text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-white ${
                    isReady ? "" : "invisible"
                  }`}
                >
                  {isReady ? count : ""}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Quick Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-cream-200 bg-cream-50 px-4 py-4 sm:px-6 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // UI only for now
                }}
                className="relative flex items-center"
              >
                <Search className="w-5 h-5 text-espresso-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search silk kurtas, festive suits, organza saris, or co-ords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 bg-white border border-cream-300 rounded-full text-sm text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 text-espresso-400 hover:text-espresso-800"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-2.5 flex items-center gap-2 text-xs text-espresso-600 overflow-x-auto pb-1">
                <span className="text-gold-600 font-medium">Trending:</span>
                {["Raw Silk Ensembles", "Chikankari", "Tissue Organza", "Bridal Pret", "Co-ord Sets"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchQuery(tag)}
                      className="px-2.5 py-0.5 rounded-full bg-cream-100 hover:bg-gold-100 text-espresso-700 hover:text-gold-800 transition-colors whitespace-nowrap"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
