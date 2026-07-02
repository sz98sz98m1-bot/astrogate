import type { ZodiacSignKey } from "./chart";

export interface SignHoroscope {
  sign: ZodiacSignKey;
  summary: string;
  love: string;
  career: string;
  advice: string;
}

export type HoroscopePeriod = "daily" | "weekly";

export interface HoroscopeBundle {
  period: HoroscopePeriod;
  generatedAtIso: string;
  /** The date (YYYY-MM-DD) or ISO week this bundle covers. */
  coverage: string;
  signs: Record<ZodiacSignKey, SignHoroscope>;
}
