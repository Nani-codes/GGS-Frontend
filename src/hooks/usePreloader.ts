import { useEffect, useState } from 'react';

/**
 * Hook to manage preloader visibility
 * Hides preloader after page load or timeout
 */
export const usePreloader = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  
  useEffect(() => {
    const hidePreloader = () => {
      setShowPreloader(false);
    };
    
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 300));
      setTimeout(hidePreloader, 1000);
    }
  }, []);
  
  return showPreloader;
};

