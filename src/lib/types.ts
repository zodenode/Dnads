/** Internal structured model + campaign pack extensions */

export type AdSource = "meta" | "tiktok" | "google" | "synthetic";

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
  /** Which library produced this row (when known) */
  source?: AdSource;
  /** Stable id from the platform when available */
  external_id?: string;
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
  /** How ads were sourced for this pack */
  ad_provenance?: {
    meta_count: number;
    tiktok_count: number;
    google_count: number;
    synthetic_count: number;
    notes?: string[];
  };
  market: MarketInsights;
  generated_ads: GeneratedAd[];
  landing_headlines: string[];
  landing_subcopy: string[];
  ugc_script_ideas: string[];
  campaign_structure: CampaignStructureItem[];
};

/** Per-competitor query hints for each ad library */
export type CompetitorLibraryMapping = {
  competitor_name: string;
  meta?: {
    search_terms?: string;
    /** Up to 10 numeric page IDs when known */
    search_page_ids?: string[];
  };
  tiktok?: {
    search_term?: string;
    advertiser_business_ids?: string[];
    search_type?: "exact_phrase" | "fuzzy_phrase";
  };
  google?: {
    /** Free-text search for SerpApi / transparency engines */
    search_query?: string;
    advertiser_id?: string;
    domain?: string;
  };
};

export type CompetitorIntelResult = {
  mappings: CompetitorLibraryMapping[];
  rationale?: string;
};
