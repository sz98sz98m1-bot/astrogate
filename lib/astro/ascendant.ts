import * as Astronomy from "astronomy-engine";
import { OBLIQUITY_DEG, degreeInSign, normalizeDegrees, signFromLongitude } from "./zodiac";

const DEG_PER_RAD = 180 / Math.PI;
const RAD_PER_DEG = Math.PI / 180;

export interface AscendantResult {
  ascendantLongitude: number;
  midheavenLongitude: number;
}

/**
 * Computes the Ascendant (rising sign cusp) and Midheaven (MC) ecliptic longitudes
 * using the standard closed-form spherical-trig formula, since astronomy-engine has
 * no built-in house/ascendant support.
 *
 * Reference: Local Sidereal Time -> RAMC -> Ascendant/MC via the obliquity of the ecliptic.
 *
 * The exact sign convention of the Ascendant formula was verified numerically against
 * astronomy-engine's own coordinate-rotation functions (Rotation_ECT_EQD + Rotation_EQD_HOR,
 * scanning the ecliptic for its eastern-horizon crossing) across multiple dates/latitudes
 * (northern/southern/equatorial) before locking in this formula -- a naive textbook
 * transcription of this formula is an easy, silent 180-degree (Ascendant/Descendant swap) bug.
 */
export function computeAscendantAndMidheaven(
  utcDate: Date,
  latitude: number,
  longitude: number,
): AscendantResult {
  // Greenwich Apparent Sidereal Time, in hours (0-24).
  const gastHours = Astronomy.SiderealTime(utcDate);

  // Local Sidereal Time in degrees: east longitude adds, west subtracts.
  const lstDegrees = normalizeDegrees(gastHours * 15 + longitude);

  const ramcRad = lstDegrees * RAD_PER_DEG;
  const latRad = latitude * RAD_PER_DEG;
  const oblRad = OBLIQUITY_DEG * RAD_PER_DEG;

  const ascRad = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad)),
  );
  const ascendantLongitude = normalizeDegrees(ascRad * DEG_PER_RAD);

  const mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(oblRad));
  const midheavenLongitude = normalizeDegrees(mcRad * DEG_PER_RAD);

  return { ascendantLongitude, midheavenLongitude };
}

export function describeLongitude(longitude: number) {
  return {
    longitude,
    sign: signFromLongitude(longitude),
    degreeInSign: degreeInSign(longitude),
  };
}
