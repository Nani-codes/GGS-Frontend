"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

export function FaqContent() {
  const t = useTranslations();

  return (
    <PageLayout currentPage="/faq">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>Our Faq </h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>Faq </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ===== FAQ SECTION ===== */}
      <div className="faq-page">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6">
              <div className="faq-one__right faq-page__right">
                <div className="accrodion-grp" data-grp-name="faq-one-accrodion">
                  <div className="accrodion wow fadeInLeft" data-wow-delay="0ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>Are your fruits and vegetables organic?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>Yes, we strictly follow organic farming methods without harmful
                          chemicals.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accrodion active wow fadeInRight" data-wow-delay="100ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>Do you deliver products at home?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>Yes, we provide safe and fast home delivery within selected areas. Don't
                          hesitate to reach out!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accrodion wow fadeInLeft" data-wow-delay="0ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>What payment methods do you accept?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>We accept cash on delivery, mobile banking, and online payments.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accrodion wow fadeInLeft" data-wow-delay="0ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>How can I visit your farm?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>You can book a farm tour from our website or contact us directly.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accrodion wow fadeInLeft" data-wow-delay="0ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>Where are your farm products sourced from?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>All of our products are directly harvested from our own organic farm to
                          ensure freshness.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="faq-one__right faq-page__right">
                <div className=" accrodion-grp" data-grp-name="faq-one-accrodion">
                  <div className="accrodion wow fadeInLeft" data-wow-delay="0ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>Are your fruits and vegetables organic?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>Yes, we strictly follow organic farming methods without harmful
                          chemicals.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accrodion wow fadeInRight" data-wow-delay="100ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>Do you deliver products at home?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>Yes, we provide safe and fast home delivery within selected areas. Don't
                          hesitate to reach out!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accrodion wow fadeInLeft" data-wow-delay="0ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>What payment methods do you accept?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>We accept cash on delivery, mobile banking, and online payments.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accrodion wow fadeInLeft" data-wow-delay="0ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>How can I visit your farm?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>You can book a farm tour from our website or contact us directly.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accrodion wow fadeInLeft" data-wow-delay="0ms" data-wow-duration="1500ms">
                    <div className="accrodion-title">
                      <h4>Where are your farm products sourced from?</h4>
                    </div>
                    <div className="accrodion-content">
                      <div className="inner">
                        <p>All of our products are directly harvested from our own organic farm to
                          ensure freshness.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
