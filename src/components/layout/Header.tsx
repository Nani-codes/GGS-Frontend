"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { ResponsiveLanguageSwitcher } from "@/components/ResponsiveLanguageSwitcher";
import { CONTACT_INFO, SOCIAL_LINKS } from '@/config/constants';
import { IMAGE_PATHS } from '@/config/images';
const qs = require('qs');

const MOBILE_MENU_STYLES = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
} as const;

interface HeaderProps {
  variant?: 'default' | 'two';
  currentPage?: string;
}

export function Header({ variant = 'two', currentPage = '#' }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const apiKey = process.env.NEXT_STRAPI_API_KEY;
      const headers: HeadersInit = apiKey
        ? { Authorization: `Bearer ${apiKey}` }
        : {};

      // Try custom endpoint first
      try {
        const response = await fetch(
          `/strapi/api/products/categories?locale=${locale}`,
          { headers }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            setCategories(data.data);
            setCategoriesLoading(false);
            return;
          }
        }
      } catch (endpointError) {
        console.warn('Custom categories endpoint failed, using fallback:', endpointError);
      }

      // Fallback: fetch products and extract categories
      const query = qs.stringify(
        {
          fields: ['Group_Name'],
          pagination: {
            page: 1,
            pageSize: 1000, // Large page size to get all categories
          },
        },
        { encodeValuesOnly: true }
      );

      const response = await fetch(
        `/strapi/api/products?locale=${locale}&${query}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products for categories');
      }

      const data = await response.json();
      const products = data.data || [];

      // Extract unique Group_Name values
      const categoriesSet = new Set<string>();
      products.forEach((product: any) => {
        if (product.Group_Name && typeof product.Group_Name === 'string') {
          categoriesSet.add(product.Group_Name.trim());
        }
      });

      // Convert to sorted array
      const sortedCategories = Array.from(categoriesSet).sort();
      setCategories(sortedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Update mobile menu after categories finish loading
  useEffect(() => {
    if (!categoriesLoading) {
      // Wait for React to finish rendering the updated menu
      const updateMobileMenu = () => {
        const mainMenuList = document.querySelector('.main-menu__list');
        const mobileNavContainer = document.querySelector('.mobile-nav__container');
        
        if (mainMenuList && mobileNavContainer) {
          // Clone the updated menu HTML to mobile container
          mobileNavContainer.innerHTML = mainMenuList.outerHTML;
          
          // Re-initialize dropdown functionality using jQuery (if available)
          // This matches the behavior from script.js lines 1031-1051
          if (typeof window !== 'undefined' && (window as any).jQuery) {
            const $ = (window as any).jQuery;
            const dropdownAnchor = $('.mobile-nav__container .main-menu__list .dropdown > a');
            
            // Remove existing buttons and handlers
            dropdownAnchor.find('button').off('click').remove();
            
            // Re-add toggle buttons and handlers
            dropdownAnchor.each(function(this: HTMLElement) {
              const self = $(this);
              const toggleBtn = document.createElement('BUTTON');
              toggleBtn.setAttribute('aria-label', 'dropdown toggler');
              toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
              self.append(toggleBtn);
              
              self.find('button').on('click', function(this: HTMLElement, e: Event) {
                e.preventDefault();
                const btn = $(this);
                btn.toggleClass('expanded');
                btn.parent().toggleClass('expanded');
                btn.parent().parent().children('ul').slideToggle();
              });
            });
          }
        }
      };

      // Use setTimeout to ensure DOM is updated after React render
      const timeoutId = setTimeout(updateMobileMenu, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [categoriesLoading]);

  const renderCategoryDropdown = () => {
    return (
      <>
        <li><Link href="/products">{t('nav.productCategories.allProducts')}</Link></li>
        {categoriesLoading ? (
          <li><span style={{ padding: '10px', color: '#999' }}>Loading...</span></li>
        ) : (
          categories.map((category) => (
            <li key={category}>
              <Link href={`/products?category=${encodeURIComponent(category)}`}>
                {category}
              </Link>
            </li>
          ))
        )}
      </>
    );
  };
  
  if (variant === 'default') {
    return (
      <>
        <header className="main-header">
          <div className="main-menu__top">
            <div className="main-menu__top-inner">
              <ul className="list-unstyled main-menu__contact-list">
                <li>
                  <div className="icon">
                    <i className="icon-email" />
                  </div>
                  <div className="text">
                    <p><a href={CONTACT_INFO.emailHref}>{CONTACT_INFO.email}</a></p>
                  </div>
                </li>
              </ul>
              <div className="main-menu__top-right">
                <p className="main-menu__social-title">{t('topBar.followUsOn')}</p>
                <div className="main-menu__social">
                  <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube" /></a>
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f" /></a>
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /></a>
                </div>
              </div>
            </div>
          </div>
          <nav className="main-menu">
            <div className="main-menu__wrapper">
              <div className="main-menu__wrapper-inner">
                <div className="main-menu__left">
                  <div className="main-menu__logo">
                    <Link href="/"><img src={IMAGE_PATHS.logo22} alt="" /></Link>
                  </div>
                </div>
                <div className="main-menu__main-menu-box">
                  <div style={MOBILE_MENU_STYLES}>
                    <a href="/#" className="mobile-nav__toggler"><i className="fa fa-bars" /></a>
                    <ResponsiveLanguageSwitcher variant="mobile" />
                  </div>
                  <ul className="main-menu__list">
                    <li>
                      <Link href="/">{t('nav.home')}</Link>
                    </li>
                    <li>
                      <Link href="/about">{t('nav.about')}</Link>
                    </li>
                    <li className="dropdown">
                      <a href="/#" onClick={(e) => e.preventDefault()}>{t('nav.products')}</a>
                      <ul className="shadow-box">
                        {renderCategoryDropdown()}
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a href="/#" onClick={(e) => e.preventDefault()}>{t('nav.calendar')}</a>
                      <ul className="shadow-box">
                        <li><Link href="/calendar/panchang">{t('nav.panchang')}</Link></li>
                      </ul>
                    </li>
                    <li>
                      <Link href="/blog">{t('nav.blog')}</Link>
                    </li>
                    <li>
                      <Link href="/contact">{t('nav.contact')}</Link>
                    </li>
                  </ul>
                </div>
                <div className="main-menu__right">
                  <ResponsiveLanguageSwitcher variant="desktop" />
                  <div className="main-menu__call">
                    <div className="main-menu__call-icon">
                      <i className="icon-call" />
                    </div>
                    <div className="main-menu__call-content">
                      <p className="main-menu__call-sub-title">{t('common.callAnytime')}</p>
                      <h5 className="main-menu__call-number"><a href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a></h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div className="stricky-header stricked-menu main-menu">
          <div className="sticky-header__content" />
        </div>
      </>
    );
  }
  
  return (
    <>
      <header className="main-header-two">
        <div className="main-menu-two__top">
          <div className="container">
            <div className="main-menu-two__top-inner">
              <ul className="list-unstyled main-menu-two__contact-list">
                <li>
                  <div className="icon">
                    <i className="icon-call" />
                  </div>
                  <div className="text">
                    <p><a href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a></p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="icon-email" />
                  </div>
                  <div className="text">
                    <p><a href={CONTACT_INFO.emailHref}>{CONTACT_INFO.email}</a></p>
                  </div>
                </li>
              </ul>
              <div className="main-menu-two__top-right">
                <div className="main-menu-two__top-time">
                  <div className="main-menu-two__top-time-icon">
                    <span className="fas fa-clock" />
                  </div>
                  <p className="main-menu-two__top-text">{t('common.businessHours')}</p>
                </div>
                <div className="main-menu-two__social">
                  <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube" /></a>
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f" /></a>
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="main-menu main-menu-two">
          <div className="main-menu-two__wrapper">
            <div className="container">
              <div className="main-menu-two__wrapper-inner">
                <div className="main-menu-two__left">
                  <div className="main-menu-two__logo">
                    <Link href="/"><img src={IMAGE_PATHS.logo11} alt="" /></Link>
                  </div>
                </div>
                <div className="main-menu-two__main-menu-box">
                  <div style={MOBILE_MENU_STYLES}>
                    <a href={`${currentPage}#`} className="mobile-nav__toggler"><i className="fa fa-bars" /></a>
                    <ResponsiveLanguageSwitcher variant="mobile" />
                  </div>
                  <ul className="main-menu__list">
                    <li>
                      <Link href="/">{t('nav.home')}</Link>
                    </li>
                    <li>
                      <Link href="/about">{t('nav.about')}</Link>
                    </li>
                    <li className="dropdown">
                      <a href={`${currentPage}#`} onClick={(e) => e.preventDefault()}>{t('nav.products')}</a>
                      <ul className="shadow-box">
                        {renderCategoryDropdown()}
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a href={`${currentPage}#`} onClick={(e) => e.preventDefault()}>{t('nav.calendar')}</a>
                      <ul className="shadow-box">
                        <li><Link href="/calendar/panchang">{t('nav.panchang')}</Link></li>
                      </ul>
                    </li>
                    <li>
                      <Link href="/blog">{t('nav.blog')}</Link>
                    </li>
                    <li>
                      <Link href="/contact">{t('nav.contact')}</Link>
                    </li>
                  </ul>
                </div>
                <div className="main-menu-two__right">
                  <ResponsiveLanguageSwitcher variant="desktop" />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="stricky-header stricked-menu main-menu main-menu-two">
        <div className="sticky-header__content" />
      </div>
    </>
  );
}

