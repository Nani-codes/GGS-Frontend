import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { AboutContent } from "@/components/pages/AboutContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('about'),
};
}

export default async function AboutPage() {
  return <AboutContent />;
}
