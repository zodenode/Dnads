/** Internal structured model per product spec */

export type HookType =
  | "pain"
  | "curiosity"
  | "urgency"
  | "status"
  | "comparison"
  | "other";

export interface Business {
  url: string;
  category: string;
  value_proposition: string[];
  target_audience: string[];
  competitors: string[];
  /** Extended for UI / campaign pack */
  product_service?: string;
  pricing_tier_inference?: string[];
}

export interface Ad {
  competitor: string;
  hook_type: HookType | string;
  angle: string;
  audience_target: string;
  offer_type: string;
  emotional_trigger: string;
  format: string;
  cta: string;
  text: string;
  /** Platform context for simulated samples */
  platform?: "meta" | "tiktok" | "google";
}

export interface MarketInsights {
  top_hooks: { label: string; percent: number }[];
  top_angles: { label: string; percent: number }[];
  saturation_gaps: string[];
  winning_patterns: string[];
  /** Extended */
  top_emotional_triggers?: { label: string; percent: number }[];
  underused_opportunities?: string[];
  positioning_saturation_map?: string[];
}

export interface GeneratedAdVariation {
  hook: string;
  primary_text: string;
  cta: string;
  angle_label: string;
  emotional_trigger_label: string;
  cluster?: string;
}

export interface CampaignPack {
  business: Business;
  competitor_ads: Ad[];
  market_insights: MarketInsights;
  generated_ads: GeneratedAdVariation[];
  /** F. Campaign pack extras */
  ads_by_angle_clusters: { cluster_name: string; ads: GeneratedAdVariation[] }[];
  landing_headlines: string[];
  landing_subcopy: string[];
  ugc_script_ideas: string[];
  suggested_campaign_structure: {
    meta_campaign_name?: string;
    tiktok_campaign_name?: string;
    ad_set_naming_hint?: string;
  };
}

export interface GenerateResponse {
  success: boolean;
  pack?: CampaignPack;
  error?: string;
}
