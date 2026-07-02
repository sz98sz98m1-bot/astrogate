import Link from "next/link";
import { BookOpen, HeartHandshake, MoonStar, Orbit } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import HeroSceneLoader from "@/components/three/HeroSceneLoader";
import RevealSection from "@/components/effects/RevealSection";

const FEATURES = [
  {
    href: "/natal-chart",
    icon: Orbit,
    title: "الخريطة الفلكية",
    description: "أدخل تاريخ ووقت ومكان ميلادك واحصل على خريطتك الفلكية الكاملة.",
  },
  {
    href: "/synastry",
    icon: HeartHandshake,
    title: "توافق الأبراج",
    description: "قارن خريطتك الفلكية مع شخص آخر واكتشف مدى التوافق بينكما.",
  },
  {
    href: "/horoscope",
    icon: MoonStar,
    title: "الأبراج اليومية",
    description: "توقعات يومية وأسبوعية لكل الأبراج الـ12، محدَّثة يوميًا.",
  },
  {
    href: "/articles",
    icon: BookOpen,
    title: "مقالات تعليمية",
    description: "تعرّف على أساسيات علم التنجيم: البيوت، الكواكب، والأبراج.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="relative grid grid-cols-1 items-center gap-8 py-16 sm:py-24 lg:grid-cols-2">
        <div className="relative z-10 text-center lg:text-right">
          <p className="text-sm tracking-[0.3em] text-gold/80">✦ بوابة الفلك ✦</p>
          <h1 className="text-glow-gold mt-4 bg-gradient-to-l from-white via-white to-purple-accent bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-5xl lg:text-6xl">
            اكتشف خريطتك الكونية
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-white/70 lg:mx-0">
            احسب خريطتك الفلكية، واكتشف توافقك مع من حولك، وتابع أبراجك اليومية بتحليل مدعوم
            بالذكاء الاصطناعي — في تجربة فضائية غامرة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/natal-chart"
              className="rounded-full bg-gradient-to-l from-gold to-amber-400 px-6 py-3 font-bold text-space-950 shadow-lg shadow-gold/20 transition-transform hover:scale-105"
            >
              أنشئ خريطتك الفلكية
            </Link>
            <Link
              href="/articles"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-bold text-white backdrop-blur transition-colors hover:border-gold/50 hover:text-gold"
            >
              استكشف التنجيم
            </Link>
          </div>
        </div>

        <div className="relative h-72 sm:h-96 lg:h-[28rem]">
          <HeroSceneLoader />
        </div>
      </section>

      <RevealSection>
        <section className="grid grid-cols-1 gap-5 pb-24 sm:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <RevealSection key={feature.href} delay={index * 0.08}>
              <Link href={feature.href} className="block h-full">
                <GlassCard className="h-full">
                  <feature.icon className="h-8 w-8 text-gold" strokeWidth={1.5} />
                  <h2 className="mt-3 text-xl font-bold text-white">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">{feature.description}</p>
                </GlassCard>
              </Link>
            </RevealSection>
          ))}
        </section>
      </RevealSection>
    </div>
  );
}
