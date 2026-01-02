"use client";

import { usePreloader } from '@/hooks/usePreloader';

const getPreloaderStyles = (show: boolean): React.CSSProperties => ({
  opacity: show ? 1 : 0,
  transition: 'opacity 0.5s ease',
  pointerEvents: show ? 'auto' : 'none',
  display: show ? 'block' : 'none',
});

export function Preloader() {
  const showPreloader = usePreloader();
  
  return (
    <div 
      id="preloader" 
      suppressHydrationWarning
      style={getPreloaderStyles(showPreloader)}
    >
      <div className="preloader">
        <span />
        <span />
      </div>
    </div>
  );
}

