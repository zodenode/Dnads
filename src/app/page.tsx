"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LOADING_STEPS = [
  "Analyzing competitors…",
  "Extracting ad patterns…",
  "Generating campaigns…",
] as const;

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [metaCountries, setMetaCountries] = useState("US");
  const [maxCompetitors, setMaxCompetitors] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 4000);
    return () => clearInterval(id);
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to continue.");
      return;
    }
    setLoading(true);
    setStepIndex(0);
    const countries = metaCountries
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: trimmed,
          ...(countries.length ? { meta_countries: countries } : {}),
          max_competitors: Math.min(20, Math.max(1, maxCompetitors)),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }
      sessionStorage.setItem("growth_pack_result", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setStepIndex(0);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-600 border-t-cyan-400" />
        <p className="mt-8 text-center text-lg text-zinc-200">
          {LOADING_STEPS[stepIndex]}
        </p>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Pulling Meta / TikTok / Google transparency when API keys are set; otherwise synthetic fill
          backs pattern coverage.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16 sm:py-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-cyan-400/90">
            URL → Growth Intelligence
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Competitor-driven campaign intelligence
          </h1>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Link
            href="/guide"
            className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-center text-sm font-medium text-zinc-200 hover:border-cyan-500/40 hover:text-cyan-300"
          >
            User guide
          </Link>
          <Link
            href="/monitor"
            className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-center text-sm font-medium text-zinc-200 hover:border-cyan-500/40 hover:text-cyan-300"
          >
            Monitor jobs
          </Link>
        </div>
      </div>

      <p className="mt-4 text-zinc-400">
        Paste a URL. We infer competitors, map each to Meta / TikTok / Google query shapes, pull public
        library rows where configured, aggregate patterns, then generate a full growth pack.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <label className="block text-sm font-medium text-zinc-300">
          Website URL
          <input
            type="url"
            name="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100 outline-none ring-cyan-500/40 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-2"
          />
        </label>

        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-sm text-cyan-400/90 hover:text-cyan-300"
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? "Hide advanced options" : "Advanced options (Meta region & competitor depth)"}
        </button>

        {showAdvanced && (
          <div className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 sm:grid-cols-2">
            <label className="block text-sm text-zinc-300">
              Meta countries (ISO, comma-separated)
              <input
                value={metaCountries}
                onChange={(e) => setMetaCountries(e.target.value)}
                placeholder="US,GB"
                className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100"
              />
            </label>
            <label className="block text-sm text-zinc-300">
              Max competitors per library pass (1–20)
              <input
                type="number"
                min={1}
                max={20}
                value={maxCompetitors}
                onChange={(e) => setMaxCompetitors(Number(e.target.value) || 10)}
                className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-500 px-4 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
        >
          Generate Growth Pack
        </button>
      </form>

      <section className="mt-14 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
        <h2 className="text-sm font-semibold text-zinc-200">How it works</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-zinc-500">
          <li>Infer business + competitor set from your URL.</li>
          <li>Map each competitor to library search hints (Meta / TikTok / Google).</li>
          <li>Fetch and merge ads → pattern report → new campaign pack.</li>
        </ol>
        <p className="mt-4 text-xs text-zinc-600">
          Full walkthrough, env vars, API routes, and monitoring: see the{" "}
          <Link href="/guide" className="text-cyan-500 hover:underline">
            user guide
          </Link>{" "}
          (<code className="text-zinc-500">USER_GUIDE.md</code>).
        </p>
      </section>
    </main>
  );
}
