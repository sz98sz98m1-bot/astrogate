"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import citiesData from "@/content/data/cities-fallback.json";

export interface CityValue {
  label: string;
  lat: number;
  lon: number;
  timezone: string;
}

interface City {
  nameAr: string;
  nameEn: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

const CITIES = citiesData as City[];

function filterCities(query: string): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CITIES.filter(
    (c) => c.nameAr.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q),
  ).slice(0, 6);
}

interface CityAutocompleteProps {
  id: string;
  label: string;
  value: CityValue | null;
  onChange: (value: CityValue | null) => void;
}

export default function CityAutocomplete({ id, label, value, onChange }: CityAutocompleteProps) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectCity(city: City) {
    const label = `${city.nameAr} (${city.country})`;
    setQuery(label);
    setIsOpen(false);
    setError(null);
    onChange({ label, lat: city.lat, lon: city.lon, timezone: city.timezone });
  }

  async function resolveFreeText() {
    if (!query.trim() || value?.label === query) return;
    setIsResolving(true);
    setError(null);
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.resolved) {
        onChange({
          label: query,
          lat: data.resolved.lat,
          lon: data.resolved.lon,
          timezone: data.resolved.timezone,
        });
      } else {
        setError("تعذّر العثور على هذه المدينة، جرّب اسمًا آخر");
        onChange(null);
      }
    } catch {
      setError("حدث خطأ أثناء البحث عن الموقع");
      onChange(null);
    } finally {
      setIsResolving(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="mb-1.5 block text-sm text-white/70">
        {label}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          id={id}
          type="text"
          value={query}
          placeholder="اكتب اسم المدينة..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pe-9 ps-3 text-sm text-white outline-none backdrop-blur transition-colors focus:border-gold/60 focus:shadow-[0_0_0_3px_rgba(255,209,102,0.15)]"
          onChange={(e) => {
            setQuery(e.target.value);
            setSuggestions(filterCities(e.target.value));
            setIsOpen(true);
            if (value) onChange(null);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={resolveFreeText}
        />
      </div>
      {isResolving && <p className="mt-1 text-xs text-white/40">جارٍ تحديد الموقع...</p>}
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="glass-panel absolute z-10 mt-1.5 w-full overflow-hidden !rounded-xl p-1"
          >
            {suggestions.map((city) => (
              <li key={`${city.nameEn}-${city.lat}`}>
                <button
                  type="button"
                  className="block w-full rounded-lg px-3 py-2 text-right text-sm text-white/90 transition-colors hover:bg-gold/10"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectCity(city)}
                >
                  {city.nameAr} <span className="text-white/40">— {city.country}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
