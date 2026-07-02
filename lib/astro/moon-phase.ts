import * as Astronomy from "astronomy-engine";
import type { MoonEvent, MoonPhaseInfo, MoonPhaseName } from "@/types/chart";
import { normalizeDegrees } from "./zodiac";

const QUARTER_TOLERANCE_DEG = 5;

function phaseNameFromAngle(angle: number): MoonPhaseName {
  const a = normalizeDegrees(angle);
  const near = (target: number) => Math.abs(normalizeDegrees(a - target + 180) - 180) <= QUARTER_TOLERANCE_DEG;

  if (near(0)) return "new";
  if (near(90)) return "first-quarter";
  if (near(180)) return "full";
  if (near(270)) return "last-quarter";
  if (a > 0 && a < 90) return "waxing-crescent";
  if (a > 90 && a < 180) return "waxing-gibbous";
  if (a > 180 && a < 270) return "waning-gibbous";
  return "waning-crescent";
}

export function computeMoonPhase(date: Date): MoonPhaseInfo {
  const phaseAngle = Astronomy.MoonPhase(date);
  const { phase_fraction: illumination } = Astronomy.Illumination(Astronomy.Body.Moon, date);

  return {
    dateIso: date.toISOString(),
    phaseAngle,
    phaseName: phaseNameFromAngle(phaseAngle),
    illumination,
  };
}

/** Exact new/first-quarter/full/last-quarter instants falling within [monthStart, monthEnd). */
export function computeMonthMoonEvents(year: number, month: number): MoonEvent[] {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const nextMonthStart = new Date(Date.UTC(year, month, 1));

  const events: MoonEvent[] = [];
  // Search from a few days before the month starts, since a quarter phase could be
  // "in progress" from SearchMoonQuarter's perspective right at the boundary.
  let quarter = Astronomy.SearchMoonQuarter(new Date(monthStart.getTime() - 3 * 86400000));

  while (quarter.time.date < nextMonthStart) {
    if (quarter.time.date >= monthStart) {
      events.push({
        dateIso: quarter.time.date.toISOString(),
        quarter: quarter.quarter as 0 | 1 | 2 | 3,
      });
    }
    quarter = Astronomy.NextMoonQuarter(quarter);
  }

  return events;
}
