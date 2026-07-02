import { NextResponse } from "next/server";
import { z } from "zod";
import { computeNatalChart } from "@/lib/astro/natal-chart";
import { computeTransitOverlay } from "@/lib/astro/transit-chart";

const birthInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  timezone: z.string().min(1),
  placeName: z.string().optional(),
});

const requestSchema = z.object({ natalInput: birthInputSchema });

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
    const natalChart = computeNatalChart(parsed.data.natalInput);
    const overlay = computeTransitOverlay(natalChart);
    return NextResponse.json({ natalChart, overlay });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "تعذر حساب خريطة العبور" },
      { status: 400 },
    );
  }
}
