import path from 'path';
import {
  MAHARASHTRA_COMMODITIES,
  MAHARASHTRA_DISTRICTS,
} from '@/data/maharashtra-market-index';

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const DEFAULT_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const PAGE_LIMIT = 1000;
const MAX_RECORDS = 10_000;
const FETCH_TIMEOUT_MS = 25_000;
const PAGE_DELAY_MS = 500;
const MAX_FETCH_RETRIES = 4;
const CACHE_TTL_MS = 15 * 60 * 1000;
const STATE = 'Maharashtra';
const RATE_LIMIT_BACKOFF_MS = [3000, 8000, 20000, 45000];

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

interface RatesPayload {
  title: string;
  meta_title: string;
  rates: MarketRateItem[];
}

interface BulkCacheFile {
  fetchedAt: number;
  records: AgmarknetRecord[];
}

interface MemoryBulkCache {
  records: AgmarknetRecord[];
  expiresAt: number;
}

let memoryBulk: MemoryBulkCache | null = null;
let bulkLoadPromise: Promise<AgmarknetRecord[]> | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBulkCacheFilePath(): string {
  if (process.env.AGMARKNET_CACHE_FILE?.trim()) {
    return process.env.AGMARKNET_CACHE_FILE.trim();
  }

  const baseDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), '.cache');
  return path.join(baseDir, 'agmarknet-maharashtra.json');
}

function isRateLimitError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('AGMARKNET_HTTP_429');
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

async function readFileCache(): Promise<BulkCacheFile | null> {
  try {
    const { readFile } = await import('fs/promises');
    const raw = await readFile(getBulkCacheFilePath(), 'utf8');
    const parsed = JSON.parse(raw) as BulkCacheFile;
    if (!Array.isArray(parsed.records) || parsed.records.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function writeFileCache(records: AgmarknetRecord[]): Promise<void> {
  try {
    const { mkdir, writeFile } = await import('fs/promises');
    const filePath = getBulkCacheFilePath();
    await mkdir(path.dirname(filePath), { recursive: true });
    const payload: BulkCacheFile = {
      fetchedAt: Date.now(),
      records,
    };
    await writeFile(filePath, JSON.stringify(payload));
  } catch (error) {
    console.warn('AgMarkNet file cache write failed:', error);
  }
}

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

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_FETCH_RETRIES; attempt++) {
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
          next: { revalidate: 900 },
          signal: controller.signal,
        }
      );

      if (response.status === 429) {
        const body = (await response.text()).slice(0, 200);
        const error = new Error(`AGMARKNET_HTTP_429: ${body}`);
        if (attempt < MAX_FETCH_RETRIES) {
          await sleep(RATE_LIMIT_BACKOFF_MS[attempt] ?? 45000);
          continue;
        }
        throw error;
      }

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
    } catch (error) {
      lastError = error;
      if (isRateLimitError(error) && attempt < MAX_FETCH_RETRIES) {
        await sleep(RATE_LIMIT_BACKOFF_MS[attempt] ?? 45000);
        continue;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('AGMARKNET_FETCH_FAILED');
}

async function fetchAllRecords(filters: Record<string, string>): Promise<AgmarknetRecord[]> {
  const records: AgmarknetRecord[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total && records.length < MAX_RECORDS) {
    if (offset > 0) {
      await sleep(PAGE_DELAY_MS);
    }

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

async function loadMaharashtraRecordsFromApi(): Promise<AgmarknetRecord[]> {
  const records = await fetchAllRecords({ state: STATE });
  if (records.length === 0) {
    throw new Error('AGMARKNET_EMPTY_RESPONSE');
  }
  return records;
}

function setMemoryBulk(records: AgmarknetRecord[]): void {
  memoryBulk = {
    records,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
}

async function loadMaharashtraRecords(): Promise<AgmarknetRecord[]> {
  const now = Date.now();
  if (memoryBulk && now < memoryBulk.expiresAt) {
    return memoryBulk.records;
  }

  if (bulkLoadPromise) {
    return bulkLoadPromise;
  }

  bulkLoadPromise = (async () => {
    const fileCache = await readFileCache();
    if (fileCache && now - fileCache.fetchedAt < CACHE_TTL_MS) {
      setMemoryBulk(fileCache.records);
      return fileCache.records;
    }

    try {
      const records = await loadMaharashtraRecordsFromApi();
      setMemoryBulk(records);
      await writeFileCache(records);
      return records;
    } catch (error) {
      if (fileCache) {
        console.warn(
          'AgMarkNet live fetch failed; serving cached Maharashtra records from',
          getBulkCacheFilePath()
        );
        setMemoryBulk(fileCache.records);
        return fileCache.records;
      }
      throw error;
    } finally {
      bulkLoadPromise = null;
    }
  })();

  return bulkLoadPromise;
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

export async function getCommodityRates(slug: string): Promise<RatesPayload> {
  const commodity = commodityBySlug.get(slug);
  if (!commodity) {
    throw new Error('COMMODITY_NOT_FOUND');
  }

  const records = await loadMaharashtraRecords();
  const filtered = records.filter((record) => record.commodity === commodity.name);

  return {
    title: commodity.name,
    meta_title: `${commodity.name} Market Rates - Maharashtra`,
    rates: filtered.map((record) => toMarketRateItem(record, false)),
  };
}

export async function getDistrictRates(slug: string): Promise<RatesPayload> {
  const district = districtBySlug.get(slug);
  if (!district) {
    throw new Error('DISTRICT_NOT_FOUND');
  }

  const records = await loadMaharashtraRecords();
  const filtered = records.filter((record) => record.district === district.name);

  return {
    title: district.name,
    meta_title: `${district.name} District Market Rates - Maharashtra`,
    rates: filtered.map((record) => toMarketRateItem(record, true)),
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
