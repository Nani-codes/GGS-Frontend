import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";

const cssAssets = [
  "/assets/css/bootstrap.min.css",
  "/assets/css/animate.min.css",
  "/assets/css/custom-animate.css",
  "/assets/css/swiper.min.css",
  "/assets/css/font-awesome-all.css",
  "/assets/css/jarallax.css",
  "/assets/css/jquery.magnific-popup.css",
  "/assets/css/odometer.min.css",
  "/assets/css/flaticon.css",
  "/assets/css/owl.carousel.min.css",
  "/assets/css/owl.theme.default.min.css",
  "/assets/css/nice-select.css",
  "/assets/css/jquery-ui.css",
  "/assets/css/aos.css",
  "/assets/css/style.css",
  "/assets/css/responsive.css",
];

const scriptAssets = [
  "/assets/js/jquery-latest.js",
  "/assets/js/bootstrap.bundle.min.js",
  "/assets/js/jarallax.min.js",
  "/assets/js/jquery.ajaxchimp.min.js",
  "/assets/js/jquery.appear.min.js",
  "/assets/js/swiper.min.js",
  "/assets/js/jquery.magnific-popup.min.js",
  "/assets/js/jquery.validate.min.js",
  "/assets/js/odometer.min.js",
  "/assets/js/wNumb.min.js",
  "/assets/js/wow.js",
  "/assets/js/isotope.js",
  "/assets/js/owl.carousel.min.js",
  "/assets/js/jquery-ui.js",
  "/assets/js/jquery.circleType.js",
  "/assets/js/jquery.lettering.min.js",
  "/assets/js/jquery.fittext.js",
  "/assets/js/jquery.nice-select.min.js",
  "/assets/js/marquee.min.js",
  "/assets/js/jquery-sidebar-content.js",
  "/assets/js/jquery.event.move.js",
  "/assets/js/aos.js",
  "/assets/js/gsap/gsap.js",
  "/assets/js/gsap/ScrollTrigger.js",
  "/assets/js/gsap/SplitText.js",
  "/assets/js/script.js",
];

export const metadata: Metadata = {
  title: {
    default: "Green Gold Seeds | Quality Seeds for Better Harvests",
    template: "%s | Green Gold Seeds",
  },
  description:
    "Green Gold Seeds - Leading seed company providing quality seeds for better harvests.",
  icons: {
    icon: [
      { url: '/assets/images/resources/logo-11.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/images/resources/logo-11.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon.png"
        />
        <link rel="manifest" href="/assets/images/favicons/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Outfit:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        {cssAssets.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body className="custom-cursor" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
        <Script id="preloader-fallback" strategy="beforeInteractive">
          {`
            // Fallback to hide preloader if jQuery doesn't load
            (function() {
              function hidePreloader() {
                const preloader = document.getElementById('preloader');
                if (preloader) {
                  preloader.style.display = 'none';
                  preloader.style.opacity = '0';
                  preloader.style.transition = 'opacity 0.5s ease';
                }
              }
              
              // Try to hide immediately if DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', hidePreloader);
              } else {
                hidePreloader();
              }
              
              // Fallback after page load
              window.addEventListener('load', function() {
                setTimeout(hidePreloader, 500);
              });
            })();
          `}
        </Script>
        {scriptAssets.map((src) => (
          <Script key={src} src={src} strategy="afterInteractive" />
        ))}
      </body>
    </html>
  );
}

