"use client";

import { useState } from "react";
import { INDUSTRY_SHOWCASES } from "@/components/landing/sample-industry-showcase";

type Props = {
  onPickDemoUrl: (url: string) => void;
};

export function LandingIndustryShowcase({ onPickDemoUrl }: Props) {
  const [activeId, setActiveId] = useState(INDUSTRY_SHOWCASES[0].id);
  const active = INDUSTRY_SHOWCASES.find((x) => x.id === activeId) ?? INDUSTRY_SHOWCASES[0];

  return (
    <section className="mt-14 w-full max-w-4xl animate-dnads-fade-in-delay-3">
      <div className="border border-[#2a2a2e] bg-[#0b0c0f]/80 p-5 sm:p-6">
        <p className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#8a8a8a]">
          sample intelligence — illustrative only
        </p>
        <h2 className="mt-2 text-lg font-normal tracking-wide text-[#d4d4d4] sm:text-xl">
          See the pattern layer before you commit a URL
        </h2>
        <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-[#7a7a7a] sm:text-[13px]">
          Growth and performance teams use dnads to read <span className="text-[#9a9a9a]">what is winning in the category</span> — not generic copy. Below: fictional ads shaped like Meta / TikTok / Google transparency rows across verticals you already run.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {INDUSTRY_SHOWCASES.map((ind) => (
            <button
              key={ind.id}
              type="button"
              onClick={() => setActiveId(ind.id)}
              className={`border px-3 py-2 text-[10px] font-normal uppercase tracking-[0.12em] transition-colors ${
                activeId === ind.id
                  ? "border-[#5a5a62] bg-[#1a1b22] text-[#d4d4d4]"
                  : "border-[#2a2a2e] bg-transparent text-[#6a6a6a] hover:border-[#3d3d44] hover:text-[#9a9a9a]"
              }`}
            >
              {ind.name}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-[#6a6a6a]">{active.audience}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {active.ads.map((ad) => (
            <article
              key={`${active.id}-${ad.platform}-${ad.headline}`}
              className="border border-[#2a2a2e] bg-[#121318]/90 p-4 text-left"
            >
              <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-[#5c5c5c]">
                <span className="text-[#8a8a8a]">{ad.platform}</span>
                <span className="rounded border border-[#2a2a2e] px-1.5 py-0.5 text-[#7a7a7a]">{ad.hook_label}</span>
              </div>
              <p className="mt-3 text-[13px] font-medium leading-snug text-[#e0e0e0]">{ad.headline}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-[#8a8a8a]">{ad.body}</p>
              <p className="mt-3 border-t border-[#2a2a2e] pt-2 text-[10px] uppercase tracking-[0.1em] text-[#6a8a7a]">
                cta: {ad.cta}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[#2a2a2e] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-[#5c5c5c]">
            Run a full pack on this vertical’s demo URL — same pipeline as your property.
          </p>
          <button
            type="button"
            onClick={() => onPickDemoUrl(active.demo_url)}
            className="shrink-0 border border-[#3d3d44] bg-[#16171c] px-4 py-2.5 text-[10px] font-normal uppercase tracking-[0.14em] text-[#b0b0b0] transition-colors hover:border-[#5a5a62] hover:text-[#e0e0e0]"
          >
            pre-fill URL for {active.name}
          </button>
        </div>
      </div>
    </section>
  );
}
