import type { GrowthPackResponse } from "@/src/types/growth-pack";
import { fetchUrlText } from "./url-fetch";
import { inferBusinessAndCompetitorAds } from "./competitor-analysis";
import { buildMarketInsights } from "./pattern-analysis";
import { generateCampaignFromPatterns } from "./generation-engine";

export async function runGrowthPipeline(url: string): Promise<GrowthPackResponse> {
  const { text, ok } = await fetchUrlText(url);
  const { business, competitor_ads } = await inferBusinessAndCompetitorAds(url, text);

  const summary =
    business.product_summary ||
    [business.value_proposition?.[0], business.target_audience?.[0]].filter(Boolean).join(" ") ||
    business.category;

  const market_insights = await buildMarketInsights(
    competitor_ads,
    business.category || "general",
    summary
  );

  const { generated_ads, campaign_pack } = await generateCampaignFromPatterns(
    business,
    market_insights,
    competitor_ads
  );

  return {
    business,
    competitor_ads,
    market_insights,
    generated_ads,
    campaign_pack,
    meta: {
      generated_at: new Date().toISOString(),
      page_excerpt_chars: text.length,
      payment_required_for_full_download: true,
    },
  };
}
