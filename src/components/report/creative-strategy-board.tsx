"use client";

import { useState } from "react";
import type { WinningAd } from "@/lib/report-types";
import { WinningAdCard } from "./winning-ad-card";

const INITIAL_VISIBLE = 5;

export function CreativeStrategyBoard({ ads }: { ads: WinningAd[] }) {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const shown = ads.slice(0, visible);
  const canLoadMore = visible < ads.length;

  return (
    <div>
      <p className="mb-6 max-w-2xl text-[13px] leading-relaxed text-[var(--text-secondary)]">
        Winning ads grid — structured cards, hooks dominant, reasoning collapsed by default. Showing{" "}
        {shown.length} of {ads.length} units.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{shown.map((ad) => (
          <WinningAdCard key={ad.id} ad={ad} />
        ))}</div>
      {canLoadMore ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => Math.min(v + 4, ads.length))}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[13px] font-medium text-[var(--text-primary)] shadow-sm hover:bg-[var(--bg-surface)]"
          >
            Load more variations
          </button>
        </div>
      ) : null}
    </div>
  );
}
