import {
  MAHARASHTRA_COMMODITIES,
  MAHARASHTRA_DISTRICTS,
} from '@/data/maharashtra-market-index';

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const DEFAULT_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const PAGE_LIMIT = 10;
const MAX_RECORDS = 500;
const FETCH_TIMEOUT_MS = 25_000;
const STATE = 'Maharashtra';

export interface AgmarknetRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

export interface CommodityCard {
  id: number;
  title: string;
  slug: string;
  tags?: string;
}

export interface MarketRateItem {
  market: string;
  variety: string;
  unit: string;
  arrival: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  date: string;
}

interface AgmarknetPage {
  total: number;
  records: AgmarknetRecord[];
}

function getApiKey(): string {
  return process.env.DATA_GOV_IN_API_KEY?.trim() || DEFAULT_API_KEY;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const commodityBySlug = new Map(
  MAHARASHTRA_COMMODITIES.map((name, index) => [slugify(name), { name, index }])
);

const districtBySlug = new Map(
  MAHARASHTRA_DISTRICTS.map((name, index) => [slugify(name), { name, index }])
);

async function fetchPage(
  offset: number,
  filters: Record<string, string>
): Promise<AgmarknetPage> {
  const params = new URLSearchParams({
    'api-key': getApiKey(),
    format: 'json',
    limit: String(PAGE_LIMIT),
    offset: String(offset),
  });

  for (const [key, value] of Object.entries(filters)) {
    params.set(`filters[${key}]`, value);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.data.gov.in/resource/${RESOURCE_ID}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'user-agent': 'GreenGoldSeeds/1.0 (+https://www.greengoldseeds.co.in)',
        },
        cache: 'no-store',
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const body = (await response.text()).slice(0, 200);
      throw new Error(`AGMARKNET_HTTP_${response.status}: ${body}`);
    }

    const data = (await response.json()) as {
      total?: number;
      records?: AgmarknetRecord[];
      error?: string;
    };

    if (data.error) {
      throw new Error(`AGMARKNET_API_ERROR: ${data.error}`);
    }

    return {
      total: data.total ?? 0,
      records: data.records ?? [],
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchAllRecords(filters: Record<string, string>): Promise<AgmarknetRecord[]> {
  const records: AgmarknetRecord[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total && records.length < MAX_RECORDS) {
    const page = await fetchPage(offset, filters);
    total = page.total;

    if (page.records.length === 0) {
      break;
    }

    records.push(...page.records);
    offset += page.records.length;
  }

  return records;
}

function toMarketRateItem(record: AgmarknetRecord, districtView: boolean): MarketRateItem {
  const varietyParts = [record.variety];
  if (record.grade) {
    varietyParts.push(record.grade);
  }

  return {
    market: districtView ? `${record.district} / ${record.market}` : record.market,
    variety: districtView
      ? `${record.commodity} (${varietyParts.join(', ')})`
      : varietyParts.join(', '),
    unit: 'Quintal',
    arrival: record.arrival_date,
    min_price: String(record.min_price),
    max_price: String(record.max_price),
    modal_price: String(record.modal_price),
    date: record.arrival_date,
  };
}

export function getCommodityList(): CommodityCard[] {
  return MAHARASHTRA_COMMODITIES.map((title, index) => ({
    id: index + 1,
    title,
    slug: slugify(title),
  }));
}

export function getDistrictList(): CommodityCard[] {
  return MAHARASHTRA_DISTRICTS.map((title, index) => ({
    id: index + 1,
    title,
    slug: slugify(title),
    tags: 'district',
  }));
}

export async function getCommodityRates(slug: string): Promise<{
  title: string;
  meta_title: string;
  rates: MarketRateItem[];
}> {
  const commodity = commodityBySlug.get(slug);
  if (!commodity) {
    throw new Error('COMMODITY_NOT_FOUND');
  }

  const records = await fetchAllRecords({
    state: STATE,
    commodity: commodity.name,
  });

  return {
    title: commodity.name,
    meta_title: `${commodity.name} Market Rates - Maharashtra`,
    rates: records.map((record) => toMarketRateItem(record, false)),
  };
}

export async function getDistrictRates(slug: string): Promise<{
  title: string;
  meta_title: string;
  rates: MarketRateItem[];
}> {
  const district = districtBySlug.get(slug);
  if (!district) {
    throw new Error('DISTRICT_NOT_FOUND');
  }

  const records = await fetchAllRecords({
    state: STATE,
    district: district.name,
  });

  return {
    title: district.name,
    meta_title: `${district.name} District Market Rates - Maharashtra`,
    rates: records.map((record) => toMarketRateItem(record, true)),
  };
}

export function resolveSlug(slug: string, districtView: boolean): 'commodity' | 'district' | null {
  if (districtView && districtBySlug.has(slug)) {
    return 'district';
  }
  if (commodityBySlug.has(slug)) {
    return 'commodity';
  }
  if (districtBySlug.has(slug)) {
    return 'district';
  }
  return null;
}
