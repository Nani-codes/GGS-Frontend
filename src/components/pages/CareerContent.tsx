"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';
import { CAREER_CONTACT } from '@/config/constants';

export function CareerContent() {
  const t = useTranslations();

  return (
    <PageLayout currentPage="/career">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{t('nav.career')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{t('nav.career')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAREER SECTION ===== */}
      <section className="about-one" style={{ padding: '120px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="about-one__content">
                <div className="section-title text-center">
                  <div className="section-title__tagline-box">
                    <div className="section-title__shape-1">
                      <img src="/assets/images/resources/section-title-shape-1.png" alt="" />
                    </div>
                    <h6 className="section-title__tagline">{t('career.tagline')}</h6>
                    <div className="section-title__shape-1">
                      <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
                    </div>
                  </div>
                  <h2 className="section-title__title">{t('career.title')}</h2>
                </div>
                <div className="about-one__text" style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    {t('career.description')}
                  </p>
                </div>

                <div
                  className="about-one__text"
                  style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '40px 32px',
                    backgroundColor: '#f8f6f1',
                    borderRadius: '12px',
                  }}
                >
                  <h3 style={{ marginBottom: '16px' }}>{t('career.ctaTitle')}</h3>
                  <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#666', marginBottom: '24px' }}>
                    {t('career.ctaDescription')}
                  </p>
                  <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#444', marginBottom: '28px' }}>
                    {t('career.applyInstructions')}
                  </p>
                  <a
                    href={CAREER_CONTACT.emailHref}
                    className="thm-btn"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                  >
                    {CAREER_CONTACT.email}
                    <i className="fal fa-long-arrow-right" />
                    <span className="hover-btn hover-bx" />
                    <span className="hover-btn hover-bx2" />
                    <span className="hover-btn hover-bx3" />
                    <span className="hover-btn hover-bx4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
