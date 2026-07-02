import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: ({ children }) => <h1 className="mb-4 mt-8 text-3xl font-bold text-gold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-3 mt-8 text-2xl font-bold text-gold">{children}</h2>,
  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold text-white">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4 leading-8 text-white/85">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-4 list-inside list-disc space-y-2 text-white/85">{children}</ul>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-sky-accent underline hover:text-gold">
      {children}
    </a>
  ),
};

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return { ...inherited, ...components };
}
