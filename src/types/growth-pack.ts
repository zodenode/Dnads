/** Internal structured models per product spec */

export interface Business {
  url: string;
  category: string;
  value_proposition: string[];
  target_audience: string[];
  competitors: string[];
  /** Extended MVP fields */
  product_summary?: string;
  pricing_tier_inference?: string[];
}

export type HookType =
  | "pain"
  | "curiosity"
  | "urgency"
  | "status"
  | "comparison"
  | string;

export interface AdIntel {
  competitor: string;
  hook_type: HookType;
  angle: string;
  audience_target: string;
  offer_type: string;
  emotional_trigger: string;
  format: string;
  cta: string;
  text: string;
  platform?: "meta" | "tiktok" | "google" | string;
}

export interface MarketInsightRow {
  label: string;
  pct?: number;
  count?: number;
  note?: string;
}

export interface MarketInsights {
  top_hooks: MarketInsightRow[];
  top_angles: MarketInsightRow[];
  saturation_gaps: MarketInsightRow[];
  winning_patterns: MarketInsightRow[];
}

export interface GeneratedAdVariation {
  hook: string;
  primary_text: string;
  cta: string;
  angle_label: string;
  emotional_trigger_label: string;
}

export interface AngleCluster {
  angle: string;
  ads: GeneratedAdVariation[];
}

export interface CampaignPackOutput {
  ads_by_angle_clusters: AngleCluster[];
  landing_headlines: string[];
  landing_subcopy: string[];
  ugc_script_ideas: string[];
  suggested_campaign_structure: {
    meta?: string[];
    tiktok?: string[];
    naming_convention?: string;
  };
}

export interface GrowthPackResponse {
  business: Business;
  competitor_ads: AdIntel[];
  market_insights: MarketInsights;
  generated_ads: GeneratedAdVariation[];
  campaign_pack: CampaignPackOutput;
  meta: {
    generated_at: string;
    page_excerpt_chars: number;
    payment_required_for_full_download: boolean;
  };
}
