"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { CONTACT_INFO } from '@/config/constants';
import { IMAGE_PATHS } from '@/config/images';

export function ContactContent() {
  const t = useTranslations();
  
  return (
    <PageLayout variant="two" currentPage="/contact">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{t('contact.title')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{t('contact.title')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ===== CONTACT INFO SECTION ===== */}
      <section className="contact-info">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay="100ms">
              <div className="contact-info__single">
                <div className="contact-info__icon">
                  <span className="icon-call" />
                </div>
                <p>{t('contact.title')}</p>
                <h3><a href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a></h3>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="200ms">
              <div className="contact-info__single">
                <div className="contact-info__icon">
                  <span className="icon-email" />
                </div>
                <p>{t('contact.title')}</p>
                <h3><a href={CONTACT_INFO.emailHref}>{CONTACT_INFO.email}</a></h3>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 wow fadeInRight" data-wow-delay="300ms">
              <div className="contact-info__single">
                <div className="contact-info__icon">
                  <span className="icon-pin" />
                </div>
                <p>{t('contact.ourOfficeLocation')}</p>
                <h3>{t('contact.location')}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
