export type MarketPressure = "LOW" | "MEDIUM" | "HIGH";
export type Trend = "up" | "flat" | "down";

export interface MarketOverview {
  category: string;
  marketPressure: MarketPressure;
  competitorIntensity: string;
  opportunityLevel: string;
  dominantStrategy: string;
  weakGap: string;
  synthesisSignals: string[];
}

export interface StrategicAngle {
  id: string;
  title: string;
  confidence: number;
  marketUsage: string;
  marketUsagePct: number;
  opportunity: string;
  whyItWorks: string;
  examplePositioning: string;
  psychologicalFraming: string;
  saturationLevel: string;
  usageRecommendation: string;
}

export interface CompetitorAd {
  id: string;
  hookType: string;
  angle: string;
  emotionalTrigger: string;
  format: string;
  cta: string;
  adText: string;
}

export interface CompetitorRow {
  id: string;
  name: string;
  spendBand: string;
  confidence: number;
  dominantAngle: string;
  trend: Trend;
  reasonSignals: string[];
  ads: CompetitorAd[];
}

export type AdFormat = "Static" | "Video" | "Image";

export interface WinningAd {
  id: string;
  angleTag: string;
  angleColor: "slate" | "amber" | "emerald" | "violet";
  performanceScore: number;
  format: AdFormat;
  hook: string;
  body: string;
  cta: string;
  strategyNotes: {
    hookRationale: string;
    competitorInspiration: string;
    psychologicalTrigger: string;
  };
  production: {
    static?: {
      fullCopy: string;
      layoutSuggestion: string;
      textHierarchy: string;
    };
    video?: {
      scenes: { range: string; beat: string }[];
      voiceover: string;
      retention: string;
    };
    image?: {
      promptStructured: {
        subject: string;
        environment: string;
        lighting: string;
        emotion: string;
        composition: string;
        negativeSpace: string;
        styleReference: string;
      };
      compositionNotes: string;
      styleGuidance: string;
    };
  };
}

export interface ProductionQueueItem {
  id: string;
  label: string;
  type: string;
  hookStrength: string;
  angle: string;
  status: string;
  confidence: number;
  reasonSignals: string[];
  imagePrompt?: WinningAd["production"]["image"];
}

export interface CampaignPackSummary {
  staticAds: number;
  ugcScripts: number;
  imageConcepts: number;
  landingVariants: number;
  dominantAngles: string[];
}

export const mockMarketOverview: MarketOverview = {
  category: "SaaS / B2B Lead Gen",
  marketPressure: "HIGH",
  competitorIntensity: "High",
  opportunityLevel: "Medium",
  dominantStrategy: "Pain + Speed Claims",
  weakGap: "Status / Identity Positioning",
  synthesisSignals: [
    "Search and social SERPs skew toward urgency-led demos",
    "Mid-funnel proof assets are under-indexed vs. top-of-funnel hooks",
    "Creative fatigue on stock “dashboard + smile” compositions",
  ],
};

export const mockAngles: StrategicAngle[] = [
  {
    id: "a1",
    title: "Pain Avoidance Urgency",
    confidence: 0.82,
    marketUsage: "High",
    marketUsagePct: 67,
    opportunity: "Medium",
    whyItWorks:
      "Buyers in this category respond to immediate loss aversion when pipeline risk is salient.",
    examplePositioning: "Stop losing qualified pipeline every day you wait on follow-up.",
    psychologicalFraming: "Loss aversion + temporal discounting",
    saturationLevel: "High in cold audiences; differentiated with specificity",
    usageRecommendation:
      "Pair with proof of speed (time-to-first-value) to avoid commoditized urgency.",
  },
  {
    id: "a2",
    title: "Comparison / Switching Friction",
    confidence: 0.76,
    marketUsage: "Medium",
    marketUsagePct: 44,
    opportunity: "High",
    whyItWorks:
      "Switching costs are top-of-mind; reducing perceived migration effort lifts intent.",
    examplePositioning: "Migrate in a week — not a quarter — with a dedicated pod.",
    psychologicalFraming: "Cognitive ease + risk reduction",
    saturationLevel: "Moderate; strongest when tied to named integrations",
    usageRecommendation: "Use for retargeting and evaluation-stage accounts.",
  },
  {
    id: "a3",
    title: "Authority Proof Stack",
    confidence: 0.71,
    marketUsage: "Medium",
    marketUsagePct: 38,
    opportunity: "Medium",
    whyItWorks:
      "Enterprise buyers anchor on peer validation when claims are dense.",
    examplePositioning: "How teams at [segment leaders] run weekly revenue reviews.",
    psychologicalFraming: "Social proof + authority bias",
    saturationLevel: "Low when proof is vertical-specific",
    usageRecommendation: "Layer beneath urgency hooks in longer sales cycles.",
  },
];

export const mockCompetitors: CompetitorRow[] = [
  {
    id: "c1",
    name: "Brand A",
    spendBand: "High",
    confidence: 0.87,
    dominantAngle: "Urgency",
    trend: "up",
    reasonSignals: ["Ad library velocity ↑", "New creative tests weekly"],
    ads: [
      {
        id: "c1-ad1",
        hookType: "Curiosity Gap",
        angle: "Speed Advantage",
        emotionalTrigger: "Fear of Delay",
        format: "UGC Video",
        cta: "Try Free Trial",
        adText:
          "Nobody told me we could onboard this fast… 48 hours later we were live. Book a walkthrough.",
      },
    ],
  },
  {
    id: "c2",
    name: "Brand B",
    spendBand: "Medium",
    confidence: 0.74,
    dominantAngle: "Comparison",
    trend: "flat",
    reasonSignals: ["Stable spend", "Repeated comparison angles"],
    ads: [
      {
        id: "c2-ad1",
        hookType: "Direct Claim",
        angle: "Cost Control",
        emotionalTrigger: "Budget Anxiety",
        format: "Static",
        cta: "See Pricing",
        adText:
          "Cut wasted spend by 22% in 30 days — see the before/after dashboard snapshot.",
      },
    ],
  },
  {
    id: "c3",
    name: "Brand C",
    spendBand: "Low",
    confidence: 0.62,
    dominantAngle: "Proof / Case Study",
    trend: "down",
    reasonSignals: ["Fewer new assets", "Recycled hooks"],
    ads: [
      {
        id: "c3-ad1",
        hookType: "Outcome Stat",
        angle: "Reliability",
        emotionalTrigger: "Risk Reduction",
        format: "Image",
        cta: "Read Case Study",
        adText: "99.2% uptime over 12 months — finance teams trust the ledger.",
      },
    ],
  },
];

export const mockWinningAds: WinningAd[] = [
  {
    id: "ad1",
    angleTag: "Pain Avoidance",
    angleColor: "amber",
    performanceScore: 86,
    format: "Static",
    hook: "Stop wasting money on bad leads",
    body: "Route only ICP-fit accounts to reps. Fewer calls, higher win rate.",
    cta: "Get instant results",
    strategyNotes: {
      hookRationale:
        "Leads with ambiguous fit create rep burnout; the hook names the leak directly.",
      competitorInspiration:
        "Brand A’s urgency framing, tightened with a pipeline-quality claim.",
      psychologicalTrigger: "Loss aversion on spend + time",
    },
    production: {
      static: {
        fullCopy:
          "Stop wasting money on bad leads.\n\nQualify in real time. Route ICP accounts only.\n\nBook a 20-min workflow review.",
        layoutSuggestion:
          "Headline top-left, single proof metric mid-right, CTA as solid pill bottom.",
        textHierarchy: "H1 hook → subhead proof → CTA + micro-trust line",
      },
    },
  },
  {
    id: "ad2",
    angleTag: "Comparison",
    angleColor: "violet",
    performanceScore: 79,
    format: "Video",
    hook: "Switch without the quarter-long project plan",
    body: "Dedicated migration pod, named integrations, weekly checkpoints.",
    cta: "See migration map",
    strategyNotes: {
      hookRationale:
        "Neutralizes the #1 evaluation objection: implementation drag.",
      competitorInspiration: "Brand B comparison lane with clearer timeline proof.",
      psychologicalTrigger: "Risk reduction + cognitive ease",
    },
    production: {
      video: {
        scenes: [
          { range: "0–3s", beat: "POV: cluttered spreadsheet vs. clean routing UI" },
          { range: "3–8s", beat: "Customer soundbite on time-to-first-value" },
          { range: "8–15s", beat: "On-screen checklist: integrations, SLA, rollout" },
        ],
        voiceover:
          "If switching felt like a six-month science project, look at this instead — pod-led rollout, weekly checkpoints, integrations your stack already uses.",
        retention: "Pattern interrupt in first frame + checklist payoff at end card",
      },
    },
  },
  {
    id: "ad3",
    angleTag: "Authority Proof",
    angleColor: "emerald",
    performanceScore: 81,
    format: "Image",
    hook: "How revenue teams at category leaders run Monday reviews",
    body: "Templated board: pipeline quality, stage conversion, forecast risk.",
    cta: "Get the template",
    strategyNotes: {
      hookRationale:
        "Borrowed authority without name-dropping; invites professional identity alignment.",
      competitorInspiration: "Brand C proof lane with sharper operating cadence.",
      psychologicalTrigger: "Status within peer set + FOMO on process",
    },
    production: {
      image: {
        promptStructured: {
          subject: "Two operators at a minimalist desk reviewing a revenue dashboard",
          environment: "Bright enterprise office, shallow depth of field",
          lighting: "Soft window key, neutral fill",
          emotion: "Focused calm, decisive",
          composition: "Rule of thirds, dashboard UI legible in foreground",
          negativeSpace: "Upper-right negative space for headline overlay",
          styleReference: "Editorial tech photography, muted palette",
        },
        compositionNotes: "Keep UI chrome minimal; emphasize one hero metric.",
        styleGuidance: "No neon gradients; slate + off-white + single accent.",
      },
    },
  },
  {
    id: "ad4",
    angleTag: "Pain Avoidance",
    angleColor: "amber",
    performanceScore: 74,
    format: "Static",
    hook: "Your reps are drowning in “maybe” accounts",
    body: "Auto-score fit in minutes using firmographic + intent signals you already have.",
    cta: "See scoring model",
    strategyNotes: {
      hookRationale: "Operational pain is vivid; “maybe” is emotionally resonant.",
      competitorInspiration: "Internal win-back tests on rep-efficiency messaging.",
      psychologicalTrigger: "Overload + escape",
    },
    production: {
      static: {
        fullCopy:
          "Your reps are drowning in “maybe” accounts.\n\nScore fit automatically. Prioritize ICP.\n\nSee the model in 15 minutes.",
        layoutSuggestion: "Split panel: chaotic list vs. prioritized short list.",
        textHierarchy: "Problem headline → mechanism subhead → CTA",
      },
    },
  },
  {
    id: "ad5",
    angleTag: "Comparison",
    angleColor: "violet",
    performanceScore: 77,
    format: "Video",
    hook: "The demo that shows your actual workflow — not a toy dataset",
    body: "Bring your fields; we mirror your stages on the call.",
    cta: "Book live sandbox",
    strategyNotes: {
      hookRationale: "Differentiates against generic demos that erode trust.",
      competitorInspiration: "High-performing consultative demo ads in adjacent tools.",
      psychologicalTrigger: "Authenticity + competence signaling",
    },
    production: {
      video: {
        scenes: [
          { range: "0–3s", beat: "Screen record: importing real-ish schema (blurred PII)" },
          { range: "3–8s", beat: "Rep narrates stage mapping in plain language" },
          { range: "8–15s", beat: "CTA card: book sandbox + what to bring checklist" },
        ],
        voiceover:
          "Bring your real stages — we’ll mirror them live. No canned dataset, no magic tricks.",
        retention: "Continuous screen relevance + narrator proximity audio",
      },
    },
  },
  {
    id: "ad6",
    angleTag: "Authority Proof",
    angleColor: "emerald",
    performanceScore: 72,
    format: "Static",
    hook: "Forecast risk surfaced before the board asks",
    body: "Stage-level conversion drift alerts tied to pipeline coverage.",
    cta: "See alert rules",
    strategyNotes: {
      hookRationale: "Speaks to CFO/CRO tension — proactive governance.",
      competitorInspiration: "Governance-led messaging in late-stage competitors.",
      psychologicalTrigger: "Prevention + control",
    },
    production: {
      static: {
        fullCopy:
          "Forecast risk surfaced before the board asks.\n\nAlerts on drift, coverage, and stage velocity.\n\nConfigure rules in under an hour.",
        layoutSuggestion: "Alert card UI mock + timeline of early warning.",
        textHierarchy: "Outcome headline → mechanism → CTA with time promise",
      },
    },
  },
  {
    id: "ad7",
    angleTag: "Pain Avoidance",
    angleColor: "amber",
    performanceScore: 70,
    format: "Image",
    hook: "Bad routing tax: 14 hours a week per rep",
    body: "Industry benchmark vs. your routing rules — instant gap report.",
    cta: "Run gap report",
    strategyNotes: {
      hookRationale: "Quantified pain creates analyst credibility.",
      competitorInspiration: "Benchmark-led hooks in SaaS performance creative.",
      psychologicalTrigger: "Anchoring + loss framing",
    },
    production: {
      image: {
        promptStructured: {
          subject: "Simple bar chart comparing hours lost vs. hours saved",
          environment: "Clean analytics canvas, enterprise UI",
          lighting: "Flat UI lighting, no dramatic shadows",
          emotion: "Analytical clarity",
          composition: "Chart left, headline-safe negative space right",
          negativeSpace: "Right third reserved for typographic headline",
          styleReference: "Bloomberg-adjacent data viz, restrained color",
        },
        compositionNotes: "Keep numbers legible at mobile width.",
        styleGuidance: "Two-color chart max; align with brand slate/blue.",
      },
    },
  },
];

export const mockProductionQueue: ProductionQueueItem[] = [
  {
    id: "p1",
    label: "Creative #1",
    type: "UGC Video",
    hookStrength: "High",
    angle: "Pain avoidance",
    status: "Recommended",
    confidence: 0.84,
    reasonSignals: ["Matches dominant market angle", "Strong hook clarity in tests"],
  },
  {
    id: "p2",
    label: "Creative #2",
    type: "Static",
    hookStrength: "Medium",
    angle: "Comparison",
    status: "Test",
    confidence: 0.69,
    reasonSignals: ["Lower saturation in retargeting cohorts"],
  },
  {
    id: "p3",
    label: "Creative #3",
    type: "Image",
    hookStrength: "High",
    angle: "Authority proof",
    status: "Recommended",
    confidence: 0.77,
    reasonSignals: ["Proof-led assets under-represented in competitor sets"],
    imagePrompt: mockWinningAds[2].production.image,
  },
];

export const mockCampaignPack: CampaignPackSummary = {
  staticAds: 10,
  ugcScripts: 5,
  imageConcepts: 6,
  landingVariants: 3,
  dominantAngles: ["Pain Avoidance Urgency", "Comparison / Switching Friction"],
};
