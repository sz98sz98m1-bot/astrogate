import Link from "next/link";
import SignCard from "@/components/horoscope/SignCard";
import { ZODIAC_SIGNS } from "@/lib/astro/zodiac";
import { loadHoroscopeBundle } from "@/lib/horoscope/load";
import type { HoroscopePeriod } from "@/types/horoscope";

export default async function HoroscopePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period: HoroscopePeriod = periodParam === "weekly" ? "weekly" : "daily";
  const { bundle, isStale } = await loadHoroscopeBundle(period);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        الأبراج اليومية
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        توقعات مولَّدة بالذكاء الاصطناعي بناءً على المواقع الفلكية الحالية للكواكب.
      </p>

      <div className="mt-6 flex justify-center gap-2">
        <Link
          href="/horoscope?period=daily"
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${period === "daily" ? "bg-gradient-to-l from-gold to-amber-400 text-space-950 font-semibold" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
        >
          يومي
        </Link>
        <Link
          href="/horoscope?period=weekly"
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${period === "weekly" ? "bg-gradient-to-l from-gold to-amber-400 text-space-950 font-semibold" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
        >
          أسبوعي
        </Link>
      </div>

      {!bundle && (
        <p className="mt-8 text-center text-sm text-gold/80">
          لم يتم توليد الأبراج بعد. شغّل <code dir="ltr">npm run refresh-horoscopes</code> لأول مرة.
        </p>
      )}
      {bundle && isStale && (
        <p className="mt-8 text-center text-xs text-gold/60">
          آخر تحديث: {new Date(bundle.generatedAtIso).toLocaleString("ar-EG")} (قد يكون التحديث
          التالي متأخرًا)
        </p>
      )}
      {bundle && !isStale && (
        <p className="mt-8 text-center text-xs text-white/40">
          آخر تحديث: {new Date(bundle.generatedAtIso).toLocaleString("ar-EG")}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ZODIAC_SIGNS.map((sign) => (
          <SignCard key={sign} sign={sign} horoscope={bundle?.signs[sign]} period={period} />
        ))}
      </div>
    </div>
  );
}
