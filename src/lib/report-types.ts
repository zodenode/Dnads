export type MarketPressure = "LOW" | "MEDIUM" | "HIGH";
export type OpportunityLevel = "Low" | "Medium" | "High";
export type CompetitorTrend = "up" | "flat" | "down";
export type AdFormat = "Static" | "Video" | "Image" | "UGC Video";

export interface MarketIntelligence {
  category: string;
  marketPressure: MarketPressure;
  competitorIntensity: string;
  opportunityLevel: OpportunityLevel;
  dominantStrategy: string;
  weakGap: string;
  marketPressureReason: string;
  confidence: number;
}

export interface StrategicAngle {
  id: string;
  title: string;
  confidence: number;
  marketUsageLabel: string;
  marketUsagePct: number;
  opportunity: OpportunityLevel;
  whyItWorks: string;
  examplePositioning: string;
  saturationLevel: string;
  usageRecommendation: string;
  psychologicalFraming: string;
}

export interface CompetitorRow {
  id: string;
  name: string;
  spendBand: string;
  confidence: number;
  dominantAngle: string;
  trend: CompetitorTrend;
}

export interface AdBreakdown {
  hookType: string;
  angle: string;
  emotionalTrigger: string;
  format: AdFormat;
  cta: string;
  adText?: string;
}

export interface CompetitorDetail extends CompetitorRow {
  ads: AdBreakdown[];
}

export interface StrategyNotes {
  whyHookWorks: string;
  competitorInspiration: string;
  psychologicalTrigger: string;
}

export interface ProductionDetailsStatic {
  fullCopy: string;
  layoutSuggestion: string;
  textHierarchy: string;
}

export interface ProductionDetailsVideo {
  scenes: { range: string; beat: string }[];
  voiceoverScript: string;
  retentionMechanism: string;
}

export interface ProductionDetailsImage {
  aiPrompt: string;
  compositionNotes: string;
  styleGuidance: string;
}

export interface WinningAd {
  id: string;
  angleId: string;
  angleLabel: string;
  angleColor: "slate" | "forest" | "clay" | "ink";
  performanceScore: number;
  format: AdFormat;
  hook: string;
  body: string;
  cta: string;
  notes: StrategyNotes;
  productionStatic?: ProductionDetailsStatic;
  productionVideo?: ProductionDetailsVideo;
  productionImage?: ProductionDetailsImage;
}

export interface ProductionQueueItem {
  id: string;
  label: string;
  type: AdFormat;
  hookStrength: "Low" | "Medium" | "High";
  angleLabel: string;
  status: string;
  imagePromptStructured?: {
    subject: string;
    environment: string;
    lighting: string;
    emotion: string;
    composition: string;
    negativeSpace: string;
    styleReference: string;
  };
}

export interface CampaignPackSummary {
  staticAds: number;
  ugcScripts: number;
  imageConcepts: number;
  landingVariants: number;
  dominantAngles: string[];
}

export interface GrowthReport {
  market: MarketIntelligence;
  angles: StrategicAngle[];
  competitors: CompetitorDetail[];
  winningAds: WinningAd[];
  productionQueue: ProductionQueueItem[];
  pack: CampaignPackSummary;
}
