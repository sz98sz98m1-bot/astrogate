import citiesData from "@/content/data/cities-fallback.json";

export interface FallbackCity {
  nameAr: string;
  nameEn: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

const CITIES = citiesData as FallbackCity[];

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

/** Exact or substring match against the bundled offline city list. */
export function findFallbackCity(query: string): FallbackCity | null {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;

  const exact = CITIES.find(
    (city) =>
      normalize(city.nameAr) === normalizedQuery || normalize(city.nameEn) === normalizedQuery,
  );
  if (exact) return exact;

  const partial = CITIES.find(
    (city) =>
      normalize(city.nameAr).includes(normalizedQuery) ||
      normalize(city.nameEn).includes(normalizedQuery),
  );
  return partial ?? null;
}

export function searchFallbackCities(query: string, limit = 8): FallbackCity[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  return CITIES.filter(
    (city) =>
      normalize(city.nameAr).includes(normalizedQuery) ||
      normalize(city.nameEn).includes(normalizedQuery),
  ).slice(0, limit);
}
