import { NextResponse } from "next/server";
import { computeCurrentTransits } from "@/lib/astro/transits";
import { generateHoroscopeForSign } from "@/lib/ai/generate-horoscope";
import { runWithConcurrencyLimit } from "@/lib/ai/concurrency";
import { writeJsonCache } from "@/lib/cache/json-cache";
import { ZODIAC_SIGNS } from "@/lib/astro/zodiac";
import type { HoroscopeBundle, HoroscopePeriod, SignHoroscope } from "@/types/horoscope";
import type { ZodiacSignKey } from "@/types/chart";

export const maxDuration = 60;

const CONCURRENCY = 4;

/**
 * Protected refresh endpoint, kept for parity with a future Vercel Cron deployment
 * (Vercel's filesystem is ephemeral in production, so this JSON-file cache approach
 * would need rework before relying on this route in production -- local dev instead
 * runs `npm run refresh-horoscopes` directly via Windows Task Scheduler).
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const provided = request.headers.get("x-cron-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
  }

  const period: HoroscopePeriod =
    new URL(request.url).searchParams.get("period") === "weekly" ? "weekly" : "daily";
  const now = new Date();

  try {
    const transits = computeCurrentTransits(now);
    const results = await runWithConcurrencyLimit(ZODIAC_SIGNS, CONCURRENCY, (sign) =>
      generateHoroscopeForSign(sign, period, transits),
    );

    const signs = Object.fromEntries(
      results.map((horoscope) => [horoscope.sign, horoscope]),
    ) as Record<ZodiacSignKey, SignHoroscope>;

    const bundle: HoroscopeBundle = {
      period,
      generatedAtIso: now.toISOString(),
      coverage: now.toISOString().slice(0, 10),
      signs,
    };

    const fileName = period === "daily" ? "horoscope-daily.json" : "horoscope-weekly.json";
    writeJsonCache(fileName, bundle);

    return NextResponse.json({ ok: true, period, generatedAtIso: bundle.generatedAtIso });
  } catch (error) {
    console.error("[api/horoscope/refresh] failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "فشل التحديث" },
      { status: 500 },
    );
  }
}
