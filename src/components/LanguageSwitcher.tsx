"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useEffect, useState, useRef, startTransition } from 'react';
import { localeNames } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMainMenuTwo, setIsMainMenuTwo] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect if we're in main-menu-two (white navbar) or main-menu (black navbar)
    const checkNavbarType = () => {
      const parent = dropdownRef.current?.closest('.main-menu-two__right, .main-menu__right');
      if (parent) {
        const isTwo = parent.classList.contains('main-menu-two__right');
        setIsMainMenuTwo(isTwo);
      }
    };
    
    // Check on mount and after a short delay to ensure DOM is ready
    checkNavbarType();
    const timeout = setTimeout(checkNavbarType, 100);
    
    return () => clearTimeout(timeout);
  }, [locale, pathname]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }
    
    // Save preference to localStorage
    localStorage.setItem('preferred-locale', newLocale);
    
    // Close dropdown immediately for better UX
    setIsOpen(false);
    
    // Use startTransition for smoother navigation without blocking UI
    startTransition(() => {
      // pathname from usePathname() already excludes the locale prefix
      // router.push() with locale option will automatically add the locale
      router.push(pathname, { locale: newLocale as 'en' | 'hi' | 'mr' });
    });
  };

  const locales = [
    { code: 'en', name: localeNames.en },
    { code: 'hi', name: localeNames.hi },
    { code: 'mr', name: localeNames.mr },
  ];

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  return (
    <div 
      className="main-menu__language-switcher" 
      ref={dropdownRef}
      style={{ 
        marginLeft: '0px', 
        position: 'relative',
        zIndex: 1000
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 32px 8px 12px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          color: isMainMenuTwo ? '#ffffff' : '#190f06',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '120px',
          transition: 'all 500ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#f5cb4b';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = isMainMenuTwo ? '#ffffff' : '#190f06';
        }}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{currentLocale.name}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 500ms ease',
            position: 'absolute',
            right: '10px',
          }}
        >
          <path
            d="M6 9L1 4h10z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: 'rgba(25, 15, 6, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '6px',
            border: '1px solid rgba(245, 203, 75, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'opacity 500ms ease, transform 500ms ease',
          }}
        >
          {locales.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => handleLanguageChange(loc.code)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                backgroundColor: loc.code === locale ? 'rgba(245, 203, 75, 0.15)' : 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: loc.code === locale ? '600' : '500',
                color: loc.code === locale ? '#f5cb4b' : '#ffffff',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
                transition: 'all 500ms ease',
              }}
              onMouseEnter={(e) => {
                if (loc.code !== locale) {
                  e.currentTarget.style.color = '#f5cb4b';
                  e.currentTarget.style.backgroundColor = 'rgba(245, 203, 75, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (loc.code !== locale) {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{loc.name}</span>
              {loc.code === locale && (
                <span style={{ marginLeft: 'auto', color: '#f5cb4b' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
