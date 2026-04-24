"use client";

import Link from "next/link";
import { startTransition, useCallback, useEffect, useState } from "react";

type Job = {
  id: string;
  url: string;
  meta_countries: string[];
  max_competitors: number;
  interval_minutes: number;
  last_run_at: string | null;
  next_run_at: string | null;
  last_status: string;
  last_error: string | null;
};

export default function MonitorPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(60);
  const [maxCompetitors, setMaxCompetitors] = useState(8);
  const [metaCountries, setMetaCountries] = useState("US");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    if (res.ok) setJobs(data.jobs ?? []);
  }, []);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  async function createJob(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const countries = metaCountries
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: url.trim(),
        interval_minutes: interval,
        max_competitors: maxCompetitors,
        meta_countries: countries.length ? countries : ["US"],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create job");
      return;
    }
    setUrl("");
    await load();
  }

  async function runNow(id: string) {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Run failed");
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function removeJob(id: string) {
    if (!confirm("Delete this monitor job?")) return;
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Back
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Monitor jobs</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Re-runs the growth pipeline on an interval. Schedule{" "}
        <code className="rounded bg-zinc-800 px-1 text-xs">GET /api/cron/jobs</code> with{" "}
        <code className="rounded bg-zinc-800 px-1 text-xs">CRON_SECRET</code> so due jobs execute.
      </p>

      <form onSubmit={createJob} className="mt-8 space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <label className="block text-sm text-zinc-300">
          URL to monitor
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://competitor.com"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-zinc-300">
            Interval (min)
            <input
              type="number"
              min={5}
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            />
          </label>
          <label className="block text-sm text-zinc-300">
            Max competitors / run
            <input
              type="number"
              min={1}
              max={20}
              value={maxCompetitors}
              onChange={(e) => setMaxCompetitors(Number(e.target.value))}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            />
          </label>
          <label className="block text-sm text-zinc-300">
            Meta countries
            <input
              value={metaCountries}
              onChange={(e) => setMetaCountries(e.target.value)}
              placeholder="US,GB"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-400"
        >
          Add job
        </button>
      </form>

      <ul className="mt-10 space-y-3">
        {jobs.map((j) => (
          <li
            key={j.id}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-300"
          >
            <div className="font-medium text-zinc-100">{j.url}</div>
            <div className="mt-1 text-xs text-zinc-500">
              every {j.interval_minutes}m · up to {j.max_competitors} competitors · Meta:{" "}
              {j.meta_countries.join(", ")}
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              status: <span className="text-zinc-300">{j.last_status}</span>
              {j.last_error ? (
                <span className="ml-2 text-red-400">{j.last_error}</span>
              ) : null}
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              next: {j.next_run_at ?? "—"} · last: {j.last_run_at ?? "—"}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy === j.id}
                onClick={() => runNow(j.id)}
                className="rounded border border-zinc-600 px-3 py-1 text-xs hover:bg-zinc-800 disabled:opacity-50"
              >
                {busy === j.id ? "Running…" : "Run now"}
              </button>
              <button
                type="button"
                onClick={() => removeJob(j.id)}
                className="rounded border border-red-900/50 px-3 py-1 text-xs text-red-300 hover:bg-red-950/40"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {jobs.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">No jobs yet. Add one above.</p>
      )}
    </main>
  );
}
