import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { CareerContent } from "@/components/pages/CareerContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('career'),
  };
}

export default async function CareerPage() {
  return <CareerContent />;
}

