import type { CampaignPackSummary } from "@/lib/report-types";

export function CampaignPackSummaryBlock({ pack }: { pack: CampaignPackSummary }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] sm:p-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
        📦 Campaign pack summary
      </p>
      <ul className="mt-6 space-y-3 border-t border-[var(--border-subtle)] pt-6 font-mono text-[13px] text-[var(--text-secondary)]">
        <li className="flex justify-between gap-4">
          <span>Static ads</span>
          <span className="text-[var(--text-primary)]">{pack.staticAds}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span>UGC scripts</span>
          <span className="text-[var(--text-primary)]">{pack.ugcScripts}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span>Image concepts</span>
          <span className="text-[var(--text-primary)]">{pack.imageConcepts}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span>Landing page variants</span>
          <span className="text-[var(--text-primary)]">{pack.landingVariants}</span>
        </li>
        <li className="border-t border-[var(--border-subtle)] pt-3">
          <span className="block text-[11px] font-sans font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Dominant angles in pack
          </span>
          <span className="mt-1 block font-sans text-[13px] text-[var(--text-primary)]">
            {pack.dominantAngles.join(" · ")}
          </span>
        </li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md border border-transparent bg-[var(--accent)] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[var(--accent-muted)]"
        >
          Download full pack
        </button>
        <button
          type="button"
          className="rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] px-5 py-2.5 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-page)]"
        >
          Export to Ads Manager
        </button>
      </div>
    </div>
  );
}
