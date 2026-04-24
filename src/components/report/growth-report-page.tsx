import type { GrowthReport } from "@/lib/report-types";
import { MarketIntelligenceHeader } from "./market-intelligence-header";
import { SectionShell } from "./section-shell";
import { StrategicAngles } from "./strategic-angles";
import { CompetitorIntelligence } from "./competitor-intelligence";
import { CreativeStrategyBoard } from "./creative-strategy-board";
import { ProductionQueue } from "./production-queue";
import { CampaignPackSummaryBlock } from "./campaign-pack";

export function GrowthReportPage({ report }: { report: GrowthReport }) {
  return (
    <main className="min-h-screen pb-16">
      <MarketIntelligenceHeader data={report.market} />

      <SectionShell
        kicker="Layer 2 · Agency thinking"
        title="Winning creative angles identified"
        id="angles"
      >
        <StrategicAngles angles={report.angles} />
      </SectionShell>

      <SectionShell
        kicker="Layer 3 · Intelligence desk"
        title="Competitor intelligence"
        id="competitors"
      >
        <CompetitorIntelligence competitors={report.competitors} />
      </SectionShell>

      <SectionShell kicker="Layer 4 · Strategy board" title="Creative strategy board" id="ads">
        <CreativeStrategyBoard ads={report.winningAds} />
      </SectionShell>

      <SectionShell kicker="Layer 5 · Production studio" title="Creative production queue" id="production">
        <ProductionQueue items={report.productionQueue} />
      </SectionShell>

      <SectionShell kicker="Layer 6 · Delivery" title="Campaign pack export" id="export">
        <CampaignPackSummaryBlock pack={report.pack} />
      </SectionShell>
    </main>
  );
}
