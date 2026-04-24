import type { MarketOverview } from "../data/mockReport";
import { ConfidencePill, MarketPressureBadge, ReasonSignals, SectionShell } from "./ui";

export function MarketIntelHeader({
  data,
  visible,
}: {
  data: MarketOverview;
  visible: boolean;
}) {
  if (!visible) {
    return (
      <SectionShell id="market" eyebrow="Layer 1" title="Market intelligence">
        <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-500">
          <p>
            <span className="font-medium text-zinc-700">Synthesizing market context</span>
            <br />
            Interpretation runs before any creative output — analyst-style read on category
            dynamics.
          </p>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="market"
      eyebrow="Layer 1"
      title="Market overview"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white">
              Category
            </span>
            <span className="text-sm font-medium text-zinc-800">{data.category}</span>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Competitor intensity
              </dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900">
                {data.competitorIntensity}
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Opportunity level
              </dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900">
                {data.opportunityLevel}
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Dominant strategy (market)
              </dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900">
                “{data.dominantStrategy}”
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Weak gap (positioning whitespace)
              </dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900">
                “{data.weakGap}”
              </dd>
            </div>
          </dl>
          <ReasonSignals items={data.synthesisSignals} />
        </div>
        <aside className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Market pressure
            </p>
            <div className="mt-2">
              <MarketPressureBadge level={data.marketPressure} />
            </div>
          </div>
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 p-3">
            <p className="text-xs text-zinc-600 leading-relaxed">
              This panel is interpretation only — no ads, no prompts. Executive read on how
              the category is behaving before creative execution.
            </p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            <ConfidencePill value={0.78} label="Synthesis" />
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
