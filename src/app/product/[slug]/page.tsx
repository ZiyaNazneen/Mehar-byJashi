import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug } from "@/lib/data/products";
import { ProductGallery } from "@/components/product/pdp/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/pdp/ProductPurchasePanel";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Piece not found",
    };
  }

  const description =
    product.description && product.description.length > 155
      ? `${product.description.slice(0, 152)}...`
      : product.description || product.subtitle || "";

  const primaryImage = product.images[0]?.url;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: primaryImage
        ? [
            {
              url: primaryImage,
              alt: product.images[0]?.alt || product.name,
            },
          ]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-cream-200 bg-cream-50/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center text-xs text-espresso-600">
          <Link
            href="/"
            className="hover:text-gold-700 transition-colors focus-visible:outline-2 focus-visible:outline-gold-500 rounded-xs"
          >
            Home
          </Link>
          <span className="mx-2 text-cream-300" aria-hidden="true">
            /
          </span>
          <span className="text-espresso-700">{product.category}</span>
          <span className="mx-2 text-cream-300" aria-hidden="true">
            /
          </span>
          <span
            className="text-espresso-950 font-medium truncate"
            aria-current="page"
          >
            {product.name}
          </span>
        </div>
      </nav>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>
          <div className="lg:col-span-5">
            <ProductPurchasePanel product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
