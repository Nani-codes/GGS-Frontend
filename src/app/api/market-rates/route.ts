import { NextRequest, NextResponse } from 'next/server';

const KRUSHIKRANTI_API_URL = 'https://api-prod.krushikranti.com/bajarbhav';
const API_KEY = process.env.KRUSHIKRANTI_API_KEY || 'krushikrantiytoierenfmdnclksajdsk';

const API_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en-GB,en-IN;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
  'cache-control': 'no-cache',
  'origin': 'https://www.krushikranti.com',
  'referer': 'https://www.krushikranti.com/',
  'x-api-key': API_KEY,
};

// Parse HTML table from b_desc to extract market rates
function parseHtmlTable(html: string): any[] {
  const rates: any[] = [];
  
  // Match all table rows
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  
  let currentDate = '';
  let match;
  
  while ((match = rowRegex.exec(html)) !== null) {
    const rowContent = match[1];
    const cells: string[] = [];
    let cellMatch;
    
    // Reset regex lastIndex for cell matching
    cellRegex.lastIndex = 0;
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      // Strip HTML tags and trim whitespace
      const cellText = cellMatch[1].replace(/<[^>]*>/g, '').trim();
      cells.push(cellText);
    }
    
    // Check if this is a date row (single cell with colspan)
    if (cells.length === 1 && /^\d{2}\/\d{2}\/\d{4}$/.test(cells[0])) {
      currentDate = cells[0];
      continue;
    }
    
    // Regular data row with 7 columns: market, variety, unit, arrival, min, max, modal
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
      // Fetch specific commodity data by slug
      apiUrl = `${KRUSHIKRANTI_API_URL}/${slug}`;
    } else {
      // Fetch list of commodities or districts
      apiUrl = KRUSHIKRANTI_API_URL;
      if (district === 'yes') {
        apiUrl += '?district=yes';
      }
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: API_HEADERS,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // If fetching by slug, parse the HTML table from b_desc
    if (slug && data.b_desc) {
      const parsedRates = parseHtmlTable(data.b_desc);
      return NextResponse.json({
        title: data.b_title,
        meta_title: data.meta_title,
        image: data.filename1,
        rates: parsedRates,
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // For list endpoints, transform to consistent format
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
    return NextResponse.json(
      { error: 'Failed to fetch market rates' },
      { status: 500 }
    );
  }
}
