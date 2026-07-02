import { z } from "zod";
import type { ZodiacSignKey } from "@/types/chart";
import type { HoroscopePeriod, SignHoroscope } from "@/types/horoscope";
import type { TransitPosition } from "@/lib/astro/transits";
import { getClaudeClient, HOROSCOPE_MODEL } from "./claude-client";
import { buildHoroscopeSystemPrompt, buildHoroscopeUserMessage } from "./horoscope-prompt";

const horoscopeSchema = z.object({
  summary: z.string().min(1),
  love: z.string().min(1),
  career: z.string().min(1),
  advice: z.string().min(1),
});

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("لم يتم العثور على JSON في رد النموذج");
  return JSON.parse(text.slice(start, end + 1));
}

async function requestHoroscope(
  sign: ZodiacSignKey,
  period: HoroscopePeriod,
  transits: TransitPosition[],
): Promise<SignHoroscope> {
  const client = getClaudeClient();

  const response = await client.messages.create({
    model: HOROSCOPE_MODEL,
    max_tokens: 800,
    // This is a short, direct JSON-generation task -- extended thinking adds latency/cost
    // and (observed in production) can exhaust max_tokens on its own reasoning pass before
    // any visible text is produced, leaving the response with no usable text block at all.
    thinking: { type: "disabled" },
    system: [buildHoroscopeSystemPrompt()],
    messages: [{ role: "user", content: buildHoroscopeUserMessage(sign, period, transits) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(`رد النموذج لا يحتوي على نص (stop_reason: ${response.stop_reason})`);
  }

  const parsed = horoscopeSchema.parse(extractJson(textBlock.text));
  return { sign, ...parsed };
}

/** Calls requestHoroscope with one retry on failure (schema mismatch, transient API error). */
export async function generateHoroscopeForSign(
  sign: ZodiacSignKey,
  period: HoroscopePeriod,
  transits: TransitPosition[],
): Promise<SignHoroscope> {
  try {
    return await requestHoroscope(sign, period, transits);
  } catch (firstError) {
    try {
      return await requestHoroscope(sign, period, transits);
    } catch (secondError) {
      throw new Error(
        `فشل توليد توقع برج ${sign} بعد محاولتين: ${
          secondError instanceof Error ? secondError.message : String(secondError)
        } (الخطأ الأول: ${firstError instanceof Error ? firstError.message : String(firstError)})`,
      );
    }
  }
}
