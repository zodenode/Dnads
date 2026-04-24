"use client";

import { useState } from "react";
import type { WinningAd } from "@/lib/report-types";

const angleStyles = {
  slate: "bg-[#e8e6e1] text-[#3d3c38] border-[#d5d2ca]",
  forest: "bg-[#dfe8e3] text-[#2d4a3e] border-[#c5d4cc]",
  clay: "bg-[#ebe4df] text-[#5c4035] border-[#d8cdc4]",
  ink: "bg-[#e4e6ea] text-[#2a2f3a] border-[#cdd1d9]",
} as const;

export function WinningAdCard({ ad }: { ad: WinningAd }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [productionOpen, setProductionOpen] = useState(false);
  const [imagePromptVisible, setImagePromptVisible] = useState(false);
  const badge = angleStyles[ad.angleColor];

  return (
    <article className="flex flex-col rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${badge}`}>{ad.angleLabel}</span>
        <span className="ml-auto font-mono text-[11px] text-[var(--text-muted)]">
          Score <span className="text-[var(--text-primary)]">{ad.performanceScore}</span>
          <span className="text-[var(--text-muted)]">/100</span>
        </span>
        <span className="rounded border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
          {ad.format}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Hook</p>
        <p className="mt-1 text-lg font-semibold leading-snug tracking-tight text-[var(--text-primary)] sm:text-xl">
          {ad.hook}
        </p>
        <div className="mt-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Body</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">{ad.body}</p>
        </div>
        <div className="mt-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">CTA</p>
          <p className="mt-1 text-[13px] font-medium text-[var(--text-primary)]">{ad.cta}</p>
        </div>

        <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
          <button
            type="button"
            onClick={() => setNotesOpen((v) => !v)}
            className="flex w-full items-center justify-between text-left text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <span>Strategy notes</span>
            <span className="font-mono text-[var(--text-muted)]">{notesOpen ? "−" : "+"}</span>
          </button>
          {notesOpen ? (
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
              <li>
                <span className="font-medium text-[var(--text-muted)]">Why this hook works · </span>
                {ad.notes.whyHookWorks}
              </li>
              <li>
                <span className="font-medium text-[var(--text-muted)]">Competitor inspiration · </span>
                {ad.notes.competitorInspiration}
              </li>
              <li>
                <span className="font-medium text-[var(--text-muted)]">Psychological trigger · </span>
                {ad.notes.psychologicalTrigger}
              </li>
            </ul>
          ) : null}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              setProductionOpen((v) => {
                const next = !v;
                if (!next) setImagePromptVisible(false);
                return next;
              });
            }}
            className="text-[12px] font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {productionOpen ? "Collapse production details" : "Expand production details"}
          </button>
          {productionOpen ? (
            <div className="mt-4 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 text-[12px] leading-relaxed text-[var(--text-secondary)]">
              {ad.format === "Static" && ad.productionStatic ? (
                <>
                  <p className="font-medium text-[var(--text-primary)]">Full copy</p>
                  <p className="mt-2 whitespace-pre-line">{ad.productionStatic.fullCopy}</p>
                  <p className="mt-3 font-medium text-[var(--text-primary)]">Layout suggestion</p>
                  <p className="mt-1">{ad.productionStatic.layoutSuggestion}</p>
                  <p className="mt-3 font-medium text-[var(--text-primary)]">Text hierarchy</p>
                  <p className="mt-1">{ad.productionStatic.textHierarchy}</p>
                </>
              ) : null}
              {(ad.format === "Video" || ad.format === "UGC Video") && ad.productionVideo ? (
                <>
                  <p className="font-medium text-[var(--text-primary)]">Scene breakdown</p>
                  <ul className="mt-2 space-y-2">
                    {ad.productionVideo.scenes.map((s) => (
                      <li key={s.range}>
                        <span className="font-mono text-[11px] text-[var(--text-muted)]">{s.range}</span>
                        <span className="mx-2 text-[var(--border-strong)]">·</span>
                        {s.beat}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-medium text-[var(--text-primary)]">Voiceover script</p>
                  <p className="mt-1">{ad.productionVideo.voiceoverScript}</p>
                  <p className="mt-3 font-medium text-[var(--text-primary)]">Retention mechanism</p>
                  <p className="mt-1">{ad.productionVideo.retentionMechanism}</p>
                </>
              ) : null}
              {ad.format === "Image" && ad.productionImage ? (
                <>
                  <p className="font-medium text-[var(--text-primary)]">Image production</p>
                  {!imagePromptVisible ? (
                    <button
                      type="button"
                      onClick={() => setImagePromptVisible(true)}
                      className="mt-2 rounded-md border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 py-2 text-[11px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                    >
                      Generate creative
                    </button>
                  ) : (
                    <div className="mt-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 font-mono text-[11px] text-[var(--text-secondary)]">
                      {ad.productionImage.aiPrompt}
                    </div>
                  )}
                  <p className="mt-3 font-medium text-[var(--text-primary)]">Composition notes</p>
                  <p className="mt-1">{ad.productionImage.compositionNotes}</p>
                  <p className="mt-3 font-medium text-[var(--text-primary)]">Style guidance</p>
                  <p className="mt-1">{ad.productionImage.styleGuidance}</p>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
