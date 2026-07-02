import type { BirthDataDraft } from "@/components/forms/BirthDataForm";
import type { SavedChart } from "./types";

const STORAGE_KEY = "astrogate.savedCharts";
const CHANGE_EVENT = "astrogate:saved-charts-changed";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readRaw(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function listSavedCharts(): SavedChart[] {
  const raw = readRaw();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedChart[]) : [];
  } catch {
    return [];
  }
}

function persist(charts: SavedChart[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // localStorage unavailable (private browsing quota, etc.) -- saving is best-effort.
  }
}

export function saveChart(label: string, draft: BirthDataDraft): SavedChart | null {
  if (!draft.city) return null;

  const chart: SavedChart = {
    id: crypto.randomUUID(),
    label: label.trim() || "خريطة بدون اسم",
    createdAtIso: new Date().toISOString(),
    draft: { date: draft.date, time: draft.time, city: draft.city },
  };

  persist([...listSavedCharts(), chart]);
  return chart;
}

export function deleteSavedChart(id: string): void {
  persist(listSavedCharts().filter((c) => c.id !== id));
}

export function getSavedChart(id: string): SavedChart | null {
  return listSavedCharts().find((c) => c.id === id) ?? null;
}

/**
 * Notifies subscribers when saved charts change, whether from this tab (custom event,
 * dispatched by persist()) or another tab (native "storage" event). Paired with
 * useSavedCharts()'s useSyncExternalStore -- this is the React-idiomatic way to read a
 * browser-only external store without a synchronous setState-in-effect (which the
 * react-hooks/set-state-in-effect rule flags) or an SSR/hydration mismatch.
 */
export function subscribeSavedCharts(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

const EMPTY_SNAPSHOT: SavedChart[] = [];
let cachedRaw: string | null | undefined;
let cachedSnapshot: SavedChart[] = EMPTY_SNAPSHOT;

/** Stable-reference snapshot for useSyncExternalStore: only re-parses when the raw value actually changed. */
export function getSavedChartsSnapshot(): SavedChart[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  cachedSnapshot = listSavedCharts();
  return cachedSnapshot;
}

export function getSavedChartsServerSnapshot(): SavedChart[] {
  return EMPTY_SNAPSHOT;
}
