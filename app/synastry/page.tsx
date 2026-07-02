"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeartHandshake, Loader2 } from "lucide-react";
import BirthDataForm, { type BirthDataDraft } from "@/components/forms/BirthDataForm";
import SavedChartsPicker from "@/components/saved-charts/SavedChartsPicker";
import AspectGrid from "@/components/chart/AspectGrid";
import CompatibilityScore from "@/components/chart/CompatibilityScore";
import type { Aspect, CompatibilityResult } from "@/types/chart";

const emptyDraft: BirthDataDraft = { date: "", time: "", city: null };

export default function SynastryPage() {
  const [draftA, setDraftA] = useState<BirthDataDraft>(emptyDraft);
  const [draftB, setDraftB] = useState<BirthDataDraft>(emptyDraft);
  const [aspects, setAspects] = useState<Aspect[] | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady =
    draftA.date && draftA.time && draftA.city && draftB.date && draftB.time && draftB.city;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draftA.city || !draftB.city) return;

    setIsLoading(true);
    setError(null);
    setAspects(null);
    setCompatibility(null);

    try {
      const res = await fetch("/api/synastry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personA: {
            date: draftA.date,
            time: draftA.time,
            lat: draftA.city.lat,
            lon: draftA.city.lon,
            timezone: draftA.city.timezone,
          },
          personB: {
            date: draftB.date,
            time: draftB.time,
            lat: draftB.city.lat,
            lon: draftB.city.lon,
            timezone: draftB.city.timezone,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر حساب التوافق");
        return;
      }
      setAspects(data.aspects as Aspect[]);
      setCompatibility(data.compatibility as CompatibilityResult);
    } catch {
      setError("حدث خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        توافق الأبراج
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        أدخل بيانات ميلاد الشخصين لمعرفة الجوانب الفلكية (Aspects) بين خريطتيهما.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <SavedChartsPicker idPrefix="synastry-a" currentDraft={draftA} onLoad={setDraftA} />
          <BirthDataForm idPrefix="synastry-a" title="الشخص الأول" value={draftA} onChange={setDraftA} />
        </div>
        <div>
          <SavedChartsPicker idPrefix="synastry-b" currentDraft={draftB} onLoad={setDraftB} />
          <BirthDataForm idPrefix="synastry-b" title="الشخص الثاني" value={draftB} onChange={setDraftB} />
        </div>

        <motion.button
          type="submit"
          disabled={!isReady || isLoading}
          whileHover={isReady && !isLoading ? { scale: 1.02 } : undefined}
          whileTap={isReady && !isLoading ? { scale: 0.98 } : undefined}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-amber-400 py-3 font-bold text-space-950 shadow-lg shadow-gold/20 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> جارٍ الحساب...
            </>
          ) : (
            <>
              <HeartHandshake className="h-4 w-4" /> احسب التوافق
            </>
          )}
        </motion.button>

        {error && <p className="text-center text-sm text-rose-300">{error}</p>}
      </form>

      <AnimatePresence>
        {aspects && compatibility && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-12 space-y-8"
          >
            <CompatibilityScore compatibility={compatibility} />
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">الجوانب الفلكية</h2>
              <AspectGrid aspects={aspects} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
