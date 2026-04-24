"use client";

import { useState } from "react";
import type { AdBreakdown, CompetitorDetail, CompetitorTrend } from "@/lib/report-types";
import { ConfidenceInline } from "./confidence";

function TrendGlyph({ t }: { t: CompetitorTrend }) {
  if (t === "up") return <span className="tabular-nums text-[var(--signal-low)]">↑</span>;
  if (t === "down") return <span className="tabular-nums text-[var(--signal-high)]">↓</span>;
  return <span className="tabular-nums text-[var(--text-muted)]">→</span>;
}

function AdBreakdownPanel({ ad }: { ad: AdBreakdown }) {
  const [showCopy, setShowCopy] = useState(false);
  return (
    <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4">
      <dl className="grid gap-3 text-[12px] sm:grid-cols-2">
        <div>
          <dt className="font-medium text-[var(--text-muted)]">Hook type</dt>
          <dd className="mt-0.5 text-[var(--text-primary)]">{ad.hookType}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--text-muted)]">Angle</dt>
          <dd className="mt-0.5 text-[var(--text-primary)]">{ad.angle}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--text-muted)]">Emotional trigger</dt>
          <dd className="mt-0.5 text-[var(--text-primary)]">{ad.emotionalTrigger}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--text-muted)]">Format</dt>
          <dd className="mt-0.5 text-[var(--text-primary)]">{ad.format}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-[var(--text-muted)]">CTA</dt>
          <dd className="mt-0.5 text-[var(--text-primary)]">{ad.cta}</dd>
        </div>
      </dl>
      {ad.adText ? (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <button
            type="button"
            onClick={() => setShowCopy((s) => !s)}
            className="text-[12px] font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {showCopy ? "Hide ad text" : "View ad text"}
          </button>
          {showCopy ? (
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">{ad.adText}</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 border-t border-[var(--border-subtle)] pt-4 text-[11px] text-[var(--text-muted)]">
          Ad text not surfaced in intelligence feed — request full scrape for verbatim copy.
        </p>
      )}
    </div>
  );
}

export function CompetitorIntelligence({ competitors }: { competitors: CompetitorDetail[] }) {
  const [openId, setOpenId] = useState<string | null>(competitors[0]?.id ?? null);
  const active = competitors.find((c) => c.id === openId) ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,340px)]">
      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[520px] border-collapse text-left text-[12px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
              <th className="px-4 py-3 font-medium">Competitor</th>
              <th className="px-4 py-3 font-medium">Spend band</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3 font-medium">Dominant angle</th>
              <th className="px-4 py-3 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((row) => {
              const selected = row.id === openId;
              return (
                <tr
                  key={row.id}
                  className={`border-b border-[var(--border-subtle)] last:border-b-0 ${
                    selected ? "bg-[var(--bg-page)]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(row.id)}
                      className="text-left font-medium text-[var(--accent)] underline-offset-2 hover:underline"
                    >
                      {row.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{row.spendBand}</td>
                  <td className="px-4 py-3 font-mono text-[var(--text-secondary)]">
                    {Math.round(row.confidence * 100)}%
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{row.dominantAngle}</td>
                  <td className="px-4 py-3 text-center text-base">
                    <TrendGlyph t={row.trend} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <aside className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-card)]">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          Ad breakdown panel
        </p>
        {active ? (
          <>
            <h3 className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{active.name}</h3>
            <div className="mt-3">
              <ConfidenceInline value={active.confidence} />
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-[var(--text-muted)]">
              Structured read — hook and angle before copy. Reduces feed spam and preserves analyst posture.
            </p>
            <ul className="mt-4 space-y-3">
              {active.ads.map((ad, i) => (
                <li key={`${active.id}-ad-${i}`}>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Observed unit {i + 1}
                  </p>
                  <AdBreakdownPanel ad={ad} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-4 text-sm text-[var(--text-muted)]">Select a competitor to open breakdowns.</p>
        )}
      </aside>
    </div>
  );
}
