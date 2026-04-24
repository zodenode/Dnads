import { useMemo, useState } from 'react'
import type { AdBreakdown, CompetitorDetail, Trend } from './reportData'
import { Confidence } from './Confidence'

type Props = { competitors: CompetitorDetail[] }

function TrendGlyph({ trend }: { trend: Trend }) {
  if (trend === 'up') return <span aria-label="Trending up">↑</span>
  if (trend === 'down') return <span aria-label="Trending down">↓</span>
  return <span aria-label="Flat trend">→</span>
}

function AdBreakdownPanel({ ad, onClose }: { ad: AdBreakdown; onClose: () => void }) {
  const [showCopy, setShowCopy] = useState(false)

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="ad-breakdown-title">
      <div className="drawer__header">
        <h3 id="ad-breakdown-title">Ad Breakdown</h3>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="drawer__hint">Structured read first — copy is optional.</p>
      <dl className="breakdown-dl">
        <div>
          <dt>Hook Type</dt>
          <dd>{ad.hookType}</dd>
        </div>
        <div>
          <dt>Angle</dt>
          <dd>{ad.angle}</dd>
        </div>
        <div>
          <dt>Emotional Trigger</dt>
          <dd>{ad.emotionalTrigger}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>{ad.format}</dd>
        </div>
        <div>
          <dt>CTA</dt>
          <dd>{ad.cta}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="btn btn--secondary"
        onClick={() => setShowCopy((v) => !v)}
        aria-expanded={showCopy}
      >
        {showCopy ? 'Hide ad text' : 'View ad text'}
      </button>
      {showCopy ? (
        <div className="copy-reveal">
          <p>{ad.adText}</p>
        </div>
      ) : null}
    </div>
  )
}

export function CompetitorSection({ competitors }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [adIndex, setAdIndex] = useState(0)

  const active = useMemo(
    () => competitors.find((c) => c.id === activeId) ?? null,
    [activeId, competitors],
  )

  return (
    <section className="layer layer--intel" aria-labelledby="competitor-heading">
      <header className="layer__head">
        <p className="eyebrow">Layer 3 · Competitor intelligence</p>
        <h2 id="competitor-heading">Competitor landscape</h2>
        <p className="layer__lede">
          Bloomberg-style table. Select a row to open structured ad breakdown — not copy-first.
        </p>
      </header>

      <div className="intel-layout">
        <div className="card card--table">
          <div className="table-wrap">
            <table className="intel-table">
              <thead>
                <tr>
                  <th scope="col">Competitor</th>
                  <th scope="col">Spend band</th>
                  <th scope="col">Confidence</th>
                  <th scope="col">Dominant angle</th>
                  <th scope="col">Trend</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.id} className={c.id === activeId ? 'is-active' : undefined}>
                    <th scope="row">{c.name}</th>
                    <td>{c.spendBand}</td>
                    <td>
                      <Confidence value={c.confidence} />
                    </td>
                    <td>{c.dominantAngle}</td>
                    <td>
                      <TrendGlyph trend={c.trend} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--table"
                        onClick={() => {
                          setActiveId(c.id)
                          setAdIndex(0)
                        }}
                      >
                        Open breakdown
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="intel-side">
          {active ? (
            <>
              <div className="card card--compact">
                <h3 className="card__title">{active.name}</h3>
                <p className="muted small">
                  Confidence on spend inference <Confidence value={active.confidence} />. Trend{' '}
                  <TrendGlyph trend={active.trend} />.
                </p>
                {active.ads.length > 1 ? (
                  <div className="ad-tabs">
                    {active.ads.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`btn btn--tab ${i === adIndex ? 'is-active' : ''}`}
                        onClick={() => setAdIndex(i)}
                      >
                        Ad {i + 1}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <AdBreakdownPanel ad={active.ads[adIndex]} onClose={() => setActiveId(null)} />
            </>
          ) : (
            <div className="card card--placeholder">
              <p className="muted">Select a competitor row to open the Ad Breakdown panel.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
