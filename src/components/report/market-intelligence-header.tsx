import type { MarketIntelligence } from "@/lib/report-types";
import { ConfidenceInline, ReasonSignal } from "./confidence";

function pressureDot(pressure: MarketIntelligence["marketPressure"]) {
  if (pressure === "HIGH") return "bg-[var(--signal-high)]";
  if (pressure === "MEDIUM") return "bg-[var(--signal-medium)]";
  return "bg-[var(--signal-low)]";
}

function pressureLabel(pressure: MarketIntelligence["marketPressure"]) {
  if (pressure === "HIGH") return "HIGH 🔴";
  if (pressure === "MEDIUM") return "MEDIUM";
  return "LOW";
}

export function MarketIntelligenceHeader({ data }: { data: MarketIntelligence }) {
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Layer 1 · Executive read
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-[1.65rem]">
          Market Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Interpretation only — no creative execution in this band. Use it to align stakeholders before
          reviewing angles and ads.
        </p>

        <div className="mt-8 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Category
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{data.category}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Market pressure
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                <span className={`h-2 w-2 rounded-full ${pressureDot(data.marketPressure)}`} aria-hidden />
                {pressureLabel(data.marketPressure)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Competitor intensity
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{data.competitorIntensity}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Opportunity level
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{data.opportunityLevel}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t border-[var(--border-subtle)] pt-8 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Dominant strategy
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-[var(--text-primary)]">
                &ldquo;{data.dominantStrategy}&rdquo;
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Weak gap
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-[var(--text-primary)]">
                &ldquo;{data.weakGap}&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--border-subtle)] pt-6">
            <ConfidenceInline value={data.confidence} />
            <ReasonSignal text={data.marketPressureReason} />
          </div>
        </div>
      </div>
    </header>
  );
}
