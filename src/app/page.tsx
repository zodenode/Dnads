"use client";

import { useCallback, useMemo, useState } from "react";
import type { GrowthPack } from "@/lib/types";

type TabId = "business" | "competitors" | "market" | "ads" | "download";

const LOADING_STEPS = [
  "Analyzing competitors…",
  "Extracting ad patterns…",
  "Generating campaigns…",
] as const;

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pack, setPack] = useState<GrowthPack | null>(null);
  const [tab, setTab] = useState<TabId>("business");
  const [paid, setPaid] = useState(false);

  const runGenerate = useCallback(async () => {
    setError(null);
    setPack(null);
    setLoading(true);
    setStepIndex(0);
    const timers = [
      setTimeout(() => setStepIndex(1), 2800),
      setTimeout(() => setStepIndex(2), 5600),
    ];
    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setPack(data as GrowthPack);
      setTab("business");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      timers.forEach(clearTimeout);
      setLoading(false);
      setStepIndex(0);
    }
  }, [url]);

  const downloadJson = useCallback(() => {
    if (!pack || !paid) return;
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "growth-pack.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [pack, paid]);

  const tabs = useMemo(
    () =>
      [
        { id: "business" as const, label: "Business Insight" },
        { id: "competitors" as const, label: "Competitor Analysis" },
        { id: "market" as const, label: "Market Patterns" },
        { id: "ads" as const, label: "Generated Ads" },
        { id: "download" as const, label: "Download Pack" },
      ] satisfies { id: TabId; label: string }[],
    []
  );

  return (
    <div className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-8">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          URL → Growth Intelligence &amp; Ad Generator
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600">
          Competitor-driven marketing intelligence: discover patterns in the market, then generate
          campaigns from those signals — not generic AI copy.
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <label htmlFor="url" className="text-sm font-medium text-zinc-800">
            Website URL
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2"
              disabled={loading}
            />
            <button
              type="button"
              onClick={runGenerate}
              disabled={loading || !url.trim()}
              className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Generate Growth Pack
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </section>

        {loading && (
          <section
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white py-16 shadow-sm"
            aria-live="polite"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800" />
            <p className="text-sm font-medium text-zinc-800">{LOADING_STEPS[stepIndex]}</p>
            <p className="text-xs text-zinc-500">This can take up to a minute.</p>
          </section>
        )}

        {pack && !loading && (
          <>
            <nav className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    tab === t.id
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            {tab === "business" && (
              <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold">Business understanding</h2>
                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-800">URL:</span> {pack.business.url}
                </p>
                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-800">Category:</span>{" "}
                  {pack.business.category}
                </p>
                {pack.business.product_summary && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-800">Product / service</h3>
                    <p className="mt-1 text-sm text-zinc-600">{pack.business.product_summary}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-zinc-800">Value proposition</h3>
                  <ul className="mt-1 list-inside list-disc text-sm text-zinc-600">
                    {pack.business.value_proposition.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-800">Target audience hypothesis</h3>
                  <ul className="mt-1 list-inside list-disc text-sm text-zinc-600">
                    {pack.business.target_audience.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
                {pack.business.pricing_tier_inference && pack.business.pricing_tier_inference.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-800">Pricing tier inference</h3>
                    <ul className="mt-1 list-inside list-disc text-sm text-zinc-600">
                      {pack.business.pricing_tier_inference.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {tab === "competitors" && (
              <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold">Competitor discovery</h2>
                <ul className="list-inside list-disc text-sm text-zinc-600">
                  {pack.business.competitors.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <h3 className="pt-2 text-sm font-medium text-zinc-800">Simulated ad intelligence (by competitor)</h3>
                <p className="text-xs text-zinc-500">{pack.meta.pattern_note}</p>
                <div className="max-h-[480px] space-y-4 overflow-y-auto pr-1">
                  {pack.competitor_ads.map((ad, i) => (
                    <article
                      key={i}
                      className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm"
                    >
                      <p className="font-medium text-zinc-900">
                        {ad.competitor}{" "}
                        <span className="font-normal text-zinc-500">
                          · {ad.channel} · {ad.format}
                        </span>
                      </p>
                      <p className="mt-1 text-zinc-700">{ad.text}</p>
                      <dl className="mt-2 grid gap-1 text-xs text-zinc-600 sm:grid-cols-2">
                        <div>
                          <dt className="font-medium text-zinc-500">Hook</dt>
                          <dd>{ad.hook_type}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-zinc-500">Angle</dt>
                          <dd>{ad.angle}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-zinc-500">Audience</dt>
                          <dd>{ad.audience_target}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-zinc-500">Offer</dt>
                          <dd>{ad.offer_type}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-zinc-500">Trigger</dt>
                          <dd>{ad.emotional_trigger}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-zinc-500">CTA</dt>
                          <dd>{ad.cta}</dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tab === "market" && (
              <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold">Market pattern analysis</h2>
                <div>
                  <h3 className="text-sm font-medium text-zinc-800">Hook distribution</h3>
                  <ul className="mt-1 text-sm text-zinc-600">
                    {pack.market_insights.top_hooks.map((h) => (
                      <li key={h.label}>
                        {h.label}: {h.percent}%
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-800">Angle distribution</h3>
                  <ul className="mt-1 text-sm text-zinc-600">
                    {pack.market_insights.top_angles.map((a) => (
                      <li key={a.label}>
                        {a.label}: {a.percent}%
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-800">Underused / gap signals</h3>
                  <ul className="mt-1 list-inside list-disc text-sm text-zinc-600">
                    {pack.market_insights.saturation_gaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-800">Winning patterns &amp; saturation</h3>
                  <ul className="mt-1 list-inside list-disc text-sm text-zinc-600">
                    {pack.market_insights.winning_patterns.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {tab === "ads" && (
              <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold">Generated ads (pattern-derived)</h2>
                <ul className="space-y-3">
                  {pack.generated_ads.map((ad, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-700"
                    >
                      <p className="font-medium text-zinc-900">{ad.hook}</p>
                      <p className="mt-1">{ad.primary_text}</p>
                      <p className="mt-2 text-xs text-zinc-500">
                        Angle: {ad.angle_label} · Trigger: {ad.emotional_trigger_label} · CTA:{" "}
                        {ad.cta}
                      </p>
                    </li>
                  ))}
                </ul>
                <h3 className="pt-4 text-sm font-semibold text-zinc-800">Campaign pack preview</h3>
                <div className="space-y-3 text-sm text-zinc-600">
                  <div>
                    <p className="font-medium text-zinc-800">Landing headlines</p>
                    <ul className="mt-1 list-inside list-disc">
                      {pack.campaign_pack.landing_headlines.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-800">Landing subcopy</p>
                    <ul className="mt-1 list-inside list-disc">
                      {pack.campaign_pack.landing_subcopy.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-800">UGC script ideas</p>
                    <ul className="mt-1 list-inside list-disc">
                      {pack.campaign_pack.ugc_script_ideas.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <p>
                    <span className="font-medium text-zinc-800">Suggested structure: </span>
                    {pack.campaign_pack.suggested_campaign_structure}
                  </p>
                </div>
              </section>
            )}

            {tab === "download" && (
              <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold">Download full campaign pack</h2>
                <p className="text-sm text-zinc-600">
                  Full JSON export is gated for Stripe checkout later. Unlock is simulated for this
                  MVP.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setPaid(true)}
                    className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
                  >
                    Pay with Stripe (placeholder)
                  </button>
                  <button
                    type="button"
                    onClick={downloadJson}
                    disabled={!paid}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Download full campaign pack (JSON)
                  </button>
                </div>
                {!paid && (
                  <p className="text-xs text-zinc-500">
                    After payment, call your backend with a Stripe session id — e.g.{" "}
                    <code className="rounded bg-zinc-100 px-1">POST /api/checkout/verify</code> — then
                    enable download.
                  </p>
                )}
                {paid && (
                  <p className="text-xs text-green-700">Unlocked for this session (demo).</p>
                )}
              </section>
            )}
          </>
        )}
      </main>

      <footer className="mt-auto border-t border-zinc-200 bg-white px-4 py-4 text-center text-xs text-zinc-500 sm:px-8">
        R&amp;D / pattern intelligence only — respect platform terms when sourcing live ad data.
      </footer>
    </div>
  );
}
