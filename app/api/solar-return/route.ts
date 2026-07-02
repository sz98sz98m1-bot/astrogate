import { NextResponse } from "next/server";
import { z } from "zod";
import { computeNatalChart } from "@/lib/astro/natal-chart";
import { computeSolarReturnChart } from "@/lib/astro/solar-return";

const birthInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  timezone: z.string().min(1),
  placeName: z.string().optional(),
});

const requestSchema = z.object({
  natalInput: birthInputSchema,
  year: z.number().int().min(1900).max(2200),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    timezone: z.string().min(1),
    placeName: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const { natalInput, year, location } = parsed.data;
    const natalChart = computeNatalChart(natalInput);
    const natalSun = natalChart.planets.find((p) => p.planet === "sun");
    if (!natalSun) throw new Error("تعذر إيجاد موقع الشمس في الخريطة الأصلية");

    const solarReturnChart = computeSolarReturnChart(natalSun.longitude, natalInput.date, year, location);
    return NextResponse.json({ natalChart, solarReturnChart });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "تعذر حساب العودة الشمسية" },
      { status: 400 },
    );
  }
}
