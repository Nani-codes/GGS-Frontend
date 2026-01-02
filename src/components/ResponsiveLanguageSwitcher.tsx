"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";

interface ResponsiveLanguageSwitcherProps {
  variant: 'desktop' | 'mobile';
}

export function ResponsiveLanguageSwitcher({ variant }: ResponsiveLanguageSwitcherProps) {
  if (variant === 'desktop') {
    return (
      <div className="responsive-language-switcher-desktop">
        <LanguageSwitcher />
      </div>
    );
  }

  // Mobile variant
  return (
    <div className="responsive-language-switcher-mobile">
      <LanguageSwitcher />
    </div>
  );
}

