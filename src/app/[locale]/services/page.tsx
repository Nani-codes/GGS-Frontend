/* Commented out - Services page temporarily disabled
import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { ServicesContent } from "@/components/pages/ServicesContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('services'),
  };
}

export default async function ServicesPage() {
  return <ServicesContent />;
}
*/

// Placeholder export to keep file as valid module
export default function ServicesPage() {
  return null;
}
