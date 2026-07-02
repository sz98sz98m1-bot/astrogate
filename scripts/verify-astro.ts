/**
 * Sanity-check script (not a full test framework) that validates computeAscendantAndMidheaven
 * against an independent numeric method built on astronomy-engine's own rotation matrices
 * (scanning the ecliptic for its eastern-horizon crossing). Run with `npm run verify:astro`.
 */
import assert from "node:assert/strict";
import * as Astronomy from "astronomy-engine";
import { computeAscendantAndMidheaven } from "../lib/astro/ascendant";
import { normalizeDegrees } from "../lib/astro/zodiac";

function numericAscendant(utcDate: Date, lat: number, lon: number): number {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const rotation = Astronomy.CombineRotation(
    Astronomy.Rotation_ECT_EQD(utcDate),
    Astronomy.Rotation_EQD_HOR(utcDate, observer),
  );

  function altitudeAzimuth(eclipticLongitude: number) {
    const vector = Astronomy.VectorFromSphere(
      { lat: 0, lon: eclipticLongitude, dist: 1 },
      utcDate,
    );
    return Astronomy.HorizonFromVector(Astronomy.RotateVector(rotation, vector), "");
  }

  let previous = altitudeAzimuth(0);
  let ascendant: number | null = null;
  for (let deg = 1; deg <= 360; deg++) {
    const current = altitudeAzimuth(deg);
    if (previous.lat < 0 !== current.lat < 0) {
      let lo = deg - 1;
      let hi = deg;
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        const midAlt = altitudeAzimuth(mid).lat;
        if (previous.lat < 0 === midAlt < 0) lo = mid;
        else hi = mid;
      }
      const root = (lo + hi) / 2;
      const azimuth = altitudeAzimuth(root).lon;
      if (azimuth > 0 && azimuth < 180) ascendant = root; // eastern horizon = rising point
    }
    previous = current;
  }

  assert(ascendant !== null, "failed to find an ascendant crossing");
  return ascendant;
}

const referenceCases = [
  { label: "Cairo 2026-07-01", date: new Date("2026-07-01T12:00:00Z"), lat: 30.0444, lon: 31.2357 },
  { label: "Equator 2026-07-01", date: new Date("2026-07-01T12:00:00Z"), lat: 0, lon: 0 },
  { label: "Cairo 1990-11-23", date: new Date("1990-11-23T03:15:00Z"), lat: 30.0444, lon: 31.2357 },
  { label: "New York 1990-11-23", date: new Date("1990-11-23T03:15:00Z"), lat: 40.7128, lon: -74.006 },
  { label: "Sydney 1990-11-23", date: new Date("1990-11-23T03:15:00Z"), lat: -33.8688, lon: 151.2093 },
];

let failures = 0;
for (const testCase of referenceCases) {
  const { ascendantLongitude } = computeAscendantAndMidheaven(testCase.date, testCase.lat, testCase.lon);
  const expected = numericAscendant(testCase.date, testCase.lat, testCase.lon);
  const diff = Math.abs(normalizeDegrees(ascendantLongitude - expected + 180) - 180);
  const pass = diff < 0.05;
  console.log(
    `${pass ? "OK  " : "FAIL"} ${testCase.label}: formula=${ascendantLongitude.toFixed(3)} numeric=${expected.toFixed(3)} diff=${diff.toFixed(4)}`,
  );
  if (!pass) failures++;
}

if (failures > 0) {
  console.error(`${failures} reference case(s) failed.`);
  process.exit(1);
}
console.log("All ascendant reference cases passed.");
