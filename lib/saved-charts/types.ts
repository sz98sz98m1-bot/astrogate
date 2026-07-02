import type { CityValue } from "@/components/forms/CityAutocomplete";

export interface SavedChart {
  id: string;
  label: string;
  createdAtIso: string;
  draft: {
    date: string;
    time: string;
    city: CityValue;
  };
}
