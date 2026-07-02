import Link from "next/link";
import { CalendarClock, Orbit, RotateCcw, Sun } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const TOOLS = [
  {
    href: "/transit-chart",
    icon: Orbit,
    title: "خريطة العبور",
    description: "أين تقع الكواكب الحالية داخل بيوت خريطتك، والجوانب بينها وبين كواكبك الأصلية.",
  },
  {
    href: "/solar-return",
    icon: Sun,
    title: "العودة الشمسية",
    description: "خريطة لحظة عودة الشمس لموقعها الفلكي الأصلي كل عام — نظرة على العام القادم.",
  },
  {
    href: "/moon-calendar",
    icon: CalendarClock,
    title: "تقويم القمر",
    description: "أطوار القمر خلال الشهر، وأيام المحاق والبدر والتربيعين بدقة فلكية.",
  },
  {
    href: "/retrograde",
    icon: RotateCcw,
    title: "الكواكب الراجعة",
    description: "تتبّع حالة الرجوع الظاهري لكل كوكب، وأقرب موعد لتغيّر اتجاه حركته.",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        أدوات فلكية إضافية
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        أدوات متقدمة تكمّل الخريطة الفلكية وتوافق الأبراج، مستوحاة من أشهر منصات التنجيم العالمية.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="block h-full">
            <GlassCard className="h-full">
              <tool.icon className="h-8 w-8 text-gold" strokeWidth={1.5} />
              <h2 className="mt-3 text-xl font-bold text-white">{tool.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">{tool.description}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
