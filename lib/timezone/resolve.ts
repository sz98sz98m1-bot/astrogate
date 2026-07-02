import { DateTime } from "luxon";

/**
 * Converts a local birth date/time in a given IANA timezone to a precise UTC Date.
 * Using luxon with the IANA zone name (not a fixed UTC offset) is essential for historical
 * accuracy, since many countries have changed their DST rules repeatedly over the decades.
 */
export function localToUtc(date: string, time: string, timezone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const dt = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone: timezone },
  );

  if (!dt.isValid) {
    throw new Error(`تعذر تحويل التاريخ/الوقت: ${dt.invalidReason} - ${dt.invalidExplanation}`);
  }

  return dt.toJSDate();
}
