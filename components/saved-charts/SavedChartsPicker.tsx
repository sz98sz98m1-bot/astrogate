"use client";

import { useState, useSyncExternalStore } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import type { BirthDataDraft } from "@/components/forms/BirthDataForm";
import {
  deleteSavedChart,
  getSavedChartsServerSnapshot,
  getSavedChartsSnapshot,
  saveChart,
  subscribeSavedCharts,
} from "@/lib/saved-charts/storage";

interface SavedChartsPickerProps {
  idPrefix: string;
  currentDraft: BirthDataDraft;
  onLoad: (draft: BirthDataDraft) => void;
}

export default function SavedChartsPicker({ idPrefix, currentDraft, onLoad }: SavedChartsPickerProps) {
  // useSyncExternalStore reads the browser-only localStorage store without a hydration
  // mismatch (getServerSnapshot returns a stable empty array) and without a synchronous
  // setState-in-effect, since persist() dispatches a change event this subscribes to.
  const charts = useSyncExternalStore(
    subscribeSavedCharts,
    getSavedChartsSnapshot,
    getSavedChartsServerSnapshot,
  );
  const [label, setLabel] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const canSave = Boolean(currentDraft.date && currentDraft.time && currentDraft.city);

  function handleSave() {
    const saved = saveChart(label, currentDraft);
    if (saved) setLabel("");
  }

  function handleDelete(id: string) {
    deleteSavedChart(id);
  }

  return (
    <div className="mb-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        {charts.length > 0 && (
          <select
            id={`${idPrefix}-saved-select`}
            defaultValue=""
            onChange={(e) => {
              const chart = charts.find((c) => c.id === e.target.value);
              if (chart) onLoad(chart.draft);
              e.target.value = "";
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 outline-none focus:border-gold/60"
          >
            <option value="" disabled>
              تحميل خريطة محفوظة...
            </option>
            {charts.map((chart) => (
              <option key={chart.id} value={chart.id} className="bg-space-900">
                {chart.label}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
        >
          <Bookmark className="h-3.5 w-3.5" /> حفظ هذه الخريطة
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="اسم الخريطة (مثلاً: أنا)"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white outline-none focus:border-gold/60"
          />
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="rounded-lg bg-gold/90 px-3 py-1.5 font-semibold text-space-950 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            حفظ
          </button>
        </div>
      )}

      {charts.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {charts.map((chart) => (
            <li
              key={chart.id}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60"
            >
              {chart.label}
              <button
                type="button"
                onClick={() => handleDelete(chart.id)}
                aria-label={`حذف ${chart.label}`}
                className="text-white/30 hover:text-rose-300"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
