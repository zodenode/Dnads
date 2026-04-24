import type { MarketOverview as MarketOverviewType } from './reportData'
import { Confidence } from './Confidence'

type Props = { data: MarketOverviewType }

function pressureDot(level: MarketOverviewType['marketPressure']) {
  if (level === 'HIGH') return '●'
  if (level === 'MEDIUM') return '●'
  return '●'
}

function pressureClass(level: MarketOverviewType['marketPressure']) {
  if (level === 'HIGH') return 'pressure pressure--high'
  if (level === 'MEDIUM') return 'pressure pressure--mid'
  return 'pressure pressure--low'
}

export function MarketOverviewSection({ data }: Props) {
  return (
    <section className="layer layer--market" aria-labelledby="market-overview-heading">
      <header className="layer__head">
        <p className="eyebrow">Layer 1 · Executive read</p>
        <h2 id="market-overview-heading">Market Overview</h2>
        <p className="layer__lede">
          Interpretation only — no creative execution in this band. Signals anchor the rest of the
          report.
        </p>
      </header>

      <div className="card card--executive">
        <dl className="exec-grid">
          <div className="exec-row">
            <dt>Category</dt>
            <dd>{data.category}</dd>
          </div>
          <div className="exec-row">
            <dt>Market Pressure</dt>
            <dd>
              <span className={pressureClass(data.marketPressure)}>
                {data.marketPressure} {pressureDot(data.marketPressure)}
              </span>
              <Confidence value={data.marketPressureConfidence} />
            </dd>
          </div>
          <div className="exec-row">
            <dt>Competitor Intensity</dt>
            <dd>
              {data.competitorIntensity}
              <Confidence value={data.competitorIntensityConfidence} />
            </dd>
          </div>
          <div className="exec-row">
            <dt>Opportunity Level</dt>
            <dd>
              {data.opportunityLevel}
              <Confidence value={data.opportunityConfidence} />
            </dd>
          </div>
          <div className="exec-row exec-row--span">
            <dt>Dominant Strategy</dt>
            <dd>
              <q className="strategy-quote">{data.dominantStrategy}</q>
              <Confidence value={data.dominantStrategyConfidence} />
            </dd>
          </div>
          <div className="exec-row exec-row--span">
            <dt>Weak Gap</dt>
            <dd>
              <q className="strategy-quote strategy-quote--muted">{data.weakGap}</q>
              <Confidence value={data.weakGapConfidence} />
            </dd>
          </div>
        </dl>

        <div className="signal-block">
          <h3 className="signal-block__title">Reason signals</h3>
          <ul className="signal-list">
            {data.pressureSignals.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
