import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/common/AnnouncementBar";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} | Artisanal Handcrafted Luxury Womenswear`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: `${BRAND_TAGLINE}. Discover handcrafted pure raw silk ensembles, festive couture, chanderi angrakhas, and contemporary luxury co-ords with worldwide express shipping.`,
  keywords: [
    "Mehar by Jashi",
    "Luxury Womenswear",
    "Raw Silk Kurta",
    "Festive Couture",
    "Handcrafted Indian Fashion",
    "Chikankari Anarkali",
    "Tissue Organza Sari",
    "Luxury Pret",
    "Designer Co-ords",
    "Worldwide Shipping",
  ],
  authors: [{ name: "Mehar by Jashi Atelier" }],
  openGraph: {
    title: `${BRAND_NAME} | Artisanal Handcrafted Luxury Womenswear`,
    description: `${BRAND_TAGLINE}. Designed for timeless moments of celebration.`,
    url: "https://meharbyjashi.com",
    siteName: BRAND_NAME,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-espresso-900 font-sans selection:bg-cream-200 selection:text-espresso-950">
        {/* Accessible skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-espresso-950 focus:text-cream-100 focus:rounded focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Global Navigation Header */}
        <Header />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
