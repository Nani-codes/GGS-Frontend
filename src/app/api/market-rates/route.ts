import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_API_BASE = 'https://api-prod.krushikranti.com/bajarbhav';
const API_BASE = (process.env.KRUSHIKRANTI_API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, '');
const API_KEY = process.env.KRUSHIKRANTI_API_KEY || 'krushikrantiytoierenfmdnclksajdsk';

const API_HEADERS = {
  accept: 'application/json, text/plain, */*',
  'accept-language': 'en-GB,en-IN;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
  'cache-control': 'no-cache',
  origin: 'https://www.krushikranti.com',
  referer: 'https://www.krushikranti.com/',
  'x-api-key': API_KEY,
};

const FETCH_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 2;

function isUpstreamNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const cause = error.cause as NodeJS.ErrnoException | undefined;
  const code = cause?.code;
  return (
    error.message.includes('fetch failed') ||
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'EAI_AGAIN'
  );
}

async function fetchUpstream(url: string): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: API_HEADERS,
        cache: 'no-store',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS && isUpstreamNetworkError(error)) {
        await new Promise((resolve) => setTimeout(resolve, 400));
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
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const slug = searchParams.get('slug');

    let apiUrl: string;

    if (slug) {
      apiUrl = `${API_BASE}/${slug}`;
    } else {
      apiUrl = API_BASE;
      if (district === 'yes') {
        apiUrl += '?district=yes';
      }
    }

    const response = await fetchUpstream(apiUrl);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (slug && data.b_desc) {
      const parsedRates = parseHtmlTable(data.b_desc);
      return NextResponse.json(
        {
          title: data.b_title,
          meta_title: data.meta_title,
          image: data.filename1,
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
          error: 'Could not reach the market rates provider. Check your internet connection and DNS, then try again.',
          code: 'UPSTREAM_UNAVAILABLE',
          hostname: cause?.hostname ?? new URL(API_BASE).hostname,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch market rates', code: 'UPSTREAM_ERROR' },
      { status: 500 }
    );
  }
}
