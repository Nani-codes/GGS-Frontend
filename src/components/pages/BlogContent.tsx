"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

export function BlogContent() {
  const t = useTranslations();
  
  return (
    <PageLayout variant="two" currentPage="/blog">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>Blog </h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>Blog </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ===== BLOG SECTION ===== */}
      <section className="blog-page">
        <div className="container">
          <div className="row">
            {/*Blog One Single Start*/}
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInLeft" data-wow-delay="100ms">
              <div className="blog-one__single">
                <div className="blog-one__single-inner">
                  <div className="blog-one__img-box">
                    <div className="blog-one__img">
                      <img src="/assets/images/blog/blog-1-1.jpg" alt="" />
                      <div className="blog-one__plus">
                        <Link href="/blog"><i className="fas fa-plus" /></Link>
                      </div>
                      <div className="blog-one__tag">
                        <Link href="/blog">Organic</Link>
                      </div>
                    </div>
                    <div className="blog-one__date">
                      <p>25 <span>Mar</span></p>
                    </div>
                  </div>
                  <div className="blog-one__content">
                    <div className="blog-one__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/blog-one-content-bg-shape.png)' }}>
                    </div>
                    <ul className="blog-one__meta list-unstyled">
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-user" />Admin
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-comments" />Comment
                        </Link>
                      </li>
                    </ul>
                    <h3 className="blog-one__title"><Link href="/blog">Why Fresh, Organic
                      Vegetables
                      Matter</Link></h3>
                    <p className="blog-one__text">Learn how organic vegetables benefit your health and the
                      planet at the same time.</p>
                  </div>
                  <div className="blog-one__read-more">
                    <Link href="/blog">{t('common.readMore')}<span className="fas fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            </div>
            {/*Blog One Single End*/}
            {/*Blog One Single Start*/}
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="200ms">
              <div className="blog-one__single">
                <div className="blog-one__single-inner">
                  <div className="blog-one__img-box">
                    <div className="blog-one__img">
                      <img src="/assets/images/blog/blog-1-2.jpg" alt="" />
                      <div className="blog-one__plus">
                        <Link href="/blog"><i className="fas fa-plus" /></Link>
                      </div>
                      <div className="blog-one__tag">
                        <Link href="/blog">FreshProduce</Link>
                      </div>
                    </div>
                    <div className="blog-one__date">
                      <p>05 <span>Jun</span></p>
                    </div>
                  </div>
                  <div className="blog-one__content">
                    <div className="blog-one__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/blog-one-content-bg-shape.png)' }}>
                    </div>
                    <ul className="blog-one__meta list-unstyled">
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-user" />Admin
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-comments" />Comment
                        </Link>
                      </li>
                    </ul>
                    <h3 className="blog-one__title"><Link href="/blog">Health Benefits of Organic
                      Vegetables</Link></h3>
                    <p className="blog-one__text">Learn how organic vegetables benefit your health and the
                      planet at the same time.</p>
                  </div>
                  <div className="blog-one__read-more">
                    <Link href="/blog">{t('common.readMore')}<span className="fas fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            </div>
            {/*Blog One Single End*/}
            {/*Blog One Single Start*/}
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInRight" data-wow-delay="300ms">
              <div className="blog-one__single">
                <div className="blog-one__single-inner">
                  <div className="blog-one__img-box">
                    <div className="blog-one__img">
                      <img src="/assets/images/blog/blog-1-3.jpg" alt="" />
                      <div className="blog-one__plus">
                        <Link href="/blog"><i className="fas fa-plus" /></Link>
                      </div>
                      <div className="blog-one__tag">
                        <Link href="/blog">AgriTech</Link>
                      </div>
                    </div>
                    <div className="blog-one__date">
                      <p>13 <span>Aug</span></p>
                    </div>
                  </div>
                  <div className="blog-one__content">
                    <div className="blog-one__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/blog-one-content-bg-shape.png)' }}>
                    </div>
                    <ul className="blog-one__meta list-unstyled">
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-user" />Admin
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-comments" />Comment
                        </Link>
                      </li>
                    </ul>
                    <h3 className="blog-one__title"><Link href="/blog">How Technology is Changing
                      Farming</Link></h3>
                    <p className="blog-one__text">Learn how organic vegetables benefit your health and the
                      planet at the same time.</p>
                  </div>
                  <div className="blog-one__read-more">
                    <Link href="/blog">{t('common.readMore')}<span className="fas fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            </div>
            {/*Blog One Single End*/}
            {/*Blog One Single Start*/}
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInLeft" data-wow-delay="100ms">
              <div className="blog-one__single">
                <div className="blog-one__single-inner">
                  <div className="blog-one__img-box">
                    <div className="blog-one__img">
                      <img src="/assets/images/blog/blog-1-4.jpg" alt="" />
                      <div className="blog-one__plus">
                        <Link href="/blog"><i className="fas fa-plus" /></Link>
                      </div>
                      <div className="blog-one__tag">
                        <Link href="/blog">Organic</Link>
                      </div>
                    </div>
                    <div className="blog-one__date">
                      <p>25 <span>Mar</span></p>
                    </div>
                  </div>
                  <div className="blog-one__content">
                    <div className="blog-one__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/blog-one-content-bg-shape.png)' }}>
                    </div>
                    <ul className="blog-one__meta list-unstyled">
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-user" />Admin
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-comments" />Comment
                        </Link>
                      </li>
                    </ul>
                    <h3 className="blog-one__title"><Link href="/blog">A Green Promise for the Next
                      Generation</Link></h3>
                    <p className="blog-one__text">Learn how organic vegetables benefit your health and the
                      planet at the same time.</p>
                  </div>
                  <div className="blog-one__read-more">
                    <Link href="/blog">{t('common.readMore')}<span className="fas fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            </div>
            {/*Blog One Single End*/}
            {/*Blog One Single Start*/}
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="200ms">
              <div className="blog-one__single">
                <div className="blog-one__single-inner">
                  <div className="blog-one__img-box">
                    <div className="blog-one__img">
                      <img src="/assets/images/blog/blog-1-5.jpg" alt="" />
                      <div className="blog-one__plus">
                        <Link href="/blog"><i className="fas fa-plus" /></Link>
                      </div>
                      <div className="blog-one__tag">
                        <Link href="/blog">FreshProduce</Link>
                      </div>
                    </div>
                    <div className="blog-one__date">
                      <p>05 <span>Jun</span></p>
                    </div>
                  </div>
                  <div className="blog-one__content">
                    <div className="blog-one__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/blog-one-content-bg-shape.png)' }}>
                    </div>
                    <ul className="blog-one__meta list-unstyled">
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-user" />Admin
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-comments" />Comment
                        </Link>
                      </li>
                    </ul>
                    <h3 className="blog-one__title"><Link href="/blog">Healthy Livestock, Safer
                      Food for the Future</Link></h3>
                    <p className="blog-one__text">Learn how organic vegetables benefit your health and the
                      planet at the same time.</p>
                  </div>
                  <div className="blog-one__read-more">
                    <Link href="/blog">{t('common.readMore')}<span className="fas fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            </div>
            {/*Blog One Single End*/}
            {/*Blog One Single Start*/}
            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInRight" data-wow-delay="300ms">
              <div className="blog-one__single">
                <div className="blog-one__single-inner">
                  <div className="blog-one__img-box">
                    <div className="blog-one__img">
                      <img src="/assets/images/blog/blog-1-6.jpg" alt="" />
                      <div className="blog-one__plus">
                        <Link href="/blog"><i className="fas fa-plus" /></Link>
                      </div>
                      <div className="blog-one__tag">
                        <Link href="/blog">AgriTech</Link>
                      </div>
                    </div>
                    <div className="blog-one__date">
                      <p>13 <span>Aug</span></p>
                    </div>
                  </div>
                  <div className="blog-one__content">
                    <div className="blog-one__content-bg-shape" style={{ backgroundImage: 'url(/assets/images/shapes/blog-one-content-bg-shape.png)' }}>
                    </div>
                    <ul className="blog-one__meta list-unstyled">
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-user" />Admin
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog">
                          <span className="fas fa-comments" />Comment
                        </Link>
                      </li>
                    </ul>
                    <h3 className="blog-one__title"><Link href="/blog">From the Scent Comes
                      the Message of Growth</Link></h3>
                    <p className="blog-one__text">Learn how organic vegetables benefit your health and the
                      planet at the same time.</p>
                  </div>
                  <div className="blog-one__read-more">
                    <Link href="/blog">{t('common.readMore')}<span className="fas fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            </div>
            {/*Blog One Single End*/}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
