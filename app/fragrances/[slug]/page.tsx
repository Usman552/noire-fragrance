import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelated, products } from "@/lib/products";
import { ProductDetail } from "@/components/product/ProductDetail";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.concentration}`,
    description: `${product.tagline} ${product.description}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail key={product.id} product={product} related={getRelated(product)} />;
}
