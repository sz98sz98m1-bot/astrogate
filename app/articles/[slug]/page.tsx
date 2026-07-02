import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/content/articles/manifest";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = ARTICLES.find((article) => article.slug === slug);
  if (!meta) notFound();

  let Content;
  try {
    ({ default: Content } = await import(`@/content/articles/${slug}.mdx`));
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/articles" className="text-sm text-white/50 hover:text-gold">
        ← كل المقالات
      </Link>
      <article className="prose prose-invert mt-6 max-w-none glass-panel p-6 sm:p-8">
        <Content />
      </article>
    </div>
  );
}
