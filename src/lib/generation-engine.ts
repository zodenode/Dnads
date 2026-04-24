import { callClaudeJson } from "./claude";
import type {
  Ad,
  Business,
  CampaignPack,
  GeneratedAdVariation,
  MarketInsights,
} from "./types";

const SYSTEM = `You are a competitor-driven campaign engine. Generate NEW ads by recombining:
1) Top-performing competitor patterns (from market_insights + ads)
2) Underused gaps / opportunities
3) URL-specific positioning from the business object

NOT generic copywriting — every line must cite a pattern logic (implicitly in the angle_label / emotional_trigger_label).

Produce 14-18 variations (hook, primary_text, cta, angle_label, emotional_trigger_label).

Then build the campaign pack sections:
- Group ads into exactly 10 ads total for "ads_by_angle_clusters" (pick the best 10 from variations if you generated more). Use 3-4 clusters by angle.
- landing_headlines: 3
- landing_subcopy: 3
- ugc_script_ideas: 5 short-form video scripts (bullet outline, 30-60s)
- suggested_campaign_structure: meta_campaign_name, tiktok_campaign_name, ad_set_naming_hint

Output ONLY valid JSON:
{
  "generated_ads": GeneratedAdVariation[],
  "ads_by_angle_clusters": { "cluster_name": string, "ads": GeneratedAdVariation[] }[],
  "landing_headlines": string[],
  "landing_subcopy": string[],
  "ugc_script_ideas": string[],
  "suggested_campaign_structure": { "meta_campaign_name": string, "tiktok_campaign_name": string, "ad_set_naming_hint": string }
}`;

export async function generateCampaignFromPatterns(input: {
  business: Business;
  ads: Ad[];
  market_insights: MarketInsights;
}): Promise<
  Pick<
    CampaignPack,
    | "generated_ads"
    | "ads_by_angle_clusters"
    | "landing_headlines"
    | "landing_subcopy"
    | "ugc_script_ideas"
    | "suggested_campaign_structure"
  >
> {
  const user = JSON.stringify(input, null, 2);
  return callClaudeJson(SYSTEM, user);
}
