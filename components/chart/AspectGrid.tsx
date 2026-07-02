import type { Aspect } from "@/types/chart";
import { ASPECT_COLORS, ASPECT_NAMES_AR, PLANET_NAMES_AR } from "@/lib/astro/labels";

export default function AspectGrid({ aspects }: { aspects: Aspect[] }) {
  if (aspects.length === 0) {
    return (
      <p className="text-center text-sm text-white/60">
        لم يتم العثور على جوانب فلكية قوية بين الخريطتين ضمن المسافة المسموحة.
      </p>
    );
  }

  return (
    <div className="glass-panel overflow-hidden !rounded-2xl p-0">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/60">
          <tr>
            <th className="px-3 py-2.5 text-right font-medium">كوكب الشخص الأول</th>
            <th className="px-3 py-2.5 text-right font-medium">الجانب</th>
            <th className="px-3 py-2.5 text-right font-medium">كوكب الشخص الثاني</th>
            <th className="px-3 py-2.5 text-right font-medium">الفارق</th>
          </tr>
        </thead>
        <tbody>
          {aspects.map((aspect, index) => (
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
  );
}
