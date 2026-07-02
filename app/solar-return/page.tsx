"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sun } from "lucide-react";
import BirthDataForm, { type BirthDataDraft } from "@/components/forms/BirthDataForm";
import CityAutocomplete, { type CityValue } from "@/components/forms/CityAutocomplete";
import SavedChartsPicker from "@/components/saved-charts/SavedChartsPicker";
import ChartWheel from "@/components/chart/ChartWheel";
import PlanetTable from "@/components/chart/PlanetTable";
import type { ChartData } from "@/types/chart";

const emptyDraft: BirthDataDraft = { date: "", time: "", city: null };
const currentYear = new Date().getFullYear();

export default function SolarReturnPage() {
  const [draft, setDraft] = useState<BirthDataDraft>(emptyDraft);
  const [returnLocation, setReturnLocation] = useState<CityValue | null>(null);
  const [year, setYear] = useState(currentYear);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = draft.date && draft.time && draft.city && (returnLocation || draft.city);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.city) return;
    const location = returnLocation ?? draft.city;

    setIsLoading(true);
    setError(null);
    setChart(null);

    try {
      const res = await fetch("/api/solar-return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          natalInput: {
            date: draft.date,
            time: draft.time,
            lat: draft.city.lat,
            lon: draft.city.lon,
            timezone: draft.city.timezone,
          },
          year,
          location: {
            lat: location.lat,
            lon: location.lon,
            timezone: location.timezone,
            placeName: location.label,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر حساب العودة الشمسية");
        return;
      }
      setChart(data.solarReturnChart as ChartData);
    } catch {
      setError("حدث خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        العودة الشمسية
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        خريطة اللحظة التي تعود فيها الشمس إلى موقعها الفلكي الأصلي كل عام — تُقرأ تقليديًا لمكان
        إقامتك الحالي وقت عيد ميلادك، لا مكان ميلادك.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <SavedChartsPicker idPrefix="solar-return" currentDraft={draft} onLoad={setDraft} />
        <BirthDataForm idPrefix="solar-return" title="بيانات الميلاد الأصلية" value={draft} onChange={setDraft} />

        <fieldset className="glass-panel p-6">
          <legend className="px-1 text-lg font-bold text-white">سنة العودة ومكان الإقامة</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="solar-return-year" className="mb-1.5 block text-sm text-white/70">
                السنة
              </label>
              <input
                id="solar-return-year"
                type="number"
                min={1900}
                max={2200}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none backdrop-blur transition-colors focus:border-gold/60 [color-scheme:dark]"
              />
            </div>
            <CityAutocomplete
              id="solar-return-location"
              label="مكان الإقامة الحالي (اختياري، الافتراضي مكان الميلاد)"
              value={returnLocation}
              onChange={setReturnLocation}
            />
          </div>
        </fieldset>

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
              <Sun className="h-4 w-4" /> احسب خريطة العودة الشمسية
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
