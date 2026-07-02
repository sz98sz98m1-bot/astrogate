import tzlookup from "tz-lookup";
import { readJsonCache, writeJsonCache } from "@/lib/cache/json-cache";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
// Must be ASCII-only: the Fetch API rejects non-Latin1 header values (ByteString).
const USER_AGENT = "AstroGate/1.0 (Arabic astrology site; contact: astrogate-support@example.com)";
const CACHE_FILE = "geocode-cache.json";

export interface GeocodeResult {
  nameAr: string;
  nameEn: string;
  lat: number;
  lon: number;
  timezone: string;
}

type GeocodeCache = Record<string, GeocodeResult>;

/** Simple single-process token bucket enforcing Nominatim's 1 request/second hard cap. */
let lastRequestAt = 0;
async function rateLimit() {
  const minGapMs = 1100;
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < minGapMs) {
    await new Promise((resolve) => setTimeout(resolve, minGapMs - elapsed));
  }
  lastRequestAt = Date.now();
}

async function loadCache(): Promise<GeocodeCache> {
  return (await readJsonCache<GeocodeCache>(CACHE_FILE)) ?? {};
}

async function saveCache(cache: GeocodeCache): Promise<void> {
  await writeJsonCache(CACHE_FILE, cache);
}

interface NominatimResponseItem {
  lat: string;
  lon: string;
  display_name: string;
}

/**
 * Server-side-only Nominatim (OpenStreetMap) geocoding client. Complies with Nominatim's
 * usage policy: descriptive User-Agent, rate limiting, and mandatory result caching
 * (never repeat an identical query). Results are cached indefinitely since city
 * coordinates do not change.
 */
export async function geocodeViaNominatim(query: string): Promise<GeocodeResult | null> {
  const cacheKey = query.trim().toLowerCase();
  const cache = await loadCache();
  if (cache[cacheKey]) return cache[cacheKey];

  await rateLimit();

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) return null;

  const results = (await response.json()) as NominatimResponseItem[];
  if (results.length === 0) return null;

  const lat = Number(results[0].lat);
  const lon = Number(results[0].lon);
  const timezone = tzlookup(lat, lon);

  const result: GeocodeResult = {
    nameAr: query,
    nameEn: results[0].display_name,
    lat,
    lon,
    timezone,
  };

  cache[cacheKey] = result;
  await saveCache(cache);

  return result;
}
