import type { AspectType, MoonPhaseName, PlanetKey } from "@/types/chart";

export const PLANET_NAMES_AR: Record<PlanetKey, string> = {
  sun: "الشمس",
  moon: "القمر",
  mercury: "عطارد",
  venus: "الزهرة",
  mars: "المريخ",
  jupiter: "المشتري",
  saturn: "زحل",
  uranus: "أورانوس",
  neptune: "نبتون",
  pluto: "بلوتو",
};

export const PLANET_SYMBOLS: Record<PlanetKey, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
};

export const ASPECT_NAMES_AR: Record<AspectType, string> = {
  conjunction: "تقارن",
  sextile: "تسديس",
  square: "تربيع",
  trine: "تثليث",
  opposition: "تقابل",
};

export const ASPECT_COLORS: Record<AspectType, string> = {
  conjunction: "text-gold",
  sextile: "text-emerald-300",
  square: "text-rose-300",
  trine: "text-sky-accent",
  opposition: "text-rose-300",
};

export const MOON_PHASE_NAMES_AR: Record<MoonPhaseName, string> = {
  new: "محاق",
  "waxing-crescent": "هلال متزايد",
  "first-quarter": "تربيع أول",
  "waxing-gibbous": "أحدب متزايد",
  full: "بدر",
  "waning-gibbous": "أحدب متناقص",
  "last-quarter": "تربيع أخير",
  "waning-crescent": "هلال متناقص",
};

export const MOON_PHASE_ICONS: Record<MoonPhaseName, string> = {
  new: "🌑",
  "waxing-crescent": "🌒",
  "first-quarter": "🌓",
  "waxing-gibbous": "🌔",
  full: "🌕",
  "waning-gibbous": "🌖",
  "last-quarter": "🌗",
  "waning-crescent": "🌘",
};
