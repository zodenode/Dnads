import { useState } from 'react'
import type { ProductionQueueItem } from './reportData'

type Props = { items: ProductionQueueItem[] }

function StructuredPromptBox({
  prompt,
}: {
  prompt: ProductionQueueItem['structuredPrompt']
}) {
  return (
    <div className="prompt-box prompt-box--queue">
      <h4 className="prompt-box__title">Image prompt (clean format)</h4>
      <dl className="prompt-dl">
        <div>
          <dt>Subject</dt>
          <dd>{prompt.subject}</dd>
        </div>
        <div>
          <dt>Environment</dt>
          <dd>{prompt.environment}</dd>
        </div>
        <div>
          <dt>Lighting</dt>
          <dd>{prompt.lighting}</dd>
        </div>
        <div>
          <dt>Emotion</dt>
          <dd>{prompt.emotion}</dd>
        </div>
        <div>
          <dt>Composition</dt>
          <dd>{prompt.composition}</dd>
        </div>
        <div>
          <dt>Negative space instruction</dt>
          <dd>{prompt.negativeSpace}</dd>
        </div>
        <div>
          <dt>Style reference</dt>
          <dd>{prompt.styleReference}</dd>
        </div>
      </dl>
    </div>
  )
}

export function ProductionQueueSection({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="layer layer--production" aria-labelledby="production-heading">
      <header className="layer__head">
        <p className="eyebrow">Layer 5 · Creative production queue</p>
        <h2 id="production-heading">Creative Production Queue</h2>
        <p className="layer__lede">
          Studio-style queue — prompts stay behind expansion and export actions, not dumped upfront.
        </p>
      </header>

      <div className="queue-list">
        {items.map((item) => {
          const expanded = openId === item.id
          return (
            <article key={item.id} className="card card--queue">
              <header className="card--queue__head">
                <div>
                  <h3 className="queue-title">{item.label}</h3>
                  <dl className="queue-meta">
                    <div>
                      <dt>Type</dt>
                      <dd>{item.type}</dd>
                    </div>
                    <div>
                      <dt>Hook strength</dt>
                      <dd>{item.hookStrength}</dd>
                    </div>
                    <div>
                      <dt>Angle</dt>
                      <dd>{item.angle}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{item.status}</dd>
                    </div>
                  </dl>
                </div>
                <div className="queue-actions">
                  <button type="button" className="btn btn--secondary">
                    Generate Variations
                  </button>
                  <button type="button" className="btn btn--primary">
                    Export to Midjourney / Runway / DALL·E
                  </button>
                </div>
              </header>

              <button
                type="button"
                className="btn btn--ghost btn--block"
                aria-expanded={expanded}
                onClick={() => setOpenId(expanded ? null : item.id)}
              >
                {expanded ? 'Hide production brief' : 'Expand production brief'}
              </button>
              {expanded ? <StructuredPromptBox prompt={item.structuredPrompt} /> : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
