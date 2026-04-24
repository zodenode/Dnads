import type {
  Business,
  CampaignPackOutput,
  GeneratedAdVariation,
  MarketInsights,
  AdIntel,
} from "@/src/types/growth-pack";
import { claudeJson } from "./claude-client";

type GenPayload = {
  generated_ads: GeneratedAdVariation[];
  campaign_pack: CampaignPackOutput;
};

const SYSTEM_GEN = `You are a performance marketing strategist. You generate NEW ads by recombining observed market patterns—not generic copy.

Return ONLY valid JSON (no markdown):
{
  "generated_ads": GeneratedAdVariation[],
  "campaign_pack": CampaignPackOutput
}

GeneratedAdVariation: hook, primary_text, cta, angle_label, emotional_trigger_label (10-20 items).

CampaignPackOutput:
- ads_by_angle_clusters: exactly clusters that together include 10 ads total (group by angle_label; distribute if needed).
- landing_headlines: 3 strings
- landing_subcopy: 3 strings
- ugc_script_ideas: 5 short bullet-style scripts for vertical video
- suggested_campaign_structure: { "meta": string[], "tiktok": string[], "naming_convention": string } with campaign/ad set naming ideas

Rules:
- Every generated ad must cite implicit lineage from competitor patterns (angles/hooks) and underused gaps; write primary_text accordingly but do not mention "competitor" in customer-facing copy.
- No plagiarism: all new copy is original while mirroring structural patterns.
- Match the business URL/category positioning.`;

export async function generateCampaignFromPatterns(
  business: Business,
  market: MarketInsights,
  competitorAds: AdIntel[]
): Promise<GenPayload> {
  const user = JSON.stringify(
    {
      business,
      market_insights: market,
      competitor_ad_patterns: competitorAds.map((a) => ({
        hook_type: a.hook_type,
        angle: a.angle,
        emotional_trigger: a.emotional_trigger,
        format: a.format,
        cta: a.cta,
        platform: a.platform,
      })),
    },
    null,
    2
  );

  return claudeJson<GenPayload>(SYSTEM_GEN, user.slice(0, 100000));
}
