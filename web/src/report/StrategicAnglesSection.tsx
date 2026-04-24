import type { StrategicAngle } from './reportData'
import { Confidence } from './Confidence'

type Props = { angles: StrategicAngle[] }

export function StrategicAnglesSection({ angles }: Props) {
  return (
    <section className="layer" aria-labelledby="angles-heading">
      <header className="layer__head">
        <p className="eyebrow">Layer 2 · Agency thinking</p>
        <h2 id="angles-heading">Winning Creative Angles Identified</h2>
        <p className="layer__lede">
          Psychological framing, saturation, and usage guidance before any creative units ship.
        </p>
      </header>

      <div className="angle-scroller" role="list">
        {angles.map((a) => (
          <article key={a.id} className="card card--angle" role="listitem">
            <header className="card--angle__head">
              <span className="angle-icon" aria-hidden>
                🧠
              </span>
              <div>
                <h3 className="angle-title">{a.title}</h3>
                <div className="angle-meta">
                  <Confidence value={a.confidence} />
                  <span className="meta-pill">
                    Market usage: {a.marketUsage} ({a.marketUsagePct}%)
                  </span>
                  <span className="meta-pill">Opportunity: {a.opportunity}</span>
                </div>
              </div>
            </header>

            <dl className="angle-dl">
              <div>
                <dt>Psychological framing</dt>
                <dd>{a.psychologicalFraming}</dd>
              </div>
              <div>
                <dt>Saturation level</dt>
                <dd>{a.saturationLevel}</dd>
              </div>
              <div>
                <dt>Usage recommendation</dt>
                <dd>{a.usageRecommendation}</dd>
              </div>
            </dl>

            <div className="angle-block">
              <h4 className="angle-block__label">Why it works</h4>
              <p className="angle-block__text">{a.whyItWorks}</p>
            </div>
            <div className="angle-block">
              <h4 className="angle-block__label">Example positioning</h4>
              <p className="angle-block__text angle-block__text--emph">{a.examplePositioning}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
