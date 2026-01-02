"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

export function ServicesContent() {
  const t = useTranslations();
  
  return (
    <PageLayout variant="two" currentPage="/services">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{t('services.diagnosticsTest')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{t('services.diagnosticsTest')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ===== SERVICES SECTION ===== */}
      <section className="services-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0ms">
              <div className="services-two__single">
                <div className="services-two__img-box">
                  <div className="services-two__img">
                    <img src="/assets/images/backgrounds/qualityassurance.png" alt={t('services.diagnosticsTest')} />
                  </div>
                </div>
                <div className="services-two__content">
                  <div className="services-two__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/services-two-content-bg-shape.png)' }}>
                  </div>
                  <div className="services-two__icon">
                    <span className="icon-precision-agriculture" />
                  </div>
                  <h3 className="services-two__title"><Link href="/diagnostics-test">{t('services.diagnosticsTest')}</Link>
                  </h3>
                  <p className="services-two__text">{t('services.diagnosticsTestDescription')}</p>
                  <div className="services-two__read-more">
                    <Link href="/diagnostics-test">{t('common.readMore')}<span className="fas fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
