"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { GeneratedAd, GrowthPack } from "@/lib/types";
import {
  isPackDownloadUnlocked,
  unlockPackForSession,
} from "@/lib/billing";

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

export default function ResultsPage() {
  const [pack] = useState<GrowthPack | null>(() => readPackFromSession());
  const [tab, setTab] = useState<Tab>("business");
  const [unlocked, setUnlocked] = useState(() =>
    typeof window !== "undefined" ? isPackDownloadUnlocked() : false,
  );
  const [showPaywall, setShowPaywall] = useState(false);

  const adsByCluster = useMemo(() => {
    if (!pack) return new Map<string, GeneratedAd[]>();
    const m = new Map<string, GeneratedAd[]>();
    for (const ad of pack.generated_ads) {
      const k = ad.cluster || "General";
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(ad);
    }
    return m;
  }, [pack]);

  const downloadJson = useCallback(() => {
    if (!pack) return;
    const blob = new Blob([JSON.stringify(pack, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "campaign-pack.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [pack]);

  if (!pack) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-zinc-400">No pack in session. Run a URL first.</p>
        <Link
          href="/"
          className="mt-6 inline-block text-cyan-400 hover:text-cyan-300"
        >
          ← Back to input
        </Link>
      </main>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "business", label: "Business Insight" },
    { id: "competitors", label: "Competitor Analysis" },
    { id: "market", label: "Market Patterns" },
    { id: "ads", label: "Generated Ads" },
    { id: "download", label: "Download Pack" },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/90">
            Growth Pack
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-50">
            {pack.business.url}
          </h1>
          <p className="text-sm text-zinc-500">{pack.business.category}</p>
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
                <h2 className="text-sm font-semibold text-zinc-100">
                  Product / service
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {pack.business.product_summary}
                </p>
              </div>
            )}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Value proposition
              </h2>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {pack.business.value_proposition.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Target audience hypothesis
              </h2>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {pack.business.target_audience.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
            {pack.business.pricing_tiers && pack.business.pricing_tiers.length > 0 && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <h2 className="text-sm font-semibold text-zinc-100">
                  Pricing inference
                </h2>
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
              <h2 className="text-sm font-semibold text-zinc-100">
                Competitors (inferred)
              </h2>
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
              Ads below are structured simulations for R&amp;D — not copied from ad libraries.
              Schema: hook type, angle, trigger, format, CTA.
            </p>
            <div className="space-y-3">
              {pack.competitor_ads.map((ad, i) => (
                <article
                  key={`${ad.competitor}-${i}`}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm"
                >
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span className="font-medium text-cyan-400/90">
                      {ad.competitor}
                    </span>
                    <span>· {ad.hook_type}</span>
                    <span>· {ad.format}</span>
                  </div>
                  <p className="mt-2 text-zinc-200">{ad.text}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Angle: {ad.angle} · Trigger: {ad.emotional_trigger} · CTA:{" "}
                    {ad.cta}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "market" && (
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">Hook mix</h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-400">
                {pack.market.top_hooks.map((h) => (
                  <li key={h.label}>
                    {h.label}: <span className="text-zinc-200">{h.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">Angle mix</h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-400">
                {pack.market.top_angles.map((a) => (
                  <li key={a.label}>
                    {a.label}: <span className="text-zinc-200">{a.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 sm:col-span-2">
              <h2 className="text-sm font-semibold text-zinc-100">
                Saturation &amp; gaps
              </h2>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {pack.market.saturation_gaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 sm:col-span-2">
              <h2 className="text-sm font-semibold text-zinc-100">
                Winning patterns
              </h2>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {pack.market.winning_patterns.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {tab === "ads" && (
          <section className="space-y-8">
            <p className="text-sm text-zinc-500">
              Ads are grouped by angle cluster (~10 per group where the model assigned clusters).
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
                      <p className="mt-2 text-zinc-300">{ad.primary_text}</p>
                      <p className="mt-2 text-xs text-zinc-500">
                        CTA: {ad.cta} · Angle: {ad.angle_label} · Trigger:{" "}
                        {ad.emotional_trigger_label}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Landing page headlines
              </h2>
              <ol className="mt-2 list-inside list-decimal text-sm text-zinc-400">
                {pack.landing_headlines.map((h) => (
                  <li key={h} className="py-1">
                    {h}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Landing subcopy
              </h2>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {pack.landing_subcopy.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                UGC script ideas
              </h2>
              <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                {pack.ugc_script_ideas.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <h2 className="text-sm font-semibold text-zinc-100">
                Suggested campaign structure
              </h2>
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
          </section>
        )}

        {tab === "download" && (
          <section className="space-y-6">
            <p className="text-sm text-zinc-400">
              Full campaign pack export is gated for Stripe checkout (placeholder). Structure
              is ready to swap in{" "}
              <code className="rounded bg-zinc-800 px-1 text-xs text-cyan-300">
                createCheckoutSession
              </code>{" "}
              server-side.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowPaywall(true)}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-400"
              >
                Download full campaign pack
              </button>
              <button
                type="button"
                onClick={downloadJson}
                disabled={!unlocked}
                className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Export JSON
              </button>
            </div>
            {!unlocked && (
              <p className="text-xs text-zinc-500">
                Export JSON stays disabled until checkout completes (demo unlock below).
              </p>
            )}
            {showPaywall && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="paywall-title"
              >
                <div className="max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
                  <h2
                    id="paywall-title"
                    className="text-lg font-semibold text-zinc-50"
                  >
                    Unlock full pack
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    Production: redirect to Stripe Checkout, then verify session server-side
                    and set an httpOnly cookie before enabling download.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-400"
                      onClick={() => {
                        unlockPackForSession();
                        setUnlocked(true);
                        setShowPaywall(false);
                      }}
                    >
                      Simulate successful payment
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300"
                      onClick={() => setShowPaywall(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
