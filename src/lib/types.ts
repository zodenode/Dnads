/** Internal structured models for the Growth Pack pipeline */

export type HookType =
  | "pain"
  | "curiosity"
  | "urgency"
  | "status"
  | "comparison"
  | string;

export interface Business {
  url: string;
  category: string;
  value_proposition: string[];
  target_audience: string[];
  competitors: string[];
  /** Enriched for UI; derived from URL + page context */
  product_summary?: string;
  pricing_tier_inference?: string[];
}

export interface Ad {
  competitor: string;
  hook_type: HookType;
  angle: string;
  audience_target: string;
  offer_type: string;
  emotional_trigger: string;
  format: string;
  cta: string;
  text: string;
  /** Simulated channel for R&D labeling */
  channel?: "meta" | "tiktok" | "google";
}

export interface DistributionItem {
  label: string;
  percent: number;
}

export interface MarketInsights {
  top_hooks: DistributionItem[];
  top_angles: DistributionItem[];
  saturation_gaps: string[];
  winning_patterns: string[];
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
  ads_by_angle_cluster: Record<string, GeneratedAdVariation[]>;
  landing_headlines: string[];
  landing_subcopy: string[];
  ugc_script_ideas: string[];
  suggested_campaign_structure: string;
}

export interface GrowthPack {
  business: Business;
  competitor_ads: Ad[];
  market_insights: MarketInsights;
  generated_ads: GeneratedAdVariation[];
  campaign_pack: CampaignPack;
  meta: {
    generated_at: string;
    source_url: string;
    pattern_note: string;
  };
}
