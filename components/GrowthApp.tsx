"use client";

import { useCallback, useState } from "react";
import type { GrowthPackResponse } from "@/src/types/growth-pack";

const LOADING_STEPS = [
  "Analyzing competitors…",
  "Extracting ad patterns…",
  "Generating campaigns…",
] as const;

type Tab = "business" | "competitors" | "market" | "ads" | "download";

export function GrowthApp() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pack, setPack] = useState<GrowthPackResponse | null>(null);
  const [tab, setTab] = useState<Tab>("business");
  const [unlocked, setUnlocked] = useState(false);

  const runGenerate = useCallback(async () => {
    setError(null);
    setPack(null);
    setLoading(true);
    setStepIdx(0);
    const timers = [
      setTimeout(() => setStepIdx(1), 2500),
      setTimeout(() => setStepIdx(2), 5500),
    ];
    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || res.statusText);
      }
      setPack(data as GrowthPackResponse);
      setTab("business");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      timers.forEach(clearTimeout);
      setLoading(false);
      setStepIdx(2);
    }
  }, [url]);

  const downloadJson = () => {
    if (!pack) return;
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `growth-pack-${encodeURIComponent(pack.business.url).slice(0, 40)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!pack && !loading) {
    return (
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.h1}>URL → Growth Intelligence</h1>
          <p style={styles.lead}>
            Competitor-driven marketing intelligence: discover patterns, gaps, and campaign-ready
            output from one URL.
          </p>
          <label style={styles.label}>
            Website URL
            <input
              style={styles.input}
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
          <button
            type="button"
            style={styles.primary}
            disabled={!url.trim()}
            onClick={runGenerate}
          >
            Generate Growth Pack
          </button>
          {error ? <p style={styles.error}>{error}</p> : null}
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.h1}>Building your pack</h1>
          <p style={styles.loading}>{LOADING_STEPS[stepIdx]}</p>
          <div style={styles.progress}>
            <div style={{ ...styles.progressBar, width: `${((stepIdx + 1) / LOADING_STEPS.length) * 100}%` }} />
          </div>
        </div>
      </main>
    );
  }

  if (!pack) return null;

  return (
    <main style={styles.mainWide}>
      <header style={styles.topBar}>
        <span style={styles.brand}>Growth Pack</span>
        <button type="button" style={styles.ghost} onClick={() => setPack(null)}>
          New URL
        </button>
      </header>

      <nav style={styles.tabs}>
        {(
          [
            ["business", "Business Insight"],
            ["competitors", "Competitor Analysis"],
            ["market", "Market Patterns"],
            ["ads", "Generated Ads"],
            ["download", "Download Pack"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            style={tab === id ? styles.tabActive : styles.tab}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <section style={styles.panel}>
        {tab === "business" && <BusinessTab pack={pack} />}
        {tab === "competitors" && <CompetitorsTab pack={pack} />}
        {tab === "market" && <MarketTab pack={pack} />}
        {tab === "ads" && <AdsTab pack={pack} />}
        {tab === "download" && (
          <DownloadTab
            unlocked={unlocked}
            onUnlock={() => setUnlocked(true)}
            onDownload={downloadJson}
          />
        )}
      </section>
    </main>
  );
}

function BusinessTab({ pack }: { pack: GrowthPackResponse }) {
  const b = pack.business;
  return (
    <div>
      <h2 style={styles.h2}>Business understanding</h2>
      <p style={styles.meta}>Source: {b.url}</p>
      <p>
        <strong>Category:</strong> {b.category}
      </p>
      {b.product_summary ? <p>{b.product_summary}</p> : null}
      <h3 style={styles.h3}>Value proposition</h3>
      <ul>
        {b.value_proposition?.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
      <h3 style={styles.h3}>Target audience hypothesis</h3>
      <ul>
        {b.target_audience?.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
      {b.pricing_tier_inference?.length ? (
        <>
          <h3 style={styles.h3}>Pricing tier inference</h3>
          <ul>
            {b.pricing_tier_inference.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function CompetitorsTab({ pack }: { pack: GrowthPackResponse }) {
  const by = new Map<string, typeof pack.competitor_ads>();
  for (const a of pack.competitor_ads) {
    const k = a.competitor;
    if (!by.has(k)) by.set(k, []);
    by.get(k)!.push(a);
  }
  return (
    <div>
      <h2 style={styles.h2}>Competitors & simulated ad intelligence</h2>
      <p style={styles.note}>
        Ads are simulated pattern samples for R&D (not scraped copies). Structured fields support
        downstream pattern analysis.
      </p>
      <ul style={styles.competitorList}>
        {pack.business.competitors?.map((c) => (
          <li key={c}>
            <strong>{c}</strong>
          </li>
        ))}
      </ul>
      {Array.from(by.entries()).map(([name, ads]) => (
        <div key={name} style={styles.block}>
          <h3 style={styles.h3}>
            {name} <span style={styles.badge}>{ads.length} samples</span>
          </h3>
          {ads.map((a, i) => (
            <article key={i} style={styles.adCard}>
              <div style={styles.tags}>
                <span style={styles.tag}>{a.platform}</span>
                <span style={styles.tag}>{a.hook_type}</span>
                <span style={styles.tag}>{a.format}</span>
              </div>
              <p style={styles.adText}>{a.text}</p>
              <dl style={styles.dl}>
                <dt>Angle</dt>
                <dd>{a.angle}</dd>
                <dt>Audience</dt>
                <dd>{a.audience_target}</dd>
                <dt>Offer</dt>
                <dd>{a.offer_type}</dd>
                <dt>Trigger</dt>
                <dd>{a.emotional_trigger}</dd>
                <dt>CTA</dt>
                <dd>{a.cta}</dd>
              </dl>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}

function MarketTab({ pack }: { pack: GrowthPackResponse }) {
  const m = pack.market_insights;
  return (
    <div>
      <h2 style={styles.h2}>Market pattern analysis</h2>
      <h3 style={styles.h3}>Hook distribution</h3>
      <InsightTable rows={m.top_hooks} />
      <h3 style={styles.h3}>Angle distribution</h3>
      <InsightTable rows={m.top_angles} />
      <h3 style={styles.h3}>Underused / gap opportunities</h3>
      <ul>
        {m.saturation_gaps?.map((r, i) => (
          <li key={i}>
            <strong>{r.label}</strong>
            {r.note ? ` — ${r.note}` : null}
            {r.pct != null ? ` (${r.pct}%)` : null}
          </li>
        ))}
      </ul>
      <h3 style={styles.h3}>Winning patterns</h3>
      <ul>
        {m.winning_patterns?.map((r, i) => (
          <li key={i}>
            <strong>{r.label}</strong>
            {r.note ? ` — ${r.note}` : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightTable({ rows }: { rows: { label: string; pct?: number; count?: number }[] }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Label</th>
          <th style={styles.th}>Count</th>
          <th style={styles.th}>%</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={styles.td}>{r.label}</td>
            <td style={styles.td}>{r.count ?? "—"}</td>
            <td style={styles.td}>{r.pct != null ? `${r.pct}%` : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AdsTab({ pack }: { pack: GrowthPackResponse }) {
  return (
    <div>
      <h2 style={styles.h2}>Pattern-driven new ads</h2>
      <p style={styles.note}>
        Variations combine top observed patterns, explicit gaps, and your URL positioning—not
        generic filler.
      </p>
      {pack.campaign_pack.ads_by_angle_clusters.map((cl, i) => (
        <div key={i} style={styles.block}>
          <h3 style={styles.h3}>Cluster: {cl.angle}</h3>
          {cl.ads.map((ad, j) => (
            <article key={j} style={styles.adCard}>
              <div style={styles.tags}>
                <span style={styles.tag}>{ad.angle_label}</span>
                <span style={styles.tag}>{ad.emotional_trigger_label}</span>
              </div>
              <p>
                <strong>Hook:</strong> {ad.hook}
              </p>
              <p style={styles.adText}>{ad.primary_text}</p>
              <p>
                <strong>CTA:</strong> {ad.cta}
              </p>
            </article>
          ))}
        </div>
      ))}
      <h3 style={styles.h3}>Landing & UGC (preview)</h3>
      <p>
        <strong>Headlines:</strong> {pack.campaign_pack.landing_headlines.join(" · ")}
      </p>
      <p>
        <strong>Subcopy:</strong> {pack.campaign_pack.landing_subcopy.join(" · ")}
      </p>
      <ol>
        {pack.campaign_pack.ugc_script_ideas.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <p>
        <strong>Campaign naming:</strong>{" "}
        {pack.campaign_pack.suggested_campaign_structure?.naming_convention}
      </p>
    </div>
  );
}

function DownloadTab({
  unlocked,
  onUnlock,
  onDownload,
}: {
  unlocked: boolean;
  onUnlock: () => void;
  onDownload: () => void;
}) {
  return (
    <div>
      <h2 style={styles.h2}>Download full campaign pack</h2>
      <p>
        Full JSON includes business profile, competitor ad intelligence, market insights, all
        generated variations, and the structured campaign pack. Stripe checkout will gate this in
        production.
      </p>
      <div style={styles.payBox}>
        {!unlocked ? (
          <>
            <p style={styles.muted}>Complete purchase to unlock download.</p>
            <button type="button" style={styles.primary} onClick={onUnlock}>
              Pay with Stripe (placeholder)
            </button>
            <p style={styles.fine}>
              MVP: this button simulates a successful checkout. Wire `checkout.session.completed`
              later to set a signed cookie or entitlements record.
            </p>
          </>
        ) : (
          <>
            <p style={styles.ok}>Unlocked for this session.</p>
            <button type="button" style={styles.primary} onClick={onDownload}>
              Download JSON pack
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  mainWide: { minHeight: "100vh", padding: "0 24px 48px" },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 28,
  },
  h1: { marginTop: 0, fontSize: "1.35rem" },
  h2: { marginTop: 0, fontSize: "1.2rem" },
  h3: { fontSize: "1rem", color: "var(--muted)" },
  lead: { color: "var(--muted)", fontSize: "0.95rem" },
  label: { display: "flex", flexDirection: "column", gap: 8, marginTop: 16, fontSize: "0.9rem" },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "#0b0e13",
    color: "var(--text)",
  },
  primary: {
    marginTop: 16,
    padding: "12px 18px",
    borderRadius: 8,
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    fontWeight: 600,
  },
  ghost: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
  },
  error: { color: "#f87171", marginTop: 12 },
  loading: { fontSize: "1.1rem", minHeight: 32 },
  progress: { height: 6, background: "var(--border)", borderRadius: 4, overflow: "hidden" },
  progressBar: { height: "100%", background: "var(--accent)", transition: "width 0.4s ease" },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid var(--border)",
  },
  brand: { fontWeight: 700 },
  tabs: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 },
  tab: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
  },
  tabActive: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid var(--accent)",
    background: "var(--accent-dim)",
    color: "var(--text)",
  },
  panel: {
    marginTop: 20,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 24,
    maxWidth: 900,
  },
  meta: { color: "var(--muted)", fontSize: "0.85rem" },
  note: { color: "var(--muted)", fontSize: "0.9rem" },
  competitorList: { columns: 2 },
  block: { marginBottom: 28 },
  adCard: {
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    background: "#0b0e13",
  },
  adText: { whiteSpace: "pre-wrap" },
  tags: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  tag: {
    fontSize: "0.75rem",
    padding: "2px 8px",
    borderRadius: 999,
    background: "var(--border)",
    color: "var(--text)",
  },
  badge: { fontSize: "0.75rem", color: "var(--muted)", fontWeight: 400 },
  dl: { display: "grid", gridTemplateColumns: "120px 1fr", gap: 4, fontSize: "0.9rem" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: 16 },
  th: { textAlign: "left", borderBottom: "1px solid var(--border)", padding: "8px 4px" },
  td: { borderBottom: "1px solid var(--border)", padding: "8px 4px", fontSize: "0.9rem" },
  payBox: {
    marginTop: 16,
    padding: 20,
    borderRadius: 10,
    border: "1px dashed var(--border)",
    background: "#0b0e13",
  },
  muted: { color: "var(--muted)" },
  fine: { fontSize: "0.8rem", color: "var(--muted)", marginTop: 12 },
  ok: { color: "#4ade80" },
};
