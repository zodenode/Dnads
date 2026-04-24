import Link from "next/link";
import { GuideMarkdown } from "@/components/guide-markdown";
import { readUserGuideMarkdown } from "@/lib/read-user-guide";

export const dynamic = "force-dynamic";

export default async function GuidePage() {
  let content: string;
  try {
    content = await readUserGuideMarkdown();
  } catch {
    content =
      "# Guide unavailable\n\nCould not read `USER_GUIDE.md` from the project root. Add that file or check deployment includes it.";
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium uppercase tracking-wider text-cyan-400/90">Documentation</p>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-zinc-400 hover:text-cyan-400">
            Home
          </Link>
          <Link href="/monitor" className="text-zinc-400 hover:text-cyan-400">
            Monitor
          </Link>
        </div>
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">User guide</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Source file: <code className="rounded bg-zinc-800 px-1.5 text-xs text-cyan-200">USER_GUIDE.md</code>{" "}
        at the repo root — edit that file to update this page.
      </p>
      <div className="mt-10">
        <GuideMarkdown content={content} />
      </div>
    </main>
  );
}
