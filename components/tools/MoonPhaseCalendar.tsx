"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MOON_PHASE_ICONS, MOON_PHASE_NAMES_AR } from "@/lib/astro/labels";
import type { MoonEvent, MoonPhaseInfo } from "@/types/chart";

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const QUARTER_ICON: Record<0 | 1 | 2 | 3, string> = {
  0: "🌑",
  1: "🌓",
  2: "🌕",
  3: "🌗",
};

const QUARTER_LABEL: Record<0 | 1 | 2 | 3, string> = {
  0: "محاق",
  1: "تربيع أول",
  2: "بدر",
  3: "تربيع أخير",
};

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Keyed by `${year}-${month}` from the parent so switching months remounts a fresh
 * instance -- isLoading naturally starts true again via its initial state, and every
 * setState call below lives inside a fetch callback, avoiding a synchronous
 * setState-in-effect (which the react-hooks/set-state-in-effect rule flags).
 */
function MonthGrid({ year, month }: { year: number; month: number }) {
  const now = new Date();
  const [events, setEvents] = useState<MoonEvent[]>([]);
  const [today, setToday] = useState<MoonPhaseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/moon-phase?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setEvents(data.events ?? []);
        setToday(data.today ?? null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const eventByDay = new Map(events.map((e) => [new Date(e.dateIso).getUTCDate(), e.quarter]));
  const isCurrentMonth = year === now.getUTCFullYear() && month === now.getUTCMonth() + 1;

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-white/40">جارٍ التحميل...</p>;
  }

  return (
    <>
      {today && (
        <div className="mb-6 flex flex-col items-center gap-1 border-b border-white/10 pb-6 text-center">
          <span className="text-5xl">{MOON_PHASE_ICONS[today.phaseName]}</span>
          <p className="mt-2 text-lg font-bold text-white">{MOON_PHASE_NAMES_AR[today.phaseName]}</p>
          <p className="text-sm text-white/50">إضاءة القمر اليوم: {Math.round(today.illumination * 100)}%</p>
        </div>
      )}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1).map((day) => {
          const quarter = eventByDay.get(day);
          const isToday = isCurrentMonth && day === now.getUTCDate();
          return (
            <div
              key={day}
              title={quarter !== undefined ? QUARTER_LABEL[quarter] : undefined}
              className={`flex flex-col items-center gap-0.5 rounded-lg py-2 ${
                isToday ? "border border-gold/50 bg-gold/10" : "bg-white/5"
              }`}
            >
              <span className="text-white/70">{day}</span>
              {quarter !== undefined && <span>{QUARTER_ICON[quarter]}</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function MoonPhaseCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth() + 1);

  function changeMonth(delta: number) {
    const total = month - 1 + delta;
    const newYear = year + Math.floor(total / 12);
    const newMonth = ((total % 12) + 12) % 12;
    setYear(newYear);
    setMonth(newMonth + 1);
  }

  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:text-gold"
          aria-label="الشهر السابق"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <p className="font-bold text-white">
          {ARABIC_MONTHS[month - 1]} {year}
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:text-gold"
          aria-label="الشهر التالي"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <MonthGrid key={`${year}-${month}`} year={year} month={month} />
    </div>
  );
}
