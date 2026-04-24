import { useEffect, useMemo, useState } from "react";
import {
  mockAngles,
  mockCampaignPack,
  mockCompetitors,
  mockMarketOverview,
  mockProductionQueue,
  mockWinningAds,
} from "./data/mockReport";
import { MarketIntelHeader } from "./components/MarketIntelHeader";
import { StrategicAnglesSection } from "./components/StrategicAngles";
import { CompetitorIntelligence } from "./components/CompetitorIntelligence";
import { WinningAdsGrid } from "./components/WinningAdsGrid";
import { ProductionQueueSection } from "./components/ProductionQueue";
import { CampaignPackExport } from "./components/CampaignPackExport";

const REVEAL_MS = [0, 900, 1800, 2700, 3600, 4500] as const;

export default function App() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = REVEAL_MS.map((ms, idx) =>
      window.setTimeout(() => setPhase((p) => Math.max(p, idx)), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const layers = useMemo(
    () => [
      { id: "market", label: "Market", ready: phase >= 1 },
      { id: "angles", label: "Angles", ready: phase >= 2 },
      { id: "competitors", label: "Intel", ready: phase >= 3 },
      { id: "ads", label: "Creatives", ready: phase >= 4 },
      { id: "production", label: "Production", ready: phase >= 5 },
      { id: "export", label: "Pack", ready: phase >= 6 },
    ],
    [phase]
  );

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-surface-raised/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Full growth report
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
              Structured creative strategy
            </h1>
            <p className="mt-1 max-w-xl text-xs text-zinc-600 sm:text-sm">
              Market insight → strategic interpretation → creative angles → ads → production
              assets. No raw dumps; everything labeled and reasoned.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Report sections">
            {layers.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  l.ready
                    ? "border-zinc-300 bg-white text-zinc-900 shadow-sm"
                    : "border-transparent bg-zinc-100 text-zinc-400 pointer-events-none"
                }`}
                aria-disabled={!l.ready}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="border-t border-zinc-100 bg-zinc-50/80">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Analysis pipeline
            </p>
            <ol className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-700">
              {[
                "Market synthesis",
                "Angle mapping",
                "Competitive set",
                "Creative board",
                "Production queue",
                "Campaign pack",
              ].map((step, i) => (
                <li
                  key={step}
                  className={`flex items-center gap-2 rounded-full border px-2.5 py-1 ${
                    phase > i
                      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                      : phase === i
                        ? "border-amber-200 bg-amber-50 text-amber-950"
                        : "border-zinc-200 bg-white text-zinc-400"
                  }`}
                >
                  <span className="font-semibold tabular-nums">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <MarketIntelHeader data={mockMarketOverview} visible={phase >= 1} />
        <StrategicAnglesSection angles={mockAngles} visible={phase >= 2} />
        <CompetitorIntelligence rows={mockCompetitors} visible={phase >= 3} />
        <WinningAdsGrid ads={mockWinningAds} visible={phase >= 4} />
        <ProductionQueueSection items={mockProductionQueue} visible={phase >= 5} />
        <CampaignPackExport pack={mockCampaignPack} visible={phase >= 6} />
      </main>

      <footer className="border-t border-zinc-200 bg-surface-raised py-8 text-center text-xs text-zinc-500">
        Phase 1 UI shell — replace mock data with your generation pipeline. Flow preserves
        strategist positioning: thinking before execution.
      </footer>
    </div>
  );
}
