import Link from "next/link";
import { ZODIAC_NAMES_AR, ZODIAC_SYMBOLS } from "@/lib/astro/zodiac";
import type { ZodiacSignKey } from "@/types/chart";
import type { SignHoroscope } from "@/types/horoscope";

type Element = "fire" | "earth" | "air" | "water";

const SIGN_ELEMENT: Record<ZodiacSignKey, Element> = {
  aries: "fire",
  leo: "fire",
  sagittarius: "fire",
  taurus: "earth",
  virgo: "earth",
  capricorn: "earth",
  gemini: "air",
  libra: "air",
  aquarius: "air",
  cancer: "water",
  scorpio: "water",
  pisces: "water",
};

const ELEMENT_GLOW: Record<Element, string> = {
  fire: "rgba(248,113,113,0.18)",
  earth: "rgba(163,230,53,0.16)",
  air: "rgba(96,165,250,0.18)",
  water: "rgba(56,189,248,0.18)",
};

export default function SignCard({
  sign,
  horoscope,
  period,
}: {
  sign: ZodiacSignKey;
  horoscope: SignHoroscope | undefined;
  period: "daily" | "weekly";
}) {
  const element = SIGN_ELEMENT[sign];

  return (
    <Link href={`/horoscope/${sign}?period=${period}`} className="group block h-full">
      <div
        className="glass-panel-hover flex h-full flex-col p-5"
        style={{
          background: `linear-gradient(180deg, ${ELEMENT_GLOW[element]}, rgba(255,255,255,0.02))`,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{ZODIAC_SYMBOLS[sign]}</span>
          <h3 className="text-lg font-bold text-white group-hover:text-gold">
            {ZODIAC_NAMES_AR[sign]}
          </h3>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/60">
          {horoscope?.summary ?? "التوقع غير متوفر حاليًا، حاول لاحقًا."}
        </p>
      </div>
    </Link>
  );
}
