import type { ChartData, TransitOverlay, TransitPlanetOverlay } from "@/types/chart";
import { computeCurrentTransits } from "./transits";
import { computeAspectsBetween } from "./synastry";

export function computeTransitOverlay(natalChart: ChartData, now: Date = new Date()): TransitOverlay {
  const transits = computeCurrentTransits(now);
  const houseBySign = new Map(natalChart.houses.map((h) => [h.sign, h.house]));

  const overlayTransits: TransitPlanetOverlay[] = transits.map((t) => ({
    planet: t.planet,
    longitude: t.longitude,
    sign: t.sign,
    retrograde: t.retrograde,
    natalHouse: houseBySign.get(t.sign) ?? 1,
  }));

  // planetA = transiting planet, planetB = natal planet (aspect direction matches TransitOverlay's documented convention).
  const aspects = computeAspectsBetween(transits, natalChart.planets);

  return {
    computedAtIso: now.toISOString(),
    transits: overlayTransits,
    aspects,
  };
}
