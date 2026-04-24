"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CampaignPack, GenerateResponse } from "@/lib/types";

const STORAGE_UNLOCK = "growth_pack_download_unlocked";

type TabId =
  | "business"
  | "competitors"
  | "market"
  | "ads"
  | "download";

const LOADING_STEPS = [
  "Analyzing competitors…",
  "Extracting ad patterns…",
  "Generating campaigns…",
] as const;

export default function Home() {
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pack, setPack] = useState<CampaignPack | null>(null);
  const [tab, setTab] = useState<TabId>("business");
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_UNLOCK) === "1") {
        setDownloadUnlocked(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const a = setTimeout(() => setLoadingStep(1), 4500);
    const b = setTimeout(() => setLoadingStep(2), 9000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [loading]);

  const runGenerate = useCallback(async () => {
    setError(null);
    setPack(null);
    setLoading(true);
    setTab("business");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, notes: notes.trim() || undefined }),
      });
      const data = (await res.json()) as GenerateResponse;
      if (!data.success || !data.pack) {
        setError(data.error || "Generation failed");
        return;
      }
      setPack(data.pack);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [url, notes]);

  const unlockPlaceholder = useCallback(() => {
    setDownloadUnlocked(true);
    try {
      localStorage.setItem(STORAGE_UNLOCK, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const downloadJson = useCallback(() => {
    if (!pack || !downloadUnlocked) return;
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "growth-campaign-pack.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [pack, downloadUnlocked]);

  const tabs = useMemo(
    () =>
      [
        { id: "business" as const, label: "Business Insight" },
        { id: "competitors" as const, label: "Competitor Analysis" },
        { id: "market" as const, label: "Market Patterns" },
        { id: "ads" as const, label: "Generated Ads" },
        { id: "download" as const, label: "Download Pack" },
      ] as const,
    []
  );

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.h1}>URL → Growth Intelligence &amp; Ad Generator</h1>
        <p style={styles.sub}>
          Competitor-driven pattern intelligence — not a generic ad writer. Simulated ad
          libraries for market structure; combine with your compliance review before use.
        </p>
      </header>

      <section style={styles.card}>
        <label style={styles.label}>
          Website URL
          <input
            style={styles.input}
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </label>
        <label style={styles.label}>
          Optional context (one line)
          <input
            style={styles.input}
            placeholder="e.g. B2B SaaS for finance teams"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />
        </label>
        <button
          type="button"
          style={styles.primaryBtn}
          disabled={loading || !url.trim()}
          onClick={runGenerate}
        >
          {loading ? "Working…" : "Generate Growth Pack"}
        </button>
      </section>

      {loading && (
        <section style={styles.cardMuted} aria-live="polite">
          <div style={styles.spinnerRow}>
            <span style={styles.spinner} />
            <strong>{LOADING_STEPS[loadingStep]}</strong>
          </div>
          <p style={styles.mutedSmall}>
            Pipeline: competitor inference → simulated ad library → pattern aggregation →
            recombination-based campaigns.
          </p>
        </section>
      )}

      {error && (
        <section style={styles.errorCard} role="alert">
          {error}
        </section>
      )}

      {pack && !loading && (
        <>
          <nav style={styles.tabs} role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                style={{
                  ...styles.tab,
                  ...(tab === t.id ? styles.tabActive : {}),
                }}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <section style={styles.panel} hidden={tab !== "business"}>
            <h2 style={styles.h2}>Business understanding</h2>
            <dl style={styles.dl}>
              <dt>URL</dt>
              <dd>{pack.business.url}</dd>
              <dt>Category</dt>
              <dd>{pack.business.category}</dd>
              {pack.business.product_service && (
                <>
                  <dt>Product / service</dt>
                  <dd>{pack.business.product_service}</dd>
                </>
              )}
              <dt>Value proposition</dt>
              <dd>
                <ul>
                  {pack.business.value_proposition.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </dd>
              <dt>Target audience hypothesis</dt>
              <dd>
                <ul>
                  {pack.business.target_audience.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </dd>
              {pack.business.pricing_tier_inference &&
                pack.business.pricing_tier_inference.length > 0 && (
                  <>
                    <dt>Pricing tier inference</dt>
                    <dd>
                      <ul>
                        {pack.business.pricing_tier_inference.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </dd>
                  </>
                )}
            </dl>
          </section>

          <section style={styles.panel} hidden={tab !== "competitors"}>
            <h2 style={styles.h2}>Competitors &amp; simulated ad intelligence</h2>
            <p style={styles.muted}>
              Competitors (5–10): {pack.business.competitors.join(", ")}
            </p>
            <p style={styles.mutedSmall}>
              Ads below are simulated samples for pattern decomposition (Meta / TikTok /
              Google-style), not copies of live creatives.
            </p>
            <div style={styles.adGrid}>
              {pack.competitor_ads.map((ad, i) => (
                <article key={i} style={styles.adCard}>
                  <div style={styles.adMeta}>
                    <span style={styles.badge}>{ad.platform || "ad"}</span>
                    <strong>{ad.competitor}</strong>
                  </div>
                  <p style={styles.adText}>{ad.text}</p>
                  <table style={styles.miniTable}>
                    <tbody>
                      <tr>
                        <td>Hook</td>
                        <td>{ad.hook_type}</td>
                      </tr>
                      <tr>
                        <td>Angle</td>
                        <td>{ad.angle}</td>
                      </tr>
                      <tr>
                        <td>Audience</td>
                        <td>{ad.audience_target}</td>
                      </tr>
                      <tr>
                        <td>Offer</td>
                        <td>{ad.offer_type}</td>
                      </tr>
                      <tr>
                        <td>Trigger</td>
                        <td>{ad.emotional_trigger}</td>
                      </tr>
                      <tr>
                        <td>Format</td>
                        <td>{ad.format}</td>
                      </tr>
                      <tr>
                        <td>CTA</td>
                        <td>{ad.cta}</td>
                      </tr>
                    </tbody>
                  </table>
                </article>
              ))}
            </div>
          </section>

          <section style={styles.panel} hidden={tab !== "market"}>
            <h2 style={styles.h2}>Market pattern analysis</h2>
            <div style={styles.twoCol}>
              <div>
                <h3 style={styles.h3}>Top hooks</h3>
                <ul>
                  {pack.market_insights.top_hooks.map((h, i) => (
                    <li key={i}>
                      {h.label}: {h.percent}%
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={styles.h3}>Top angles</h3>
                <ul>
                  {pack.market_insights.top_angles.map((h, i) => (
                    <li key={i}>
                      {h.label}: {h.percent}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {pack.market_insights.top_emotional_triggers &&
              pack.market_insights.top_emotional_triggers.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h3 style={styles.h3}>Emotional triggers</h3>
                  <ul>
                    {pack.market_insights.top_emotional_triggers.map((h, i) => (
                      <li key={i}>
                        {h.label}: {h.percent}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            <h3 style={styles.h3}>Saturation / gaps</h3>
            <ul>
              {pack.market_insights.saturation_gaps.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
            <h3 style={styles.h3}>Winning patterns</h3>
            <ul>
              {pack.market_insights.winning_patterns.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
            {pack.market_insights.underused_opportunities &&
              pack.market_insights.underused_opportunities.length > 0 && (
                <>
                  <h3 style={styles.h3}>Underused opportunities</h3>
                  <ul>
                    {pack.market_insights.underused_opportunities.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </>
              )}
            {pack.market_insights.positioning_saturation_map &&
              pack.market_insights.positioning_saturation_map.length > 0 && (
                <>
                  <h3 style={styles.h3}>Positioning saturation map</h3>
                  <ul>
                    {pack.market_insights.positioning_saturation_map.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </>
              )}
          </section>

          <section style={styles.panel} hidden={tab !== "ads"}>
            <h2 style={styles.h2}>Pattern-derived ads</h2>
            <p style={styles.mutedSmall}>
              Variations recombine top market patterns, whitespace angles, and your URL
              positioning.
            </p>
            {pack.ads_by_angle_clusters.map((cluster, ci) => (
              <div key={ci} style={{ marginBottom: 24 }}>
                <h3 style={styles.h3}>{cluster.cluster_name}</h3>
                <div style={styles.adGrid}>
                  {cluster.ads.map((ad, i) => (
                    <article key={i} style={styles.adCard}>
                      <p style={styles.hook}>{ad.hook}</p>
                      <p style={styles.adText}>{ad.primary_text}</p>
                      <p style={styles.ctaLine}>
                        <strong>CTA:</strong> {ad.cta}
                      </p>
                      <p style={styles.mutedSmall}>
                        {ad.angle_label} · {ad.emotional_trigger_label}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
            <h3 style={styles.h3}>All generated variations</h3>
            <div style={styles.adGrid}>
              {pack.generated_ads.map((ad, i) => (
                <article key={i} style={styles.adCard}>
                  <p style={styles.hook}>{ad.hook}</p>
                  <p style={styles.adText}>{ad.primary_text}</p>
                  <p style={styles.ctaLine}>
                    <strong>CTA:</strong> {ad.cta}
                  </p>
                  <p style={styles.mutedSmall}>
                    {ad.angle_label} · {ad.emotional_trigger_label}
                  </p>
                </article>
              ))}
            </div>
            <h3 style={styles.h3}>Landing page ideas</h3>
            <ul>
              {pack.landing_headlines.map((h, i) => (
                <li key={i}>
                  <strong>H{i + 1}:</strong> {h}
                </li>
              ))}
            </ul>
            <ul>
              {pack.landing_subcopy.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
            <h3 style={styles.h3}>UGC script ideas</h3>
            <ol>
              {pack.ugc_script_ideas.map((s, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <pre style={styles.pre}>{s}</pre>
                </li>
              ))}
            </ol>
            <h3 style={styles.h3}>Suggested campaign structure</h3>
            <ul>
              <li>
                <strong>Meta:</strong>{" "}
                {pack.suggested_campaign_structure.meta_campaign_name}
              </li>
              <li>
                <strong>TikTok:</strong>{" "}
                {pack.suggested_campaign_structure.tiktok_campaign_name}
              </li>
              <li>
                <strong>Ad set hint:</strong>{" "}
                {pack.suggested_campaign_structure.ad_set_naming_hint}
              </li>
            </ul>
          </section>

          <section style={styles.panel} hidden={tab !== "download"}>
            <h2 style={styles.h2}>Download full campaign pack</h2>
            <p style={styles.muted}>
              JSON export includes the full structured pack for your stack. PDF can be
              added behind the same Stripe gate later.
            </p>

            {!downloadUnlocked ? (
              <div style={styles.lockBox}>
                <p style={{ marginTop: 0 }}>
                  Downloads are reserved for paid plans. Stripe Checkout will mount here
                  (e.g. create checkout session server route, success URL sets entitlement).
                </p>
                <p style={styles.mutedSmall}>
                  Env hooks: <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> (client) and{" "}
                  <code>STRIPE_SECRET_KEY</code> / webhook secret on the server when you wire
                  billing.
                </p>
                <button type="button" style={styles.secondaryBtn} onClick={unlockPlaceholder}>
                  Simulate successful checkout (MVP placeholder)
                </button>
              </div>
            ) : (
              <button type="button" style={styles.primaryBtn} onClick={downloadJson}>
                Download campaign pack (JSON)
              </button>
            )}
          </section>
        </>
      )}

      <footer style={styles.footer}>
        <span>MVP — Claude API required · pattern-first intelligence</span>
      </footer>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "32px 20px 64px",
  },
  header: { marginBottom: 28 },
  h1: { fontSize: "1.65rem", fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2 },
  sub: { margin: 0, color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.5 },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardMuted: {
    background: "var(--surface)",
    border: "1px dashed var(--border)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  label: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14, fontSize: 14 },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "#0b1018",
  },
  primaryBtn: {
    marginTop: 8,
    padding: "12px 18px",
    borderRadius: 8,
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    fontWeight: 600,
  },
  secondaryBtn: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
  },
  spinnerRow: { display: "flex", alignItems: "center", gap: 12 },
  spinner: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: "3px solid var(--border)",
    borderTopColor: "var(--accent)",
    display: "inline-block",
    animation: "spin 0.9s linear infinite",
  },
  muted: { color: "var(--muted)", fontSize: 15 },
  mutedSmall: { color: "var(--muted)", fontSize: 13, lineHeight: 1.5 },
  errorCard: {
    padding: 16,
    borderRadius: 10,
    background: "#3b1515",
    border: "1px solid #7f1d1d",
    color: "#fecaca",
    marginBottom: 20,
  },
  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
  },
  tabActive: {
    borderColor: "var(--accent)",
    color: "var(--text)",
    background: "rgba(61, 139, 253, 0.12)",
  },
  panel: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  h2: { marginTop: 0, fontSize: "1.2rem" },
  h3: { fontSize: "1rem", marginBottom: 8 },
  dl: { display: "grid", gridTemplateColumns: "160px 1fr", gap: "8px 16px", fontSize: 14 },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  adGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  adCard: {
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 12,
    background: "#0b1018",
    fontSize: 13,
  },
  adMeta: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  badge: {
    fontSize: 11,
    textTransform: "uppercase",
    padding: "2px 6px",
    borderRadius: 4,
    background: "var(--border)",
    color: "var(--muted)",
  },
  adText: { margin: "0 0 8px", lineHeight: 1.45 },
  hook: { fontWeight: 700, margin: "0 0 8px" },
  ctaLine: { margin: "8px 0 0", fontSize: 13 },
  miniTable: {
    width: "100%",
    fontSize: 12,
    borderCollapse: "collapse",
  },
  pre: {
    whiteSpace: "pre-wrap",
    margin: 0,
    fontSize: 12,
    color: "var(--muted)",
  },
  lockBox: {
    border: "1px dashed var(--warn)",
    borderRadius: 10,
    padding: 16,
    background: "rgba(251, 191, 36, 0.06)",
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    color: "var(--muted)",
    textAlign: "center",
  },
};
