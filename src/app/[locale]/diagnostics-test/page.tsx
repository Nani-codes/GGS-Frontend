import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { DiagnosticTestContent } from "@/components/pages/DiagnosticTestContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('diagnosticsTest'),
};
}

export default async function DiagnosticsTestPage() {
  return <DiagnosticTestContent />;
}
