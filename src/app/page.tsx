import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { BrandStorySection } from "@/components/home/BrandStorySection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getCategories } from "@/lib/data/categories";
import { getAllPublishedProducts } from "@/lib/data/products";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllPublishedProducts(),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category Browsing Section */}
      <CategorySection categories={categories} />

      {/* 3. New Arrivals Showcase */}
      <NewArrivalsSection products={products} />

      {/* 4. Featured Collection (The Noor Edit) */}
      <FeaturedCollection />

      {/* 5. Brand Introduction & Artisan Story */}
      <BrandStorySection />

      {/* 6. Newsletter Subscription UI */}
      <NewsletterSection />
    </div>
  );
}
