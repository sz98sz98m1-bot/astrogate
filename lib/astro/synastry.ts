import type { Aspect, AspectType, ChartData, PlanetKey } from "@/types/chart";
import { normalizeDegrees } from "./zodiac";

const ASPECT_DEFINITIONS: { type: AspectType; angle: number; orb: number }[] = [
  { type: "conjunction", angle: 0, orb: 8 },
  { type: "sextile", angle: 60, orb: 6 },
  { type: "square", angle: 90, orb: 8 },
  { type: "trine", angle: 120, orb: 8 },
  { type: "opposition", angle: 180, orb: 8 },
];

export function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));
  return diff > 180 ? 360 - diff : diff;
}

export interface AspectablePlanet {
  planet: PlanetKey;
  longitude: number;
}

/**
 * Pairwise aspect calculation between two planet sets. Shared by synastry (chart vs. chart)
 * and transit overlays (transiting planets vs. natal planets) so the aspect-matching logic
 * (and its orbs) only lives in one place.
 */
export function computeAspectsBetween(
  planetsA: AspectablePlanet[],
  planetsB: AspectablePlanet[],
): Aspect[] {
  const aspects: Aspect[] = [];

  for (const planetA of planetsA) {
    for (const planetB of planetsB) {
      const separation = angularSeparation(planetA.longitude, planetB.longitude);

      for (const definition of ASPECT_DEFINITIONS) {
        const orb = Math.abs(separation - definition.angle);
        if (orb <= definition.orb) {
          aspects.push({
            planetA: planetA.planet,
            planetB: planetB.planet,
            type: definition.type,
            orb,
          });
          break; // a planet pair only gets its closest-matching aspect
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb);
}

export function computeSynastryAspects(chartA: ChartData, chartB: ChartData): Aspect[] {
  return computeAspectsBetween(chartA.planets, chartB.planets);
}

export { ASPECT_DEFINITIONS };
