"use client";

import { useTranslations } from 'next-intl';

interface ContactButtonsProps {
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
}

export function ContactButtons({ phoneDisplay, phoneHref, whatsappHref }: ContactButtonsProps) {
  const t = useTranslations();

  return (
    <div className="contact-buttons" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        width: '100%',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Call Button */}
        <a
          href={phoneHref}
          aria-label={`Call ${phoneDisplay}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#f5cb4b',
            color: '#190f06',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '15px',
            transition: 'all 0.3s ease',
            minWidth: '140px',
            minHeight: '44px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5bb3b';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f5cb4b';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          <span className="icon-call" style={{ fontSize: '18px' }} />
          <span>{t('contact.stateContacts.call') || 'Call'}</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Message ${phoneDisplay} on WhatsApp`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#25D366',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '15px',
            transition: 'all 0.3s ease',
            minWidth: '140px',
            minHeight: '44px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#20BA5A';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#25D366';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          <i className="fab fa-whatsapp" style={{ fontSize: '18px' }} />
          <span>{t('contact.stateContacts.whatsapp') || 'WhatsApp'}</span>
        </a>
      </div>
      <p style={{
        fontSize: '12px',
        color: '#999',
        marginTop: '4px',
        fontStyle: 'italic',
        textAlign: 'center'
      }}>
        {t('contact.stateContacts.callOrMessage') || 'Call or Message'}
      </p>
    </div>
  );
}

