export type PressureLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type Trend = 'up' | 'flat' | 'down'

export interface MarketOverview {
  category: string
  marketPressure: PressureLevel
  marketPressureConfidence: number
  competitorIntensity: string
  competitorIntensityConfidence: number
  opportunityLevel: string
  opportunityConfidence: number
  dominantStrategy: string
  dominantStrategyConfidence: number
  weakGap: string
  weakGapConfidence: number
  pressureSignals: string[]
}

export interface StrategicAngle {
  id: string
  title: string
  confidence: number
  marketUsage: string
  marketUsagePct: number
  opportunity: string
  psychologicalFraming: string
  saturationLevel: string
  usageRecommendation: string
  whyItWorks: string
  examplePositioning: string
}

export interface CompetitorRow {
  id: string
  name: string
  spendBand: string
  confidence: number
  dominantAngle: string
  trend: Trend
}

export interface AdBreakdown {
  hookType: string
  angle: string
  emotionalTrigger: string
  format: string
  cta: string
  adText: string
}

export interface CompetitorDetail extends CompetitorRow {
  ads: AdBreakdown[]
}

export type AdFormat = 'Static' | 'Video' | 'Image'

export interface StrategyNotes {
  hookRationale: string
  competitorInspiration: string
  psychologicalTrigger: string
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
  aiPromptStructured: {
    subject: string
    environment: string
    lighting: string
    emotion: string
    composition: string
    negativeSpace: string
    styleReference: string
  }
  compositionNotes: string
  styleGuidance: string
}

export interface WinningAd {
  id: string
  angleId: string
  angleLabel: string
  angleHue: number
  expectedPerformance: number
  format: AdFormat
  hook: string
  body: string
  cta: string
  notes: StrategyNotes
  staticDetail?: StaticProduction
  videoDetail?: VideoProduction
  imageDetail?: ImageProduction
}

export interface ProductionQueueItem {
  id: string
  label: string
  type: string
  hookStrength: string
  angle: string
  status: string
  structuredPrompt: ImageProduction['aiPromptStructured']
}

export interface CampaignPackSummary {
  staticAds: number
  ugcScripts: number
  imageConcepts: number
  landingVariants: number
  dominantAngles: number
}

export const marketOverview: MarketOverview = {
  category: 'SaaS',
  marketPressure: 'HIGH',
  marketPressureConfidence: 0.79,
  competitorIntensity: 'High',
  competitorIntensityConfidence: 0.84,
  opportunityLevel: 'Medium',
  opportunityConfidence: 0.71,
  dominantStrategy: 'Pain + Speed Claims',
  dominantStrategyConfidence: 0.88,
  weakGap: 'Status / Identity Positioning',
  weakGapConfidence: 0.76,
  pressureSignals: [
    'CPM up 12% QoQ in primary prospecting audiences',
    'Three incumbents rotating urgency-led hooks in top placements',
    'Review velocity slowing vs. last quarter baseline',
  ],
}

export const strategicAngles: StrategicAngle[] = [
  {
    id: 'pain-urgency',
    title: 'Pain Avoidance Urgency',
    confidence: 0.82,
    marketUsage: 'High',
    marketUsagePct: 67,
    opportunity: 'Medium',
    psychologicalFraming: 'Loss aversion with time-bound relief',
    saturationLevel: 'High in prospecting; room in retargeting',
    usageRecommendation: 'Pair with proof blocks; avoid pure fear stacking',
    whyItWorks:
      'Users in this category respond to immediate loss aversion when the promised fix is concrete and fast.',
    examplePositioning: 'Stop losing qualified pipeline every day you wait…',
  },
  {
    id: 'social-proof',
    title: 'Peer Proof + Workflow Fit',
    confidence: 0.77,
    marketUsage: 'Medium',
    marketUsagePct: 41,
    opportunity: 'High',
    psychologicalFraming: 'Belonging and professional identity',
    saturationLevel: 'Moderate; strongest when tied to named outcomes',
    usageRecommendation: 'Lead with logos only after a quantified win',
    whyItWorks:
      'Decision makers de-risk by mirroring teams they respect; specificity beats logo walls.',
    examplePositioning: 'How RevOps teams at Series B cut reporting time 38%',
  },
  {
    id: 'curiosity-gap',
    title: 'Curiosity Gap + Mechanism',
    confidence: 0.74,
    marketUsage: 'Medium',
    marketUsagePct: 52,
    opportunity: 'Medium',
    psychologicalFraming: 'Open loop with a credible mechanism',
    saturationLevel: 'Spiking in short-form; fatigue if payoff is weak',
    usageRecommendation: 'Reserve for cold audiences with a 3s proof pivot',
    whyItWorks:
      'Hooks that imply hidden knowledge work when the reveal is operational, not hype.',
    examplePositioning: 'The one automation finance never talks about (but uses)',
  },
]

export const competitors: CompetitorDetail[] = [
  {
    id: 'brand-a',
    name: 'Brand A',
    spendBand: 'High',
    confidence: 0.87,
    dominantAngle: 'Urgency',
    trend: 'up',
    ads: [
      {
        hookType: 'Curiosity Gap',
        angle: 'Speed Advantage',
        emotionalTrigger: 'Fear of Delay',
        format: 'UGC Video',
        cta: 'Try Free Trial',
        adText:
          'POV: you finally automate the report everyone said would take weeks. Start free — no card.',
      },
    ],
  },
  {
    id: 'brand-b',
    name: 'Brand B',
    spendBand: 'Medium',
    confidence: 0.74,
    dominantAngle: 'Comparison',
    trend: 'flat',
    ads: [
      {
        hookType: 'Side-by-Side',
        angle: 'Efficiency',
        emotionalTrigger: 'Competence / Control',
        format: 'Static',
        cta: 'See the breakdown',
        adText:
          'Spreadsheets vs. live board: same data, half the meetings. Compare plans.',
      },
    ],
  },
  {
    id: 'brand-c',
    name: 'Brand C',
    spendBand: 'Low',
    confidence: 0.62,
    dominantAngle: 'Identity',
    trend: 'down',
    ads: [
      {
        hookType: 'Aspirational',
        angle: 'Team Culture',
        emotionalTrigger: 'Pride',
        format: 'Image',
        cta: 'Book a walkthrough',
        adText: 'Built for teams who outgrow “good enough” ops stacks.',
      },
    ],
  },
]

const baseNotes: StrategyNotes = {
  hookRationale: 'Leads with quantified pain before brand; reduces scroll skip in cold feeds.',
  competitorInspiration: 'Brand A urgency frame + Brand B proof density (synthesized, not copied).',
  psychologicalTrigger: 'Loss aversion with a clear escape path (trial + time save).',
}

export const winningAdsSeed: WinningAd[] = [
  {
    id: 'ad-1',
    angleId: 'pain-urgency',
    angleLabel: 'Pain Avoidance Urgency',
    angleHue: 8,
    expectedPerformance: 86,
    format: 'Static',
    hook: 'Stop wasting money on bad leads',
    body: 'Qualify in real time. Route only buyers your reps can close this quarter.',
    cta: 'Get Instant Results',
    notes: baseNotes,
    staticDetail: {
      fullCopy:
        'Stop wasting money on bad leads. Qualify in real time and route only buyers your reps can close. Teams cut cost-per-SQL 22% in 30 days.',
      layoutSuggestion: 'Headline top-left, single proof stat mid-right, CTA bar anchored bottom.',
      textHierarchy: 'H1 hook → sub proof line → single feature row → CTA + risk reversal.',
    },
  },
  {
    id: 'ad-2',
    angleId: 'social-proof',
    angleLabel: 'Peer Proof + Workflow Fit',
    angleHue: 210,
    expectedPerformance: 81,
    format: 'Video',
    hook: 'How RevOps teams cut reporting time 38%',
    body: 'Same stack. Fewer meetings. Live board your CFO actually trusts.',
    cta: 'See the workflow',
    notes: {
      ...baseNotes,
      hookRationale: 'Named function + metric borrows credibility before product mention.',
      psychologicalTrigger: 'Social proof through role mirror + measurable outcome.',
    },
    videoDetail: {
      scenes: [
        { range: '0–3s', beat: 'Hook on-screen metric + frustrated spreadsheet cut' },
        { range: '3–8s', beat: 'Screen capture: live board replacing three static tabs' },
        { range: '8–15s', beat: 'Customer quote + CTA with calendar micro-commit' },
      ],
      voiceoverScript:
        'If reporting still eats your Wednesdays, you are not short on data — you are short on routing. Here is how RevOps teams claw back 38% of that time without ripping out the CRM.',
      retentionMechanism: 'Pattern interrupt at 3s with UI motion; payoff line at 12s.',
    },
  },
  {
    id: 'ad-3',
    angleId: 'curiosity-gap',
    angleLabel: 'Curiosity Gap + Mechanism',
    angleHue: 280,
    expectedPerformance: 78,
    format: 'Image',
    hook: 'The one automation finance never talks about',
    body: 'Pipeline hygiene that finance signs off on — automated, auditable, on-brand.',
    cta: 'Reveal the setup',
    notes: {
      ...baseNotes,
      hookRationale: 'Open loop resolves into a compliance-friendly mechanism, not hype.',
      competitorInspiration: 'Category curiosity hooks; differentiated with audit language.',
      psychologicalTrigger: 'Insider knowledge + risk reduction.',
    },
    imageDetail: {
      aiPromptStructured: {
        subject: 'RevOps lead glancing at a wall-mounted analytics board',
        environment: 'Minimal glass office, dawn light',
        lighting: 'Soft side light, cool key',
        emotion: 'Quiet confidence',
        composition: 'Rule of thirds, negative space top-right for headline overlay',
        negativeSpace: 'Keep top-right 20% clean for text lockup',
        styleReference: 'Editorial tech photography, Bloomberg Markets palette',
      },
      compositionNotes: 'Single focal face; UI legible but secondary.',
      styleGuidance: 'Muted slate/teal grade; no stock “handshake” clichés.',
    },
  },
  {
    id: 'ad-4',
    angleId: 'pain-urgency',
    angleLabel: 'Pain Avoidance Urgency',
    angleHue: 8,
    expectedPerformance: 74,
    format: 'Video',
    hook: 'Your pipeline is leaking tonight',
    body: 'Auto-score every inbound touch. Wake up to a ranked queue, not noise.',
    cta: 'Fix the leak',
    notes: baseNotes,
    videoDetail: {
      scenes: [
        { range: '0–3s', beat: 'Night-mode UI + ticking timer metaphor' },
        { range: '3–8s', beat: 'Leak animation into scored queue' },
        { range: '8–15s', beat: 'Morning payoff + CTA' },
      ],
      voiceoverScript:
        'Leads do not wait for Monday standups. If scoring still batch-runs overnight, you are paying for leads you will never call in time.',
      retentionMechanism: 'Audio-led hook first 2s; visual payoff synchronized at 6s.',
    },
  },
  {
    id: 'ad-5',
    angleId: 'social-proof',
    angleLabel: 'Peer Proof + Workflow Fit',
    angleHue: 210,
    expectedPerformance: 72,
    format: 'Static',
    hook: 'Series B teams run forecasting here',
    body: 'One board. CRM + billing + usage. No more “which spreadsheet is true?”',
    cta: 'Get the board',
    notes: baseNotes,
    staticDetail: {
      fullCopy:
        'Series B teams run forecasting here. One live board pulls CRM, billing, and product usage so GTM and Finance argue with data, not decks.',
      layoutSuggestion: 'Split panel: product UI left, testimonial right, CTA centered low.',
      textHierarchy: 'Social headline → dual proof (logo + stat) → CTA + footnote on security.',
    },
  },
  {
    id: 'ad-6',
    angleId: 'curiosity-gap',
    angleLabel: 'Curiosity Gap + Mechanism',
    angleHue: 280,
    expectedPerformance: 70,
    format: 'Static',
    hook: 'Why your ROAS looks fine but pipeline does not',
    body: 'Attribution drift diagnostic — 90 seconds, no engineering ticket.',
    cta: 'Run the diagnostic',
    notes: baseNotes,
    staticDetail: {
      fullCopy:
        'Why your ROAS looks fine but pipeline does not. Attribution drift hides in channel silos. Run a 90-second diagnostic and see where credit stacks wrong.',
      layoutSuggestion: 'Question headline, simple drift diagram, CTA as diagnostic CTA.',
      textHierarchy: 'Question → diagram callouts → CTA + micro-trust (SOC2)',
    },
  },
  {
    id: 'ad-7',
    angleId: 'pain-urgency',
    angleLabel: 'Pain Avoidance Urgency',
    angleHue: 8,
    expectedPerformance: 69,
    format: 'Image',
    hook: 'Paying for leads you never call',
    body: 'Route by intent + fit in under a second. Reps see buyers first.',
    cta: 'See routing rules',
    notes: baseNotes,
    imageDetail: {
      aiPromptStructured: {
        subject: 'Sales operator at laptop, inbox sorted by intent score',
        environment: 'Bright modern desk, shallow depth of field',
        lighting: 'High-key natural window',
        emotion: 'Relief / focus',
        composition: 'Foreground inbox UI mock, subject mid-ground',
        negativeSpace: 'Left third clean for headline stack',
        styleReference: 'Linear-style product photography, desaturated',
      },
      compositionNotes: 'UI readable; intent scores visible as color chips.',
      styleGuidance: 'Cool neutrals; single accent color on “hot” leads only.',
    },
  },
]

export const productionQueue: ProductionQueueItem[] = [
  {
    id: 'pq-1',
    label: 'Creative #1',
    type: 'UGC Video',
    hookStrength: 'High',
    angle: 'Pain avoidance',
    status: 'Recommended',
    structuredPrompt: {
      subject: 'Founder in hoodie, handheld selfie frame',
      environment: 'Home office with soft plants, shallow DOF',
      lighting: 'Natural window key, gentle fill',
      emotion: 'Earnest urgency without shouting',
      composition: 'Eyes upper third; leave lower third for captions',
      negativeSpace: 'Right gutter clean for UI insert',
      styleReference: 'Authentic UGC, slight grain, no over-polish',
    },
  },
  {
    id: 'pq-2',
    label: 'Creative #2',
    type: 'Static',
    hookStrength: 'Medium',
    angle: 'Peer proof',
    status: 'Alternate',
    structuredPrompt: {
      subject: 'Product UI hero with single stat callout',
      environment: 'Flat studio backdrop, subtle grid',
      lighting: 'Even softbox, minimal shadow',
      emotion: 'Clinical confidence',
      composition: 'Center-weighted UI, headline safe zones left',
      negativeSpace: 'Top 15% reserved for brand bar',
      styleReference: 'Notion-adjacent minimalism, slate on off-white',
    },
  },
]

export const campaignPack: CampaignPackSummary = {
  staticAds: 10,
  ugcScripts: 5,
  imageConcepts: 6,
  landingVariants: 3,
  dominantAngles: 2,
}
