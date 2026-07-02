import { NextResponse } from "next/server";
import { computeMonthMoonEvents, computeMoonPhase } from "@/lib/astro/moon-phase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const now = new Date();
  const year = Number(url.searchParams.get("year") ?? now.getUTCFullYear());
  const month = Number(url.searchParams.get("month") ?? now.getUTCMonth() + 1);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "سنة أو شهر غير صحيح" }, { status: 400 });
  }

  const events = computeMonthMoonEvents(year, month);
  const today = computeMoonPhase(now);

  return NextResponse.json({ events, today });
}
