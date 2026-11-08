import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert integer minor currency units (paise) to decimal currency (rupees)
 * e.g. 2850000 paise -> 28500 rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Format currency for international fashion commerce
 * Supports INR (default), USD, AED, GBP, EUR
 */


export function formatCurrency(
  amount: number,
  currency: "INR" | "USD" | "AED" | "GBP" | "EUR" = "INR",
  locale: string = "en-IN"
): string {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    AED: "AED ",
    GBP: "£",
    EUR: "€",
  };

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount);

  return `${symbols[currency]}${formattedAmount}`;
}



/**
 * Format integer minor units (paise) directly to currency string
 */
export function formatMinorUnits(
  paise: number,
  currency: "INR" | "USD" | "AED" | "GBP" | "EUR" = "INR",
  locale: string = "en-IN"
): string {
  return formatCurrency(paiseToRupees(paise), currency, locale);
}
