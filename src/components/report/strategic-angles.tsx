import type { StrategicAngle } from "@/lib/report-types";
import { ConfidenceInline } from "./confidence";

function opportunityTone(o: StrategicAngle["opportunity"]) {
  if (o === "High") return "text-[var(--signal-low)]";
  if (o === "Medium") return "text-[var(--signal-medium)]";
  return "text-[var(--text-muted)]";
}

export function StrategicAngles({ angles }: { angles: StrategicAngle[] }) {
  return (
    <div className="-mx-4 sm:-mx-6">
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6 scrollbar-thin">
        {angles.map((a) => (
          <article
            key={a.id}
            className="min-w-[min(100%,280px)] max-w-[320px] shrink-0 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold leading-snug text-[var(--text-primary)]">{a.title}</h3>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <ConfidenceInline value={a.confidence} />
            </div>
            <dl className="mt-4 space-y-2 text-[12px]">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--text-muted)]">Market usage</dt>
                <dd className="text-right font-medium text-[var(--text-primary)]">
                  {a.marketUsageLabel} ({a.marketUsagePct}%)
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--text-muted)]">Opportunity</dt>
                <dd className={`font-medium ${opportunityTone(a.opportunity)}`}>{a.opportunity}</dd>
              </div>
              <div className="border-t border-[var(--border-subtle)] pt-2">
                <dt className="text-[var(--text-muted)]">Saturation</dt>
                <dd className="mt-0.5 text-[var(--text-secondary)]">{a.saturationLevel}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Psychological framing
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                {a.psychologicalFraming}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Why it works
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">{a.whyItWorks}</p>
            </div>
            <div className="mt-4 rounded-md bg-[var(--bg-page)] px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Example positioning
              </p>
              <p className="mt-1 text-[12px] font-medium italic leading-relaxed text-[var(--text-primary)]">
                {a.examplePositioning}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Usage recommendation
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                {a.usageRecommendation}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
