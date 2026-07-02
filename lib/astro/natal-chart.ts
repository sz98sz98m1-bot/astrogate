import type { BirthInput, ChartData } from "@/types/chart";
import { localToUtc } from "@/lib/timezone/resolve";
import { computeAllPlanets } from "./planets";
import { computeAscendantAndMidheaven, describeLongitude } from "./ascendant";
import { assignHousesToPlanets, computeWholeSignHouses } from "./houses";

/**
 * Builds a full chart (planets + ascendant + houses) for a known UTC instant and location.
 * Shared by computeNatalChart (which first has to resolve local time -> UTC) and any
 * feature that already has the UTC instant in hand (e.g. solar return's root-finding),
 * so the localToUtc round-trip only happens where it's actually needed.
 */
export function computeChartAtUtc(utcDate: Date, lat: number, lon: number, input: BirthInput): ChartData {
  const { ascendantLongitude, midheavenLongitude } = computeAscendantAndMidheaven(
    utcDate,
    lat,
    lon,
  );

  const houses = computeWholeSignHouses(ascendantLongitude);
  const rawPlanets = computeAllPlanets(utcDate);
  const planets = assignHousesToPlanets(rawPlanets, houses);

  return {
    input,
    utcIso: utcDate.toISOString(),
    planets,
    ascendant: describeLongitude(ascendantLongitude),
    midheaven: describeLongitude(midheavenLongitude),
    houses,
    houseSystem: "whole-sign",
  };
}

export function computeNatalChart(input: BirthInput): ChartData {
  const utcDate = localToUtc(input.date, input.time, input.timezone);
  return computeChartAtUtc(utcDate, input.lat, input.lon, input);
}
