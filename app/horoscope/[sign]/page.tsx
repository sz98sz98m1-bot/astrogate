import Link from "next/link";
import { notFound } from "next/navigation";
import { ZODIAC_NAMES_AR, ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "@/lib/astro/zodiac";
import { loadHoroscopeBundle } from "@/lib/horoscope/load";
import GlassCard from "@/components/ui/GlassCard";
import type { ZodiacSignKey } from "@/types/chart";
import type { HoroscopePeriod } from "@/types/horoscope";

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((sign) => ({ sign }));
}

export default async function SignHoroscopePage({
  params,
  searchParams,
}: {
  params: Promise<{ sign: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { sign } = await params;
  const { period: periodParam } = await searchParams;

  if (!ZODIAC_SIGNS.includes(sign as ZodiacSignKey)) {
    notFound();
  }
  const signKey = sign as ZodiacSignKey;
  const period: HoroscopePeriod = periodParam === "weekly" ? "weekly" : "daily";
  const { bundle } = loadHoroscopeBundle(period);
  const horoscope = bundle?.signs[signKey];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/horoscope" className="text-sm text-white/50 hover:text-gold">
        ← كل الأبراج
      </Link>

      <div className="mt-4 text-center">
        <span className="text-5xl">{ZODIAC_SYMBOLS[signKey]}</span>
        <h1 className="text-glow-gold mt-2 text-3xl font-black text-white sm:text-4xl">
          {ZODIAC_NAMES_AR[signKey]}
        </h1>
        <p className="mt-1 text-sm text-white/40">
          توقع {period === "daily" ? "اليوم" : "هذا الأسبوع"}
        </p>
      </div>

      {!horoscope && (
        <p className="mt-8 text-center text-sm text-gold/80">التوقع غير متوفر حاليًا لهذا البرج.</p>
      )}

      {horoscope && (
        <div className="mt-8 space-y-6">
          <GlassCard hover={false}>
            <p className="leading-8 text-white/90">{horoscope.summary}</p>
          </GlassCard>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <GlassCard hover={false}>
              <h2 className="font-bold text-gold">💞 الحب والعلاقات</h2>
              <p className="mt-2 text-sm leading-7 text-white/80">{horoscope.love}</p>
            </GlassCard>
            <GlassCard hover={false}>
              <h2 className="font-bold text-gold">💼 العمل والمال</h2>
              <p className="mt-2 text-sm leading-7 text-white/80">{horoscope.career}</p>
            </GlassCard>
          </section>
          <div className="glass-panel border-gold/30 bg-gold/5 p-6">
            <h2 className="font-bold text-gold">✦ نصيحة اليوم</h2>
            <p className="mt-2 text-sm leading-7 text-white/80">{horoscope.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
