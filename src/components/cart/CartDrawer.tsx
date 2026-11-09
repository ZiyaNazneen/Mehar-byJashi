"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCurrency } from "@/lib/utils";

function isAllowedCartImageUrl(imageUrl: string | null): imageUrl is string {
  if (!imageUrl) {
    return false;
  }

  try {
    const url = new URL(imageUrl);
    // This allowlist mirrors next.config.ts images.remotePatterns.
    return (
      url.protocol === "https:" &&
      (url.hostname === "images.unsplash.com" ||
        /^[^.]+\.supabase\.co$/.test(url.hostname))
    );
  } catch {
    return false;
  }
}

export function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    isReady,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      const focusableElements = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !panel.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === lastElement || !panel.contains(activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (
        previouslyFocused instanceof HTMLElement &&
        document.contains(previouslyFocused)
      ) {
        previouslyFocused.focus();
      }
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-espresso-950/50"
        onClick={closeDrawer}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
        className="fixed right-0 top-0 z-60 flex h-dvh w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-cream-200 px-5 py-4">
          <h2
            id="cart-drawer-heading"
            className="font-serif text-2xl font-normal text-espresso-950"
          >
            Your Bag <span className="text-lg">({count})</span>
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="rounded-full p-2 text-espresso-800 transition-colors hover:bg-cream-100 focus-visible:outline-2 focus-visible:outline-gold-500"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          {!isReady ? (
            <p className="py-8 text-sm text-espresso-600">Loading your bag...</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="font-serif text-xl text-espresso-900">
                Your bag is empty.
              </p>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-sm border border-gold-500 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-espresso-950 transition-colors hover:bg-cream-50 focus-visible:outline-2 focus-visible:outline-gold-500"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-cream-200">
              {items.map((item) => {
                const safeImageUrl = isAllowedCartImageUrl(item.imageUrl)
                  ? item.imageUrl
                  : null;

                return (
                  <li
                    key={item.variantId}
                    className="flex gap-4 py-5"
                  >
                    <div className="relative aspect-3/4 w-20 shrink-0 overflow-hidden rounded-sm bg-cream-100">
                      {safeImageUrl ? (
                        <Image
                          src={safeImageUrl}
                          alt={item.productName}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${encodeURIComponent(item.productSlug)}`}
                          onClick={closeDrawer}
                          className="font-serif text-lg leading-tight text-espresso-950 hover:text-gold-700 focus-visible:outline-2 focus-visible:outline-gold-500"
                        >
                          {item.productName}
                        </Link>
                        <span className="shrink-0 text-sm text-espresso-900">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-espresso-600">
                        <span>Size {item.size}</span>
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="h-3 w-3 rounded-full border border-cream-300"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-espresso-700">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center rounded-sm border border-cream-300">
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => {
                              const nextQuantity = item.quantity - 1;
                              updateQuantity(item.variantId, nextQuantity);
                              setAnnouncement(
                                `Quantity of ${item.productName} set to ${nextQuantity}`
                              );
                            }}
                            aria-label={`Decrease quantity of ${item.productName}`}
                            className="p-2 text-espresso-800 transition-colors hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-gold-500"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span
                            className="min-w-7 text-center text-xs text-espresso-950"
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= item.maxQuantity}
                            onClick={() => {
                              const nextQuantity = item.quantity + 1;
                              updateQuantity(item.variantId, nextQuantity);
                              setAnnouncement(
                                `Quantity of ${item.productName} set to ${nextQuantity}`
                              );
                            }}
                            aria-label={`Increase quantity of ${item.productName}`}
                            className="p-2 text-espresso-800 transition-colors hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-gold-500"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        {item.quantity >= item.maxQuantity && (
                          <span className="text-[11px] text-espresso-600">
                            Maximum reached
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(item.variantId);
                            setAnnouncement(`${item.productName} removed from bag`);
                            requestAnimationFrame(() =>
                              closeButtonRef.current?.focus()
                            );
                          }}
                          aria-label={`Remove ${item.productName} from bag`}
                          className="text-xs text-espresso-600 underline underline-offset-2 hover:text-gold-700 focus-visible:outline-2 focus-visible:outline-gold-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-cream-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between text-sm font-medium text-espresso-950">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-espresso-600">
            Shipping calculated at checkout. Final prices and availability are
            confirmed at checkout.
          </p>
          <button
            type="button"
            disabled
            className="mt-4 w-full cursor-not-allowed rounded-sm bg-cream-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-espresso-500"
          >
            Checkout
          </button>
          <p className="mt-2 text-center text-[11px] text-espresso-500">
            Checkout is coming soon.
          </p>
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </aside>
    </>
  );
}
