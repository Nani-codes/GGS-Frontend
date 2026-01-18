"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { CONTACT_INFO, STATE_CONTACTS } from '@/config/constants';
import { IMAGE_PATHS } from '@/config/images';
import { ContactButtons } from '@/components/ContactButtons';
import { useState, useEffect, useRef } from 'react';

export function ContactContent() {
  const t = useTranslations();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [displayedState, setDisplayedState] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contactDetailsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside (only when dropdown menu is open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInDropdown = dropdownRef.current?.contains(target);
      const isClickInContactDetails = contactDetailsRef.current?.contains(target);
      
      // Only close dropdown menu if it's open and clicking outside
      // Don't close if contact details are showing (selectedState is a state name)
      if (selectedState === 'open' && !isClickInDropdown && !isClickInContactDetails) {
        setSelectedState(null);
      }
    };

    // Only add listener when dropdown menu is open
    if (selectedState === 'open') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedState]);
  
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
          <div className="row" style={{ justifyContent: 'center' }}>
            <div className="col-xl-5 col-lg-5 col-md-6 wow fadeInLeft" data-wow-delay="100ms">
              <div className="contact-info__single">
                <div className="contact-info__icon">
                  <span className="icon-call" />
                </div>
                <p>{t('contact.title')}</p>
                <h3><a href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a></h3>
              </div>
            </div>
            <div className="col-xl-5 col-lg-5 col-md-6 wow fadeInUp" data-wow-delay="200ms">
              <div className="contact-info__single">
                <div className="contact-info__icon">
                  <span className="icon-email" />
                </div>
                <p>{t('contact.title')}</p>
                <h3><a href={CONTACT_INFO.emailHref}>{CONTACT_INFO.email}</a></h3>
              </div>
            </div>
            {/* Address card commented out - address is now shown in the Google Maps section below */}
            {/* <div className="col-xl-4 col-lg-4 wow fadeInRight" data-wow-delay="300ms">
              <div className="contact-info__single">
                <div className="contact-info__icon">
                  <span className="icon-pin" />
                </div>
                <p>{t('contact.ourOfficeLocation')}</p>
                <h3>{t('contact.location')}</h3>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* ===== GOOGLE MAPS SECTION ===== */}
      <section className="map-section" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="section-title text-center" style={{ marginBottom: '50px' }}>
                <div className="section-title__tagline-box">
                  <div className="section-title__shape-1">
                    <img src="/assets/images/resources/section-title-shape-1.png" alt="" />
                  </div>
                  <h6 className="section-title__tagline">{t('contact.ourOfficeLocation') || 'Our Office Location'}</h6>
                  <div className="section-title__shape-1">
                    <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
                  </div>
                </div>
                <h2 className="section-title__title" style={{ marginBottom: '20px' }}>{t('contact.location')}</h2>
              </div>
              <div 
                className="map-container" 
                style={{
                  maxWidth: '100%',
                  margin: '0 auto',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  height: '450px',
                  minHeight: '300px'
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1232.1010381010683!2d75.21006631056184!3d19.785209794267075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb9d9734c4d705%3A0xb5c013d011fcf81f!2sGreen%20Gold%20Seeds!5e0!3m2!1sen!2sin!4v1768751321112!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Green Gold Seeds Office Location"
                  aria-label="Google Maps showing Green Gold Seeds office location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATE-WISE CONTACTS DROPDOWN SECTION ===== */}
      <section className="state-contacts" style={{ padding: '80px 0', backgroundColor: '#faf8f0' }}>
        <div className="container">
          <div className="section-title text-center">
            <div className="section-title__tagline-box">
              <div className="section-title__shape-1">
                <img src="/assets/images/resources/section-title-shape-1.png" alt="" />
              </div>
              <h6 className="section-title__tagline">{t('contact.stateContacts.tagline') || 'Contact Us'}</h6>
              <div className="section-title__shape-1">
                <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
              </div>
            </div>
            <h2 className="section-title__title">{t('contact.stateContacts.title') || 'State-wise Contacts'}</h2>
            <p style={{ maxWidth: '700px', margin: '20px auto 0', color: '#666', fontSize: '16px' }}>
              {t('contact.stateContacts.description') || 'Select your state to find contact information for your region'}
            </p>
          </div>

          <div className="row" style={{ marginTop: '50px' }}>
            <div className="col-xl-12">
              <div 
                ref={dropdownRef}
                style={{
                  maxWidth: '600px',
                  margin: '0 auto',
                  position: 'relative'
                }}
              >
                {/* Dropdown Button */}
                <div
                  onClick={() => {
                    if (selectedState === 'open') {
                      // Close dropdown if already open
                      setSelectedState(null);
                    } else if (selectedState && selectedState !== 'open') {
                      // If a state is selected, open dropdown to change selection
                      setSelectedState('open');
                    } else {
                      // Open dropdown
                      setSelectedState('open');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '18px 25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: '2px solid #e5e5e5',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#190f06',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: selectedState === 'open' ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedState !== 'open') {
                      e.currentTarget.style.borderColor = '#f5cb4b';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedState !== 'open') {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                    }
                  }}
                >
                  <span>
                    {displayedState 
                      ? STATE_CONTACTS.find(c => c.state === displayedState)?.state || t('contact.stateContacts.selectState') || 'Select State'
                      : t('contact.stateContacts.selectState') || 'Select State'}
                  </span>
                  <span className={`fas fa-chevron-${selectedState === 'open' ? 'up' : 'down'}`} style={{ fontSize: '14px', color: '#999' }} />
                </div>

                {/* Dropdown Menu - Only show when dropdown is open */}
                {selectedState === 'open' && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    zIndex: 1000,
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {STATE_CONTACTS.map((contact, index) => (
                      <div
                        key={contact.state}
                        onClick={() => {
                          setSelectedState(contact.state);
                          setDisplayedState(contact.state);
                        }}
                        style={{
                          padding: '15px 25px',
                          fontSize: '15px',
                          color: '#190f06',
                          cursor: 'pointer',
                          borderBottom: index < STATE_CONTACTS.length - 1 ? '1px solid #f0f0f0' : 'none',
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5cb4b20';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ fontWeight: '600' }}>{contact.state}</span>
                        <span className="fas fa-chevron-right" style={{ fontSize: '12px', color: '#999' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected State Contact Details */}
              {displayedState && (
                <div 
                  ref={contactDetailsRef}
                  style={{
                    maxWidth: '800px',
                    margin: '40px auto 0',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                >
                  {(() => {
                    const contact = STATE_CONTACTS.find(c => c.state === displayedState);
                    if (!contact) return null;
                    return (
                      <>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '30px',
                          paddingBottom: '20px',
                          borderBottom: '2px solid #f5cb4b'
                        }}>
                          <h3 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#190f06',
                            margin: 0
                          }}>
                            {contact.state}
                          </h3>
                          <button
                            onClick={() => {
                              setSelectedState(null);
                              setDisplayedState(null);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '24px',
                              color: '#999',
                              cursor: 'pointer',
                              padding: '0',
                              width: '30px',
                              height: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <span className="fas fa-times" />
                          </button>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '25px'
                        }}>
                          {/* Phone Number with Call and WhatsApp Buttons */}
                          <div style={{
                            padding: '20px',
                            backgroundColor: '#faf8f0',
                            borderRadius: '12px',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: '#f5cb4b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 15px'
                            }}>
                              <span className="icon-call" style={{ fontSize: '24px', color: '#190f06' }} />
                            </div>
                            <p style={{
                              fontSize: '14px',
                              color: '#666',
                              marginBottom: '10px',
                              fontWeight: '600'
                            }}>
                              {t('contact.stateContacts.phone') || 'Phone'}
                            </p>
                            <h4 style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#190f06',
                              margin: '0 0 15px 0'
                            }}>
                              {contact.phoneDisplay}
                            </h4>
                            <ContactButtons
                              phoneDisplay={contact.phoneDisplay}
                              phoneHref={contact.phoneHref}
                              whatsappHref={contact.whatsappHref}
                            />
                          </div>

                          {/* Email */}
                          {contact.email && (
                            <div style={{
                              padding: '20px',
                              backgroundColor: '#faf8f0',
                              borderRadius: '12px',
                              textAlign: 'center'
                            }}>
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#f5cb4b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 15px'
                              }}>
                                <span className="icon-email" style={{ fontSize: '24px', color: '#190f06' }} />
                              </div>
                              <p style={{
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '10px',
                                fontWeight: '600'
                              }}>
                                {t('contact.stateContacts.email') || 'Email'}
                              </p>
                              <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#190f06',
                                margin: 0,
                                wordBreak: 'break-word'
                              }}>
                                <a 
                                  href={`mailto:${contact.email}`}
                                  style={{
                                    color: '#190f06',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#f5cb4b';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#190f06';
                                  }}
                                >
                                  {contact.email}
                                </a>
                              </h4>
                            </div>
                          )}

                          {/* Location */}
                          {contact.location && (
                            <div style={{
                              padding: '20px',
                              backgroundColor: '#faf8f0',
                              borderRadius: '12px',
                              textAlign: 'center'
                            }}>
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#f5cb4b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 15px'
                              }}>
                                <span className="icon-pin" style={{ fontSize: '24px', color: '#190f06' }} />
                              </div>
                              <p style={{
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '10px',
                                fontWeight: '600'
                              }}>
                                {t('contact.stateContacts.location') || 'Location'}
                              </p>
                              <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#190f06',
                                margin: 0
                              }}>
                                {contact.location}
                              </h4>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
