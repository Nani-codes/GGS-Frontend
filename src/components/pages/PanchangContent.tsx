"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

export function PanchangContent() {
  const t = useTranslations();
  
  // Array of panchang image paths
  const panchangImages = Array.from({ length: 12 }, (_, i) => 
    `/assets/images/panchang/panchang-${String(i + 1).padStart(2, '0')}.jpg`
  );
  
  return (
    <PageLayout variant="two" currentPage="/calendar/panchang">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{t('nav.panchang')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li><Link href="/calendar/panchang">{t('nav.calendar')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{t('nav.panchang')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* ===== PANCHANG IMAGES SECTION ===== */}
      <section className="panchang-page" style={{ padding: '120px 0', minHeight: '100vh' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center">
                <h3 className="section-title__title">{t('nav.panchang')}</h3>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '50px' }}>
            {panchangImages.map((imagePath, index) => (
              <div 
                key={index} 
                className="col-xl-4 col-lg-4 col-md-6 col-sm-12"
                style={{ marginBottom: '30px' }}
              >
                <div 
                  className="panchang-image-wrapper"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0px 10px 30px 0px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img 
                    src={imagePath} 
                    alt={`Panchang ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'contain',
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

