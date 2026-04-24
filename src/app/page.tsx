"use client";

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
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
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
          Competitor signals are simulated when libraries are unavailable — patterns still drive output.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wider text-cyan-400/90">
        URL → Growth Intelligence
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        Competitor-driven campaign intelligence
      </h1>
      <p className="mt-4 text-zinc-400">
        Paste a website URL. We infer the category, simulate market-style competitor ads
        for pattern extraction, then generate new angles from what is working — not generic
        copywriting.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
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
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
        >
          Generate Growth Pack
        </button>
      </form>
    </main>
  );
}
