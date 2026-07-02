import type { RetrogradePlanetKey, RetrogradeStatus } from "@/types/chart";
import { geocentricLongitude } from "./planets";
import { isRetrograde } from "./transits";
import { signedDelta } from "./zodiac";

const RETROGRADE_PLANETS: RetrogradePlanetKey[] = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

interface Station {
  date: Date;
  /** True if this station transitions the planet INTO retrograde motion. */
  newlyRetrograde: boolean;
}

/**
 * Scans forward day-by-day (up to maxDays) for the next station (direction change) of a
 * planet's apparent motion. A "station" is detected when the signed daily delta flips sign
 * between day N-1 and day N -- the station itself occurred *between* those two days, so we
 * linear-interpolate the zero-crossing for sub-day precision rather than reporting day N
 * (which would be off by up to a full day).
 */
export function findNextStation(planet: RetrogradePlanetKey, from: Date, maxDays = 200): Station | null {
  let prevLon = geocentricLongitude(planet, from);
  let prevDelta = signedDelta(prevLon, geocentricLongitude(planet, new Date(from.getTime() - 86400000)));

  for (let day = 1; day <= maxDays; day++) {
    const date = new Date(from.getTime() + day * 86400000);
    const lon = geocentricLongitude(planet, date);
    const delta = signedDelta(lon, prevLon);

    if (Math.sign(delta) !== Math.sign(prevDelta) && delta !== 0 && prevDelta !== 0) {
      const frac = Math.abs(prevDelta) / (Math.abs(prevDelta) + Math.abs(delta));
      const stationTime = from.getTime() + (day - 1 + frac) * 86400000;
      return { date: new Date(stationTime), newlyRetrograde: delta < 0 };
    }

    prevDelta = delta;
    prevLon = lon;
  }

  return null;
}

export function computeRetrogradeStatus(now: Date = new Date()): RetrogradeStatus[] {
  return RETROGRADE_PLANETS.map((planet) => {
    const retrograde = isRetrograde(planet, now);
    const station = findNextStation(planet, now);
    return {
      planet,
      retrograde,
      nextStationIso: station?.date.toISOString() ?? null,
      nextStationIsRetrograde: station?.newlyRetrograde ?? null,
    };
  });
}
