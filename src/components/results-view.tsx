"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";
import type { Ad, GeneratedAd, GrowthPack } from "@/lib/types";
import {
  accessTierForViewer,
  adPrimaryTextLowRes,
  canUseCampaignExport,
  canViewCompetitorIntelligence,
  canViewFullMarketResolution,
  canViewHighResolutionAds,
  canViewStudioIntelligence,
  slicePackForFreePreview,
} from "@/lib/access-tier";
import { DepthUnlockPanel } from "@/components/depth-unlock-panel";

type Tab = "business" | "competitors" | "market" | "ads" | "download";

function readPackFromSession(): GrowthPack | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem("growth_pack_result");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GrowthPack;
  } catch {
    return null;
  }
}

const COMPETITOR_UNLOCK = {
  headline: "Full competitive intelligence available",
  subcopy:
    "Activate analyst-level competitive resolution: spend-relative signals, structured breakdowns, and full depth behind each observed unit — not more ad volume.",
  bullets: [
    "Full competitor breakdowns with spend band + confidence framing",
    "Spend intensity and angle concentration map (full resolution)",
    "Extended angle taxonomy tied to market behavior",
    "High-resolution creative system (full ad grid + production paths)",
  ],
} as const;

const MARKET_UNLOCK = {
  headline: "Unlock full market pattern resolution",
  subcopy:
    "The preview shows directionally correct hook and angle mix. Full resolution includes saturation logic, gap detection, and complete winning-pattern synthesis.",
  bullets: [
    "Complete hook and angle distributions",
    "Saturation gaps and whitespace signals",
    "Full winning-pattern cluster readout",
  ],
} as const;

const ADS_UNLOCK = {
  headline: "Access high-resolution strategy layer",
  subcopy:
    "You are not buying more lines of copy. You are enabling the full creative system: complete clusters, landing variants, UGC paths, and campaign architecture.",
  bullets: [
    "Full ad variation grid by cluster",
    "Landing page headline + subcopy system",
    "UGC script paths and campaign structure",
  ],
} as const;

export function ResultsView() {
  const [pack] = useState<GrowthPack | null>(() => readPackFromSession());
  const [tab, setTab] = useState<Tab>("business");
  const { isLoaded, isSignedIn, user } = useUser();

  const tier = useMemo(
    () => accessTierForViewer({ isSignedIn: !!isSignedIn, metadata: user?.publicMetadata }),
    [isSignedIn, user?.publicMetadata],
  );

  const displayPack = useMemo(() => {
    if (!pack) return null;
    if (!isLoaded) return slicePackForFreePreview(pack);
    if (!isSignedIn || tier === "free") return slicePackForFreePreview(pack);
    return pack;
  }, [pack, isLoaded, isSignedIn, tier]);

  const fullMarket = pack?.market ?? null;
  const showMarketTeaser = fullMarket && !canViewFullMarketResolution(tier);
  const showCompetitorGate = !canViewCompetitorIntelligence(tier);
  const showAdsGate = !canViewHighResolutionAds(tier);
  const exportUnlocked = canUseCampaignExport(tier);

  const teaseCompetitorAds = useMemo((): Ad[] => {
    if (!pack?.competitor_ads?.length) {
      return [
        {
          competitor: "—",
          hook_type: "—",
          angle: "—",
          emotional_trigger: "—",
          format: "—",
          cta: "—",
          text: "…",
        },
      ];
    }
    return pack.competitor_ads.slice(0, 4);
  }, [pack]);

  const adsByCluster = useMemo(() => {
    if (!displayPack) return new Map<string, GeneratedAd[]>();
    const m = new Map<string, GeneratedAd[]>();
    for (const ad of displayPack.generated_ads) {
      const k = ad.cluster || "General";
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(ad);
    }
    return m;
  }, [displayPack]);

  const downloadJson = useCallback(() => {
    if (!pack || !exportUnlocked) return;
    const blob = new Blob([JSON.stringify(pack, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "growth-intelligence-pack.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [pack, exportUnlocked]);

  if (!pack) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-zinc-400">No report in session. Run a URL from the home page first.</p>
        <Link href="/" className="mt-6 inline-block text-cyan-400 hover:text-cyan-300">
          ← Back to input
        </Link>
      </main>
    );
  }

  if (!isLoaded || !displayPack) {
    return (
      <main className="mx-auto flex min-h-[40vh] max-w-4xl flex-col items-center justify-center px-6 py-20">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-600 border-t-cyan-400" />
        <p className="mt-6 text-center text-sm text-zinc-400">Resolving analyst access…</p>
      </main>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "business", label: "Market context" },
    { id: "competitors", label: "Competitive intelligence" },
    { id: "market", label: "Pattern resolution" },
    { id: "ads", label: "Creative system" },
    { id: "download", label: "Activation & export" },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/90">
            Growth intelligence report
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-50">{pack.business.url}</h1>
          <p className="text-sm text-zinc-500">{pack.business.category}</p>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-zinc-500">
            We show how your market is actually behaving — and what to do next. Deeper analysis is available
            when you raise intelligence resolution (not a paywall on generation).
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-zinc-400 underline-offset-4 hover:text-cyan-400 hover:underline"
        >
          New URL
        </Link>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-zinc-800 text-cyan-300"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 space-y-6 text-zinc-300">
        {tab === "business" && (
          <section className="space-y-4">
            {pack.business.product_summary && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <h2 className="text-sm font-semibold text-zinc-100">Product / service read</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{pack.business.product_summary}</p>
              </div>
            )}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">Value proposition signals</h2>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {pack.business.value_proposition.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">Audience hypothesis</h2>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {pack.business.target_audience.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
            {pack.business.pricing_tiers && pack.business.pricing_tiers.length > 0 && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <h2 className="text-sm font-semibold text-zinc-100">Pricing inference</h2>
                <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                  {pack.business.pricing_tiers.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {tab === "competitors" && (
          <section className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">Competitors (inferred)</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {pack.business.competitors.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-zinc-500">
              Observed units are structured for intelligence (hook, angle, trigger, format, CTA) — not raw
              feed dumps.
            </p>

            {showCompetitorGate ? (
              <>
                <div className="pointer-events-none select-none space-y-3 opacity-[0.22] blur-[2.5px]">
                  {teaseCompetitorAds.map((ad, i) => (
                    <article
                      key={`tease-${i}`}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm"
                    >
                      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                        <span className="font-medium text-cyan-400/90">{ad.competitor}</span>
                        <span>· {ad.hook_type}</span>
                        <span>· {ad.format}</span>
                      </div>
                      <p className="mt-2 text-zinc-200">{ad.text}</p>
                    </article>
                  ))}
                </div>
                <DepthUnlockPanel
                  tier={tier}
                  isSignedIn={!!isSignedIn}
                  headline={COMPETITOR_UNLOCK.headline}
                  subcopy={COMPETITOR_UNLOCK.subcopy}
                  bullets={[...COMPETITOR_UNLOCK.bullets]}
                  upgradeHref="/settings/access"
                />
              </>
            ) : (
              <div className="space-y-3">
                {pack.competitor_ads.map((ad, i) => (
                  <article
                    key={`${ad.competitor}-${i}`}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm"
                  >
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span className="font-medium text-cyan-400/90">{ad.competitor}</span>
                      <span>· {ad.hook_type}</span>
                      <span>· {ad.format}</span>
                    </div>
                    <p className="mt-2 text-zinc-200">{ad.text}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Angle: {ad.angle} · Trigger: {ad.emotional_trigger} · CTA: {ad.cta}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "market" && (
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <h2 className="text-sm font-semibold text-zinc-100">Hook mix</h2>
                <ul className="mt-2 space-y-1 text-sm text-zinc-400">
                  {displayPack.market.top_hooks.map((h) => (
                    <li key={h.label}>
                      {h.label}: <span className="text-zinc-200">{h.percent}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <h2 className="text-sm font-semibold text-zinc-100">Angle mix</h2>
                <ul className="mt-2 space-y-1 text-sm text-zinc-400">
                  {displayPack.market.top_angles.map((a) => (
                    <li key={a.label}>
                      {a.label}: <span className="text-zinc-200">{a.percent}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {showMarketTeaser && fullMarket ? (
              <div className="pointer-events-none relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 opacity-50">
                <div className="absolute inset-0 backdrop-blur-[3px]" />
                <div className="relative grid gap-4 sm:grid-cols-2">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-100">Extended resolution</h2>
                    <ul className="mt-2 space-y-1 text-sm text-zinc-500">
                      {fullMarket.top_hooks.slice(2).map((h) => (
                        <li key={h.label}>
                          {h.label}: {h.percent}%
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-100">Further angles</h2>
                    <ul className="mt-2 space-y-1 text-sm text-zinc-500">
                      {fullMarket.top_angles.slice(2).map((a) => (
                        <li key={a.label}>
                          {a.label}: {a.percent}%
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {!canViewFullMarketResolution(tier) ? (
              <DepthUnlockPanel
                tier={tier}
                isSignedIn={!!isSignedIn}
                headline={MARKET_UNLOCK.headline}
                subcopy={MARKET_UNLOCK.subcopy}
                bullets={[...MARKET_UNLOCK.bullets]}
                upgradeHref="/settings/access"
              />
            ) : (
              <>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 sm:col-span-2">
                  <h2 className="text-sm font-semibold text-zinc-100">Saturation &amp; gaps</h2>
                  <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                    {pack.market.saturation_gaps.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 sm:col-span-2">
                  <h2 className="text-sm font-semibold text-zinc-100">Winning patterns</h2>
                  <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                    {pack.market.winning_patterns.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {canViewStudioIntelligence(tier) ? (
              <div className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-4">
                <h2 className="text-sm font-semibold text-cyan-200">Continuous market intelligence</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Studio plane: multiple growth profiles, historical tracking, and opportunity alerts ship on
                  your roadmap — export to ad platforms layers here when ready.
                </p>
              </div>
            ) : null}
          </section>
        )}

        {tab === "ads" && (
          <section className="space-y-8">
            <p className="text-sm text-zinc-500">
              Creative system is grouped by cluster. Preview shows a low-resolution slice; full resolution
              includes the complete grid and downstream assets.
            </p>
            {[...adsByCluster.entries()].map(([cluster, ads]) => (
              <div key={cluster}>
                <h2 className="text-lg font-semibold text-zinc-100">{cluster}</h2>
                <ul className="mt-3 space-y-4">
                  {ads.map((ad, idx) => (
                    <li
                      key={`${cluster}-${idx}`}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm"
                    >
                      <p className="font-medium text-cyan-300/90">{ad.hook}</p>
                      <p className="mt-2 text-zinc-300">
                        {showAdsGate ? adPrimaryTextLowRes(ad.primary_text) : ad.primary_text}
                      </p>
                      <p className="mt-2 text-xs text-zinc-500">
                        CTA: {ad.cta} · Angle: {ad.angle_label} · Trigger: {ad.emotional_trigger_label}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {showAdsGate ? (
              <DepthUnlockPanel
                tier={tier}
                isSignedIn={!!isSignedIn}
                headline={ADS_UNLOCK.headline}
                subcopy={ADS_UNLOCK.subcopy}
                bullets={[...ADS_UNLOCK.bullets]}
                upgradeHref="/settings/access"
              />
            ) : (
              <>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                  <h2 className="text-sm font-semibold text-zinc-100">Landing page headline system</h2>
                  <ol className="mt-2 list-inside list-decimal text-sm text-zinc-400">
                    {pack.landing_headlines.map((h) => (
                      <li key={h} className="py-1">
                        {h}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                  <h2 className="text-sm font-semibold text-zinc-100">Landing subcopy</h2>
                  <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                    {pack.landing_subcopy.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                  <h2 className="text-sm font-semibold text-zinc-100">UGC script paths</h2>
                  <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                    {pack.ugc_script_ideas.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                  <h2 className="text-sm font-semibold text-zinc-100">Campaign architecture</h2>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-400">
                    {pack.campaign_structure.map((c) => (
                      <li key={c.name}>
                        <span className="font-medium text-zinc-200">{c.name}</span>
                        {" — "}
                        {c.objective}
                        {c.notes ? (
                          <span className="block text-xs text-zinc-500">{c.notes}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </section>
        )}

        {tab === "download" && (
          <section className="space-y-6" id="analyst-access">
            <p className="text-sm leading-relaxed text-zinc-400">
              <strong className="text-zinc-200">Campaign pack export</strong> is an activation tool: JSON
              suitable for downstream systems — not a payment gate on creativity. Enable it by activating
              full growth intelligence resolution on your workspace.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!exportUnlocked}
                onClick={downloadJson}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Enable campaign export system
              </button>
              <Link
                href="/settings/access"
                className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
              >
                View access resolution
              </Link>
            </div>
            {!exportUnlocked ? (
              <DepthUnlockPanel
                tier={tier}
                isSignedIn={!!isSignedIn}
                headline="Enable full pack activation"
                subcopy="Unlock export and downstream handoff at the same intelligence tier as full competitive and creative resolution — one analyst plane, not bolt-on credits."
                bullets={[
                  "JSON export of the full intelligence object",
                  "PDF / bundle export when wired to your renderer",
                  "Future: direct handoff to ad platforms from the same access plane",
                ]}
                upgradeHref="/settings/access"
              />
            ) : (
              <p className="text-xs text-zinc-500">
                Export includes the complete structured pack (same object used to render this report).
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
