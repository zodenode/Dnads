"use client";

import { useState } from "react";
import type { ProductionQueueItem } from "@/lib/report-types";

function StructuredPromptBox({
  p,
}: {
  p: NonNullable<ProductionQueueItem["imagePromptStructured"]>;
}) {
  const rows: { k: string; v: string }[] = [
    { k: "Subject", v: p.subject },
    { k: "Environment", v: p.environment },
    { k: "Lighting", v: p.lighting },
    { k: "Emotion", v: p.emotion },
    { k: "Composition", v: p.composition },
    { k: "Negative space", v: p.negativeSpace },
    { k: "Style reference", v: p.styleReference },
  ];
  return (
    <div className="mt-3 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)]">
      {rows.map((row) => (
        <div key={row.k} className="border-b border-[var(--border-subtle)] py-2 last:border-b-0">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {row.k}
          </span>
          <p className="mt-1 font-sans text-[12px] text-[var(--text-secondary)]">{row.v}</p>
        </div>
      ))}
    </div>
  );
}

export function ProductionQueue({ items }: { items: ProductionQueueItem[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = expanded[item.id] ?? false;
        return (
          <div
            key={item.id}
            className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</p>
                <dl className="mt-2 grid gap-x-6 gap-y-1 text-[12px] sm:grid-flow-col sm:auto-cols-fr">
                  <div>
                    <dt className="text-[var(--text-muted)]">Type</dt>
                    <dd className="font-medium text-[var(--text-primary)]">{item.type}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-muted)]">Hook strength</dt>
                    <dd className="font-medium text-[var(--text-primary)]">{item.hookStrength}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-muted)]">Angle</dt>
                    <dd className="font-medium text-[var(--text-primary)]">{item.angleLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-muted)]">Status</dt>
                    <dd className="font-medium text-[var(--text-primary)]">{item.status}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-2 text-[11px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-page)]"
                >
                  Generate variations
                </button>
                <button
                  type="button"
                  className="rounded-md border border-transparent bg-[var(--accent)] px-3 py-2 text-[11px] font-medium text-white hover:bg-[var(--accent-muted)]"
                >
                  Export to Midjourney / Runway / DALL·E
                </button>
              </div>
            </div>
            <div className="px-4 py-3">
              <button
                type="button"
                onClick={() => setExpanded((e) => ({ ...e, [item.id]: !isOpen }))}
                className="text-[12px] font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {isOpen ? "Collapse studio brief" : "Expand studio brief"}
              </button>
              {isOpen && item.imagePromptStructured ? (
                <div className="mt-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Image prompt (copy-ready)
                  </p>
                  <StructuredPromptBox p={item.imagePromptStructured} />
                </div>
              ) : isOpen ? (
                <p className="mt-3 text-[12px] text-[var(--text-muted)]">
                  No structured image brief on this queue item — link to a winning static or image unit to
                  inherit fields.
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
