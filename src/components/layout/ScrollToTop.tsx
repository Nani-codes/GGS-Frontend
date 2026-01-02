"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface ScrollToTopProps {
  currentPage?: string;
}

export function ScrollToTop({ currentPage = '#' }: ScrollToTopProps) {
  const t = useTranslations();
  
  return (
    <Link href={`${currentPage}#`} data-target="html" className="scroll-to-target scroll-to-top">
      <span className="scroll-to-top__wrapper">
        <span className="scroll-to-top__inner" />
      </span>
      <span className="scroll-to-top__text">{t('common.goBackTop')}</span>
    </Link>
  );
}

