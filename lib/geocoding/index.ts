import { findFallbackCity, searchFallbackCities } from "./fallback-cities";
import { geocodeViaNominatim, type GeocodeResult } from "./nominatim";

/**
 * Resolves a free-text city query to coordinates + IANA timezone.
 * Tries the bundled offline city list first (instant, no network, reduces load on
 * Nominatim), falling back to a live Nominatim lookup on a cache miss.
 */
export async function resolveCity(query: string): Promise<GeocodeResult | null> {
  const fallback = findFallbackCity(query);
  if (fallback) {
    return {
      nameAr: fallback.nameAr,
      nameEn: fallback.nameEn,
      lat: fallback.lat,
      lon: fallback.lon,
      timezone: fallback.timezone,
    };
  }

  return geocodeViaNominatim(query);
}

/** Autocomplete suggestions -- offline-only for instant response as the user types. */
export function suggestCities(query: string) {
  return searchFallbackCities(query);
}
