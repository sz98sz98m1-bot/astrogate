"use client";

import { useEffect, useState } from "react";
import { PLANET_NAMES_AR } from "@/lib/astro/labels";
import type { RetrogradeStatus } from "@/types/chart";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
}

export default function RetrogradeTracker() {
  const [statuses, setStatuses] = useState<RetrogradeStatus[] | null>(null);

  useEffect(() => {
    fetch("/api/retrograde")
      .then((res) => res.json())
      .then((data) => setStatuses(data.statuses ?? []));
  }, []);

  if (!statuses) {
    return <p className="py-8 text-center text-sm text-white/40">جارٍ التحميل...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {statuses.map((status) => (
        <div key={status.planet} className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{PLANET_NAMES_AR[status.planet]}</h3>
            {status.retrograde ? (
              <span className="rounded-full bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300">
                رجوع ظاهري ℞
              </span>
            ) : (
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                حركة مباشرة
              </span>
            )}
          </div>
          {status.nextStationIso && (
            <p className="mt-3 text-sm text-white/60">
              {status.nextStationIsRetrograde ? "يبدأ الرجوع الظاهري في" : "ينتهي الرجوع الظاهري في"}{" "}
              <span className="text-white/90">{formatDate(status.nextStationIso)}</span>
            </p>
          )}
          {!status.nextStationIso && (
            <p className="mt-3 text-sm text-white/40">لا توجد نقطة تحوّل ضمن الأشهر القادمة.</p>
          )}
        </div>
      ))}
    </div>
  );
}
