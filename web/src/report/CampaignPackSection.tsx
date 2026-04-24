import type { CampaignPackSummary } from './reportData'

type Props = { pack: CampaignPackSummary }

export function CampaignPackSection({ pack }: Props) {
  return (
    <section className="layer layer--pack" aria-labelledby="pack-heading">
      <header className="layer__head">
        <p className="eyebrow">Layer 6 · Campaign pack export</p>
        <h2 id="pack-heading">Campaign Pack Summary</h2>
      </header>

      <div className="card card--pack">
        <div className="pack-icon" aria-hidden>
          📦
        </div>
        <ul className="pack-list">
          <li>
            <strong>{pack.staticAds}</strong> Static Ads
          </li>
          <li>
            <strong>{pack.ugcScripts}</strong> UGC Scripts
          </li>
          <li>
            <strong>{pack.imageConcepts}</strong> Image Concepts
          </li>
          <li>
            <strong>{pack.landingVariants}</strong> Landing Page Variants
          </li>
          <li>
            <strong>{pack.dominantAngles}</strong> Strategy Angles Dominating
          </li>
        </ul>
        <div className="pack-actions">
          <button type="button" className="btn btn--primary">
            Download Full Pack
          </button>
          <button type="button" className="btn btn--secondary">
            Export to Ads Manager
          </button>
        </div>
      </div>
    </section>
  )
}
