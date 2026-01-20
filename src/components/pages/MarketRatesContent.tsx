"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

interface CommodityCard {
  id: number;
  title: string;
  slug: string;
  tags?: string;
}

interface MarketRateItem {
  market: string;
  variety: string;
  unit: string;
  arrival: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  date: string;
}

interface RatesResponse {
  title: string;
  meta_title: string;
  image?: string;
  rates: MarketRateItem[];
}

type ViewType = 'all' | 'district';

export function MarketRatesContent() {
  const t = useTranslations();
  const [viewType, setViewType] = useState<ViewType>('all');
  const [commodities, setCommodities] = useState<CommodityCard[]>([]);
  const [loadingCommodities, setLoadingCommodities] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityCard | null>(null);
  const [ratesResponse, setRatesResponse] = useState<RatesResponse | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch commodities list when view type changes
  useEffect(() => {
    const fetchCommodities = async () => {
      setLoadingCommodities(true);
      setError(null);
      setSelectedCommodity(null);
      setRatesResponse(null);

      try {
        const url = viewType === 'district'
          ? '/api/market-rates?district=yes'
          : '/api/market-rates';

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch commodities');
        }
        const result = await response.json();

        // Handle response - expecting array of { id, title, slug, tags }
        const items = Array.isArray(result) ? result : [];
        setCommodities(items);
      } catch (err) {
        console.error('Error fetching commodities:', err);
        setError(t('marketRates.errorLoading'));
      } finally {
        setLoadingCommodities(false);
      }
    };

    fetchCommodities();
  }, [viewType, t]);

  // Fetch rates data when a commodity is selected
  const handleCommodityClick = async (commodity: CommodityCard) => {
    setSelectedCommodity(commodity);
    setLoadingRates(true);
    setError(null);

    try {
      const response = await fetch(`/api/market-rates?slug=${encodeURIComponent(commodity.slug)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rates');
      }
      const result: RatesResponse = await response.json();
      setRatesResponse(result);
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError(t('marketRates.errorLoading'));
    } finally {
      setLoadingRates(false);
    }
  };

  // Go back to commodity list
  const handleBackClick = () => {
    setSelectedCommodity(null);
    setRatesResponse(null);
  };

  // Format price with Indian currency
  const formatPrice = (price: string) => {
    if (!price || price === '-') return '-';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <PageLayout currentPage="/market-rates">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{t('marketRates.pageTitle')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{t('marketRates.breadcrumb')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARKET RATES SECTION ===== */}
      <section className="market-rates-section" style={{ padding: '80px 0', backgroundColor: '#faf8f0' }}>
        <div className="container">
          <div className="section-title text-center sec-title-animation animation-style1">
            <div className="section-title__tagline-box">
              <div className="section-title__shape-1">
                <img src="/assets/images/resources/section-title-shape-1.png" alt="" />
              </div>
              <h6 className="section-title__tagline">{t('marketRates.tagline')}</h6>
              <div className="section-title__shape-1">
                <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
              </div>
            </div>
            <h3 className="section-title__title title-animation">{t('marketRates.title')}</h3>
          </div>

          <div className="market-rates-content" style={{ marginTop: '40px' }}>

            {/* Back Button - Show when viewing rates */}
            {selectedCommodity && (
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={handleBackClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span className="fas fa-arrow-left" />
                  {t('marketRates.backToList')}
                </button>
              </div>
            )}

            {/* Toggle Buttons - View Type (hide when viewing specific commodity) */}
            {!selectedCommodity && (
              <div className="view-toggle-buttons" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '30px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setViewType('all')}
                  style={{
                    padding: '12px 30px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: viewType === 'all' ? '#f5cb4b' : '#ffffff',
                    color: viewType === 'all' ? '#190f06' : '#666',
                    boxShadow: viewType === 'all'
                      ? '0 4px 15px rgba(245, 203, 75, 0.4)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <span className="fas fa-store" style={{ marginRight: '8px' }} />
                  {t('marketRates.allMarkets')}
                </button>
                <button
                  onClick={() => setViewType('district')}
                  style={{
                    padding: '12px 30px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: viewType === 'district' ? '#f5cb4b' : '#ffffff',
                    color: viewType === 'district' ? '#190f06' : '#666',
                    boxShadow: viewType === 'district'
                      ? '0 4px 15px rgba(245, 203, 75, 0.4)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <span className="fas fa-map-marker-alt" style={{ marginRight: '8px' }} />
                  {t('marketRates.districtWise')}
                </button>
              </div>
            )}

            {/* Loading State for Commodities */}
            {loadingCommodities && !selectedCommodity && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '60px 40px',
              }}>
                <div className="loading-spinner" style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #f5f5f5',
                  borderTop: '4px solid #f5cb4b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '20px'
                }} />
                <p style={{ color: '#666', fontSize: '16px' }}>{t('common.loading')}</p>
                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}

            {/* Commodity Cards Grid */}
            {!loadingCommodities && !selectedCommodity && commodities.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {commodities.map((commodity, index) => (
                  <div
                    key={commodity.slug || index}
                    onClick={() => handleCommodityClick(commodity)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '24px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                      border: '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                      e.currentTarget.style.borderColor = '#f5cb4b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#f5cb4b20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <span className="fas fa-seedling" style={{ fontSize: '24px', color: '#f5cb4b' }} />
                    </div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#190f06',
                      margin: 0
                    }}>
                      {commodity.title}
                    </h4>
                    <p style={{
                      fontSize: '12px',
                      color: '#999',
                      marginTop: '8px',
                      marginBottom: 0
                    }}>
                      {t('marketRates.viewRates')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* No Commodities State */}
            {!loadingCommodities && !selectedCommodity && commodities.length === 0 && !error && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '60px 40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center'
              }}>
                <span className="fas fa-inbox" style={{
                  fontSize: '48px',
                  color: '#ccc',
                  marginBottom: '20px',
                  display: 'block'
                }} />
                <p style={{ color: '#666', fontSize: '16px' }}>{t('marketRates.noData')}</p>
              </div>
            )}

            {/* Selected Commodity Header */}
            {selectedCommodity && (
              <div style={{
                backgroundColor: '#f5cb4b',
                borderRadius: '12px',
                padding: '20px 30px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span className="fas fa-seedling" style={{ fontSize: '20px', color: '#f5cb4b' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#190f06', margin: 0 }}>
                    {ratesResponse?.title || selectedCommodity.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#190f06', margin: '5px 0 0 0', opacity: 0.7 }}>
                    {t('marketRates.todayRates')}
                  </p>
                </div>
              </div>
            )}

            {/* Loading State for Rates */}
            {loadingRates && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '60px 40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center'
              }}>
                <div className="loading-spinner" style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #f5f5f5',
                  borderTop: '4px solid #f5cb4b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px auto'
                }} />
                <p style={{ color: '#666', fontSize: '16px' }}>{t('common.loading')}</p>
                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div style={{
                backgroundColor: '#fff5f5',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center',
                border: '1px solid #ffcdd2'
              }}>
                <span className="fas fa-exclamation-triangle" style={{
                  fontSize: '48px',
                  color: '#e57373',
                  marginBottom: '20px',
                  display: 'block'
                }} />
                <p style={{ color: '#c62828', fontSize: '16px' }}>{error}</p>
                <button
                  onClick={() => selectedCommodity ? handleCommodityClick(selectedCommodity) : setViewType(viewType)}
                  style={{
                    marginTop: '20px',
                    padding: '10px 25px',
                    backgroundColor: '#f5cb4b',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {t('marketRates.retry')}
                </button>
              </div>
            )}

            {/* Rates Data Table */}
            {selectedCommodity && !loadingRates && !error && ratesResponse && ratesResponse.rates.length > 0 && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '700px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5cb4b' }}>
                        <th style={tableHeaderStyle}>{t('marketRates.table.market')}</th>
                        <th style={tableHeaderStyle}>{t('marketRates.table.variety')}</th>
                        <th style={tableHeaderStyle}>{t('marketRates.table.unit')}</th>
                        <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>{t('marketRates.table.arrival')}</th>
                        <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>{t('marketRates.table.minPrice')}</th>
                        <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>{t('marketRates.table.maxPrice')}</th>
                        <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>{t('marketRates.table.modalPrice')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratesResponse.rates.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                            borderBottom: '1px solid #eee'
                          }}
                        >
                          <td style={tableCellStyle}>
                            <strong>{item.market}</strong>
                          </td>
                          <td style={tableCellStyle}>{item.variety}</td>
                          <td style={tableCellStyle}>{item.unit}</td>
                          <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                            {item.arrival}
                          </td>
                          <td style={{ ...tableCellStyle, color: '#4caf50', fontWeight: '600', textAlign: 'right' }}>
                            {formatPrice(item.min_price)}
                          </td>
                          <td style={{ ...tableCellStyle, color: '#f44336', fontWeight: '600', textAlign: 'right' }}>
                            {formatPrice(item.max_price)}
                          </td>
                          <td style={{ ...tableCellStyle, color: '#2196f3', fontWeight: '700', textAlign: 'right' }}>
                            {formatPrice(item.modal_price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {ratesResponse.rates.length > 100 && (
                  <div style={{
                    padding: '15px',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    borderTop: '1px solid #eee'
                  }}>
                    <p style={{ color: '#666', margin: 0 }}>
                      {t('marketRates.showingResults', { shown: 100, total: ratesResponse.rates.length })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No Rates Data State */}
            {selectedCommodity && !loadingRates && !error && (!ratesResponse || ratesResponse.rates.length === 0) && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '60px 40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center'
              }}>
                <span className="fas fa-inbox" style={{
                  fontSize: '48px',
                  color: '#ccc',
                  marginBottom: '20px',
                  display: 'block'
                }} />
                <p style={{ color: '#666', fontSize: '16px' }}>{t('marketRates.noData')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA SECTION ===== */}
      <section className="cta-two">
        <div className="container">
          <div className="cta-two__inner text-center">
            <h3>{t('marketRates.ctaTitle')}</h3>
            <p>{t('marketRates.ctaDescription')}</p>
            <div style={{ marginTop: '30px' }}>
              <Link className="thm-btn" href="/contact">
                {t('nav.contact')}
                <i className="fal fa-long-arrow-right" />
                <span className="hover-btn hover-bx" />
                <span className="hover-btn hover-bx2" />
                <span className="hover-btn hover-bx3" />
                <span className="hover-btn hover-bx4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '15px 12px',
  textAlign: 'left',
  fontWeight: '700',
  color: '#190f06',
  fontSize: '14px',
  whiteSpace: 'nowrap'
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '14px',
  color: '#333'
};
