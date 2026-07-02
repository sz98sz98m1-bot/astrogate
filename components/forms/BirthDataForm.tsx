"use client";

import CityAutocomplete, { type CityValue } from "./CityAutocomplete";

export interface BirthDataDraft {
  date: string;
  time: string;
  city: CityValue | null;
}

interface BirthDataFormProps {
  idPrefix: string;
  title?: string;
  value: BirthDataDraft;
  onChange: (value: BirthDataDraft) => void;
}

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none backdrop-blur transition-colors focus:border-gold/60 focus:shadow-[0_0_0_3px_rgba(255,209,102,0.15)] [color-scheme:dark]";

export default function BirthDataForm({ idPrefix, title, value, onChange }: BirthDataFormProps) {
  return (
    <fieldset className="glass-panel p-6">
      {title && <legend className="px-1 text-lg font-bold text-white">{title}</legend>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-date`} className="mb-1.5 block text-sm text-white/70">
            تاريخ الميلاد
          </label>
          <input
            id={`${idPrefix}-date`}
            type="date"
            required
            value={value.date}
            onChange={(e) => onChange({ ...value, date: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-time`} className="mb-1.5 block text-sm text-white/70">
            وقت الميلاد (24 ساعة)
          </label>
          <input
            id={`${idPrefix}-time`}
            type="time"
            required
            value={value.time}
            onChange={(e) => onChange({ ...value, time: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
        <div className="sm:col-span-2">
          <CityAutocomplete
            id={`${idPrefix}-city`}
            label="مكان الميلاد"
            value={value.city}
            onChange={(city) => onChange({ ...value, city })}
          />
        </div>
      </div>
    </fieldset>
  );
}
