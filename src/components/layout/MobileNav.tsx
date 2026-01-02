"use client";

import { Link } from '@/i18n/routing';
import { ResponsiveLanguageSwitcher } from "@/components/ResponsiveLanguageSwitcher";
import { CONTACT_INFO, SOCIAL_LINKS } from '@/config/constants';
import { IMAGE_PATHS } from '@/config/images';

export function MobileNav() {
  return (
    <div className="mobile-nav__wrapper">
      <div className="mobile-nav__overlay mobile-nav__toggler" />
      <div className="mobile-nav__content">
        <span className="mobile-nav__close mobile-nav__toggler"><i className="fa fa-times" /></span>
        <div className="logo-box">
          <Link href="/" aria-label="logo image"><img src={IMAGE_PATHS.logo11} width={150} alt="" /></Link>
        </div>
        <div className="mobile-nav__container" />
        <ul className="mobile-nav__contact list-unstyled">
          <li>
            <i className="fa fa-envelope" />
            <a href={CONTACT_INFO.emailHref}>{CONTACT_INFO.email}</a>
          </li>
          <li>
            <i className="fas fa-phone" />
            <a href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a>
          </li>
        </ul>
        <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <ResponsiveLanguageSwitcher variant="mobile" />
        </div>
        <div className="mobile-nav__top">
          <div className="mobile-nav__social">
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="fab fa-youtube" />
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="fab fa-facebook-square" />
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="fab fa-instagram" />
          </div>
        </div>
      </div>
    </div>
  );
}

