import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { PanchangContent } from "@/components/pages/PanchangContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('panchang'),
  };
}

export default async function PanchangPage() {
  return <PanchangContent />;
}

