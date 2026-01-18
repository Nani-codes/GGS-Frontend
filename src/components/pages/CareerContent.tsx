"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

export function CareerContent() {
  const t = useTranslations();
  
  return (
    <PageLayout variant="two" currentPage="/career">
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
                    <h6 className="section-title__tagline">{t('career.tagline') || 'Join Our Team'}</h6>
                    <div className="section-title__shape-1">
                      <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
                    </div>
                  </div>
                  <h2 className="section-title__title">{t('career.title') || 'Career & Opportunities'}</h2>
                </div>
                <div className="about-one__text" style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    {t('career.description') || 'We are always looking for talented individuals to join our team. Explore exciting career opportunities with Green Gold Seeds Pvt. Ltd. and be part of our mission to transform Indian agriculture.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA SECTION ===== */}
      <section className="cta-two">
        <div className="container">
          <div className="cta-two__inner text-center">
            <h3>{t('career.ctaTitle') || 'Interested in Joining Our Team?'}</h3>
            <p>{t('career.ctaDescription') || 'Send us your resume or contact us for more information about current openings.'}</p>
            <div style={{ marginTop: '30px' }}>
              <Link className="thm-btn" href="/contact">
                {t('nav.contact')}
                <i className="fal fa-long-arrow-right" />
                <span className="hover-btn hover-bx" />
                <span className="hover-btn hover-bx2" />
                <span className="hover-btn hover-bx3" />
                <span className="hover-btn hover-bx4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

