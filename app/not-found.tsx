import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <Sparkles className="h-10 w-10 text-gold" strokeWidth={1.5} />
      <p className="mt-4 text-sm tracking-[0.3em] text-gold/70">404</p>
      <h1 className="text-glow-gold mt-2 text-3xl font-black text-white sm:text-4xl">
        هذه الصفحة تائهة بين النجوم
      </h1>
      <p className="mt-4 text-sm leading-7 text-white/60">
        الرابط الذي اتّبعته غير موجود، أو ربما انتقل إلى مجرّة أخرى.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-l from-gold to-amber-400 px-6 py-3 font-bold text-space-950 shadow-lg shadow-gold/20 transition-transform hover:scale-105"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}
