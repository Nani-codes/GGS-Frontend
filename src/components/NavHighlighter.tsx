"use client";

import { usePathname } from "@/i18n/routing";
import { useEffect, useState, useRef } from "react";

const normalizePath = (href: string | null): string | null => {
  if (!href) return null;
  try {
    // Handle relative paths
    if (href.startsWith("/")) {
      const normalized = href.replace(/\/+$/, "") || "/";
      // Remove locale prefix if present (e.g., /en, /hi, /mr)
      return normalized.replace(/^\/(en|hi|mr)(\/|$)/, "/") || "/";
    }
    // Handle full URLs only in browser
    if (typeof window !== "undefined") {
      const url = new URL(href, window.location.origin);
      const path = url.pathname.replace(/\/+$/, "") || "/";
      // Remove locale prefix
      return path.replace(/^\/(en|hi|mr)(\/|$)/, "/") || "/";
    }
    // Fallback for SSR
    const normalized = href.replace(/\/+$/, "") || "/";
    return normalized.replace(/^\/(en|hi|mr)(\/|$)/, "/") || "/";
  } catch {
    // If it's a simple path, normalize it
    const normalized = href.replace(/\/+$/, "") || "/";
    return normalized.replace(/^\/(en|hi|mr)(\/|$)/, "/") || "/";
  }
};

export function NavHighlighter() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side after mount
    if (!mounted || typeof window === "undefined") return;

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the execution to prevent excessive re-renders
    timeoutRef.current = setTimeout(() => {
      try {
        // Wait for DOM to be ready
        if (!document.querySelector(".main-menu__list")) {
          return;
        }

        // Normalize current path - remove locale prefix
        const currentPath = pathname 
          ? pathname.replace(/^\/(en|hi|mr)(\/|$)/, "/").replace(/\/+$/, "") || "/"
          : "/";
        
        // Remove all current classes first
        const menuItems = document.querySelectorAll(".main-menu__list li");
        menuItems.forEach((li) => {
          li.classList.remove("current");
        });

        // Find and mark active links
        const navLinks = document.querySelectorAll<HTMLAnchorElement>(
          ".main-menu__list a[href]"
        );

        let foundActive = false;

        navLinks.forEach((link) => {
          const parent = link.closest("li");
          if (!parent) return;

          const href = link.getAttribute("href");
          if (!href) return;

          // Skip anchor links and dropdown togglers
          if (href.startsWith("#") || href === "/#" || href === "#") return;

          const normalizedHref = normalizePath(href);
          if (!normalizedHref) return;

          // Compare paths (both should be normalized without locale)
          const isActive = normalizedHref === currentPath;

          if (isActive) {
            parent.classList.add("current");
            foundActive = true;
            
            // Also mark parent dropdown if this is a child item
            const dropdownParent = parent.closest("li.dropdown");
            if (dropdownParent && dropdownParent !== parent) {
              dropdownParent.classList.add("current");
            }
          }
        });

        // If no active link found and we're on home, mark home as active
        if (!foundActive && (currentPath === "/" || currentPath === "")) {
          const homeLink = document.querySelector(".main-menu__list > li:first-child");
          if (homeLink) {
            homeLink.classList.add("current");
          }
        }
      } catch (error) {
        // Silently handle errors to prevent breaking the app
        // Error handled silently to avoid console clutter
      }
    }, 100); // 100ms debounce

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, mounted]);

  return null;
}
