"use client";

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CONTACT_INFO } from '@/config/constants';
import { IMAGE_PATHS } from '@/config/images';
const qs = require('qs');

interface FooterProps {
  variant?: 'default' | 'two';
}

export function Footer({ variant = 'default' }: FooterProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [productCategories, setProductCategories] = useState<string[]>([]);
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
            // Limit to first 5 categories for footer display
            setProductCategories(data.data.slice(0, 5));
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
            pageSize: 1000,
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

      // Convert to sorted array and limit to first 5
      const sortedCategories = Array.from(categoriesSet).sort().slice(0, 5);
      setProductCategories(sortedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setProductCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);
  
  return (
    <footer className="site-footer">
      <div className="site-footer__bg" style={{ backgroundImage: 'url(/assets/images/backgrounds/site-footer-bg.jpg)' }}>
      </div>
      <div className="site-footer__top">
        <div className="container">
          <div className="site-footer__top-inner">
            <div className="row">
              <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                <div className="footer-widget__about">
                  <div className="footer-widget__about-logo">
                    <Link href="/"><img src={IMAGE_PATHS.logo11} alt="" style={{ width: '160px', height: '50px', objectFit: 'contain' }} /></Link>
                  </div>
                  <p className="footer-widget__about-text">{t('footer.about.text')}</p>
                </div>
              </div>
              <div className="col-xl-5 col-lg-12 col-md-12 wow fadeInUp" data-wow-delay="200ms">
                <div className="footer-widget__links-services-wrapper">
                  <div className="row">
                    <div className="col-6">
                      <div className="footer-widget__links">
                        <h4 className="footer-widget__title">{t('footer.quickLinks.title')}</h4>
                        <ul className="footer-widget__links-list list-unstyled">
                          <li><span className="fas fa-wheat"></span><Link href="/about">{t('footer.quickLinks.aboutUs')}</Link></li>
                          <li><span className="fas fa-wheat"></span><Link href="/services">{t('footer.quickLinks.services')}</Link></li>
                          <li><span className="fas fa-wheat"></span><Link href="/products">{t('footer.quickLinks.portfolio')}</Link></li>
                          <li><span className="fas fa-wheat"></span><Link href="/faq">{t('footer.quickLinks.helpFaqs')}</Link></li>
                          <li><span className="fas fa-wheat"></span><Link href="/contact">{t('footer.quickLinks.contactUs')}</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="footer-widget__services">
                        <h4 className="footer-widget__title">{t('footer.ourProducts.title')}</h4>
                        {categoriesLoading ? (
                          <ul className="footer-widget__links-list list-unstyled">
                            <li><span className="fas fa-wheat"></span><span>Loading...</span></li>
                          </ul>
                        ) : productCategories.length > 0 ? (
                          <ul className="footer-widget__links-list list-unstyled">
                            {productCategories.map((category) => (
                              <li key={category}>
                                <span className="fas fa-wheat"></span>
                                <Link href={`/products?category=${encodeURIComponent(category)}`}>
                                  {category}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="footer-widget__links-list list-unstyled">
                            <li><span className="fas fa-wheat"></span><Link href="/products">{t('footer.ourProducts.organicProcessed')}</Link></li>
                            <li><span className="fas fa-wheat"></span><Link href="/products">{t('footer.ourProducts.dairyProducts')}</Link></li>
                            <li><span className="fas fa-wheat"></span><Link href="/products">{t('footer.ourProducts.livestockProducts')}</Link></li>
                            <li><span className="fas fa-wheat"></span><Link href="/products">{t('footer.ourProducts.cropsGrains')}</Link></li>
                            <li><span className="fas fa-wheat"></span><Link href="/products">{t('footer.ourProducts.freshVegetables')}</Link></li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="400ms">
                <div className="footer-widget__contact">
                  <h3 className="footer-widget__title">{t('footer.contactUs.title')}</h3>
                  <ul className="footer-widget__contact-list list-unstyled">
                    <li>
                      <div className="icon">
                        <span className="icon-pin"></span>
                      </div>
                      <p>{t('contact.location')}</p>
                    </li>
                    <li>
                      <div className="icon">
                        <span className="icon-call"></span>
                      </div>
                      <p>
                        <a href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a>
                      </p>
                    </li>
                    {/* <li>
                      <div className="icon">
                        <span className="icon-email"></span>
                      </div>
                      <p>
                        <a href={CONTACT_INFO.emailHref}>{CONTACT_INFO.email}</a>
                      </p>
                    </li> */}
                    <li>
                      <div className="icon">
                        <span className="icon-email"></span>
                      </div>
                      <p>
                        <a href="mailto:info@greengoldseeds.co.in">info@greengoldseeds.co.in</a>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="site-footer__bottom-inner">
                <div className="site-footer__copyright">
                  <p className="site-footer__copyright-text">Copyright@ 2025 <Link href="/">Green Gold Seeds</Link>. All Rights Reserved.</p>
                </div>
                <div className="site-footer__bottom-menu-box">
                  <ul className="list-unstyled site-footer__bottom-menu">
                    <li><Link href="/about">{t('footer.termsOfService')}</Link></li>
                    <li><Link href="/about">{t('footer.privacyPolicy')}</Link></li>
                    <li><Link href="/about">{t('footer.support')}</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

