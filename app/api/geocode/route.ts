import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveCity, suggestCities } from "@/lib/geocoding";

const requestSchema = z.object({
  query: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "الرجاء إدخال اسم مدينة صحيح" }, { status: 400 });
  }

  const suggestions = suggestCities(parsed.data.query);
  const resolved = await resolveCity(parsed.data.query);

  return NextResponse.json({ resolved, suggestions });
}
