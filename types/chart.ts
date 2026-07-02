export type ZodiacSignKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type PlanetKey =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export interface PlanetPosition {
  planet: PlanetKey;
  longitude: number; // 0-360 tropical ecliptic longitude
  sign: ZodiacSignKey;
  degreeInSign: number; // 0-30
  house: number; // 1-12, whole sign house
}

export interface BirthInput {
  /** ISO date string, e.g. "1998-04-12" */
  date: string;
  /** 24h local time, e.g. "14:30" */
  time: string;
  lat: number;
  lon: number;
  /** IANA timezone name, e.g. "Africa/Cairo" */
  timezone: string;
  placeName?: string;
}

export interface HouseCusp {
  house: number; // 1-12
  sign: ZodiacSignKey;
  longitude: number; // cusp start longitude 0-360
}

export interface ChartData {
  input: BirthInput;
  utcIso: string;
  planets: PlanetPosition[];
  ascendant: { longitude: number; sign: ZodiacSignKey; degreeInSign: number };
  midheaven: { longitude: number; sign: ZodiacSignKey; degreeInSign: number };
  houses: HouseCusp[];
  houseSystem: "whole-sign";
}

export type AspectType =
  | "conjunction"
  | "sextile"
  | "square"
  | "trine"
  | "opposition";

export interface Aspect {
  planetA: PlanetKey;
  planetB: PlanetKey;
  type: AspectType;
  orb: number; // degrees away from exact
}

export interface SynastryResult {
  chartA: ChartData;
  chartB: ChartData;
  aspects: Aspect[];
  compatibility: CompatibilityResult;
}

/** The 8 non-luminary planets tracked for retrograde status (excludes sun/moon, which never appear retrograde). */
export type RetrogradePlanetKey = Exclude<PlanetKey, "sun" | "moon">;

export interface RetrogradeStatus {
  planet: RetrogradePlanetKey;
  retrograde: boolean;
  /** ISO instant of the next station (direction change) within the lookahead window, or null if none found. */
  nextStationIso: string | null;
  /** Whether the next station transitions into retrograde motion (null if no station found). */
  nextStationIsRetrograde: boolean | null;
}

export type MoonPhaseName =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export interface MoonPhaseInfo {
  dateIso: string;
  phaseAngle: number; // 0-360
  phaseName: MoonPhaseName;
  illumination: number; // 0-1
}

export interface MoonEvent {
  dateIso: string;
  quarter: 0 | 1 | 2 | 3; // 0=new, 1=first quarter, 2=full, 3=last quarter
}

export interface CompatibilityCategoryScore {
  score: number; // 0-100
  contributingAspects: Aspect[];
}

export interface CompatibilityResult {
  emotional: CompatibilityCategoryScore;
  communication: CompatibilityCategoryScore;
  passion: CompatibilityCategoryScore;
  overall: CompatibilityCategoryScore;
}

export interface TransitPlanetOverlay {
  planet: PlanetKey;
  longitude: number;
  sign: ZodiacSignKey;
  retrograde: boolean;
  /** Which of the natal chart's whole-sign houses this transiting planet currently falls in. */
  natalHouse: number;
}

export interface TransitOverlay {
  computedAtIso: string;
  transits: TransitPlanetOverlay[];
  /** planetA = transiting planet, planetB = natal planet. */
  aspects: Aspect[];
}
