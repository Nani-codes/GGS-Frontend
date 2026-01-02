import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { FaqContent } from "@/components/pages/FaqContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('faq'),
};
}

export default async function FaqPage() {
  return <FaqContent />;
}
