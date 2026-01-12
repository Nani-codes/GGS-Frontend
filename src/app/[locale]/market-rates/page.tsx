import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { MarketRatesContent } from "@/components/pages/MarketRatesContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('marketRates'),
  };
}

export default async function MarketRatesPage() {
  return <MarketRatesContent />;
}

