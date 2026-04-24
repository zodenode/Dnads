export type PressureLevel = 'low' | 'medium' | 'high'
export type SpendBand = 'low' | 'medium' | 'high' | 'very high'
export type Trend = 'up' | 'flat' | 'down'
export type AdFormat = 'static' | 'video' | 'image'
export type OpportunityLevel = 'low' | 'medium' | 'high'

export interface ReasonSignal {
  label: string
  detail: string
}

export interface MarketOverview {
  category: string
  /** Competitive pressure (same scale as market pressure; labelled explicitly in UI). */
  marketPressure: PressureLevel
  competitorIntensity: string
  opportunityLevel: OpportunityLevel
  dominantStrategy: string
  /** Market / format saturation — narrative only; no ad copy. */
  saturationNotes: string
  /** Optional positioning gap (internal brief); not shown as primary market field. */
  weakGap?: string
  confidence: number
  reasonSignals: ReasonSignal[]
}

export interface StrategicAngle {
  id: string
  title: string
  confidence: number
  marketUsage: { level: string; percent: number }
  opportunity: OpportunityLevel
  /** 1–2 lines max in UI (presentation layer may truncate). */
  whyItWorks: string
  examplePositioning?: string
  psychologicalFraming: string
  saturationLevel: string
  /** Underused opportunity / white space (analyst note). */
  underusedOpportunity: string
  usageRecommendation: string
  colorKey: 'slate' | 'indigo' | 'amber' | 'emerald' | 'rose'
  reasonSignals?: ReasonSignal[]
}

export interface CompetitorAd {
  id: string
  hookType: string
  angle: string
  emotionalTrigger: string
  format: string
  cta: string
  adText: string
}

export interface Competitor {
  id: string
  name: string
  spendBand: SpendBand
  confidence: number
  dominantAngle: string
  trend: Trend
  ads: CompetitorAd[]
  reasonSignals?: ReasonSignal[]
}

export interface StaticProduction {
  fullCopy: string
  layoutSuggestion: string
  textHierarchy: string
}

export interface VideoProduction {
  scenes: { range: string; beat: string }[]
  voiceoverScript: string
  retentionMechanism: string
}

export interface ImageProduction {
  promptSections: Record<string, string>
  compositionNotes: string
  styleGuidance: string
}

export interface WinningAd {
  id: string
  angleId: string
  angleTitle: string
  angleColorKey: StrategicAngle['colorKey']
  performanceScore: number
  format: AdFormat
  hook: string
  body: string
  cta: string
  strategyNotes: {
    hookRationale: string
    competitorInspiration: string
    psychologicalTrigger: string
  }
  confidence: number
  reasonSignals: ReasonSignal[]
  staticDetails?: StaticProduction
  videoDetails?: VideoProduction
  imageDetails?: ImageProduction
}

export interface ProductionQueueItem {
  id: string
  label: string
  type: string
  hookStrength: string
  angle: string
  status: string
  confidence: number
  reasonSignals: ReasonSignal[]
  imagePromptSections?: Record<string, string>
}

export interface CampaignPackSummary {
  staticAds: number
  ugcScripts: number
  imageConcepts: number
  landingVariants: number
  dominantAngles: number
}

export interface GrowthReportData {
  generatedAt: string
  market: MarketOverview
  angles: StrategicAngle[]
  competitors: Competitor[]
  winningAds: WinningAd[]
  productionQueue: ProductionQueueItem[]
  campaignPack: CampaignPackSummary
}
