import type { ZodiacSignKey } from "@/types/chart";

/** Mean obliquity of the ecliptic for the current epoch (degrees). Fixed constant is fine for MVP. */
export const OBLIQUITY_DEG = 23.4367;

export const ZODIAC_SIGNS: ZodiacSignKey[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export const ZODIAC_NAMES_AR: Record<ZodiacSignKey, string> = {
  aries: "الحمل",
  taurus: "الثور",
  gemini: "الجوزاء",
  cancer: "السرطان",
  leo: "الأسد",
  virgo: "العذراء",
  libra: "الميزان",
  scorpio: "العقرب",
  sagittarius: "القوس",
  capricorn: "الجدي",
  aquarius: "الدلو",
  pisces: "الحوت",
};

export const ZODIAC_SYMBOLS: Record<ZodiacSignKey, string> = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
};

/** Normalize any angle to the [0, 360) range. */
export function normalizeDegrees(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

/** Signed shortest angular delta a-b in (-180, 180], handling the 0/360 wraparound. */
export function signedDelta(a: number, b: number): number {
  return normalizeDegrees(a - b + 180) - 180;
}

/** Given a 0-360 tropical ecliptic longitude, return the zodiac sign. */
export function signFromLongitude(longitude: number): ZodiacSignKey {
  const normalized = normalizeDegrees(longitude);
  const index = Math.floor(normalized / 30);
  return ZODIAC_SIGNS[index] ?? "aries";
}

/** Given a 0-360 tropical ecliptic longitude, return the 0-30 degree within its sign. */
export function degreeInSign(longitude: number): number {
  const normalized = normalizeDegrees(longitude);
  return normalized % 30;
}
