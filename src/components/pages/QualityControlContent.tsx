"use client";

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

const qcSections = [
  {
    number: 1,
    title: "Certified Quality Systems",
    icon: "fas fa-certificate",
    points: [
      "ISO 9001:2008 certified quality management system",
      "Covers production, processing, packing, and dispatch",
      "Ensures standardized operations across the entire value chain"
    ]
  },
  {
    number: 2,
    title: "NABL Accredited Seed Testing",
    icon: "fas fa-flask",
    points: [
      "NABL accreditation (since April 2024)",
      "Seed Testing Laboratory authorized to issue Seed Analysis Certificates",
      "Testing follows ISTA & IMSCS protocols for accuracy and reliability"
    ]
  },
  {
    number: 3,
    title: "Strict Seed Testing & Approval Process",
    icon: "fas fa-clipboard-check",
    points: [
      "Every seed lot undergoes rigorous testing before release",
      "Compliance with Indian Minimum Seed Certification Standards (IMSCS)",
      "Adherence to Seed Act, Seed Rules & Seed Control Orders",
      "Ensures germination quality, purity, and performance consistency"
    ]
  },
  {
    number: 4,
    title: "Rigorous Field GOT (Grow-Out Test) Validation",
    icon: "fas fa-seedling",
    points: [
      "Mandatory Grow-Out Testing (GOT) conducted for each and every seed lot before release to market",
      "Field-based validation ensures genetic purity",
      "Phenotypic uniformity and true-to-type plant characteristics verified",
      "Acts as a final quality checkpoint under real cultivation conditions"
    ]
  },
  {
    number: 5,
    title: "Advanced Molecular & Biotech Validation",
    icon: "fas fa-dna",
    points: [
      "In-house biotech laboratory equipped with Molecular GOT capabilities",
      "Protein-level validation and toxification analysis",
      "DNA fingerprinting for all developed crops and varieties",
      "Strengthens genetic authenticity, purity assurance, and product reliability"
    ]
  },
  {
    number: 6,
    title: "Rapid Selection & Breeding Support Systems",
    icon: "fas fa-microscope",
    points: [
      "Advanced rapid screening and selection methods developed",
      "Supports breeders in early-stage trait identification",
      "Efficient selection of superior lines",
      "Accelerates breeding cycles and improves development accuracy"
    ]
  },
  {
    number: 7,
    title: "Data Integrity & Traceability",
    icon: "fas fa-database",
    points: [
      "Strong QA documentation systems",
      "Complete lot-wise traceability from production to distribution",
      "Participation in inter-laboratory trials",
      "Validated results through Government & notified seed testing labs"
    ]
  },
  {
    number: 8,
    title: "Field-Level Quality Monitoring",
    icon: "fas fa-binoculars",
    points: [
      "Regular field audits during production and storage",
      "Monitoring of crop performance and disease resistance",
      "Environmental adaptability assessment",
      "Ensures real-world validation of product quality"
    ]
  },
  {
    number: 9,
    title: "Packaging & Labelling Compliance",
    icon: "fas fa-box-open",
    points: [
      "Variety details, lot number & germination data on every pack",
      "Treatment information & expiry details clearly mentioned",
      "All seed packs follow regulatory norms",
      "Ensures transparency and farmer trust"
    ]
  },
  {
    number: 10,
    title: "End-to-End Quality Governance",
    icon: "fas fa-shield-alt",
    points: [
      "Dedicated Legal & Compliance Division",
      "Responsible for quality audits and regulatory adherence",
      "Vendor and partner compliance monitoring",
      "Ensures consistent quality control across the ecosystem"
    ]
  }
];

export function QualityControlContent() {
  const t = useTranslations();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <PageLayout currentPage="/blog">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>Quality Control & Assurance</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>Quality Control</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTRO SECTION ===== */}
      <section style={{ padding: '80px 0 40px', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center">
              <div className="section-title text-center sec-title-animation animation-style1">
                <div className="section-title__tagline-box" style={{ justifyContent: 'center' }}>
                  <div className="section-title__shape-1">
                    <img src="/assets/images/resources/section-title-shape-1.png" alt="" />
                  </div>
                  <h6 className="section-title__tagline">Our Commitment</h6>
                  <div className="section-title__shape-1">
                    <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
                  </div>
                </div>
                <h3 className="section-title__title title-animation" style={{ fontSize: '36px' }}>
                  Quality Control & Assurance
                </h3>
              </div>
              <p style={{
                fontSize: '17px',
                color: '#555',
                lineHeight: '1.8',
                maxWidth: '800px',
                margin: '0 auto 20px',
              }}>
                At Green Gold Seeds Pvt. Ltd., quality is not just a process — it is a promise. 
                From seed selection to final dispatch, every step is governed by rigorous standards, 
                advanced technology, and a deep commitment to farmer trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QC CARDS SECTION ===== */}
      <section style={{ padding: '40px 0 80px', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="row">
            {qcSections.map((section) => {
              const isExpanded = expandedCard === section.number;
              return (
                <div key={section.number} className="col-xl-6 col-lg-6 col-md-12" style={{ marginBottom: '24px' }}>
                  <div
                    onClick={() => setExpandedCard(isExpanded ? null : section.number)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: isExpanded ? '2px solid #f5cb4b' : '1px solid #e8e8e8',
                      borderRadius: '12px',
                      padding: '28px 28px 24px',
                      cursor: 'pointer',
                      transition: 'all 0.35s ease',
                      boxShadow: isExpanded
                        ? '0 8px 30px rgba(245, 203, 75, 0.15)'
                        : '0 2px 8px rgba(0,0,0,0.04)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      position: 'relative' as const,
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                        e.currentTarget.style.borderColor = '#f5cb4b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                        e.currentTarget.style.borderColor = '#e8e8e8';
                      }
                    }}
                  >
                    {/* Card Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: isExpanded ? '20px' : '0' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        backgroundColor: isExpanded ? '#f5cb4b' : '#faf8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                      }}>
                        <span className={section.icon} style={{
                          fontSize: '22px',
                          color: isExpanded ? '#ffffff' : '#f5cb4b',
                          transition: 'color 0.3s ease',
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#f5cb4b',
                          letterSpacing: '1px',
                          textTransform: 'uppercase' as const,
                          marginBottom: '4px',
                        }}>
                          {String(section.number).padStart(2, '0')}
                        </div>
                        <h4 style={{
                          fontSize: '17px',
                          fontWeight: '600',
                          color: '#190f06',
                          margin: 0,
                          lineHeight: '1.3',
                        }}>
                          {section.title}
                        </h4>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: isExpanded ? '#f5cb4b' : '#999',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                      }}>
                        <span className="fas fa-chevron-down" />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div style={{
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: '18px',
                      }}>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                        }}>
                          {section.points.map((point, idx) => (
                            <li key={idx} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              marginBottom: idx < section.points.length - 1 ? '12px' : '0',
                              fontSize: '15px',
                              color: '#444',
                              lineHeight: '1.6',
                            }}>
                              <span className="fas fa-check-circle" style={{
                                color: '#4CAF50',
                                fontSize: '14px',
                                marginTop: '4px',
                                flexShrink: 0,
                              }} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section style={{ padding: '60px 0', backgroundColor: '#faf8f0' }}>
        <div className="container">
          <div style={{
            textAlign: 'center' as const,
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#190f06',
              marginBottom: '16px',
            }}>
              Quality You Can Trust
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.7',
              marginBottom: '30px',
            }}>
              Our multi-layered quality assurance framework ensures that every seed 
              from Green Gold Seeds meets the highest standards of genetic purity, 
              germination, and field performance.
            </p>
            <Link className="thm-btn" href="/contact">
              Contact Us
              <i className="fal fa-long-arrow-right" />
              <span className="hover-btn hover-bx" />
              <span className="hover-btn hover-bx2" />
              <span className="hover-btn hover-bx3" />
              <span className="hover-btn hover-bx4" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
