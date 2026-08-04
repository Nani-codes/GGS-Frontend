import { NextRequest, NextResponse } from 'next/server';
import { fetchInstagramImage } from '@/lib/instagram-public';

export const dynamic = 'force-dynamic';

const FALLBACK_IMAGE = '/assets/images/blog/blog-1-1.jpg';
// Only proxy Instagram / Facebook CDN hosts to avoid becoming an open proxy.
const ALLOWED_HOST = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/i;

function redirectToFallback(request: NextRequest) {
  return NextResponse.redirect(new URL(FALLBACK_IMAGE, request.url), 302);
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('u');
  if (!target) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let host: string;
  try {
    host = new URL(target).host;
  } catch {
    return new NextResponse('Invalid url parameter', { status: 400 });
  }

  if (!ALLOWED_HOST.test(host)) {
    return new NextResponse('Host not allowed', { status: 403 });
  }

  try {
    const { buffer, contentType, status } = await fetchInstagramImage(target);

    if (status !== 200 || !contentType.startsWith('image/')) {
      return redirectToFallback(request);
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.warn('Instagram image proxy failed:', error);
    return redirectToFallback(request);
  }
}
