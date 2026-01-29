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
      <section className="page-header market-rates-page-header">
        <div className="page-header__bg market-rates-header-bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
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
      <section className="market-rates-section" style={{ 
        padding: '80px 0', 
        background: 'linear-gradient(135deg, #faf8f0 0%, #f5f7f0 50%, #faf8f0 100%)'
      }}>
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
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={handleBackClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f8f8';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                    e.currentTarget.style.transform = 'translateX(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span className="fas fa-arrow-left" style={{ fontSize: '16px' }} />
                  {t('marketRates.backToList')}
                </button>
              </div>
            )}

            {/* Toggle Buttons - View Type (hide when viewing specific commodity) */}
            {!selectedCommodity && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px'
              }}>
                <div className="view-toggle-buttons market-rates-filter-buttons" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setViewType('all')}
                    style={{
                      padding: '14px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: viewType === 'all' ? '#f5cb4b' : '#ffffff',
                      color: viewType === 'all' ? '#190f06' : '#666',
                      boxShadow: viewType === 'all'
                        ? '0 6px 20px rgba(245, 203, 75, 0.35), 0 2px 8px rgba(245, 203, 75, 0.2)'
                        : '0 3px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)',
                      transform: viewType === 'all' ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={(e) => {
                      if (viewType !== 'all') {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 5px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)';
                        e.currentTarget.style.backgroundColor = '#f8f8f8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (viewType !== 'all') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    <span className="fas fa-store" style={{ marginRight: '8px' }} />
                    {t('marketRates.allMarkets')}
                  </button>
                  <button
                    onClick={() => setViewType('district')}
                    style={{
                      padding: '14px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: viewType === 'district' ? '#f5cb4b' : '#ffffff',
                      color: viewType === 'district' ? '#190f06' : '#666',
                      boxShadow: viewType === 'district'
                        ? '0 6px 20px rgba(245, 203, 75, 0.35), 0 2px 8px rgba(245, 203, 75, 0.2)'
                        : '0 3px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)',
                      transform: viewType === 'district' ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={(e) => {
                      if (viewType !== 'district') {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 5px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)';
                        e.currentTarget.style.backgroundColor = '#f8f8f8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (viewType !== 'district') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    <span className="fas fa-map-marker-alt" style={{ marginRight: '8px' }} />
                    {t('marketRates.districtWise')}
                  </button>
                </div>
                {/* Last Updated Info */}
                <p style={{
                  fontSize: '13px',
                  color: '#999',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  Updated today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
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
              <div className="market-rates-cards-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '28px',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 10px'
              }}>
                {commodities.map((commodity, index) => {
                  // Get commodity-specific accent color for top strip only
                  const getCommodityAccent = (title: string, slug: string) => {
                    const lowerTitle = title.toLowerCase();
                    const lowerSlug = slug.toLowerCase();
                    
                    if (lowerTitle.includes('सोयाबिन') || lowerTitle.includes('soybean') || lowerSlug.includes('soybean')) {
                      return '#4CAF50';
                    }
                    if (lowerTitle.includes('कापूस') || lowerTitle.includes('cotton') || lowerSlug.includes('cotton')) {
                      return '#FFC107';
                    }
                    if (lowerTitle.includes('कांदा') || lowerTitle.includes('onion') || lowerSlug.includes('onion')) {
                      return '#FF6B6B';
                    }
                    if (lowerTitle.includes('तूर') || lowerTitle.includes('toor') || lowerSlug.includes('toor')) {
                      return '#FF9800';
                    }
                    if (lowerTitle.includes('कोथिंबिर') || lowerTitle.includes('coriander') || lowerSlug.includes('coriander')) {
                      return '#66BB6A';
                    }
                    if (lowerTitle.includes('उडीद') || lowerTitle.includes('urad') || lowerSlug.includes('urad')) {
                      return '#9C27B0';
                    }
                    if (lowerTitle.includes('हरभरा') || lowerTitle.includes('chana') || lowerSlug.includes('chana')) {
                      return '#FFA726';
                    }
                    if (lowerTitle.includes('मिरची') || lowerTitle.includes('chili') || lowerSlug.includes('chili')) {
                      return '#E53935';
                    }
                    if (lowerTitle.includes('मका') || lowerTitle.includes('maize') || lowerSlug.includes('maize')) {
                      return '#FFD700';
                    }
                    if (lowerTitle.includes('मेथी') || lowerTitle.includes('fenugreek') || lowerSlug.includes('fenugreek')) {
                      return '#8BC34A';
                    }
                    return '#f5cb4b'; // Default brand yellow
                  };

                  const accentColor = getCommodityAccent(commodity.title, commodity.slug);

                  return (
                    <div
                      key={commodity.slug || index}
                      className="market-rates-card"
                      onClick={() => handleCommodityClick(commodity)}
                      style={{
                        background: 'linear-gradient(135deg, #f8f9f5 0%, #f0f2eb 100%)',
                        borderRadius: '18px',
                        padding: '28px 22px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(0,0,0,0.04)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08), 0 0 0 2px rgba(245, 203, 75, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(245, 203, 75, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)';
                      }}
                    >
                      {/* Top accent strip */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: accentColor,
                        borderRadius: '18px 18px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.height = '5px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.height = '4px';
                      }}
                      />
                      
                      {/* Icon with subtle background circle */}
                      <div className="market-rates-card-icon" style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(245, 203, 75, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px auto',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.backgroundColor = 'rgba(245, 203, 75, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = 'rgba(245, 203, 75, 0.08)';
                      }}
                      >
                        <span className="fas fa-seedling market-rates-card-icon-svg" style={{ fontSize: '32px', color: '#f5cb4b' }} />
                      </div>
                      
                      {/* Crop name - bold, primary focus */}
                      <h4 className="market-rates-card-title" style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#190f06',
                        margin: 0,
                        lineHeight: '1.4',
                        marginBottom: '10px'
                      }}>
                        {commodity.title}
                      </h4>
                      
                      {/* Action text - lighter, subtle */}
                      <p style={{
                        fontSize: '12px',
                        color: '#888',
                        margin: 0,
                        fontWeight: '400',
                        letterSpacing: '0.3px'
                      }}>
                        {t('marketRates.viewRates')}
                      </p>
                    </div>
                  );
                })}
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
                padding: '16px 30px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 2px 8px rgba(245, 203, 75, 0.2)'
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
                overflow: 'hidden',
                marginTop: '16px',
                borderTop: '3px solid rgba(255,255,255,0.8)',
                position: 'relative'
              }}>
                {/* Subtle separator shadow */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent)',
                  zIndex: 1
                }} />
                <div style={{ overflowX: 'auto', maxHeight: '70vh', overflowY: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '700px'
                  }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                      <tr style={{ 
                        backgroundColor: '#e6b800',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                      }}>
                        <th style={tableHeaderStyle}>{t('marketRates.table.market')}</th>
                        <th style={tableHeaderStyle}>{t('marketRates.table.variety')}</th>
                        <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>{t('marketRates.table.unit')}</th>
                        <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>{t('marketRates.table.arrival')}</th>
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
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#faf9f5',
                            borderBottom: '1px solid #f0f0f0'
                          }}
                        >
                          <td style={tableCellStyle}>
                            <strong>{item.market}</strong>
                          </td>
                          <td style={tableCellStyle}>{item.variety}</td>
                          <td style={{ ...tableCellStyle, textAlign: 'center' }}>{item.unit}</td>
                          <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                            {item.arrival}
                          </td>
                          <td style={{ ...tableCellStyle, color: '#4caf50', fontWeight: '600', textAlign: 'right' }}>
                            {formatPrice(item.min_price)}
                          </td>
                          <td style={{ ...tableCellStyle, color: '#f44336', fontWeight: '600', textAlign: 'right' }}>
                            {formatPrice(item.max_price)}
                          </td>
                          <td style={{ ...tableCellStyle, color: '#1565c0', fontWeight: '700', textAlign: 'right', fontSize: '15px' }}>
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
  padding: '16px 12px',
  textAlign: 'left',
  fontWeight: '800',
  color: '#190f06',
  fontSize: '15px',
  whiteSpace: 'nowrap',
  letterSpacing: '0.3px'
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '14px',
  color: '#333'
};
