import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { HomeContent } from "@/components/pages/HomeContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('home'),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <HomeContent />;
}

