import { DateTime } from "luxon";
import type { BirthInput, ChartData } from "@/types/chart";
import { geocentricLongitude } from "./planets";
import { signedDelta } from "./zodiac";
import { computeChartAtUtc } from "./natal-chart";

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Finds the exact UTC instant in `year` when the Sun's geocentric ecliptic longitude
 * returns to `natalSunLongitude`. The Sun's longitude increases monotonically all year
 * (no retrograde, no stationary points), so a bisection search is safe and simple --
 * see lib/astro/solar-return.ts design notes: the search is seeded on the birth
 * month/day in the target year (handling Feb 29 by projecting to Feb 28 in non-leap
 * years), bracketed generously (+/-5 days, widening to +/-10 if that fails to bracket
 * a root), and resolved via signed-delta comparisons so the 0/360 wrap near the Aries
 * point never breaks the sign test.
 */
export function findSolarReturn(natalSunLongitude: number, year: number, natalDate: string): Date {
  const [, monthStr, dayStr] = natalDate.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);
  const seedDay = month === 2 && day === 29 && !isLeapYear(year) ? 28 : day;
  const seed = Date.UTC(year, month - 1, seedDay, 12, 0, 0);

  const f = (t: number) => signedDelta(geocentricLongitude("sun", new Date(t)), natalSunLongitude);

  let lo = seed - 5 * 86400000;
  let hi = seed + 5 * 86400000;

  if (Math.sign(f(lo)) === Math.sign(f(hi))) {
    lo = seed - 10 * 86400000;
    hi = seed + 10 * 86400000;
  }

  for (let i = 0; i < 40 && hi - lo > 1000; i++) {
    const mid = (lo + hi) / 2;
    if (Math.sign(f(mid)) === Math.sign(f(lo))) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return new Date((lo + hi) / 2);
}

export interface SolarReturnLocation {
  lat: number;
  lon: number;
  timezone: string;
  placeName?: string;
}

/**
 * Computes a full chart for the solar return instant, at a location that may differ from
 * the birth location (traditionally the return chart is read for the person's current
 * residence at the time of their birthday, not their birthplace).
 */
export function computeSolarReturnChart(
  natalSunLongitude: number,
  natalDate: string,
  year: number,
  location: SolarReturnLocation,
): ChartData {
  const utcInstant = findSolarReturn(natalSunLongitude, year, natalDate);
  const local = DateTime.fromJSDate(utcInstant, { zone: "utc" }).setZone(location.timezone);

  const input: BirthInput = {
    date: local.toFormat("yyyy-MM-dd"),
    time: local.toFormat("HH:mm"),
    lat: location.lat,
    lon: location.lon,
    timezone: location.timezone,
    placeName: location.placeName,
  };

  return computeChartAtUtc(utcInstant, location.lat, location.lon, input);
}
