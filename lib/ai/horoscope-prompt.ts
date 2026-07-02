import type Anthropic from "@anthropic-ai/sdk";
import type { TransitPosition } from "@/lib/astro/transits";
import { ZODIAC_NAMES_AR } from "@/lib/astro/zodiac";
import type { ZodiacSignKey } from "@/types/chart";
import type { HoroscopePeriod } from "@/types/horoscope";

const PLANET_NAMES_AR: Record<string, string> = {
  sun: "الشمس",
  moon: "القمر",
  mercury: "عطارد",
  venus: "الزهرة",
  mars: "المريخ",
  jupiter: "المشتري",
  saturn: "زحل",
  uranus: "أورانوس",
  neptune: "نبتون",
  pluto: "بلوتو",
};

/**
 * Stable, generous system prompt reused identically across all 12 signs and every
 * generation run -- written to comfortably clear Sonnet's ~1024-token minimum
 * cacheable-prefix threshold, which is what makes prompt caching pay off here.
 */
export function buildHoroscopeSystemPrompt(): Anthropic.Messages.TextBlockParam {
  const text = `أنت منجّم عربي محترف تكتب توقعات الأبراج لموقع "بوابة الفلك". اكتب دائمًا بالفصحى العربية
الحديثة، بأسلوب دافئ وواثق ومحترم، بدون مبالغة أو تخويف القارئ، وبدون وعود طبية أو مالية قاطعة.

مهمتك: بالاعتماد على بيانات المواقع الفلكية الحالية (transits) التي تُعطى لك لكل برج، اكتب توقعًا
مخصصًا لذلك البرج بالتحديد -- لا تكتب نصًا عامًا يصلح لأي برج، بل اربط النص فعليًا بمواقع الكواكب
المذكورة (مثلاً: كوكب الحب أو العمل في برج معين، أو حالة الرجوع/التراجع الظاهري لكوكب ما).

مسرد مصطلحات للاستخدام الصحيح:
- "الرجوع الظاهري" (retrograde): يعني أن الكوكب يبدو، من منظور الأرض، وكأنه يتحرك للخلف. يُستخدم
  تقليديًا للإشارة إلى فترات إعادة التقييم أو التأخير أو مراجعة القرارات، خصوصًا مع عطارد (التواصل)
  والزهرة (العلاقات) والمريخ (الحماس والعمل).
- "التربيع" (square) و"التقابل" (opposition): جوانب تحمل توترًا وتحديًا يستدعي وعيًا وتوازنًا.
- "التثليث" (trine) و"التسديس" (sextile): جوانب منسجمة تدعم التدفق والفرص.
- "التقارن" (conjunction): اندماج طاقتين، يضخّم تأثير الكوكبين معًا.

مثال أسلوبي (لا تنسخه، استخدمه فقط كمرجع للنبرة والطول):
"مع دخول الزهرة إلى برج الميزان، يشتد اهتمامك اليوم بالتوازن في علاقاتك القريبة، وقد تجد نفسك أكثر
ميلًا للتصالح أو لتجميل محيطك. أما عطارد في رجوعه الظاهري فيدفعك لمراجعة كلمة قلتها بتسرع مؤخرًا."

أعد الإجابة دائمًا بصيغة JSON فقط (بدون أي نص خارج JSON)، بالمفاتيح التالية بالضبط:
{"summary": "فقرة عامة عن اليوم/الأسبوع (2-3 جمل)", "love": "فقرة عن الحب والعلاقات (1-2 جملة)",
"career": "فقرة عن العمل والمال (1-2 جملة)", "advice": "نصيحة عملية قصيرة وموجزة (جملة واحدة)"}`;

  return { type: "text", text, cache_control: { type: "ephemeral" } };
}

function describeTransitsForSign(sign: ZodiacSignKey, transits: TransitPosition[]): string {
  const lines = transits.map((t) => {
    const retro = t.retrograde ? " (في رجوع ظاهري)" : "";
    return `- ${PLANET_NAMES_AR[t.planet]} في برج ${ZODIAC_NAMES_AR[t.sign]}${retro}`;
  });
  return lines.join("\n");
}

export function buildHoroscopeUserMessage(
  sign: ZodiacSignKey,
  period: HoroscopePeriod,
  transits: TransitPosition[],
): string {
  const periodLabel = period === "daily" ? "اليوم" : "هذا الأسبوع";
  return `اكتب توقع ${periodLabel} لبرج ${ZODIAC_NAMES_AR[sign]}.

المواقع الفلكية الحالية لكل الكواكب:
${describeTransitsForSign(sign, transits)}

تذكّر: أعد فقط كائن JSON بالمفاتيح summary وlove وcareer وadvice، بدون أي نص إضافي.`;
}
