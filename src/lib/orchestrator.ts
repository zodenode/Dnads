import { analyzeBusinessAndCompetitors } from "./competitor-analysis";
import { generateSimulatedCompetitorAds } from "./ad-decomposition";
import { analyzePatterns } from "./pattern-analysis";
import { generateCampaignFromPatterns } from "./generation-engine";
import { fetchUrlContext } from "./url-context";
import type { CampaignPack } from "./types";

export async function buildGrowthPack(url: string, notes?: string): Promise<CampaignPack> {
  const pageContext = await fetchUrlContext(url);
  const business = await analyzeBusinessAndCompetitors(url, `${pageContext}\n${notes || ""}`);
  const competitor_ads = await generateSimulatedCompetitorAds(business);
  const market_insights = await analyzePatterns(competitor_ads);
  const gen = await generateCampaignFromPatterns({
    business,
    ads: competitor_ads,
    market_insights,
  });

  return {
    business,
    competitor_ads,
    market_insights,
    generated_ads: gen.generated_ads,
    ads_by_angle_clusters: gen.ads_by_angle_clusters,
    landing_headlines: gen.landing_headlines,
    landing_subcopy: gen.landing_subcopy,
    ugc_script_ideas: gen.ugc_script_ideas,
    suggested_campaign_structure: gen.suggested_campaign_structure,
  };
}
