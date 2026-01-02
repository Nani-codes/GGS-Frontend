import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { ProductsContent } from "@/components/pages/ProductsContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('products'),
};
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; subcategory?: string; search?: string; q?: string }>;
}) {
  const { category, subcategory, search, q } = await searchParams;
  // Support both 'search' and 'q' query parameters
  const searchQuery = search || q || undefined;
  return <ProductsContent category={category} subcategory={subcategory} search={searchQuery} />;
}
