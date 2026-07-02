import { NextResponse } from "next/server";
import { z } from "zod";
import { computeNatalChart } from "@/lib/astro/natal-chart";
import { computeSynastryAspects } from "@/lib/astro/synastry";
import { computeCompatibilityScore } from "@/lib/astro/compatibility";

const birthInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  timezone: z.string().min(1),
  placeName: z.string().optional(),
});

const requestSchema = z.object({
  personA: birthInputSchema,
  personB: birthInputSchema,
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات الميلاد غير صحيحة", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const chartA = computeNatalChart(parsed.data.personA);
    const chartB = computeNatalChart(parsed.data.personB);
    const aspects = computeSynastryAspects(chartA, chartB);
    const compatibility = computeCompatibilityScore(aspects);
    return NextResponse.json({ chartA, chartB, aspects, compatibility });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "تعذر حساب التوافق" },
      { status: 400 },
    );
  }
}
