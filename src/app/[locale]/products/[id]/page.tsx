import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { ProductsDetailsContent } from "@/components/pages/ProductsDetailsContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('productDetails'),
  };
}

export default async function ProductDetailsPage() {
  return <ProductsDetailsContent />;
}

