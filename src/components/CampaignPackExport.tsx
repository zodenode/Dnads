import type { CampaignPackSummary } from "../data/mockReport";
import { SectionShell } from "./ui";

export function CampaignPackExport({
  pack,
  visible,
}: {
  pack: CampaignPackSummary;
  visible: boolean;
}) {
  if (!visible) {
    return (
      <SectionShell id="export" eyebrow="Layer 6" title="Campaign pack export">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
          Pack summary and export actions surface after the full strategy stack.
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id="export" eyebrow="Layer 6" title="Campaign pack summary">
      <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Pack contents
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-800">
              <li className="flex justify-between gap-8 border-b border-zinc-100 pb-2">
                <span>Static ads</span>
                <span className="font-semibold tabular-nums">{pack.staticAds}</span>
              </li>
              <li className="flex justify-between gap-8 border-b border-zinc-100 pb-2">
                <span>UGC scripts</span>
                <span className="font-semibold tabular-nums">{pack.ugcScripts}</span>
              </li>
              <li className="flex justify-between gap-8 border-b border-zinc-100 pb-2">
                <span>Image concepts</span>
                <span className="font-semibold tabular-nums">{pack.imageConcepts}</span>
              </li>
              <li className="flex justify-between gap-8 border-b border-zinc-100 pb-2">
                <span>Landing page variants</span>
                <span className="font-semibold tabular-nums">{pack.landingVariants}</span>
              </li>
            </ul>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Dominant angles in pack
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-zinc-700">
              {pack.dominantAngles.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
            <button
              type="button"
              className="rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Download full pack
            </button>
            <button
              type="button"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Export to Ads Manager
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
