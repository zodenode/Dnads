/** Internal structured model + campaign pack extensions */

export type Business = {
  url: string;
  category: string;
  value_proposition: string[];
  target_audience: string[];
  competitors: string[];
  /** MVP extras for human-readable pack */
  product_summary?: string;
  pricing_tiers?: string[];
};

export type Ad = {
  competitor: string;
  hook_type: string;
  angle: string;
  emotional_trigger: string;
  format: string;
  cta: string;
  text: string;
  audience_target?: string;
  offer_type?: string;
};

export type MarketInsights = {
  top_hooks: { label: string; percent: number }[];
  top_angles: { label: string; percent: number }[];
  saturation_gaps: string[];
  winning_patterns: string[];
};

export type GeneratedAd = {
  hook: string;
  primary_text: string;
  cta: string;
  angle_label: string;
  emotional_trigger_label: string;
  cluster: string;
};

export type CampaignStructureItem = {
  name: string;
  objective: string;
  notes?: string;
};

export type GrowthPack = {
  business: Business;
  competitor_ads: Ad[];
  market: MarketInsights;
  generated_ads: GeneratedAd[];
  landing_headlines: string[];
  landing_subcopy: string[];
  ugc_script_ideas: string[];
  campaign_structure: CampaignStructureItem[];
};
