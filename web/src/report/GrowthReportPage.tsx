import { CampaignPackSection } from './CampaignPackSection'
import { CompetitorSection } from './CompetitorSection'
import { MarketOverviewSection } from './MarketOverviewSection'
import { ProductionQueueSection } from './ProductionQueueSection'
import {
  campaignPack,
  competitors,
  marketOverview,
  productionQueue,
  strategicAngles,
  winningAdsSeed,
} from './reportData'
import { StrategicAnglesSection } from './StrategicAnglesSection'
import { WinningAdsBoard } from './WinningAdsBoard'

export function GrowthReportPage() {
  return (
    <div className="report">
      <header className="report__hero">
        <p className="eyebrow">Full growth report · Single surface</p>
        <h1 className="report__title">Structured creative strategy report</h1>
        <p className="report__subtitle">
          Flow: market insight → strategic interpretation → creative angles → ads → production
          assets. Nothing is presented as absolute — confidence and reason signals travel with each
          block.
        </p>
      </header>

      <ol className="flow-rail" aria-label="Report flow">
        <li>Market intelligence</li>
        <li>Strategic angles</li>
        <li>Competitor intelligence</li>
        <li>Creative board</li>
        <li>Production queue</li>
        <li>Campaign pack</li>
      </ol>

      <MarketOverviewSection data={marketOverview} />
      <StrategicAnglesSection angles={strategicAngles} />
      <CompetitorSection competitors={competitors} />
      <WinningAdsBoard ads={winningAdsSeed} initialVisible={5} />
      <ProductionQueueSection items={productionQueue} />
      <CampaignPackSection pack={campaignPack} />
    </div>
  )
}
