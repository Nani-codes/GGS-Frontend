import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['46.62.128.100'],
  env: {
    NEXT_STRAPI_API_KEY: process.env.NEXT_STRAPI_API_KEY,
    NEXT_STRAPI_BASE_URL: process.env.NEXT_STRAPI_BASE_URL,
    // Instagram API credentials
    INSTAGRAM_SESSION_ID: process.env.INSTAGRAM_SESSION_ID,
    INSTAGRAM_CSRF_TOKEN: process.env.INSTAGRAM_CSRF_TOKEN,
    INSTAGRAM_IG_DID: process.env.INSTAGRAM_IG_DID,
    INSTAGRAM_DS_USER_ID: process.env.INSTAGRAM_DS_USER_ID,
    INSTAGRAM_MID: process.env.INSTAGRAM_MID,
    INSTAGRAM_DATR: process.env.INSTAGRAM_DATR,
  },
  async rewrites() {
    const strapiBaseUrl = process.env.NEXT_STRAPI_BASE_URL || 'http://localhost:1337';
    return [
      {
        source: '/strapi/:path*',
        destination: `${strapiBaseUrl}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
