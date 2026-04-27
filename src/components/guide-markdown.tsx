"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Components } from "react-markdown";

type Props = { content: string };

const mdComponents: Partial<Components> = {
  h1: ({ children }) => (
    <h1 className="mt-10 scroll-mt-24 border-b border-zinc-800 pb-3 text-2xl font-semibold text-zinc-50 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 scroll-mt-24 text-xl font-semibold text-zinc-100">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 text-lg font-medium text-zinc-200">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4 leading-relaxed text-zinc-400">{children}</p>,
  ul: ({ children }) => (
    <ul className="mt-4 list-inside list-disc space-y-2 text-zinc-400">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-inside list-decimal space-y-2 text-zinc-400">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  hr: () => <hr className="my-10 border-zinc-800" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[32rem] text-left text-sm text-zinc-300">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-zinc-900/80 text-zinc-200">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-zinc-700 px-4 py-3 font-medium">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-zinc-800 px-4 py-3 text-zinc-400">{children}</td>,
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const inline = (props as { inline?: boolean }).inline;
    if (inline) {
      return (
        <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-cyan-200">{children}</code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  a: ({ href, children }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className="font-medium text-cyan-400 hover:underline" target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
  strong: ({ children }) => <strong className="font-semibold text-zinc-200">{children}</strong>,
};

export function GuideMarkdown({ content }: Props) {
  return (
    <article className="max-w-3xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
