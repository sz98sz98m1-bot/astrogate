import type { CompatibilityResult } from "@/types/chart";

const CATEGORIES: { key: keyof CompatibilityResult; label: string; icon: string }[] = [
  { key: "emotional", label: "العاطفي", icon: "💞" },
  { key: "communication", label: "التواصل", icon: "💬" },
  { key: "passion", label: "الجاذبية", icon: "🔥" },
  { key: "overall", label: "التوافق العام", icon: "✦" },
];

export default function CompatibilityScore({ compatibility }: { compatibility: CompatibilityResult }) {
  return (
    <div className="glass-panel p-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {CATEGORIES.map(({ key, label, icon }) => {
          const { score } = compatibility[key];
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-white/80">
                  {icon} {label}
                </span>
                <span className="font-bold text-gold">{score}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-gold to-amber-400"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-center text-xs leading-6 text-white/40">
        هذا المؤشر تقدير مبسّط مبني على عدد الجوانب الفلكية القوية بين الخريطتين، وليس مقياسًا
        علميًا للتوافق — استخدمه للتأمل والفضول فقط.
      </p>
    </div>
  );
}
