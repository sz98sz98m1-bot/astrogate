import { geocentricLongitude } from "../lib/astro/planets";
import { findSolarReturn } from "../lib/astro/solar-return";
import { normalizeDegrees } from "../lib/astro/zodiac";

const cases = [
  { label: "regular birthday", natalDate: "1990-11-23", returnYear: 2026, natalLon: geocentricLongitude("sun", new Date("1990-11-23T01:15:00Z")) },
  { label: "Feb 29 birthday, non-leap return year", natalDate: "1992-02-29", returnYear: 2025, natalLon: geocentricLongitude("sun", new Date("1992-02-29T12:00:00Z")) },
  { label: "Feb 29 birthday, leap return year", natalDate: "1992-02-29", returnYear: 2028, natalLon: geocentricLongitude("sun", new Date("1992-02-29T12:00:00Z")) },
  { label: "near Aries wraparound", natalDate: "2000-03-20", returnYear: 2026, natalLon: geocentricLongitude("sun", new Date("2000-03-20T08:00:00Z")) },
];

let failures = 0;
for (const c of cases) {
  const returnInstant = findSolarReturn(c.natalLon, c.returnYear, c.natalDate);
  const returnLon = geocentricLongitude("sun", returnInstant);
  const diff = Math.abs(normalizeDegrees(returnLon - c.natalLon + 180) - 180);
  const pass = diff < 0.01;
  console.log(
    `${pass ? "OK  " : "FAIL"} ${c.label}: return=${returnInstant.toISOString()} diff=${diff.toFixed(5)}°`,
  );
  if (!pass) failures++;
}

if (failures > 0) {
  console.error(`${failures} case(s) failed.`);
  process.exit(1);
}
console.log("All solar return cases passed.");
