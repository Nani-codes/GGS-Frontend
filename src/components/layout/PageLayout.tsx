"use client";

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Preloader } from './Preloader';
import { ChatPopup } from './ChatPopup';
import { WhatsAppPopup } from './WhatsAppPopup';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { ScrollToTop } from './ScrollToTop';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/config/constants';
import { IMAGE_PATHS } from '@/config/images';

const NavHighlighter = dynamic(() => import("@/components/NavHighlighter").then(mod => ({ default: mod.NavHighlighter })), { ssr: false });

interface PageLayoutProps {
  children: ReactNode;
  variant?: 'default' | 'two';
  currentPage?: string;
  showSidebar?: boolean;
}

export function PageLayout({ 
  children, 
  variant = 'two', 
  currentPage = '#',
  showSidebar = false 
}: PageLayoutProps) {
  const t = useTranslations();
  
  return (
    <>
      <NavHighlighter />
      <div>
        <div className="custom-cursor__cursor" />
        <div className="custom-cursor__cursor-two" />
        <Preloader />
        <ChatPopup />
        <WhatsAppPopup />
        {showSidebar && (
          <div className="xs-sidebar-group info-group info-sidebar">
            <div className="xs-overlay xs-bg-black" />
            <div className="xs-sidebar-widget">
              <div className="sidebar-widget-container">
                <div className="widget-heading">
                  <a href="/#" className="close-side-widget">X</a>
                </div>
                <div className="sidebar-textwidget">
                  <div className="sidebar-info-contents">
                    <div className="content-inner">
                      <div className="logo">
                        <Link href="/"><img src={IMAGE_PATHS.logo11} alt="" /></Link>
                      </div>
                      <div className="content-box">
                        <h4>{t('sidebar.aboutUs')}</h4>
                        <div className="inner-text">
                          <p>{t('sidebar.sidebarAboutText')}</p>
                        </div>
                      </div>
                      <div className="sidebar-contact-info">
                        <h4>{t('sidebar.contactInfo')}</h4>
                        <ul className="list-unstyled">
                          <li>
                            <span className="icon-pin" /> {t('contact.location')}
                          </li>
                          <li>
                            <span className="icon-call" />
                            <a href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a>
                          </li>
                          <li>
                            <span className="icon-email" />
                            <a href={CONTACT_INFO.emailHref}>{CONTACT_INFO.email}</a>
                          </li>
                        </ul>
                      </div>
                      <div className="thm-social-link1">
                        <ul className="social-box list-unstyled">
                          <li>
                            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f" aria-hidden="true" /></a>
                          </li>
                          <li>
                            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube" aria-hidden="true" /></a>
                          </li>
                          <li>
                            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" aria-hidden="true" /></a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="page-wrapper">
          <Header variant={variant} currentPage={currentPage} />
          {children}
          <Footer variant={variant} />
        </div>
        <MobileNav />
        <ScrollToTop currentPage={currentPage} />
      </div>
    </>
  );
}

