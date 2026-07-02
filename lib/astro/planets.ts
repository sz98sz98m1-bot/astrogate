import * as Astronomy from "astronomy-engine";
import type { PlanetKey, PlanetPosition } from "@/types/chart";
import { degreeInSign, signFromLongitude } from "./zodiac";

const PLANET_BODIES: Record<PlanetKey, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

export const PLANET_KEYS = Object.keys(PLANET_BODIES) as PlanetKey[];

/** Geocentric tropical ecliptic longitude (0-360 degrees) of a body at a given UTC instant. */
export function geocentricLongitude(planet: PlanetKey, utcDate: Date): number {
  const body = PLANET_BODIES[planet];
  const vector = Astronomy.GeoVector(body, utcDate, true);
  const ecliptic = Astronomy.Ecliptic(vector);
  return ecliptic.elon;
}

/**
 * Computes the ecliptic longitude for every tracked planet at a UTC instant.
 * House numbers are filled in by the caller once the Ascendant/houses are known.
 */
export function computeAllPlanets(utcDate: Date): Omit<PlanetPosition, "house">[] {
  return PLANET_KEYS.map((planet) => {
    const longitude = geocentricLongitude(planet, utcDate);
    return {
      planet,
      longitude,
      sign: signFromLongitude(longitude),
      degreeInSign: degreeInSign(longitude),
    };
  });
}
