import { cacheFileAgeMs, readJsonCache } from "@/lib/cache/json-cache";
import type { HoroscopeBundle, HoroscopePeriod } from "@/types/horoscope";

const STALE_THRESHOLD_MS = 36 * 60 * 60 * 1000; // 36 hours

function fileNameFor(period: HoroscopePeriod): string {
  return period === "daily" ? "horoscope-daily.json" : "horoscope-weekly.json";
}

export interface LoadedHoroscopeBundle {
  bundle: HoroscopeBundle | null;
  isStale: boolean;
}

export async function loadHoroscopeBundle(period: HoroscopePeriod): Promise<LoadedHoroscopeBundle> {
  const fileName = fileNameFor(period);
  const [bundle, ageMs] = await Promise.all([
    readJsonCache<HoroscopeBundle>(fileName),
    cacheFileAgeMs(fileName),
  ]);
  const isStale = ageMs === null || ageMs > STALE_THRESHOLD_MS;
  return { bundle, isStale };
}
