import Link from "next/link";
import { Sparkles } from "lucide-react";

const NAV_LINKS = [
  { href: "/natal-chart", label: "الخريطة الفلكية" },
  { href: "/synastry", label: "توافق الأبراج" },
  { href: "/horoscope", label: "الأبراج اليومية" },
  { href: "/tools", label: "أدوات إضافية" },
  { href: "/articles", label: "مقالات" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-space-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-gold" strokeWidth={1.5} />
          <span className="text-lg font-bold tracking-tight text-white">بوابة الفلك</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative py-1 transition-colors hover:text-white"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-purple-accent via-gold to-sky-accent transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
