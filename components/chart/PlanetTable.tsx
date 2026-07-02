import type { ChartData } from "@/types/chart";
import { ZODIAC_NAMES_AR, ZODIAC_SYMBOLS } from "@/lib/astro/zodiac";
import { PLANET_NAMES_AR } from "@/lib/astro/labels";

function formatDegree(degreeInSign: number): string {
  const degrees = Math.floor(degreeInSign);
  const minutes = Math.round((degreeInSign - degrees) * 60);
  return `${degrees}°${minutes.toString().padStart(2, "0")}′`;
}

export default function PlanetTable({ chart }: { chart: ChartData }) {
  return (
    <div className="glass-panel overflow-hidden !rounded-2xl p-0">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/60">
          <tr>
            <th className="px-3 py-2.5 text-right font-medium">الكوكب</th>
            <th className="px-3 py-2.5 text-right font-medium">البرج</th>
            <th className="px-3 py-2.5 text-right font-medium">الدرجة</th>
            <th className="px-3 py-2.5 text-right font-medium">البيت</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-white/10 bg-gold/5">
            <td className="px-3 py-2.5 font-semibold text-gold">الطالع (ASC)</td>
            <td className="px-3 py-2.5 text-white/90">
              {ZODIAC_SYMBOLS[chart.ascendant.sign]} {ZODIAC_NAMES_AR[chart.ascendant.sign]}
            </td>
            <td className="px-3 py-2.5 text-white/90">
              {formatDegree(chart.ascendant.degreeInSign)}
            </td>
            <td className="px-3 py-2.5 text-white/90">—</td>
          </tr>
          {chart.planets.map((planet) => (
            <tr key={planet.planet} className="border-t border-white/10">
              <td className="px-3 py-2.5 text-white/90">{PLANET_NAMES_AR[planet.planet]}</td>
              <td className="px-3 py-2.5 text-white/90">
                {ZODIAC_SYMBOLS[planet.sign]} {ZODIAC_NAMES_AR[planet.sign]}
              </td>
              <td className="px-3 py-2.5 text-white/90">{formatDegree(planet.degreeInSign)}</td>
              <td className="px-3 py-2.5 text-white/90">{planet.house}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
