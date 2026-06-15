import { setDefaultResultOrder } from 'node:dns';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Prefer IPv4 on servers where IPv6 routes to api-prod.krushikranti.com fail.
setDefaultResultOrder('ipv4first');

const DEFAULT_API_BASE = 'https://api-prod.krushikranti.com/bajarbhav';
const DEFAULT_API_KEY = 'krushikrantiytoierenfmdnclksajdsk';

function getApiBase(): string {
  return (process.env.KRUSHIKRANTI_API_BASE_URL || DEFAULT_API_BASE).trim().replace(/\/$/, '');
}

function getApiKey(): string {
  const key = process.env.KRUSHIKRANTI_API_KEY?.trim();
  return key || DEFAULT_API_KEY;
}

function buildApiHeaders(): Record<string, string> {
  return {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-GB,en-IN;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
    'cache-control': 'no-cache',
    origin: 'https://www.krushikranti.com',
    referer: 'https://www.krushikranti.com/',
    'user-agent': 'GreenGoldSeeds/1.0 (+https://www.greengoldseeds.co.in)',
    'x-api-key': getApiKey(),
  };
}

const FETCH_TIMEOUT_MS = 25_000;
const MAX_ATTEMPTS = 3;

function getErrorCode(error: unknown): string | undefined {
  if (!(error instanceof Error)) return undefined;
  const cause = error.cause as { code?: string } | undefined;
  return cause?.code || (error as { code?: string }).code;
}

function isUpstreamNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = getErrorCode(error);
  const message = error.message.toLowerCase();

  if (error.name === 'AbortError' || message.includes('aborted')) {
    return true;
  }

  const networkCodes = new Set([
    'ENOTFOUND',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'EAI_AGAIN',
    'ECONNRESET',
    'EPROTO',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_SOCKET',
    'CERT_HAS_EXPIRED',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  ]);

  return (
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('socket') ||
    message.includes('timed out') ||
    (code ? networkCodes.has(code) : false)
  );
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchUpstream(url: string): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'GET',
          headers: buildApiHeaders(),
          cache: 'no-store',
        },
        FETCH_TIMEOUT_MS
      );
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS && isUpstreamNetworkError(error)) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

// Parse HTML table from b_desc to extract market rates
function parseHtmlTable(html: string): any[] {
  const rates: any[] = [];

  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  let currentDate = '';
  let match;

  while ((match = rowRegex.exec(html)) !== null) {
    const rowContent = match[1];
    const cells: string[] = [];
    let cellMatch;

    cellRegex.lastIndex = 0;
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const cellText = cellMatch[1].replace(/<[^>]*>/g, '').trim();
      cells.push(cellText);
    }

    if (cells.length === 1 && /^\d{2}\/\d{2}\/\d{4}$/.test(cells[0])) {
      currentDate = cells[0];
      continue;
    }

    if (cells.length >= 7) {
      rates.push({
        market: cells[0] || '-',
        variety: cells[1] || '-',
        unit: cells[2] || 'क्विंटल',
        arrival: cells[3] || '-',
        min_price: cells[4] || '-',
        max_price: cells[5] || '-',
        modal_price: cells[6] || '-',
        date: currentDate,
      });
    }
  }

  return rates;
}

export async function GET(request: NextRequest) {
  const apiBase = getApiBase();

  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const slug = searchParams.get('slug');

    let apiUrl: string;

    if (slug) {
      apiUrl = `${apiBase}/${slug}`;
    } else {
      apiUrl = apiBase;
      if (district === 'yes') {
        apiUrl += '?district=yes';
      }
    }

    const response = await fetchUpstream(apiUrl);

    if (!response.ok) {
      const errorBody = (await response.text()).slice(0, 200);
      console.error('Market rates upstream HTTP error:', {
        status: response.status,
        url: apiUrl,
        body: errorBody,
        hostname: new URL(apiBase).hostname,
      });

      return NextResponse.json(
        {
          error: 'Market rates provider returned an error. Please verify server API credentials.',
          code: response.status === 404 ? 'UPSTREAM_AUTH_ERROR' : 'UPSTREAM_HTTP_ERROR',
          upstreamStatus: response.status,
        },
        { status: 502 }
      );
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Market rates JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid response from market rates provider', code: 'UPSTREAM_PARSE_ERROR' },
        { status: 502 }
      );
    }

    const payload = data as Record<string, any>;

    if (slug && payload.b_desc) {
      const parsedRates = parseHtmlTable(payload.b_desc);
      return NextResponse.json(
        {
          title: payload.b_title,
          meta_title: payload.meta_title,
          image: payload.filename1,
          rates: parsedRates,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }

    if (Array.isArray(data)) {
      const transformed = data.map((item: any) => ({
        id: item.b_id,
        title: item.b_title,
        slug: item.b_slug,
        tags: item.b_tags,
      }));
      return NextResponse.json(transformed, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Market rates API error:', error);

    if (isUpstreamNetworkError(error)) {
      const cause = error instanceof Error ? (error.cause as { hostname?: string } | undefined) : undefined;
      return NextResponse.json(
        {
          error: 'Could not reach the market rates provider from the server. Check outbound network/DNS access.',
          code: 'UPSTREAM_UNAVAILABLE',
          hostname: cause?.hostname ?? new URL(apiBase).hostname,
          detail: error instanceof Error ? error.message : 'Unknown network error',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch market rates',
        code: 'UPSTREAM_ERROR',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
