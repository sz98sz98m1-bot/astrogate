import type { Aspect, CompatibilityCategoryScore, CompatibilityResult, PlanetKey } from "@/types/chart";
import { ASPECT_DEFINITIONS } from "./synastry";

type CategoryKey = "emotional" | "communication" | "passion";

/** Unordered planet-pair membership per category -- both (A,B) and (B,A) orderings count. */
const CATEGORY_PAIRS: Record<CategoryKey, [PlanetKey, PlanetKey][]> = {
  emotional: [
    ["moon", "moon"],
    ["moon", "venus"],
    ["moon", "sun"],
    ["moon", "saturn"],
  ],
  communication: [
    ["mercury", "mercury"],
    ["mercury", "moon"],
    ["mercury", "venus"],
    ["mercury", "sun"],
  ],
  passion: [
    ["venus", "mars"],
    ["mars", "mars"],
    ["venus", "venus"],
    ["mars", "sun"],
  ],
};

/** Signed base points per aspect type -- trine/conjunction supportive, square/opposition tense. */
const ASPECT_POINTS: Record<Aspect["type"], number> = {
  conjunction: 10,
  trine: 10,
  sextile: 6,
  square: -6,
  opposition: -4,
};

const MAX_ORB_BY_TYPE = Object.fromEntries(
  ASPECT_DEFINITIONS.map((d) => [d.type, d.orb]),
) as Record<Aspect["type"], number>;

const BASELINE = 50;
const SCALE_FACTOR = 2.5;

function pairMatches(aspect: Aspect, pairs: [PlanetKey, PlanetKey][]): boolean {
  return pairs.some(
    ([x, y]) =>
      (aspect.planetA === x && aspect.planetB === y) ||
      (aspect.planetA === y && aspect.planetB === x),
  );
}

function scoreCategory(aspects: Aspect[], pairs: [PlanetKey, PlanetKey][]): CompatibilityCategoryScore {
  const contributingAspects = aspects.filter((a) => pairMatches(a, pairs));

  const rawScore = contributingAspects.reduce((sum, aspect) => {
    const maxOrb = MAX_ORB_BY_TYPE[aspect.type];
    const precision = 1 - aspect.orb / maxOrb;
    return sum + ASPECT_POINTS[aspect.type] * precision;
  }, 0);

  const score = Math.min(100, Math.max(0, Math.round(BASELINE + rawScore * SCALE_FACTOR)));

  return { score, contributingAspects };
}

/**
 * A transparent, illustrative point-based compatibility indicator derived purely from the
 * already-computed synastry aspects -- NOT a scientific measure. Callers must surface the
 * "illustrative only" disclaimer alongside these numbers (see CompatibilityScore component).
 */
export function computeCompatibilityScore(aspects: Aspect[]): CompatibilityResult {
  const emotional = scoreCategory(aspects, CATEGORY_PAIRS.emotional);
  const communication = scoreCategory(aspects, CATEGORY_PAIRS.communication);
  const passion = scoreCategory(aspects, CATEGORY_PAIRS.passion);

  const overallScore = Math.round((emotional.score + communication.score + passion.score) / 3);
  const overallAspects = [
    ...new Map(
      [...emotional.contributingAspects, ...communication.contributingAspects, ...passion.contributingAspects].map(
        (a) => [`${a.planetA}-${a.planetB}-${a.type}`, a],
      ),
    ).values(),
  ];

  return {
    emotional,
    communication,
    passion,
    overall: { score: overallScore, contributingAspects: overallAspects },
  };
}
