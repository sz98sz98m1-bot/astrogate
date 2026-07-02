import Link from "next/link";
import { ARTICLES } from "@/content/articles/manifest";
import GlassCard from "@/components/ui/GlassCard";

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-glow-gold text-center text-3xl font-black text-white sm:text-4xl">
        مقالات تعليمية
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/60">
        تعرّف على أساسيات علم التنجيم: الخريطة الفلكية، الأبراج، البيوت، الكواكب، والتوافق.
      </p>

      <div className="mt-10 space-y-4">
        {ARTICLES.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="group block">
            <GlassCard>
              <h2 className="text-lg font-bold text-white group-hover:text-gold">
                {article.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">{article.description}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
