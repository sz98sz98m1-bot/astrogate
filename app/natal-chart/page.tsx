"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import BirthDataForm, { type BirthDataDraft } from "@/components/forms/BirthDataForm";
import SavedChartsPicker from "@/components/saved-charts/SavedChartsPicker";
import ChartWheel from "@/components/chart/ChartWheel";
import PlanetTable from "@/components/chart/PlanetTable";
import type { ChartData } from "@/types/chart";

const emptyDraft: BirthDataDraft = { date: "", time: "", city: null };

export default function NatalChartPage() {
  const [draft, setDraft] = useState<BirthDataDraft>(emptyDraft);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = draft.date && draft.time && draft.city;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.city) return;

    setIsLoading(true);
    setError(null);
    setChart(null);

    try {
      const res = await fetch("/api/natal-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: draft.date,
          time: draft.time,
          lat: draft.city.lat,
          lon: draft.city.lon,
          timezone: draft.city.timezone,
          placeName: draft.city.label,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر حساب الخريطة الفلكية");
        return;
      }
      setChart(data as ChartData);
    } catch {
      setError("حدث خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        حاسبة الخريطة الفلكية
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        أدخل تاريخ ووقت ومكان ميلادك بدقة للحصول على مواقع الكواكب والطالع والبيوت الفلكية
        (نظام البيوت المستخدم: Whole Sign).
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <SavedChartsPicker idPrefix="natal" currentDraft={draft} onLoad={setDraft} />
        <BirthDataForm idPrefix="natal" value={draft} onChange={setDraft} />

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
              <Sparkles className="h-4 w-4" /> احسب خريطتي الفلكية
            </>
          )}
        </motion.button>

        {error && <p className="text-center text-sm text-rose-300">{error}</p>}
      </form>

      <AnimatePresence>
        {chart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-12 space-y-8"
          >
            <ChartWheel chart={chart} />
            <PlanetTable chart={chart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
