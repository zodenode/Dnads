import { useMemo, useState, type CSSProperties } from 'react'
import type { WinningAd } from './reportData'
import { Confidence } from './Confidence'

type Props = { ads: WinningAd[]; initialVisible?: number }

function angleStyle(hue: number): CSSProperties {
  return { ['--angle-hue' as string]: `${hue}` }
}

function ProductionExpand({ ad }: { ad: WinningAd }) {
  const [imagePromptOpen, setImagePromptOpen] = useState(false)

  if (ad.format === 'Static' && ad.staticDetail) {
    const d = ad.staticDetail
    return (
      <div className="prod-expand">
        <h4 className="prod-expand__title">Production details · Static</h4>
        <div className="prod-block">
          <h5>Full copy</h5>
          <p>{d.fullCopy}</p>
        </div>
        <div className="prod-block">
          <h5>Layout suggestion</h5>
          <p>{d.layoutSuggestion}</p>
        </div>
        <div className="prod-block">
          <h5>Text hierarchy</h5>
          <p>{d.textHierarchy}</p>
        </div>
      </div>
    )
  }

  if (ad.format === 'Video' && ad.videoDetail) {
    const d = ad.videoDetail
    return (
      <div className="prod-expand">
        <h4 className="prod-expand__title">Production details · Video</h4>
        <div className="prod-block">
          <h5>Scene breakdown</h5>
          <ul className="scene-list">
            {d.scenes.map((s) => (
              <li key={s.range}>
                <strong>{s.range}</strong> — {s.beat}
              </li>
            ))}
          </ul>
        </div>
        <div className="prod-block">
          <h5>Voiceover script</h5>
          <p>{d.voiceoverScript}</p>
        </div>
        <div className="prod-block">
          <h5>Retention mechanism</h5>
          <p>{d.retentionMechanism}</p>
        </div>
      </div>
    )
  }

  if (ad.format === 'Image' && ad.imageDetail) {
    const d = ad.imageDetail
    const p = d.aiPromptStructured
    return (
      <div className="prod-expand">
        <h4 className="prod-expand__title">Production details · Image</h4>
        {!imagePromptOpen ? (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setImagePromptOpen(true)}
          >
            Generate Creative
          </button>
        ) : (
          <div className="prompt-box">
            <h5>Image prompt (structured)</h5>
            <dl className="prompt-dl">
              <div>
                <dt>Subject</dt>
                <dd>{p.subject}</dd>
              </div>
              <div>
                <dt>Environment</dt>
                <dd>{p.environment}</dd>
              </div>
              <div>
                <dt>Lighting</dt>
                <dd>{p.lighting}</dd>
              </div>
              <div>
                <dt>Emotion</dt>
                <dd>{p.emotion}</dd>
              </div>
              <div>
                <dt>Composition</dt>
                <dd>{p.composition}</dd>
              </div>
              <div>
                <dt>Negative space</dt>
                <dd>{p.negativeSpace}</dd>
              </div>
              <div>
                <dt>Style reference</dt>
                <dd>{p.styleReference}</dd>
              </div>
            </dl>
          </div>
        )}
        <div className="prod-block">
          <h5>Composition notes</h5>
          <p>{d.compositionNotes}</p>
        </div>
        <div className="prod-block">
          <h5>Style guidance</h5>
          <p>{d.styleGuidance}</p>
        </div>
      </div>
    )
  }

  return (
    <p className="muted small">No production detail attached for this unit.</p>
  )
}

export function WinningAdsBoard({ ads, initialVisible = 5 }: Props) {
  const [visible, setVisible] = useState(initialVisible)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notesOpen, setNotesOpen] = useState<Record<string, boolean>>({})

  const shown = useMemo(() => ads.slice(0, visible), [ads, visible])

  return (
    <section className="layer layer--board" aria-labelledby="board-heading">
      <header className="layer__head">
        <p className="eyebrow">Layer 4 · Creative strategy board</p>
        <h2 id="board-heading">Winning Ads Grid</h2>
        <p className="layer__lede">
          Execution after interpretation. Cards stay structured; depth is progressive disclosure.
        </p>
      </header>

      <div className="ad-grid">
        {shown.map((ad) => {
          const notesExpanded = notesOpen[ad.id] ?? false
          const prodOpen = expandedId === ad.id
          return (
            <article key={ad.id} className="card card--ad" style={angleStyle(ad.angleHue)}>
              <header className="card--ad__header">
                <span className="angle-tag">{ad.angleLabel}</span>
                <div className="card--ad__scores">
                  <span className="perf-score" title="Model-estimated composite score">
                    {ad.expectedPerformance}
                    <span className="perf-score__label"> / 100</span>
                  </span>
                  <span className="format-badge">{ad.format}</span>
                </div>
              </header>

              <p className="ad-hook">{ad.hook}</p>
              <p className="ad-body">{ad.body}</p>
              <p className="ad-cta">
                <span className="ad-cta__label">CTA</span> {ad.cta}
              </p>

              <details
                className="notes-details"
                open={notesExpanded}
                onToggle={(e) =>
                  setNotesOpen((m) => ({ ...m, [ad.id]: (e.target as HTMLDetailsElement).open }))
                }
              >
                <summary>Strategy notes</summary>
                <dl className="notes-dl">
                  <div>
                    <dt>Why this hook works</dt>
                    <dd>{ad.notes.hookRationale}</dd>
                  </div>
                  <div>
                    <dt>Competitor inspiration</dt>
                    <dd>{ad.notes.competitorInspiration}</dd>
                  </div>
                  <div>
                    <dt>Psychological trigger</dt>
                    <dd>{ad.notes.psychologicalTrigger}</dd>
                  </div>
                </dl>
                <p className="small muted">
                  Model certainty on this card{' '}
                  <Confidence value={Math.min(0.95, ad.expectedPerformance / 100)} />
                </p>
              </details>

              <button
                type="button"
                className="btn btn--ghost btn--block"
                aria-expanded={prodOpen}
                onClick={() => setExpandedId(prodOpen ? null : ad.id)}
              >
                {prodOpen ? 'Hide production details' : 'Expand → Production details'}
              </button>
              {prodOpen ? <ProductionExpand ad={ad} /> : null}
            </article>
          )
        })}
      </div>

      {visible < ads.length ? (
        <div className="load-more">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setVisible((v) => Math.min(v + 3, ads.length))}
          >
            Load more variations
          </button>
          <span className="muted small">
            Showing {shown.length} of {ads.length} units
          </span>
        </div>
      ) : (
        <p className="muted small load-more">All {ads.length} units visible.</p>
      )}
    </section>
  )
}
