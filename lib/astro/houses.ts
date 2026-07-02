import type { HouseCusp, PlanetPosition, ZodiacSignKey } from "@/types/chart";
import { ZODIAC_SIGNS, normalizeDegrees, signFromLongitude } from "./zodiac";

/**
 * Whole Sign house system: house 1 = the Ascendant's entire sign, house 2 = the next
 * sign, and so on. This is the simplest and one of the oldest house systems, and avoids
 * the iterative/trigonometric cusp-solving that systems like Placidus require.
 */
export function computeWholeSignHouses(ascendantLongitude: number): HouseCusp[] {
  const ascendantSign = signFromLongitude(ascendantLongitude);
  const startIndex = ZODIAC_SIGNS.indexOf(ascendantSign);

  return Array.from({ length: 12 }, (_, i) => {
    const signIndex = (startIndex + i) % 12;
    const sign: ZodiacSignKey = ZODIAC_SIGNS[signIndex];
    return {
      house: i + 1,
      sign,
      longitude: normalizeDegrees(signIndex * 30),
    };
  });
}

/** Assigns a whole-sign house number (1-12) to each planet based on its zodiac sign. */
export function assignHousesToPlanets(
  planets: Omit<PlanetPosition, "house">[],
  houses: HouseCusp[],
): PlanetPosition[] {
  const houseBySign = new Map(houses.map((h) => [h.sign, h.house]));
  return planets.map((planet) => ({
    ...planet,
    house: houseBySign.get(planet.sign) ?? 1,
  }));
}
