import { useMemo, useState } from "react";
import type { WinningAd } from "../data/mockReport";
import { promptFieldLabel } from "../lib/labels";
import { ConfidencePill, SectionShell } from "./ui";

const angleStyles: Record<
  WinningAd["angleColor"],
  string
> = {
  slate: "bg-zinc-100 text-zinc-800 border-zinc-200",
  amber: "bg-amber-50 text-amber-950 border-amber-200",
  emerald: "bg-emerald-50 text-emerald-950 border-emerald-200",
  violet: "bg-violet-50 text-violet-950 border-violet-200",
};

const INITIAL_VISIBLE = 5;

function ProductionExpand({ ad }: { ad: WinningAd }) {
  const [showImagePrompt, setShowImagePrompt] = useState(false);

  if (ad.format === "Static" && ad.production.static) {
    const s = ad.production.static;
    return (
      <div className="mt-4 space-y-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Full copy
          </p>
          <pre className="mt-1 whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-800">
            {s.fullCopy}
          </pre>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Layout suggestion
          </p>
          <p className="mt-1 text-xs text-zinc-700">{s.layoutSuggestion}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Text hierarchy
          </p>
          <p className="mt-1 text-xs text-zinc-700">{s.textHierarchy}</p>
        </div>
      </div>
    );
  }

  if (ad.format === "Video" && ad.production.video) {
    const v = ad.production.video;
    return (
      <div className="mt-4 space-y-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Scene breakdown
          </p>
          <ul className="mt-2 space-y-2">
            {v.scenes.map((sc) => (
              <li
                key={sc.range}
                className="flex gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs"
              >
                <span className="shrink-0 font-mono font-semibold text-zinc-600">
                  {sc.range}
                </span>
                <span className="text-zinc-800">{sc.beat}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Voiceover script
          </p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-800">{v.voiceover}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Retention mechanism
          </p>
          <p className="mt-1 text-xs text-zinc-700">{v.retention}</p>
        </div>
      </div>
    );
  }

  if (ad.format === "Image" && ad.production.image) {
    const img = ad.production.image;
    return (
      <div className="mt-4 space-y-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm">
        {!showImagePrompt ? (
          <button
            type="button"
            onClick={() => setShowImagePrompt(true)}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            Generate creative
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Image prompt (structured)
            </p>
            <div className="rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-zinc-800">
              {Object.entries(img.promptStructured).map(([k, val]) => (
                <p key={k} className="border-b border-zinc-100 py-1 last:border-0">
                  <span className="font-semibold text-zinc-600">
                    {promptFieldLabel(k)}:{" "}
                  </span>
                  {val}
                </p>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Composition notes
              </p>
              <p className="mt-1 text-xs text-zinc-700">{img.compositionNotes}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Style guidance
              </p>
              <p className="mt-1 text-xs text-zinc-700">{img.styleGuidance}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function AdCard({ ad }: { ad: WinningAd }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const scoreConfidence = useMemo(
    () => Math.min(0.95, 0.55 + ad.performanceScore / 250),
    [ad.performanceScore]
  );

  return (
    <article className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${angleStyles[ad.angleColor]}`}
        >
          {ad.angleTag}
        </span>
        <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
          {ad.format}
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Score
          </span>
          <span className="text-lg font-semibold tabular-nums text-zinc-900">
            {ad.performanceScore}
          </span>
          <ConfidencePill value={scoreConfidence} label="Model" />
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-zinc-900">
        {ad.hook}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{ad.body}</p>
      <p className="mt-4 text-sm font-semibold text-zinc-900">{ad.cta}</p>
      <div className="mt-4 border-t border-zinc-100 pt-3">
        <button
          type="button"
          onClick={() => setNotesOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 hover:text-zinc-900"
        >
          Strategy notes
          <span className="text-zinc-400">{notesOpen ? "−" : "+"}</span>
        </button>
        {notesOpen && (
          <dl className="mt-3 space-y-2 text-xs text-zinc-700">
            <div>
              <dt className="font-semibold text-zinc-500">Why this hook works</dt>
              <dd className="mt-0.5 leading-relaxed">{ad.strategyNotes.hookRationale}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Competitor inspiration</dt>
              <dd className="mt-0.5 leading-relaxed">
                {ad.strategyNotes.competitorInspiration}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Psychological trigger</dt>
              <dd className="mt-0.5 leading-relaxed">
                {ad.strategyNotes.psychologicalTrigger}
              </dd>
            </div>
          </dl>
        )}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setProdOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
        >
          {prodOpen ? "Collapse" : "Expand"} production details
          <span className="text-zinc-400">{prodOpen ? "−" : "+"}</span>
        </button>
        {prodOpen && <ProductionExpand ad={ad} />}
      </div>
    </article>
  );
}

export function WinningAdsGrid({
  ads,
  visible,
}: {
  ads: WinningAd[];
  visible: boolean;
}) {
  const [count, setCount] = useState(INITIAL_VISIBLE);
  const visibleAds = ads.slice(0, count);
  const canLoadMore = count < ads.length;

  if (!visible) {
    return (
      <SectionShell id="ads" eyebrow="Layer 4" title="Creative strategy board">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
          Winning ads appear after market read, angles, and competitive context — structured
          cards, not raw copy dumps.
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id="ads" eyebrow="Layer 4" title="Creative strategy board">
      <p className="mb-6 max-w-2xl text-sm text-zinc-600">
        Hooks lead; body and CTA stay compact. Strategy notes and production specs stay
        collapsed by default to limit visual noise.
      </p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
      {canLoadMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(c + 3, ads.length))}
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            Load more variations
          </button>
        </div>
      )}
    </SectionShell>
  );
}
