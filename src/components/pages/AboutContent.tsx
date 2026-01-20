"use client";

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

export function AboutContent() {
  const t = useTranslations();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <PageLayout currentPage="/about">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{t('about.pageTitle')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{t('about.breadcrumb')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ===== ABOUT SECTION ===== */}
      <section id="our-history" className="about-one about-five">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="about-one__left">
                <div className="about-one__img" style={{ width: '100%', height: '100%', minHeight: '500px' }}>
                  <img src={IMAGE_PATHS.homepageImage} alt="Tractor tilling field" style={{ width: '100%', height: '100%', minHeight: '500px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="about-one__right">
                <div className="section-title text-left sec-title-animation animation-style2">
                  <div className="section-title__tagline-box">
                    <div className="section-title__shape-1">
                      <img src="/assets/images/resources/section-title-shape-1.png" alt="section-title-shape-1" />
                    </div>
                    <h6 className="section-title__tagline">{t('about.ourStory')}</h6>
                    <div className="section-title__shape-1">
                      <img src="/assets/images/resources/section-title-shape-2.png" alt="section-title-shape-2" />
                    </div>
                  </div>
                  <h3 className="section-title__title title-animation">{t('about.growingWithFarmers')}</h3>
                </div>
                <p className="about-one__text">
                  {t('about.storyText1')}
                </p>
                <p className="about-one__text">
                  {t('about.storyText2')}
                </p>
                <h4 className="about-one__title-1">{t('about.highlightsAtGlance')}</h4>
                <div className="about-one__points-box-and-since">
                  <ul className="about-one__points list-unstyled">
                    <li>
                      <div className="icon">
                        <span className="fas fa-wheat" />
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: t('about.highlight1') }} />
                    </li>
                    <li>
                      <div className="icon">
                        <span className="fas fa-wheat" />
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: t('about.highlight2') }} />
                    </li>
                    <li>
                      <div className="icon">
                        <span className="fas fa-wheat" />
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: t('about.highlight3') }} />
                    </li>
                  </ul>
                  <div className="about-one__since-box">
                    <div className="about-one__since-icon">
                      <span className="icon-harvester" />
                    </div>
                    <h5 className="about-one__since-title">{t('about.progressSince')}</h5>
                    <h4 className="about-one__since-year">2001</h4>
                  </div>
                </div>
                <div className="about-one__btn-and-video">
                  <div className="about-one__btn-box">
                    <Link className="thm-btn" href="/about#our-history">{t('common.exploreOurJourney')}
                      <i className="fal fa-long-arrow-right" />
                      <span className="hover-btn hover-bx" />
                      <span className="hover-btn hover-bx2" />
                      <span className="hover-btn hover-bx3" />
                      <span className="hover-btn hover-bx4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== VISION/MISSION/VALUES DIAMOND FLOW SECTION ===== */}
      <section className="vision-mission-flow-section">
        <div className="container">
          <div className="vision-mission-flow vision-mission-flow--vshape">
            {/* Diamond 1 - Vision */}
            <div className="diamond-flow-item diamond-flow-item--vision">
              <div className="diamond-tile diamond-tile--vision">
                <div className="diamond-tile__number">1</div>
                <div className="diamond-tile__title">Vision</div>
              </div>
              <div className="diamond-flow-description diamond-flow-description--center">
                <p className="diamond-flow-description-text" dangerouslySetInnerHTML={{ __html: t('about.visionText') }} />
              </div>
            </div>

            {/* Connector 1-2 */}
            <div className="diamond-flow-connector diamond-flow-connector--1-2"></div>

            {/* Diamond 2 - Mission */}
            <div className="diamond-flow-item diamond-flow-item--mission">
              <div className="diamond-tile diamond-tile--mission">
                <div className="diamond-tile__number">2</div>
                <div className="diamond-tile__title">Mission</div>
              </div>
              <div className="diamond-flow-description diamond-flow-description--center">
                <p className="diamond-flow-description-text" dangerouslySetInnerHTML={{ __html: t('about.missionText') }} />
              </div>
            </div>

            {/* Connector 2-3 */}
            <div className="diamond-flow-connector diamond-flow-connector--2-3"></div>

            {/* Diamond 3 - Values */}
            <div className="diamond-flow-item diamond-flow-item--values">
              <div className="diamond-tile diamond-tile--values">
                <div className="diamond-tile__number">3</div>
                <div className="diamond-tile__title">Values</div>
              </div>
              <div className="diamond-flow-description diamond-flow-description--center">
                <p className="diamond-flow-description-text">{t('home.values.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== INFRASTRUCTURE HIGHLIGHTS SECTION ===== */}
      <section className="infrastructure-highlights-section" style={{ padding: '80px 0', backgroundColor: '#faf8f0' }}>
        <div className="container">
          <div className="section-title text-center">
            <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#190f06', marginBottom: '10px' }}>{t('about.infrastructureHighlights')}</h3>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#f5cb4b', margin: '0 auto 40px' }}></div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="infrastructure-accordion" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { key: 'researchDevelopment', label: t('about.infrastructure.researchDevelopment') },
                  { key: 'qualityControl', label: t('about.infrastructure.qualityControl') },
                  { key: 'seedProcessing', label: t('about.infrastructure.seedProcessing') }
                ].map((item) => {
                  const isExpanded = expandedItem === item.key;
                  return (
                    <div key={item.key} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                      <div
                        className="infrastructure-item"
                        onClick={() => setExpandedItem(isExpanded ? null : item.key)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                        }}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: '2px solid #f5cb4b',
                            backgroundColor: isExpanded ? '#f5cb4b' : 'transparent',
                            marginRight: '15px',
                            flexShrink: 0,
                            transition: 'background-color 0.3s ease'
                          }}
                        ></div>
                        <div style={{ flex: 1, fontSize: '18px', fontWeight: '500', color: '#190f06' }}>
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#666',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          <span className="fas fa-chevron-down" />
                        </div>
                      </div>
                      {isExpanded && item.key === 'researchDevelopment' && (
                        <div
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e0e0e0',
                            borderTop: '1px solid #e0e0e0',
                            borderRadius: '0 0 8px 8px',
                            padding: '30px',
                            marginTop: '-8px'
                          }}
                        >
                          <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#190f06' }}>
                            <p style={{ marginBottom: '15px' }}>{t('about.infrastructure.rdOverview')}</p>

                            <h5 style={{ fontSize: '18px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#190f06' }}>
                              {t('about.infrastructure.rdCottonHybrids')}
                            </h5>
                            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                              <li style={{ marginBottom: '8px' }}>{t('about.infrastructure.rdGold70')}</li>
                              <li style={{ marginBottom: '8px' }}>{t('about.infrastructure.rdKuber')}</li>
                              <li style={{ marginBottom: '8px' }}>{t('about.infrastructure.rdGold50')}</li>
                              <li style={{ marginBottom: '8px' }}>{t('about.infrastructure.rdNamaskar')}</li>
                            </ul>
                            <p style={{ marginBottom: '15px' }}>{t('about.infrastructure.rdPipeline')}</p>

                            <h5 style={{ fontSize: '18px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#190f06' }}>
                              {t('about.infrastructure.rdBollgard')}
                            </h5>
                            <p style={{ marginBottom: '15px' }}>{t('about.infrastructure.rdBollgardDesc')}</p>

                            <h5 style={{ fontSize: '18px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#190f06' }}>
                              {t('about.infrastructure.rdWheat')}
                            </h5>
                            <p style={{ marginBottom: '8px' }}>{t('about.infrastructure.rdWheatGold')}</p>
                            <p>{t('about.infrastructure.rdWheatOngoing')}</p>
                          </div>
                        </div>
                      )}
                      {isExpanded && item.key === 'qualityControl' && (
                        <div
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e0e0e0',
                            borderTop: '1px solid #e0e0e0',
                            borderRadius: '0 0 8px 8px',
                            padding: '30px',
                            marginTop: '-8px'
                          }}
                        >
                          <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#190f06' }}>
                            <p style={{ marginBottom: '15px' }}>{t('about.infrastructure.qcOverview')}</p>
                            <p style={{ marginBottom: '15px' }}>{t('about.infrastructure.qcFieldInspection')}</p>
                            <p style={{ marginBottom: '15px' }}>{t('about.infrastructure.qcLaboratory')}</p>
                            <p>{t('about.infrastructure.qcGrowOut')}</p>
                          </div>
                        </div>
                      )}
                      {isExpanded && item.key === 'seedProcessing' && (
                        <div
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e0e0e0',
                            borderTop: '1px solid #e0e0e0',
                            borderRadius: '0 0 8px 8px',
                            padding: '30px',
                            marginTop: '-8px'
                          }}
                        >
                          <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#190f06' }}>
                            <p style={{ marginBottom: '15px' }}>{t('about.infrastructure.spOverview')}</p>
                            <p style={{ marginBottom: '15px' }}>{t('about.infrastructure.spDefinition')}</p>
                            <p>{t('about.infrastructure.spLocations')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== TEAM SECTION ===== */}
      <section id="team" className="team-one about-page-team">
        <div className="container">
          <div className="section-title text-center sec-title-animation animation-style1">
            <div className="section-title__tagline-box">
              <div className="section-title__shape-1">
                <img src="/assets/images/resources/section-title-shape-1.png" alt="" />
              </div>
              <h6 className="section-title__tagline">{t('about.professionalPeople')}</h6>
              <div className="section-title__shape-1">
                <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
              </div>
            </div>
            <h3 className="section-title__title title-animation">{t('about.ourLeaders')}</h3>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInLeft" data-wow-delay="100ms">
              <div className="team-one__single">
                <div className="team-one__img-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="team-one__img" style={{ width: '100%', maxWidth: '370px', height: '448px', overflow: 'hidden', borderRadius: '10px' }}>
                    <img src="/assets/images/backgrounds/pic1.jpg" alt="Shri Madhukarrao Mulay - Chairman" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
                <div className="team-one__content">
                  <div className="team-one__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/team-one-content-bg-shape.png)' }}>
                  </div>
                  <h3 className="team-one__title"><Link href="/about#team">Shri Madhukarrao Mulay</Link></h3>
                  <p className="team-one__sub-title">{t('about.chairman')}</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 wow fadeInRight" data-wow-delay="200ms">
              <div className="team-one__single">
                <div className="team-one__img-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="team-one__img" style={{ width: '100%', maxWidth: '370px', height: '448px', overflow: 'hidden', borderRadius: '10px' }}>
                    <img src="/assets/images/backgrounds/pic2.jpg" alt="Shri Ajeet Mulay - Managing Director" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
                <div className="team-one__content">
                  <div className="team-one__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/team-one-content-bg-shape.png)' }}>
                  </div>
                  <h3 className="team-one__title"><Link href="/about#team">Shri Ajeet Mulay</Link></h3>
                  <p className="team-one__sub-title">{t('about.managingDirector')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== CLOSING STATEMENT ===== */}
      <section className="cta-two closing-message">
        <div className="container">
          <div className="cta-two__inner text-center">
            <h3>{t('home.banner.title')}</h3>
            <p>{t('about.closingStatement')}</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
