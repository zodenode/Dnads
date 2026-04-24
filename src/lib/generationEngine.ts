import type { Ad, Business, CampaignPack, GeneratedAdVariation, MarketInsights } from "./types";
import { completeJson } from "./anthropic";

const SYSTEM = `You are a performance strategist. Generate NEW ad variations by recombining observed market patterns — NOT generic copywriting.
Rules:
- Every line must reference or imply competitor-derived patterns (hooks, angles, triggers) and gaps from the inputs.
- Produce 12-18 variations (prefer 15).
- angle_label and emotional_trigger_label must align with the pattern intelligence provided.
Output ONLY valid JSON with shape:
{
  "generated_ads": [ { "hook", "primary_text", "cta", "angle_label", "emotional_trigger_label", "cluster" } ],
  "campaign_pack": {
    "ads_by_angle_cluster": { "<cluster name>": [ same objects subset, total 10 ads across clusters ] },
    "landing_headlines": [3 strings],
    "landing_subcopy": [3 strings],
    "ugc_script_ideas": [5 short bullet-style scripts],
    "suggested_campaign_structure": "one paragraph with Meta/TikTok style campaign/ad set naming"
  }
}
Clusters should group the 10 packaged ads by angle (e.g. 2-4 clusters). Do not duplicate the same primary_text twice.`;

type GenOut = {
  generated_ads: GeneratedAdVariation[];
  campaign_pack: CampaignPack;
};

export async function generateFromPatterns(
  business: Business,
  ads: Ad[],
  insights: MarketInsights
): Promise<{ generated_ads: GeneratedAdVariation[]; campaign_pack: CampaignPack }> {
  const user = JSON.stringify({
    business,
    competitor_ads_sample: ads.slice(0, 40),
    market_insights: insights,
    instruction:
      "Recombine top_hooks, top_angles, saturation_gaps, and winning_patterns into new ads and a campaign pack for THIS url's positioning.",
  });

  const out = await completeJson<GenOut>(SYSTEM, user);
  const generated = Array.isArray(out.generated_ads) ? out.generated_ads : [];
  const pack = out.campaign_pack || {
    ads_by_angle_cluster: {},
    landing_headlines: [],
    landing_subcopy: [],
    ugc_script_ideas: [],
    suggested_campaign_structure: "",
  };

  return {
    generated_ads: generated.map(normalizeVariation),
    campaign_pack: normalizePack(pack),
  };
}

function normalizeVariation(v: GeneratedAdVariation): GeneratedAdVariation {
  return {
    hook: String(v.hook || ""),
    primary_text: String(v.primary_text || ""),
    cta: String(v.cta || ""),
    angle_label: String(v.angle_label || ""),
    emotional_trigger_label: String(v.emotional_trigger_label || ""),
    cluster: v.cluster ? String(v.cluster) : undefined,
  };
}

function normalizePack(p: CampaignPack): CampaignPack {
  const clusters: Record<string, GeneratedAdVariation[]> = {};
  if (p.ads_by_angle_cluster && typeof p.ads_by_angle_cluster === "object") {
    for (const [k, arr] of Object.entries(p.ads_by_angle_cluster)) {
      if (Array.isArray(arr)) {
        clusters[k] = arr.map(normalizeVariation);
      }
    }
  }
  return {
    ads_by_angle_cluster: clusters,
    landing_headlines: Array.isArray(p.landing_headlines)
      ? p.landing_headlines.map(String).slice(0, 3)
      : [],
    landing_subcopy: Array.isArray(p.landing_subcopy) ? p.landing_subcopy.map(String).slice(0, 3) : [],
    ugc_script_ideas: Array.isArray(p.ugc_script_ideas) ? p.ugc_script_ideas.map(String).slice(0, 5) : [],
    suggested_campaign_structure: String(p.suggested_campaign_structure || ""),
  };
}
