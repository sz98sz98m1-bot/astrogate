import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/** Lazily-created singleton so the app can still boot without ANTHROPIC_API_KEY set. */
export function getClaudeClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY غير مضبوط. أضِفه في .env.local لتفعيل توليد الأبراج بالذكاء الاصطناعي.",
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const HOROSCOPE_MODEL = "claude-sonnet-5";
