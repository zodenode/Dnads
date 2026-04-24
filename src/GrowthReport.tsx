import { useMemo, useState } from 'react'
import type {
  Competitor,
  CompetitorAd,
  GrowthReportData,
  StrategicAngle,
  WinningAd,
} from './types/report'
import './GrowthReport.css'

function formatConfidence(n: number) {
  return n.toFixed(2)
}

function pressureLabel(level: string) {
  if (level === 'high') return 'HIGH'
  if (level === 'medium') return 'MEDIUM'
  return 'LOW'
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
  const lines = Object.entries(sections).map(([k, v]) => `${k}: ${v}`)
  return <div className="gr-prompt-box">{lines.join('\n\n')}</div>
}

function ReasonSignalsBlock({
  confidence,
  signals,
}: {
  confidence: number
  signals: { label: string; detail: string }[]
}) {
  return (
    <details>
      <summary className="gr-collapsible-trigger">
        <span>Analyst reasoning</span>
        <span>Confidence {formatConfidence(confidence)}</span>
      </summary>
      <ul className="gr-reason-list">
        {signals.map((s) => (
          <li key={s.label}>
            <strong>{s.label}:</strong> {s.detail}
          </li>
        ))}
      </ul>
    </details>
  )
}

function MarketLayer({ data }: { data: GrowthReportData['market'] }) {
  return (
    <section className="gr-section" aria-labelledby="market-heading">
      <p className="gr-section-label">Layer 1 — Market intelligence</p>
      <div className="gr-market-card">
        <h2 id="market-heading">Market overview</h2>
        <p className="gr-angle-meta" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Interpretation only — no creative execution in this block.
        </p>
        <dl className="gr-market-grid">
          <div className="gr-kv">
            <dt>Category</dt>
            <dd>{data.category}</dd>
          </div>
          <div className="gr-kv">
            <dt>Market pressure</dt>
            <dd className={data.marketPressure === 'high' ? 'gr-pressure-high' : ''}>
              {pressureLabel(data.marketPressure)}
              {data.marketPressure === 'high' ? ' · elevated spend efficiency bar' : ''}
            </dd>
          </div>
          <div className="gr-kv">
            <dt>Competitor intensity</dt>
            <dd>{data.competitorIntensity}</dd>
          </div>
          <div className="gr-kv">
            <dt>Opportunity level</dt>
            <dd style={{ textTransform: 'capitalize' }}>{data.opportunityLevel}</dd>
          </div>
        </dl>
        <div className="gr-market-strategy">
          <p className="gr-quote-block">
            <strong>Dominant strategy:</strong> “{data.dominantStrategy}”
          </p>
          <p className="gr-quote-block">
            <strong>Weak gap:</strong> “{data.weakGap}”
          </p>
        </div>
        <details>
          <summary className="gr-collapsible-trigger">
            <span>Confidence &amp; reason signals</span>
            <span>{formatConfidence(data.confidence)}</span>
          </summary>
          <ul className="gr-reason-list">
            {data.reasonSignals.map((s) => (
              <li key={s.label}>
                <strong>{s.label}:</strong> {s.detail}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  )
}

function AnglesLayer({ angles }: { angles: StrategicAngle[] }) {
  return (
    <section className="gr-section" aria-labelledby="angles-heading">
      <p className="gr-section-label">Layer 2 — Strategic angles</p>
      <h2 id="angles-heading" className="gr-section-title">
        Winning creative angles identified
      </h2>
      <div className="gr-angles-scroll" role="list">
        {angles.map((a) => (
          <article key={a.id} className="gr-angle-card" role="listitem">
            <span className={angleTagClass(a.colorKey)} aria-hidden>
              Angle
            </span>
            <h3>{a.title}</h3>
            <p className="gr-angle-meta">
              Confidence <strong>{formatConfidence(a.confidence)}</strong>
              <br />
              Market usage: {a.marketUsage.level} ({a.marketUsage.percent}%)
              <br />
              Opportunity:{' '}
              <span style={{ textTransform: 'capitalize' }}>{a.opportunity}</span>
            </p>
            <p className="gr-angle-body">
              <strong>Why it works:</strong> {a.whyItWorks}
            </p>
            <p className="gr-angle-body">
              <strong>Example positioning:</strong> “{a.examplePositioning}”
            </p>
            <p className="gr-angle-body">
              <strong>Psychological framing:</strong> {a.psychologicalFraming}
            </p>
            <p className="gr-angle-body">
              <strong>Saturation:</strong> {a.saturationLevel}
            </p>
            <p className="gr-angle-body">
              <strong>Usage recommendation:</strong> {a.usageRecommendation}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function AdBreakdownPanel({ ad }: { ad: CompetitorAd }) {
  const [showCopy, setShowCopy] = useState(false)
  return (
    <div className="gr-panel">
      <h4>Ad breakdown</h4>
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

  return (
    <section className="gr-section" aria-labelledby="comp-heading">
      <details>
        <summary className="gr-collapsible-trigger" style={{ padding: '0.75rem 0' }}>
          <span>
            <span aria-hidden>◇ </span>Layer 3 — Competitor intelligence (optional)
          </span>
          <span>Expand</span>
        </summary>
        <p className="gr-section-label" style={{ marginTop: '0.5rem' }}>
          Bloomberg-style read
        </p>
        <h2 id="comp-heading" className="gr-section-title">
          Competitive set
        </h2>
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
                  <td>{c.spendBand}</td>
                  <td>{formatConfidence(c.confidence)}</td>
                  <td>{c.dominantAngle}</td>
                  <td>
                    <span className={`gr-trend gr-trend--${c.trend}`}>{trendSymbol(c.trend)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected && selected.ads[0] && <AdBreakdownPanel ad={selected.ads[0]} />}
      </details>
    </section>
  )
}

function formatBadge(f: WinningAd['format']) {
  if (f === 'static') return 'Static'
  if (f === 'video') return 'Video'
  return 'Image'
}

function WinningAdCard({ ad }: { ad: WinningAd }) {
  const [imagePromptVisible, setImagePromptVisible] = useState(false)

  return (
    <article className="gr-ad-card">
      <div className="gr-ad-card-header">
        <span className={angleTagClass(ad.angleColorKey)}>{ad.angleTitle}</span>
        <span className="gr-format-badge">{formatBadge(ad.format)}</span>
        <span className="gr-score">
          Expected performance <span>{ad.performanceScore}</span>
          <span style={{ color: 'var(--gr-text-muted)', fontWeight: 500 }}> / 100</span>
        </span>
      </div>
      <p className="gr-hook">{ad.hook}</p>
      <p className="gr-ad-body">{ad.body}</p>
      <p className="gr-ad-cta">{ad.cta}</p>
      <ReasonSignalsBlock confidence={ad.confidence} signals={ad.reasonSignals} />
      <details>
        <summary className="gr-collapsible-trigger">Strategy notes</summary>
        <div className="gr-collapsible-panel">
          <p>
            <strong>Why this hook works:</strong> {ad.strategyNotes.hookRationale}
          </p>
          <p>
            <strong>Competitor inspiration:</strong> {ad.strategyNotes.competitorInspiration}
          </p>
          <p>
            <strong>Psychological trigger:</strong> {ad.strategyNotes.psychologicalTrigger}
          </p>
        </div>
      </details>
      <details>
        <summary className="gr-collapsible-trigger">Production details</summary>
        <div className="gr-collapsible-panel">
          {ad.format === 'static' && ad.staticDetails && (
            <>
              <p>
                <strong>Full copy</strong>
              </p>
              <div className="gr-prompt-box">{ad.staticDetails.fullCopy}</div>
              <p>
                <strong>Layout suggestion</strong>
              </p>
              <p>{ad.staticDetails.layoutSuggestion}</p>
              <p>
                <strong>Text hierarchy</strong>
              </p>
              <p>{ad.staticDetails.textHierarchy}</p>
            </>
          )}
          {ad.format === 'video' && ad.videoDetails && (
            <>
              <p>
                <strong>Scene breakdown</strong>
              </p>
              <ul className="gr-reason-list">
                {ad.videoDetails.scenes.map((s) => (
                  <li key={s.range}>
                    <strong>{s.range}:</strong> {s.beat}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Voiceover script</strong>
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
              {!imagePromptVisible ? (
                <button type="button" className="gr-btn" onClick={() => setImagePromptVisible(true)}>
                  Generate creative
                </button>
              ) : (
                <>
                  <p style={{ marginTop: '0.75rem' }}>
                    <strong>Image prompt</strong> (copy-ready)
                  </p>
                  <PromptSectionsBox sections={ad.imageDetails.promptSections} />
                </>
              )}
              <p>
                <strong>Composition notes</strong>
              </p>
              <p>{ad.imageDetails.compositionNotes}</p>
              <p>
                <strong>Style guidance</strong>
              </p>
              <p>{ad.imageDetails.styleGuidance}</p>
            </>
          )}
        </div>
      </details>
    </article>
  )
}

function CreativeBoard({ ads }: { ads: WinningAd[] }) {
  const [visible, setVisible] = useState(5)
  const slice = ads.slice(0, visible)
  return (
    <section className="gr-section" aria-labelledby="board-heading">
      <p className="gr-section-label">Layer 4 — Creative strategy board</p>
      <h2 id="board-heading" className="gr-section-title">
        Winning ads grid
      </h2>
      <p className="gr-angle-meta" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
        Showing {slice.length} of {ads.length} concepts. Strategy notes and production fields stay
        collapsed by default.
      </p>
      <div className="gr-ads-grid">
        {slice.map((ad) => (
          <WinningAdCard key={ad.id} ad={ad} />
        ))}
      </div>
      {visible < ads.length && (
        <div className="gr-load-more">
          <button type="button" className="gr-btn" onClick={() => setVisible((v) => v + 5)}>
            Load more variations
          </button>
        </div>
      )}
    </section>
  )
}

function ProductionLayer({
  items,
}: {
  items: GrowthReportData['productionQueue']
}) {
  return (
    <section className="gr-section" aria-labelledby="prod-heading">
      <p className="gr-section-label">Layer 5 — Creative production</p>
      <h2 id="prod-heading" className="gr-section-title">
        Creative production queue
      </h2>
      <div className="gr-queue">
        {items.map((item) => (
          <details key={item.id} className="gr-queue-item">
            <summary style={{ cursor: 'pointer', listStyle: 'none' }}>
              <div className="gr-queue-head">
                <strong>{item.label}</strong>
                <span className={item.status === 'Test' ? 'gr-status gr-status--test' : 'gr-status'}>
                  {item.status}
                </span>
              </div>
              <div className="gr-queue-meta">
                Type: {item.type} · Hook strength: {item.hookStrength} · Angle: {item.angle} ·
                Confidence {formatConfidence(item.confidence)}
              </div>
            </summary>
            <ReasonSignalsBlock confidence={item.confidence} signals={item.reasonSignals} />
            <div className="gr-btn-row">
              <button type="button" className="gr-btn">
                Generate variations
              </button>
              <button type="button" className="gr-btn">
                Export to Midjourney / Runway / DALL·E
              </button>
            </div>
            {item.imagePromptSections && (
              <>
                <p className="gr-angle-meta" style={{ marginTop: '1rem' }}>
                  Image prompt (structured)
                </p>
                <PromptSectionsBox sections={item.imagePromptSections} />
              </>
            )}
          </details>
        ))}
      </div>
    </section>
  )
}

function CampaignPackLayer({ pack }: { pack: GrowthReportData['campaignPack'] }) {
  return (
    <section className="gr-section" aria-labelledby="pack-heading">
      <p className="gr-section-label">Layer 6 — Campaign pack</p>
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
  return (
    <div className="gr-page">
      <div className="gr-shell">
        <header className="gr-doc-header">
          <h1>Growth intelligence report</h1>
          <p>
            Structured creative strategy — market insight, interpretation, execution, then assets.
            Generated {new Date(data.generatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
            .
          </p>
        </header>
        <MarketLayer data={data.market} />
        <AnglesLayer angles={data.angles} />
        <CompetitorLayer competitors={data.competitors} />
        <CreativeBoard ads={data.winningAds} />
        <ProductionLayer items={data.productionQueue} />
        <CampaignPackLayer pack={data.campaignPack} />
      </div>
    </div>
  )
}
