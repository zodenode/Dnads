import { useMemo, useState } from 'react'
import type {
  Competitor,
  CompetitorAd,
  GrowthReportData,
  SpendBand,
  StrategicAngle,
  WinningAd,
} from './types/report'
import { normalizeReport } from './lib/normalizeReport'
import './GrowthReport.css'

function confidencePct01(n: number): number {
  if (n > 1) return Math.round(Math.min(100, n))
  return Math.round(n * 100)
}

function formatConfidence01(n: number) {
  const x = n > 1 ? n / 100 : n
  return x.toFixed(2)
}

function pressureTier(level: string): string {
  if (level === 'high') return 'HIGH'
  if (level === 'medium') return 'MED'
  return 'LOW'
}

function opportunityTier(level: string): string {
  if (level === 'high') return 'HIGH'
  if (level === 'medium') return 'MED'
  return 'LOW'
}

function spendTier(b: SpendBand): string {
  if (b === 'very high') return 'VERY HIGH'
  return b.toUpperCase()
}

function trendSymbol(t: Competitor['trend']) {
  if (t === 'up') return '↑'
  if (t === 'down') return '↓'
  return '→'
}

function angleTagClass(key: StrategicAngle['colorKey']) {
  return `gr-tag gr-tag--${key}`
}

function PromptSectionsBox({ sections }: { sections: Record<string, string> }) {
  const order = [
    'subject',
    'environment',
    'lighting',
    'emotion',
    'composition',
    'negative space requirement',
    'negative space instruction',
    'style reference',
  ]
  const keys = [...new Set([...order.filter((k) => k in sections), ...Object.keys(sections)])]
  const lines = keys.map((k) => {
    const label =
      k === 'negative space instruction' ? 'negative space requirement' : k
    return `${label}: ${sections[k]}`
  })
  return <div className="gr-prompt-box">{lines.join('\n\n')}</div>
}

function CredibilityLine({
  confidence01,
  primaryReason,
}: {
  confidence01: number
  primaryReason: string
}) {
  const pct = confidencePct01(confidence01)
  return (
    <p className="gr-credibility-line">
      <span className="gr-badge gr-badge--confidence">Confidence {pct}/100</span>
      <span className="gr-reason-inline">Reason: {primaryReason}</span>
    </p>
  )
}

function CredibilityDetails({
  confidence01,
  signals,
}: {
  confidence01: number
  signals: { label: string; detail: string }[]
}) {
  if (signals.length <= 1) return null
  return (
    <details className="gr-credibility-more">
      <summary className="gr-collapsible-trigger">
        <span>Additional signals</span>
        <span>{formatConfidence01(confidence01)}</span>
      </summary>
      <ul className="gr-reason-list">
        {signals.slice(1).map((s) => (
          <li key={s.label}>
            <strong>{s.label}:</strong> {s.detail}
          </li>
        ))}
      </ul>
    </details>
  )
}

function MarketLayer({ data }: { data: GrowthReportData['market'] }) {
  const primaryReason = data.reasonSignals[0]?.detail ?? 'Directional read from category signals.'
  return (
    <section className="gr-section" aria-labelledby="market-heading">
      <p className="gr-section-label">1 · Market intelligence</p>
      <div className="gr-market-card">
        <h2 id="market-heading">Market overview</h2>
        <p className="gr-section-sub">Interpretation only. No ad copy in this section.</p>
        <dl className="gr-market-grid">
          <div className="gr-kv">
            <dt>Category</dt>
            <dd>{data.category}</dd>
          </div>
          <div className="gr-kv">
            <dt>Competitive pressure</dt>
            <dd>
              <span className={`gr-badge gr-badge--tier gr-tier-${data.marketPressure}`}>
                {pressureTier(data.marketPressure)}
              </span>
            </dd>
          </div>
          <div className="gr-kv">
            <dt>Opportunity level</dt>
            <dd>
              <span className={`gr-badge gr-badge--tier gr-tier-${data.opportunityLevel}`}>
                {opportunityTier(data.opportunityLevel)}
              </span>
            </dd>
          </div>
          <div className="gr-kv">
            <dt>Competitor intensity</dt>
            <dd>{data.competitorIntensity}</dd>
          </div>
        </dl>
        <div className="gr-market-strategy">
          <p className="gr-quote-block">
            <strong>Dominant ad strategy in market:</strong> {data.dominantStrategy}
          </p>
          <p className="gr-quote-block">
            <strong>Saturation notes:</strong> {data.saturationNotes}
          </p>
        </div>
        <CredibilityLine confidence01={data.confidence} primaryReason={primaryReason} />
        <CredibilityDetails confidence01={data.confidence} signals={data.reasonSignals} />
      </div>
    </section>
  )
}

function truncateAnalyst(s: string, max = 140) {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function StrategyInterpretationLayer({ angles }: { angles: StrategicAngle[] }) {
  return (
    <section className="gr-section" aria-labelledby="strategy-heading">
      <p className="gr-section-label">2 · Strategic interpretation</p>
      <h2 id="strategy-heading" className="gr-section-title">
        Dominant creative angles
      </h2>
      <p className="gr-section-sub">Analyst report format — not model explanation.</p>
      <div className="gr-angles-scroll" role="list">
        {angles.map((a) => {
          const signals = a.reasonSignals ?? []
          const primary = signals[0]?.detail ?? truncateAnalyst(a.whyItWorks)
          return (
            <article key={a.id} className="gr-angle-card" role="listitem">
              <span className={angleTagClass(a.colorKey)}>Angle type</span>
              <h3>{a.title}</h3>
              <CredibilityLine confidence01={a.confidence} primaryReason={primary} />
              <CredibilityDetails confidence01={a.confidence} signals={signals} />
              <p className="gr-angle-body">
                <strong>Why it works:</strong> {truncateAnalyst(a.whyItWorks, 120)}
              </p>
              <p className="gr-angle-body">
                <strong>Saturation:</strong> {a.saturationLevel}
              </p>
              <p className="gr-angle-body">
                <strong>Underused opportunity:</strong> {a.underusedOpportunity}
              </p>
              {a.examplePositioning && (
                <details>
                  <summary className="gr-collapsible-trigger">Reference positioning</summary>
                  <p className="gr-collapsible-panel">“{a.examplePositioning}”</p>
                </details>
              )}
              <details>
                <summary className="gr-collapsible-trigger">Framing &amp; usage</summary>
                <div className="gr-collapsible-panel">
                  <p>
                    <strong>Psychological framing:</strong> {a.psychologicalFraming}
                  </p>
                  <p>
                    <strong>Usage:</strong> {a.usageRecommendation}
                  </p>
                  <p className="gr-angle-meta">
                    Market usage: {a.marketUsage.level} ({a.marketUsage.percent}%)
                  </p>
                </div>
              </details>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function AdBreakdownPanel({ ad }: { ad: CompetitorAd }) {
  const [showCopy, setShowCopy] = useState(false)
  return (
    <div className="gr-panel">
      <h4>Structured breakdown</h4>
      <dl className="gr-breakdown-grid">
        <div className="gr-mini-kv">
          <dt>Hook type</dt>
          <dd>{ad.hookType}</dd>
        </div>
        <div className="gr-mini-kv">
          <dt>Angle</dt>
          <dd>{ad.angle}</dd>
        </div>
        <div className="gr-mini-kv">
          <dt>Emotional trigger</dt>
          <dd>{ad.emotionalTrigger}</dd>
        </div>
        <div className="gr-mini-kv">
          <dt>Format</dt>
          <dd>{ad.format}</dd>
        </div>
        <div className="gr-mini-kv">
          <dt>CTA</dt>
          <dd>{ad.cta}</dd>
        </div>
      </dl>
      {!showCopy ? (
        <button type="button" className="gr-btn" onClick={() => setShowCopy(true)}>
          View ad text
        </button>
      ) : (
        <div className="gr-prompt-box" style={{ marginTop: '0.75rem' }}>
          {ad.adText}
        </div>
      )}
    </div>
  )
}

function CompetitorLayer({ competitors }: { competitors: Competitor[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(competitors[0]?.id ?? null)
  const selected = useMemo(
    () => competitors.find((c) => c.id === selectedId) ?? null,
    [competitors, selectedId],
  )

  if (competitors.length === 0) return null

  return (
    <section className="gr-section" aria-labelledby="comp-heading">
      <p className="gr-section-label">3 · Competitor intelligence</p>
      <h2 id="comp-heading" className="gr-section-title">
        Competitive set
      </h2>
      <p className="gr-section-sub">Structured fields first. Raw competitor copy is gated.</p>
      <div className="gr-table-wrap">
        <table className="gr-table">
          <thead>
            <tr>
              <th>Competitor</th>
              <th>Spend band</th>
              <th>Confidence</th>
              <th>Dominant angle</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.id}>
                <td>
                  <button
                    type="button"
                    className="row-btn"
                    onClick={() => setSelectedId(c.id)}
                    aria-pressed={selectedId === c.id}
                  >
                    {c.name}
                  </button>
                </td>
                <td>
                  <span className="gr-badge gr-badge--tier">{spendTier(c.spendBand)}</span>
                </td>
                <td>{formatConfidence01(c.confidence)}</td>
                <td>{c.dominantAngle}</td>
                <td>
                  <span className={`gr-trend gr-trend--${c.trend}`}>{trendSymbol(c.trend)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="gr-comp-panel-wrap">
          <CredibilityLine
            confidence01={selected.confidence}
            primaryReason={
              selected.reasonSignals?.[0]?.detail ??
              'Structured read from creative pattern + spend proxies.'
            }
          />
          {selected.reasonSignals && selected.reasonSignals.length > 1 && (
            <CredibilityDetails confidence01={selected.confidence} signals={selected.reasonSignals} />
          )}
          {selected.ads[0] && <AdBreakdownPanel ad={selected.ads[0]} />}
        </div>
      )}
    </section>
  )
}

function formatBadge(f: WinningAd['format']) {
  if (f === 'static') return 'Static'
  if (f === 'video') return 'Video'
  return 'Image'
}

function videoStageLabel(range: string): string {
  if (range.startsWith('0')) return '0–3s · Hook'
  if (range.startsWith('3')) return '3–8s · Escalation'
  if (range.startsWith('8')) return '8–15s · Conversion push'
  return `${range} · Beat`
}

function WinningAdCard({ ad }: { ad: WinningAd }) {
  const [imagePromptVisible, setImagePromptVisible] = useState(false)
  const primaryReason = ad.reasonSignals[0]?.detail ?? 'Pattern fit vs category corpus.'

  return (
    <article className="gr-ad-card">
      <div className="gr-ad-card-header">
        <span className={angleTagClass(ad.angleColorKey)}>{ad.angleTitle}</span>
        <span className="gr-badge gr-badge--trigger">{ad.strategyNotes.psychologicalTrigger}</span>
        <span className="gr-format-badge">{formatBadge(ad.format)}</span>
        <span className="gr-score">
          Expected performance <span>{ad.performanceScore}</span>
          <span className="gr-score-den">/100</span>
        </span>
      </div>
      <p className="gr-hook">{ad.hook}</p>
      <p className="gr-ad-body">{ad.body}</p>
      <p className="gr-ad-cta">{ad.cta}</p>
      <CredibilityLine confidence01={ad.confidence} primaryReason={primaryReason} />
      <CredibilityDetails confidence01={ad.confidence} signals={ad.reasonSignals} />
      <details>
        <summary className="gr-collapsible-trigger">Execution notes</summary>
        <div className="gr-collapsible-panel">
          <p>
            <strong>Hook logic:</strong> {ad.strategyNotes.hookRationale}
          </p>
          <p>
            <strong>Competitor reference:</strong> {ad.strategyNotes.competitorInspiration}
          </p>
        </div>
      </details>
      <details>
        <summary className="gr-collapsible-trigger">Production assets</summary>
        <div className="gr-collapsible-panel">
          {ad.format === 'static' && ad.staticDetails && (
            <>
              <p>
                <strong>Layout guidance</strong>
              </p>
              <p>{ad.staticDetails.layoutSuggestion}</p>
              <p>
                <strong>Hierarchy suggestion</strong>
              </p>
              <p>{ad.staticDetails.textHierarchy}</p>
              <details>
                <summary className="gr-collapsible-trigger">Full copy</summary>
                <div className="gr-prompt-box">{ad.staticDetails.fullCopy}</div>
              </details>
            </>
          )}
          {ad.format === 'video' && ad.videoDetails && (
            <>
              <p>
                <strong>Three-stage script</strong>
              </p>
              <ul className="gr-reason-list">
                {ad.videoDetails.scenes.map((s) => (
                  <li key={s.range}>
                    <strong>{videoStageLabel(s.range)}:</strong> {s.beat}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Voiceover</strong>
              </p>
              <p>{ad.videoDetails.voiceoverScript}</p>
              <p>
                <strong>Retention mechanism</strong>
              </p>
              <p>{ad.videoDetails.retentionMechanism}</p>
            </>
          )}
          {ad.format === 'image' && ad.imageDetails && (
            <>
              <p>
                <strong>Composition &amp; style</strong>
              </p>
              <p>{ad.imageDetails.compositionNotes}</p>
              <p>{ad.imageDetails.styleGuidance}</p>
              {!imagePromptVisible ? (
                <button type="button" className="gr-btn" onClick={() => setImagePromptVisible(true)}>
                  Reveal image prompt
                </button>
              ) : (
                <>
                  <p style={{ marginTop: '0.75rem' }}>
                    <strong>Structured prompt</strong>
                  </p>
                  <PromptSectionsBox sections={ad.imageDetails.promptSections} />
                </>
              )}
            </>
          )}
        </div>
      </details>
    </article>
  )
}

type Cluster = { angle: StrategicAngle; ads: WinningAd[] }

function buildClusters(angles: StrategicAngle[], ads: WinningAd[]): Cluster[] {
  const byAngle = new Map<string, WinningAd[]>()
  for (const ad of ads) {
    const list = byAngle.get(ad.angleId) ?? []
    list.push(ad)
    byAngle.set(ad.angleId, list)
  }
  return angles
    .map((angle) => ({
      angle,
      ads: byAngle.get(angle.id) ?? [],
    }))
    .filter((c) => c.ads.length > 0)
}

function ClusterBlock({ cluster }: { cluster: Cluster }) {
  const [visible, setVisible] = useState(4)
  const sorted = [...cluster.ads].sort((a, b) => b.performanceScore - a.performanceScore)
  const slice = sorted.slice(0, visible)
  const clusterScore = Math.max(...cluster.ads.map((a) => a.performanceScore))
  const trigger = cluster.angle.psychologicalFraming

  return (
    <div className="gr-cluster">
      <header className="gr-cluster-head">
        <div>
          <h3 className="gr-cluster-title">{cluster.angle.title}</h3>
          <p className="gr-cluster-meta">
            Psychological trigger: <strong>{trigger}</strong>
            <span className="gr-cluster-score">
              Cluster expected performance <span>{clusterScore}</span>/100
            </span>
          </p>
        </div>
      </header>
      <div className="gr-ads-grid">
        {slice.map((ad) => (
          <WinningAdCard key={ad.id} ad={ad} />
        ))}
      </div>
      {visible < sorted.length && (
        <div className="gr-load-more">
          <button type="button" className="gr-btn" onClick={() => setVisible((v) => v + 4)}>
            View more variations
          </button>
        </div>
      )}
    </div>
  )
}

function CreativeStrategyBoard({ angles, ads }: { angles: StrategicAngle[]; ads: WinningAd[] }) {
  const clusters = useMemo(() => buildClusters(angles, ads), [angles, ads])
  return (
    <section className="gr-section" aria-labelledby="board-heading">
      <p className="gr-section-label">4 · Creative system</p>
      <h2 id="board-heading" className="gr-section-title">
        Creative strategy board
      </h2>
      <p className="gr-section-sub">
        Primary value layer — ads are grouped by angle cluster, not listed at random. Initial view
        limits variations per cluster.
      </p>
      <div className="gr-cluster-stack">
        {clusters.map((c) => (
          <ClusterBlock key={c.angle.id} cluster={c} />
        ))}
      </div>
    </section>
  )
}

function ProductionAssetsLayer({
  items,
}: {
  items: GrowthReportData['productionQueue']
}) {
  return (
    <section className="gr-section" aria-labelledby="prod-heading">
      <p className="gr-section-label">5 · Production assets</p>
      <h2 id="prod-heading" className="gr-section-title">
        Production queue
      </h2>
      <p className="gr-section-sub">
        Studio-style queue. Prompts and exports stay collapsed until explicitly opened.
      </p>
      <div className="gr-queue">
        {items.map((item) => {
          const primary = item.reasonSignals[0]?.detail ?? 'Queue ranking from model confidence.'
          return (
            <details key={item.id} className="gr-queue-item">
              <summary className="gr-queue-summary">
                <div className="gr-queue-head">
                  <strong>{item.label}</strong>
                  <span className={item.status === 'Test' ? 'gr-status gr-status--test' : 'gr-status'}>
                    {item.status}
                  </span>
                </div>
                <div className="gr-queue-meta">
                  {item.type} · Hook {item.hookStrength} · {item.angle}
                </div>
              </summary>
              <CredibilityLine confidence01={item.confidence} primaryReason={primary} />
              <CredibilityDetails confidence01={item.confidence} signals={item.reasonSignals} />
              <div className="gr-btn-row">
                <button type="button" className="gr-btn">
                  Generate variations
                </button>
                <button type="button" className="gr-btn">
                  Export to Midjourney / Runway / DALL·E
                </button>
              </div>
              {item.imagePromptSections && (
                <details className="gr-queue-prompt">
                  <summary className="gr-collapsible-trigger">Structured image prompt</summary>
                  <PromptSectionsBox sections={item.imagePromptSections} />
                </details>
              )}
            </details>
          )
        })}
      </div>
    </section>
  )
}

function CampaignPackLayer({ pack }: { pack: GrowthReportData['campaignPack'] }) {
  return (
    <section className="gr-section" aria-labelledby="pack-heading">
      <p className="gr-section-label">6 · Campaign pack</p>
      <div className="gr-pack-card">
        <h2 id="pack-heading" className="gr-section-title" style={{ marginBottom: '0.75rem' }}>
          Campaign pack summary
        </h2>
        <pre className="gr-pack-summary">
          {`${pack.staticAds} Static Ads
${pack.ugcScripts} UGC Scripts
${pack.imageConcepts} Image Concepts
${pack.landingVariants} Landing Page Variants
${pack.dominantAngles} Strategy Angles Dominating`}
        </pre>
        <div className="gr-pack-actions">
          <button type="button" className="gr-btn gr-btn--primary">
            Download full pack
          </button>
          <button type="button" className="gr-btn">
            Export to Ads Manager
          </button>
        </div>
      </div>
    </section>
  )
}

export function GrowthReport({ data }: { data: GrowthReportData }) {
  const report = useMemo(() => normalizeReport(data), [data])

  return (
    <div className="gr-page">
      <div className="gr-shell">
        <header className="gr-doc-header">
          <h1>Performance marketing intelligence terminal</h1>
          <p className="gr-hero-sub">
            Market insight → strategic interpretation → competitor intelligence → creative system →
            production assets. Generated{' '}
            {new Date(report.generatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}.
          </p>
        </header>
        <MarketLayer data={report.market} />
        <StrategyInterpretationLayer angles={report.angles} />
        <CompetitorLayer competitors={report.competitors} />
        <CreativeStrategyBoard angles={report.angles} ads={report.winningAds} />
        <ProductionAssetsLayer items={report.productionQueue} />
        <CampaignPackLayer pack={report.campaignPack} />
      </div>
    </div>
  )
}
