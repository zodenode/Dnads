import type { GrowthPack } from "./types";
import { fetchUrlText } from "./urlFetch";
import { analyzeCompetitors } from "./competitorAnalysis";
import { synthesizeCompetitorAds } from "./adDecomposition";
import { aggregatePatterns } from "./patternAnalysis";
import { generateFromPatterns } from "./generationEngine";

export async function buildGrowthPack(rawUrl: string): Promise<GrowthPack> {
  const { url, text } = await fetchUrlText(rawUrl);
  const business = await analyzeCompetitors(url, text);
  const competitor_ads = await synthesizeCompetitorAds(business);
  const market_insights = aggregatePatterns(competitor_ads);
  const { generated_ads, campaign_pack } = await generateFromPatterns(
    business,
    competitor_ads,
    market_insights
  );

  return {
    business,
    competitor_ads,
    market_insights,
    generated_ads,
    campaign_pack,
    meta: {
      generated_at: new Date().toISOString(),
      source_url: url,
      pattern_note:
        "Competitor ads are simulated samples for pattern extraction (R&D). Outputs are recombinations of structured signals, not scraped creative.",
    },
  };
}
