"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Orbit } from "lucide-react";
import BirthDataForm, { type BirthDataDraft } from "@/components/forms/BirthDataForm";
import SavedChartsPicker from "@/components/saved-charts/SavedChartsPicker";
import TransitOverlayTable from "@/components/chart/TransitOverlayTable";
import type { TransitOverlay } from "@/types/chart";

const emptyDraft: BirthDataDraft = { date: "", time: "", city: null };

export default function TransitChartPage() {
  const [draft, setDraft] = useState<BirthDataDraft>(emptyDraft);
  const [overlay, setOverlay] = useState<TransitOverlay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = draft.date && draft.time && draft.city;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.city) return;

    setIsLoading(true);
    setError(null);
    setOverlay(null);

    try {
      const res = await fetch("/api/transit-chart", {
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
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر حساب خريطة العبور");
        return;
      }
      setOverlay(data.overlay as TransitOverlay);
    } catch {
      setError("حدث خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        خريطة العبور
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        شاهد أين تقع مواقع الكواكب الحالية داخل بيوت خريطتك الفلكية، والجوانب بينها وبين كواكبك
        الأصلية.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <SavedChartsPicker idPrefix="transit" currentDraft={draft} onLoad={setDraft} />
        <BirthDataForm idPrefix="transit" value={draft} onChange={setDraft} />

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
              <Orbit className="h-4 w-4" /> احسب خريطة العبور
            </>
          )}
        </motion.button>

        {error && <p className="text-center text-sm text-rose-300">{error}</p>}
      </form>

      <AnimatePresence>
        {overlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-12"
          >
            <TransitOverlayTable overlay={overlay} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
