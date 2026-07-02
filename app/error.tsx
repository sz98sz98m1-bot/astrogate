"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <AlertTriangle className="h-10 w-10 text-rose-300" strokeWidth={1.5} />
      <h1 className="text-glow-gold mt-4 text-3xl font-black text-white sm:text-4xl">
        حدث خطأ غير متوقع
      </h1>
      <p className="mt-4 text-sm leading-7 text-white/60">
        عذرًا، اصطدمنا بكوكب لم نكن نتوقعه. حاول مرة أخرى، وإذا استمرت المشكلة راجعنا لاحقًا.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 flex items-center gap-2 rounded-full bg-gradient-to-l from-gold to-amber-400 px-6 py-3 font-bold text-space-950 shadow-lg shadow-gold/20 transition-transform hover:scale-105"
      >
        <RotateCcw className="h-4 w-4" /> أعد المحاولة
      </button>
    </div>
  );
}
