/**
 * Regenerates AI horoscope text for all 12 zodiac signs and writes it to the JSON cache.
 *
 * Usage:
 *   npm run refresh-horoscopes -- daily
 *   npm run refresh-horoscopes -- weekly
 *
 * Intended to run on a schedule (Windows Task Scheduler locally; Vercel Cron in production).
 * Failures are logged loudly and exit with a non-zero code, since a silently-stale cache
 * is the main reliability risk for this feature.
 */
import "dotenv/config";
import { computeCurrentTransits } from "../lib/astro/transits";
import { generateHoroscopeForSign } from "../lib/ai/generate-horoscope";
import { runWithConcurrencyLimit } from "../lib/ai/concurrency";
import { writeJsonCache } from "../lib/cache/json-cache";
import { ZODIAC_SIGNS } from "../lib/astro/zodiac";
import type { HoroscopeBundle, HoroscopePeriod, SignHoroscope } from "../types/horoscope";
import type { ZodiacSignKey } from "../types/chart";

const CONCURRENCY = 4;

function coverageLabel(period: HoroscopePeriod, now: Date): string {
  if (period === "daily") return now.toISOString().slice(0, 10);
  const firstDayOfWeek = new Date(now);
  const day = firstDayOfWeek.getUTCDay() || 7;
  firstDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() - day + 1);
  return `week-of-${firstDayOfWeek.toISOString().slice(0, 10)}`;
}

async function main() {
  const period: HoroscopePeriod = process.argv.includes("weekly") ? "weekly" : "daily";
  const now = new Date();

  console.log(`[refresh-horoscopes] بدء توليد الأبراج (${period}) بتاريخ ${now.toISOString()}`);

  const transits = computeCurrentTransits(now);

  const results = await runWithConcurrencyLimit(ZODIAC_SIGNS, CONCURRENCY, async (sign) => {
    console.log(`[refresh-horoscopes] توليد برج ${sign}...`);
    return generateHoroscopeForSign(sign, period, transits);
  });

  const signs = Object.fromEntries(
    results.map((horoscope) => [horoscope.sign, horoscope]),
  ) as Record<ZodiacSignKey, SignHoroscope>;

  const bundle: HoroscopeBundle = {
    period,
    generatedAtIso: now.toISOString(),
    coverage: coverageLabel(period, now),
    signs,
  };

  const fileName = period === "daily" ? "horoscope-daily.json" : "horoscope-weekly.json";
  await writeJsonCache(fileName, bundle);

  console.log(`[refresh-horoscopes] تم بنجاح، تمت كتابة ${fileName} لكل الأبراج الـ12.`);
}

main().catch((error) => {
  console.error("[refresh-horoscopes] فشل التحديث:", error);
  process.exit(1);
});
