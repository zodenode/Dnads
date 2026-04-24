"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGameOfLife } from "@/hooks/useGameOfLife";
import { BootSequence } from "@/components/landing/boot-sequence";
import { GridRenderer } from "@/components/landing/grid-renderer";
import { SimulationOverlay } from "@/components/landing/simulation-overlay";

const LOADING_LINES = [
  "binding competitive signals…",
  "resolving pattern substrate…",
  "emitting growth intelligence pack…",
] as const;

export function LandingPage() {
  const router = useRouter();
  const [bootDone, setBootDone] = useState(false);
  const finishBoot = useMemo(() => () => setBootDone(true), []);
  const [url, setUrl] = useState("");
  const [metaCountries, setMetaCountries] = useState("US");
  const [maxCompetitors, setMaxCompetitors] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadLine, setLoadLine] = useState(0);

  const { grid, tickIndex, density, solidBlocks, lastBirths } = useGameOfLife(bootDone);

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      setLoadLine((i) => Math.min(i + 1, LOADING_LINES.length - 1));
    }, 2200);
    return () => clearInterval(id);
  }, [loading]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const trimmed = url.trim();
      if (!trimmed) {
        setError("URL required to initialize cycle.");
        return;
      }
      setLoading(true);
      setLoadLine(0);
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
        setError(err instanceof Error ? err.message : "Cycle aborted.");
      } finally {
        setLoading(false);
        setLoadLine(0);
      }
    },
    [url, router, metaCountries, maxCompetitors],
  );

  if (loading) {
    return (
      <main className="relative flex min-h-[calc(100vh-3.25rem)] flex-col items-center justify-center bg-[#0b0c0f] px-6 font-mono text-[#9a9a9a]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#5c5c5c]">evolution cycle</p>
        <p className="mt-6 text-sm text-[#c4c4c4]">{LOADING_LINES[loadLine]}</p>
        <p className="mt-4 max-w-md text-center text-[11px] leading-relaxed text-[#6a6a6a]">
          simulation layer remains active — intelligence pipeline executing
        </p>
      </main>
    );
  }

  return (
    <>
      {!bootDone ? <BootSequence onComplete={finishBoot} /> : null}

      <main className="relative min-h-[calc(100vh-3.25rem)] overflow-hidden bg-[#0b0c0f] font-mono text-[#c4c4c4]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden pt-16">
          <div className="scale-[0.92] sm:scale-100">
            <GridRenderer grid={grid} />
          </div>
        </div>

        <SimulationOverlay
          key={bootDone ? "sim-on" : "sim-off"}
          tickIndex={tickIndex}
          density={density}
          solidBlocks={solidBlocks}
          lastBirths={lastBirths}
          active={bootDone}
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3.25rem)] max-w-3xl flex-col px-6 pb-16 pt-12 sm:pt-16">
          <header className="text-center animate-dnads-fade-in-delay-1">
            <h1 className="text-3xl font-normal tracking-[0.12em] text-[#e8e8e8] sm:text-4xl">dnads</h1>
            <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-[#8a8a8a] sm:text-sm">
              adaptive advertising under competitive selection pressure
            </p>
            <p className="mx-auto mt-2 max-w-md text-[11px] leading-relaxed text-[#5c5c5c]">
              ads evolve through survival in competitive markets
            </p>
          </header>

          <section className="mt-14 animate-dnads-fade-in-delay-2">
            <form onSubmit={handleSubmit} className="mx-auto max-w-lg border border-[#2a2a2e] bg-[#0b0c0f]/85 p-5 backdrop-blur-sm sm:p-6">
              <label className="block text-[10px] font-normal uppercase tracking-[0.18em] text-[#6a6a6a]">
                target url
                <input
                  type="url"
                  name="url"
                  placeholder="https://"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="mt-3 w-full border border-[#2a2a2e] bg-[#121318] px-3 py-3 text-sm text-[#e0e0e0] outline-none transition-colors placeholder:text-[#4a4a4e] focus:border-[#3d3d44] disabled:opacity-50"
                />
              </label>
              {error ? (
                <p className="mt-3 text-[11px] text-[#9a6a6a]" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="mt-4 w-full border border-dashed border-[#2a2a2e] py-2 text-[10px] font-normal uppercase tracking-[0.14em] text-[#6a6a6a] transition-colors hover:border-[#3d3d44] hover:text-[#8a8a8a]"
                aria-expanded={showAdvanced}
              >
                {showAdvanced ? "hide query parameters" : "show query parameters (meta region · depth)"}
              </button>

              {showAdvanced ? (
                <div className="mt-4 grid gap-3 border-t border-[#2a2a2e] pt-4 sm:grid-cols-2">
                  <label className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6a6a6a]">
                    meta countries (iso, comma)
                    <input
                      value={metaCountries}
                      onChange={(e) => setMetaCountries(e.target.value)}
                      placeholder="US,GB"
                      className="mt-2 w-full border border-[#2a2a2e] bg-[#121318] px-2 py-2 font-mono text-[11px] text-[#c4c4c4] outline-none focus:border-[#3d3d44]"
                    />
                  </label>
                  <label className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6a6a6a]">
                    max competitors (1–20)
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={maxCompetitors}
                      onChange={(e) => setMaxCompetitors(Number(e.target.value) || 10)}
                      className="mt-2 w-full border border-[#2a2a2e] bg-[#121318] px-2 py-2 text-[11px] text-[#c4c4c4] outline-none focus:border-[#3d3d44]"
                    />
                  </label>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full border border-[#3d3d44] bg-[#16171c] py-3 text-[11px] font-normal uppercase tracking-[0.14em] text-[#b0b0b0] transition-colors hover:border-[#52525a] hover:bg-[#1a1b22] hover:text-[#d4d4d4] disabled:opacity-50"
              >
                initialize evolution cycle
              </button>
            </form>
          </section>

          <section className="mx-auto mt-10 w-full max-w-lg animate-dnads-fade-in-delay-3">
            <div className="border border-[#2a2a2e] bg-[#0b0c0f]/80 p-4 text-[10px] leading-relaxed text-[#6a6a6a]">
              <p className="text-[#8a8a8a]">{">"} system status: monitoring ad ecosystems</p>
              <p>{">"} selection model: active</p>
              <p>{">"} mutation engine: running</p>
              <p>{">"} simulation layer: connected</p>
              <p className="mt-3 border-t border-[#2a2a2e] pt-3 text-[#5c5c5c]">
                {">"}{" "}
                <Link href="/monitor" className="text-[#7a7a7a] underline-offset-2 hover:text-[#a0a0a0]">
                  continuous monitor jobs
                </Link>
              </p>
              <p className="mt-2 text-[#5c5c5c]">
                {">"}{" "}
                <Link href="/guide" className="text-[#7a7a7a] underline-offset-2 hover:text-[#a0a0a0]">
                  user guide (USER_GUIDE.md)
                </Link>
              </p>
            </div>
          </section>

          <section className="mx-auto mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3 animate-dnads-fade-in-delay-4">
            <article className="border border-[#2a2a2e] bg-[#0b0c0f]/75 p-4">
              <h2 className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#8a8a8a]">
                market simulation
              </h2>
              <p className="mt-2 text-[11px] leading-relaxed text-[#6a6a6a]">
                Competitive space as a dynamic grid — strategies appear, spread, and collapse under pressure.
              </p>
            </article>
            <article className="border border-[#2a2a2e] bg-[#0b0c0f]/75 p-4">
              <h2 className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#8a8a8a]">
                selection pressure
              </h2>
              <p className="mt-2 text-[11px] leading-relaxed text-[#6a6a6a]">
                Only configurations that persist under local rules survive — a stand-in for market selection.
              </p>
            </article>
            <article className="border border-[#2a2a2e] bg-[#0b0c0f]/75 p-4">
              <h2 className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#8a8a8a]">
                mutation engine
              </h2>
              <p className="mt-2 text-[11px] leading-relaxed text-[#6a6a6a]">
                Sparse births and dense clusters model where new creative forms might emerge or stall.
              </p>
            </article>
          </section>
        </div>
      </main>

    </>
  );
}
