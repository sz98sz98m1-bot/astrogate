import { NextResponse } from "next/server";
import { computeRetrogradeStatus } from "@/lib/astro/retrograde";
import { cacheFileAgeMs, readJsonCache, writeJsonCache } from "@/lib/cache/json-cache";
import type { RetrogradeStatus } from "@/types/chart";

const CACHE_FILE = "retrograde.json";
const CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours -- positions barely move within a day.

interface RetrogradeCache {
  computedAtIso: string;
  statuses: RetrogradeStatus[];
}

export async function GET() {
  const [ageMs, cached] = await Promise.all([
    cacheFileAgeMs(CACHE_FILE),
    readJsonCache<RetrogradeCache>(CACHE_FILE),
  ]);

  if (cached && ageMs !== null && ageMs < CACHE_MAX_AGE_MS) {
    return NextResponse.json(cached);
  }

  const statuses = computeRetrogradeStatus();
  const result: RetrogradeCache = { computedAtIso: new Date().toISOString(), statuses };
  await writeJsonCache(CACHE_FILE, result);

  return NextResponse.json(result);
}
