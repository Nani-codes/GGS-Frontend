import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { WeatherContent } from "@/components/pages/WeatherContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('weather'),
  };
}

export default async function WeatherPage() {
  return <WeatherContent />;
}

