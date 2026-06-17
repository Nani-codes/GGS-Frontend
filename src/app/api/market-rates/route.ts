import { NextRequest, NextResponse } from 'next/server';
import {
  getCommodityList,
  getCommodityRates,
  getDistrictList,
  getDistrictRates,
  resolveSlug,
} from '@/lib/agmarknet';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    error.name === 'AbortError' ||
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('timed out') ||
    message.includes('abort')
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const slug = searchParams.get('slug');
    const districtView = district === 'yes';

    if (!slug) {
      const items = districtView ? getDistrictList() : getCommodityList();
      return NextResponse.json(items, {
        status: 200,
        headers: CACHE_HEADERS,
      });
    }

    const slugType = resolveSlug(slug, districtView);

    if (slugType === 'district') {
      const data = await getDistrictRates(slug);
      return NextResponse.json(data, {
        status: 200,
        headers: CACHE_HEADERS,
      });
    }

    if (slugType === 'commodity') {
      const data = await getCommodityRates(slug);
      return NextResponse.json(data, {
        status: 200,
        headers: CACHE_HEADERS,
      });
    }

    return NextResponse.json(
      {
        error: 'Market item not found',
        code: 'NOT_FOUND',
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Market rates API error:', error);

    if (error instanceof Error && error.message === 'COMMODITY_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Commodity not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message === 'DISTRICT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'District not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (isNetworkError(error)) {
      return NextResponse.json(
        {
          error:
            'Could not reach the market rates provider from the server. Check outbound network access.',
          code: 'UPSTREAM_UNAVAILABLE',
          detail: error instanceof Error ? error.message : 'Unknown network error',
        },
        { status: 503 }
      );
    }

    if (error instanceof Error && error.message.startsWith('AGMARKNET_HTTP_403')) {
      return NextResponse.json(
        {
          error: 'Market rates provider blocked the request. Verify the data.gov.in API key.',
          code: 'UPSTREAM_AUTH_ERROR',
          upstreamStatus: 403,
        },
        { status: 502 }
      );
    }

    if (error instanceof Error && error.message.startsWith('AGMARKNET_HTTP_429')) {
      return NextResponse.json(
        {
          error:
            'Market rates provider rate limit reached. Register a dedicated API key at data.gov.in, set DATA_GOV_IN_API_KEY, then try again in a few minutes.',
          code: 'RATE_LIMIT',
          upstreamStatus: 429,
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
