import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { QualityControlContent } from "@/components/pages/QualityControlContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('blog'),
  };
}

export default async function QualityControlPage() {
  return <QualityControlContent />;
}
