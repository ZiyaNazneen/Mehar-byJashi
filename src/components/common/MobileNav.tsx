"use client";

import { useEffect } from "react";
import { NAV_LINKS, BRAND_NAME } from "@/lib/constants";
import { X, ArrowRight, Sparkles, Phone, Mail } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-cream-50 text-espresso-900 shadow-2xl flex flex-col justify-between border-r border-cream-200 z-10 animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div>
          <div className="p-6 border-b border-cream-200 flex items-center justify-between">
            <div>
              <span className="font-serif text-2xl tracking-wide font-normal text-espresso-950">
                Mehar
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 font-medium">
                by Jashi
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 text-espresso-700 hover:text-espresso-950 hover:bg-cream-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-6 py-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="group flex items-center justify-between py-3.5 text-base font-medium text-espresso-800 hover:text-gold-600 border-b border-cream-100 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </span>
                <ArrowRight className="w-4 h-4 text-espresso-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </nav>
        </div>

        {/* Footer in Drawer */}
        <div className="p-6 bg-cream-100 border-t border-cream-200 space-y-4">
          <div className="flex items-center gap-2 text-xs text-gold-700 font-medium">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>Complimentary Global Delivery</span>
          </div>
          <div className="text-xs text-espresso-600 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-espresso-500" />
              <a href="mailto:concierge@meharbyjashi.com" className="hover:underline">
                concierge@meharbyjashi.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-espresso-500" />
              <span>+1 (800) 924-MEHAR (Client Care)</span>
            </div>
          </div>
          <p className="text-[11px] text-espresso-500 pt-2 border-t border-cream-200">
            © 2026 {BRAND_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
