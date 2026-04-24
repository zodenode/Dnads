import { useState } from "react";
import type { ProductionQueueItem } from "../data/mockReport";
import { promptFieldLabel } from "../lib/labels";
import { ConfidencePill, ReasonSignals, SectionShell } from "./ui";

function PromptBlock({
  prompt,
}: {
  prompt: NonNullable<ProductionQueueItem["imagePrompt"]>;
}) {
  return (
    <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4 font-mono text-[11px] leading-relaxed text-zinc-800">
      {Object.entries(prompt.promptStructured).map(([k, val]) => (
        <p key={k} className="border-b border-zinc-100 py-1.5 last:border-0">
          <span className="font-semibold text-zinc-600">{promptFieldLabel(k)}: </span>
          {val}
        </p>
      ))}
    </div>
  );
}

function QueueRow({ item }: { item: ProductionQueueItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900">{item.label}</h3>
            <ConfidencePill value={item.confidence} />
          </div>
          <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
            <div>
              <dt className="font-medium text-zinc-500">Type</dt>
              <dd className="font-semibold text-zinc-900">{item.type}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Hook strength</dt>
              <dd className="font-semibold text-zinc-900">{item.hookStrength}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Angle</dt>
              <dd className="font-semibold text-zinc-900">{item.angle}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Status</dt>
              <dd className="font-semibold text-zinc-900">{item.status}</dd>
            </div>
          </dl>
          <ReasonSignals items={item.reasonSignals} compact />
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <button
            type="button"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 sm:w-auto"
          >
            Generate variations
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 sm:w-auto"
          >
            Export to Midjourney / Runway / DALL·E
          </button>
        </div>
      </div>
      {item.imagePrompt && (
        <div className="border-t border-zinc-100 px-5 py-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-semibold uppercase tracking-wide text-zinc-600 hover:text-zinc-900"
          >
            {open ? "Hide" : "Show"} image prompt (production)
          </button>
          {open && <PromptBlock prompt={item.imagePrompt} />}
        </div>
      )}
    </div>
  );
}

export function ProductionQueueSection({
  items,
  visible,
}: {
  items: ProductionQueueItem[];
  visible: boolean;
}) {
  if (!visible) {
    return (
      <SectionShell id="production" eyebrow="Layer 5" title="Creative production queue">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
          Studio-style queue: typed briefs, status, and export paths — not a wall of
          prompts.
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id="production" eyebrow="Layer 5" title="Creative production queue">
      <div className="space-y-4">
        {items.map((item) => (
          <QueueRow key={item.id} item={item} />
        ))}
      </div>
    </SectionShell>
  );
}
