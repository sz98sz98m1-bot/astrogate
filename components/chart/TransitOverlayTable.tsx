import type { TransitOverlay } from "@/types/chart";
import { ZODIAC_NAMES_AR, ZODIAC_SYMBOLS } from "@/lib/astro/zodiac";
import { ASPECT_COLORS, ASPECT_NAMES_AR, PLANET_NAMES_AR } from "@/lib/astro/labels";

export default function TransitOverlayTable({ overlay }: { overlay: TransitOverlay }) {
  return (
    <div className="space-y-6">
      <div className="glass-panel overflow-hidden !rounded-2xl p-0">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-3 py-2.5 text-right font-medium">الكوكب العابر</th>
              <th className="px-3 py-2.5 text-right font-medium">البرج الحالي</th>
              <th className="px-3 py-2.5 text-right font-medium">البيت الأصلي المتأثر</th>
              <th className="px-3 py-2.5 text-right font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {overlay.transits.map((t) => (
              <tr key={t.planet} className="border-t border-white/10">
                <td className="px-3 py-2.5 text-white/90">{PLANET_NAMES_AR[t.planet]}</td>
                <td className="px-3 py-2.5 text-white/90">
                  {ZODIAC_SYMBOLS[t.sign]} {ZODIAC_NAMES_AR[t.sign]}
                </td>
                <td className="px-3 py-2.5 text-white/90">البيت {t.natalHouse}</td>
                <td className="px-3 py-2.5">
                  {t.retrograde ? (
                    <span className="text-rose-300">رجوع ظاهري ℞</span>
                  ) : (
                    <span className="text-white/40">مباشر</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {overlay.aspects.length > 0 && (
        <div className="glass-panel overflow-hidden !rounded-2xl p-0">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-3 py-2.5 text-right font-medium">الكوكب العابر</th>
                <th className="px-3 py-2.5 text-right font-medium">الجانب</th>
                <th className="px-3 py-2.5 text-right font-medium">الكوكب الأصلي</th>
                <th className="px-3 py-2.5 text-right font-medium">الفارق</th>
              </tr>
            </thead>
            <tbody>
              {overlay.aspects.map((aspect, index) => (
                <tr key={index} className="border-t border-white/10">
                  <td className="px-3 py-2.5 text-white/90">{PLANET_NAMES_AR[aspect.planetA]}</td>
                  <td className={`px-3 py-2.5 font-semibold ${ASPECT_COLORS[aspect.type]}`}>
                    {ASPECT_NAMES_AR[aspect.type]}
                  </td>
                  <td className="px-3 py-2.5 text-white/90">{PLANET_NAMES_AR[aspect.planetB]}</td>
                  <td className="px-3 py-2.5 text-white/50">{aspect.orb.toFixed(1)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
