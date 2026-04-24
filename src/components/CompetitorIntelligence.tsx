import { useState } from "react";
import type { CompetitorAd, CompetitorRow } from "../data/mockReport";
import {
  ConfidencePill,
  ReasonSignals,
  SectionShell,
  TrendGlyph,
} from "./ui";

function AdBreakdownPanel({
  competitor,
  ad,
  onClose,
}: {
  competitor: CompetitorRow;
  ad: CompetitorAd;
  onClose: () => void;
}) {
  const [showCopy, setShowCopy] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-breakdown-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-100 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Ad breakdown
            </p>
            <h3 id="ad-breakdown-title" className="text-sm font-semibold text-zinc-900">
              {competitor.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Close
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-wrap gap-2">
            <ConfidencePill value={competitor.confidence} />
          </div>
          <dl className="grid gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Hook type
              </dt>
              <dd className="font-medium text-zinc-900">{ad.hookType}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Angle
              </dt>
              <dd className="font-medium text-zinc-900">{ad.angle}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Emotional trigger
              </dt>
              <dd className="font-medium text-zinc-900">{ad.emotionalTrigger}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Format
              </dt>
              <dd className="font-medium text-zinc-900">{ad.format}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                CTA
              </dt>
              <dd className="font-medium text-zinc-900">{ad.cta}</dd>
            </div>
          </dl>
          <div>
            <button
              type="button"
              onClick={() => setShowCopy((v) => !v)}
              className="text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-600"
            >
              {showCopy ? "Hide ad text" : "View ad text"}
            </button>
            {showCopy && (
              <blockquote className="mt-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-relaxed text-zinc-700">
                {ad.adText}
              </blockquote>
            )}
          </div>
          <ReasonSignals items={competitor.reasonSignals} />
        </div>
      </div>
    </div>
  );
}

export function CompetitorIntelligence({
  rows,
  visible,
}: {
  rows: CompetitorRow[];
  visible: boolean;
}) {
  const [open, setOpen] = useState<{
    competitor: CompetitorRow;
    ad: CompetitorAd;
  } | null>(null);

  if (!visible) {
    return (
      <SectionShell id="competitors" eyebrow="Layer 3" title="Competitor intelligence">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
          Spend bands, dominant angles, and trend signals — Bloomberg-style table. Ad copy
          stays behind structured breakdowns until you ask for it.
        </div>
      </SectionShell>
    );
  }

  return (
    <>
      <SectionShell id="competitors" eyebrow="Layer 3" title="Competitor intelligence">
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Competitor</th>
                <th className="px-4 py-3">Spend band</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Dominant angle</th>
                <th className="px-4 py-3">Trend</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50/80">
                  <td className="px-4 py-3 font-medium text-zinc-900">{row.name}</td>
                  <td className="px-4 py-3 text-zinc-700">{row.spendBand}</td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">
                    {Math.round(row.confidence * 100)}%
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{row.dominantAngle}</td>
                  <td className="px-4 py-3 text-lg text-zinc-800">
                    <TrendGlyph trend={row.trend} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setOpen({ competitor: row, ad: row.ads[0] })
                      }
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                    >
                      Open breakdown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>
      {open && (
        <AdBreakdownPanel
          competitor={open.competitor}
          ad={open.ad}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
