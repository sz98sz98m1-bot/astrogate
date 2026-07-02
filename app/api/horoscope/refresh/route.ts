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

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured locally -- allow (dev convenience)

  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically when the
  // CRON_SECRET env var is set. Also accept the custom header for manual/local calls.
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const customHeader = request.headers.get("x-cron-secret");
  return customHeader === secret;
}

async function refresh(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
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
    await writeJsonCache(fileName, bundle);

    return NextResponse.json({ ok: true, period, generatedAtIso: bundle.generatedAtIso });
  } catch (error) {
    console.error("[api/horoscope/refresh] failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "فشل التحديث" },
      { status: 500 },
    );
  }
}

// Vercel Cron always sends GET requests. POST is kept for manual/local triggering.
export async function GET(request: Request) {
  return refresh(request);
}

export async function POST(request: Request) {
  return refresh(request);
}
