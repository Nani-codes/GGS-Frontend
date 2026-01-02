import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { BlogContent } from "@/components/pages/BlogContent";

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

export default async function BlogPage() {
  return <BlogContent />;
}
