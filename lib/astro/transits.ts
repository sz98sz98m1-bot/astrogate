import type { PlanetKey } from "@/types/chart";
import { geocentricLongitude, PLANET_KEYS } from "./planets";
import { signedDelta, signFromLongitude } from "./zodiac";

export interface TransitPosition {
  planet: PlanetKey;
  longitude: number;
  sign: ReturnType<typeof signFromLongitude>;
  retrograde: boolean;
}

/**
 * Detects apparent retrograde motion by comparing ecliptic longitude "today" vs. one day
 * earlier -- if longitude is decreasing (accounting for 0/360 wraparound), the body appears
 * retrograde from Earth. The Sun and Moon never appear retrograde and are skipped.
 */
export function isRetrograde(planet: PlanetKey, now: Date): boolean {
  if (planet === "sun" || planet === "moon") return false;
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const today = geocentricLongitude(planet, now);
  const prior = geocentricLongitude(planet, yesterday);
  return signedDelta(today, prior) < 0;
}

/** Computes today's ("now") planetary positions -- the input for daily horoscope generation. */
export function computeCurrentTransits(now: Date = new Date()): TransitPosition[] {
  return PLANET_KEYS.map((planet) => {
    const longitude = geocentricLongitude(planet, now);
    return {
      planet,
      longitude,
      sign: signFromLongitude(longitude),
      retrograde: isRetrograde(planet, now),
    };
  });
}
