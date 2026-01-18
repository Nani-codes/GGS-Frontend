"use client";

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  sunrise: string;
  sunset: string;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

// Popular cities for suggestions (India-focused)
const POPULAR_CITIES = [
  'Chh. Sambhajinagar (Aurangabad), Maharashtra',
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'Nashik, Maharashtra',
  'Nagpur, Maharashtra',
  'Kolhapur, Maharashtra',
  'Solapur, Maharashtra',
  'Ahmednagar, Maharashtra',
  'Satara, Maharashtra',
  'Sangli, Maharashtra',
  'Jalgaon, Maharashtra',
  'Buldhana, Maharashtra',
  'Akola, Maharashtra',
  'Amravati, Maharashtra',
  'Yavatmal, Maharashtra',
  'Wardha, Maharashtra',
  'Chandrapur, Maharashtra',
  'Beed, Maharashtra',
  'Latur, Maharashtra',
  'Osmanabad, Maharashtra',
  'Nanded, Maharashtra',
  'Delhi',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Lucknow, Uttar Pradesh',
  'Indore, Madhya Pradesh',
  'Bhopal, Madhya Pradesh',
  'Chandigarh',
  'Coimbatore, Tamil Nadu',
  'Visakhapatnam, Andhra Pradesh',
];

export function WeatherContent() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('Chh. Sambhajinagar (Aurangabad), Maharashtra');
  const [selectedCity, setSelectedCity] = useState('Chh. Sambhajinagar (Aurangabad), Maharashtra');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(POPULAR_CITIES.slice(0, 8));
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const fetchWeather = async (city: string) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(city)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data.current);
      setForecast(data.forecast || []);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(t('weather.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSelectedCity(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (city: string) => {
    setSearchQuery(city);
    setSelectedCity(city);
    setShowSuggestions(false);
  };

  const getWeatherIcon = (condition: string, icon: string) => {
    // Map weather conditions to FontAwesome icons
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return 'fas fa-sun';
    } else if (conditionLower.includes('cloud') && conditionLower.includes('part')) {
      return 'fas fa-cloud-sun';
    } else if (conditionLower.includes('cloud')) {
      return 'fas fa-cloud';
    } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
      return 'fas fa-cloud-rain';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return 'fas fa-bolt';
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return 'fas fa-smog';
    } else if (conditionLower.includes('snow')) {
      return 'fas fa-snowflake';
    }
    return 'fas fa-cloud-sun';
  };

  const getWeatherGradient = (condition: string) => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return 'linear-gradient(135deg, #f5cb4b 0%, #ff8c42 100%)';
    } else if (conditionLower.includes('cloud')) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (conditionLower.includes('rain')) {
      return 'linear-gradient(135deg, #3a6073 0%, #16222a 100%)';
    } else if (conditionLower.includes('thunder')) {
      return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <PageLayout variant="two" currentPage="/weather">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{t('weather.pageTitle')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{t('weather.breadcrumb')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WEATHER SECTION ===== */}
      <section className="weather-section" style={{ padding: '80px 0', backgroundColor: '#faf8f0' }}>
        <div className="container">
          <div className="section-title text-center sec-title-animation animation-style1">
            <div className="section-title__tagline-box">
              <div className="section-title__shape-1">
                <img src="/assets/images/resources/section-title-shape-1.png" alt="" />
              </div>
              <h6 className="section-title__tagline">{t('weather.tagline')}</h6>
              <div className="section-title__shape-1">
                <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
              </div>
            </div>
            <h3 className="section-title__title title-animation">{t('weather.title')}</h3>
            <p style={{ maxWidth: '700px', margin: '20px auto 0', color: '#666', fontSize: '16px' }}>
              {t('weather.description')}
            </p>
          </div>

          {/* City Search */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40px',
            marginBottom: '30px'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '450px'
            }}>
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'stretch'
              }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span
                    className="fas fa-search"
                    style={{
                      position: 'absolute',
                      left: '18px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999',
                      fontSize: '16px',
                      pointerEvents: 'none'
                    }}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('weather.searchPlaceholder')}
                    style={{
                      width: '100%',
                      padding: '15px 20px 15px 48px',
                      fontSize: '16px',
                      fontWeight: '500',
                      border: '2px solid transparent',
                      borderRadius: '30px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      color: '#333',
                      outline: 'none',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#f5cb4b';
                    }}
                    onMouseLeave={(e) => {
                      if (document.activeElement !== e.currentTarget) {
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        zIndex: 100
                      }}
                    >
                      <div style={{
                        padding: '8px 12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#999',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        {t('weather.popularCities') || 'Popular Suggestions'}
                      </div>
                      {filteredSuggestions.map((city, index) => (
                        <div
                          key={city}
                          onClick={() => handleSuggestionClick(city)}
                          style={{
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#333',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5cb4b20';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span className="fas fa-map-marker-alt" style={{ color: '#f5cb4b', fontSize: '14px' }} />
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSearch}
                  style={{
                    padding: '15px 25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '30px',
                    backgroundColor: '#f5cb4b',
                    color: '#190f06',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(245, 203, 75, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e6bc3d';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 203, 75, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5cb4b';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 203, 75, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span className="fas fa-cloud-sun" />
                  {t('weather.getWeather')}
                </button>
              </div>
              
              {/* Help text */}
              <p style={{
                textAlign: 'center',
                marginTop: '12px',
                fontSize: '13px',
                color: '#888'
              }}>
                {t('weather.searchHint')}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
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

          {/* Error State */}
          {error && !loading && (
            <div style={{
              backgroundColor: '#fff5f5',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              textAlign: 'center',
              border: '1px solid #ffcdd2',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <span className="fas fa-exclamation-triangle" style={{ 
                fontSize: '48px', 
                color: '#e57373',
                marginBottom: '20px',
                display: 'block'
              }} />
              <p style={{ color: '#c62828', fontSize: '16px' }}>{error}</p>
              <button 
                onClick={() => fetchWeather(selectedCity)}
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
                {t('weather.retry')}
              </button>
            </div>
          )}

          {/* Weather Data */}
          {!loading && !error && weather && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {/* Current Weather Card */}
              <div style={{
                background: getWeatherGradient(weather.condition),
                borderRadius: '24px',
                padding: '40px',
                color: '#fff',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                marginBottom: '40px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '30px',
                  alignItems: 'center'
                }}>
                  {/* Left - Main Weather */}
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ 
                      fontSize: '24px', 
                      fontWeight: '600', 
                      marginBottom: '10px',
                      opacity: 0.9
                    }}>
                      <span className="fas fa-map-marker-alt" style={{ marginRight: '10px' }} />
                      {weather.location}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '20px',
                      marginBottom: '15px'
                    }}>
                      <span 
                        className={getWeatherIcon(weather.condition, weather.icon)} 
                        style={{ fontSize: '72px' }}
                      />
                      <span style={{ 
                        fontSize: '72px', 
                        fontWeight: '300',
                        lineHeight: 1
                      }}>
                        {Math.round(weather.temperature)}°C
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: '20px', 
                      textTransform: 'capitalize',
                      marginBottom: '10px'
                    }}>
                      {weather.condition}
                    </p>
                    <p style={{ fontSize: '14px', opacity: 0.8 }}>
                      {t('weather.feelsLike')}: {Math.round(weather.feelsLike)}°C
                    </p>
                  </div>

                  {/* Right - Weather Details */}
                  <div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '20px'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center'
                      }}>
                        <span className="fas fa-tint" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{t('weather.humidity')}</p>
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>{weather.humidity}%</p>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center'
                      }}>
                        <span className="fas fa-wind" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{t('weather.windSpeed')}</p>
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>{weather.windSpeed} km/h</p>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center'
                      }}>
                        <span className="fas fa-compress-arrows-alt" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{t('weather.pressure')}</p>
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>{weather.pressure} hPa</p>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center'
                      }}>
                        <span className="fas fa-eye" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{t('weather.visibility')}</p>
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>{weather.visibility} km</p>
                      </div>
                    </div>

                    {/* Sunrise/Sunset */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '20px',
                      marginTop: '20px'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center'
                      }}>
                        <span className="fas fa-sun" style={{ fontSize: '24px', marginBottom: '8px', display: 'block', color: '#ffeb3b' }} />
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{t('weather.sunrise')}</p>
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>{weather.sunrise}</p>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center'
                      }}>
                        <span className="fas fa-moon" style={{ fontSize: '24px', marginBottom: '8px', display: 'block', color: '#ffca28' }} />
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{t('weather.sunset')}</p>
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>{weather.sunset}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {forecast.length > 0 && (
                <>
                  <h4 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#190f06',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    {t('weather.forecast')}
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px'
                  }}>
                    {forecast.map((day, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '16px',
                          padding: '20px 15px',
                          textAlign: 'center',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                        }}
                      >
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#666',
                          marginBottom: '12px'
                        }}>
                          {day.date}
                        </p>
                        <span 
                          className={getWeatherIcon(day.condition, day.icon)}
                          style={{ 
                            fontSize: '36px', 
                            color: '#f5cb4b',
                            display: 'block',
                            marginBottom: '12px'
                          }} 
                        />
                        <p style={{
                          fontSize: '12px',
                          color: '#999',
                          marginBottom: '8px',
                          textTransform: 'capitalize'
                        }}>
                          {day.condition}
                        </p>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '10px',
                          marginBottom: '8px'
                        }}>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                            {Math.round(day.maxTemp)}°
                          </span>
                          <span style={{ fontSize: '16px', color: '#999' }}>
                            {Math.round(day.minTemp)}°
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '15px',
                          fontSize: '11px',
                          color: '#888'
                        }}>
                          <span>
                            <span className="fas fa-tint" style={{ marginRight: '4px', color: '#64b5f6' }} />
                            {day.humidity}%
                          </span>
                          <span>
                            <span className="fas fa-wind" style={{ marginRight: '4px', color: '#90a4ae' }} />
                            {day.windSpeed}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Agricultural Tips */}
              <div style={{
                marginTop: '50px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h4 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#190f06',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span className="fas fa-seedling" style={{ color: '#4caf50' }} />
                  {t('weather.farmingTips')}
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px'
                  }}>
                    <span className="fas fa-tint" style={{ 
                      fontSize: '24px', 
                      color: '#2196f3',
                      marginTop: '3px'
                    }} />
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>
                        {t('weather.tips.irrigation')}
                      </h5>
                      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                        {weather.humidity > 70 
                          ? t('weather.tips.irrigationHigh')
                          : t('weather.tips.irrigationLow')}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px'
                  }}>
                    <span className="fas fa-cloud-sun" style={{ 
                      fontSize: '24px', 
                      color: '#ff9800',
                      marginTop: '3px'
                    }} />
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>
                        {t('weather.tips.fieldWork')}
                      </h5>
                      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                        {weather.condition.toLowerCase().includes('rain')
                          ? t('weather.tips.fieldWorkRain')
                          : t('weather.tips.fieldWorkClear')}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px'
                  }}>
                    <span className="fas fa-bug" style={{ 
                      fontSize: '24px', 
                      color: '#e91e63',
                      marginTop: '3px'
                    }} />
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>
                        {t('weather.tips.pestControl')}
                      </h5>
                      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                        {weather.humidity > 60 
                          ? t('weather.tips.pestControlHigh')
                          : t('weather.tips.pestControlLow')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== CONTACT CTA SECTION ===== */}
      <section className="cta-two">
        <div className="container">
          <div className="cta-two__inner text-center">
            <h3>{t('weather.ctaTitle')}</h3>
            <p>{t('weather.ctaDescription')}</p>
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

