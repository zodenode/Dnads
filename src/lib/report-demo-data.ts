import type { GrowthReport } from "./report-types";

export const demoGrowthReport: GrowthReport = {
  market: {
    category: "SaaS",
    marketPressure: "HIGH",
    competitorIntensity: "High",
    opportunityLevel: "Medium",
    dominantStrategy: "Pain + Speed Claims",
    weakGap: "Status / Identity Positioning",
    marketPressureReason:
      "High CAC category with homogeneous messaging; incumbents cluster on efficiency and ROI proof.",
    confidence: 0.78,
  },
  angles: [
    {
      id: "pain-urgency",
      title: "Pain Avoidance Urgency",
      confidence: 0.82,
      marketUsageLabel: "High",
      marketUsagePct: 67,
      opportunity: "Medium",
      whyItWorks:
        "Users in this category respond to immediate loss aversion when switching costs feel invisible until failure.",
      examplePositioning: "Stop losing qualified pipeline every day you wait on manual follow-up.",
      saturationLevel: "High in prospecting; underused in retargeting with specificity.",
      usageRecommendation:
        "Pair with proof blocks and a single quantified outcome; avoid generic 'save time' claims.",
      psychologicalFraming: "Loss aversion + temporal discounting",
    },
    {
      id: "speed-advantage",
      title: "Speed Advantage",
      confidence: 0.76,
      marketUsageLabel: "High",
      marketUsagePct: 58,
      opportunity: "Medium",
      whyItWorks:
        "Speed reduces perceived risk of adoption when the product category is crowded with similar feature lists.",
      examplePositioning: "Go live in hours, not quarters — without ripping out your stack.",
      saturationLevel: "Very high in top-of-funnel; differentiation requires mechanism, not slogans.",
      usageRecommendation: "Anchor speed to a workflow step competitors skip (onboarding, QA, handoff).",
      psychologicalFraming: "Certainty via control + competence signaling",
    },
    {
      id: "comparison-proof",
      title: "Comparison + Proof Density",
      confidence: 0.71,
      marketUsageLabel: "Medium",
      marketUsagePct: 41,
      opportunity: "High",
      whyItWorks:
        "Buyers who are actively evaluating shorten decision cycles when claims map to verifiable artifacts.",
      examplePositioning: "See the exact integration path your team will run — side by side with your current tool.",
      saturationLevel: "Moderate; often executed as feature grids without narrative.",
      usageRecommendation: "Use in mid-funnel: one competitor, one dimension, one proof artifact.",
      psychologicalFraming: "Social proof + analytical mode activation",
    },
  ],
  competitors: [
    {
      id: "brand-a",
      name: "Brand A",
      spendBand: "High",
      confidence: 0.87,
      dominantAngle: "Urgency",
      trend: "up",
      ads: [
        {
          hookType: "Curiosity Gap",
          angle: "Speed Advantage",
          emotionalTrigger: "Fear of Delay",
          format: "UGC Video",
          cta: "Try Free Trial",
          adText:
            "We were bleeding leads every Monday until we switched — here's the one workflow change that fixed it.",
        },
        {
          hookType: "Direct Challenge",
          angle: "Pain Avoidance Urgency",
          emotionalTrigger: "Loss Aversion",
          format: "Static",
          cta: "Book a Demo",
          adText: "If your pipeline looks full but revenue doesn't, your follow-up is the leak.",
        },
      ],
    },
    {
      id: "brand-b",
      name: "Brand B",
      spendBand: "Medium",
      confidence: 0.74,
      dominantAngle: "Comparison",
      trend: "flat",
      ads: [
        {
          hookType: "Proof Stack",
          angle: "Comparison + Proof Density",
          emotionalTrigger: "Analytical Confidence",
          format: "Image",
          cta: "See Pricing",
        },
      ],
    },
    {
      id: "brand-c",
      name: "Brand C",
      spendBand: "Low",
      confidence: 0.62,
      dominantAngle: "Brand Trust",
      trend: "down",
      ads: [
        {
          hookType: "Authority",
          angle: "Status / Identity",
          emotionalTrigger: "Belonging",
          format: "Video",
          cta: "Join Waitlist",
        },
      ],
    },
  ],
  winningAds: [
    {
      id: "ad-1",
      angleId: "pain-urgency",
      angleLabel: "Pain Avoidance Urgency",
      angleColor: "clay",
      performanceScore: 86,
      format: "Static",
      hook: "Stop wasting money on bad leads",
      body: "Qualify in real time. Route only buyers who match your ICP — before your reps burn cycles.",
      cta: "Get Instant Results",
      notes: {
        whyHookWorks:
          "Names a concrete budget leak; pairs loss with a controllable lever (qualification), not vague 'efficiency'.",
        competitorInspiration: "Brand A urgency framing + Brand B proof density structure.",
        psychologicalTrigger: "Loss aversion + agency (you can stop the leak today).",
      },
      productionStatic: {
        fullCopy:
          "Headline: Stop wasting money on bad leads.\nSub: Qualify in real time. Route only ICP-fit buyers.\nProof: [single stat or logo strip]\nCTA: Get Instant Results",
        layoutSuggestion:
          "Headline dominant (60% width), proof as a thin band, CTA as solid pill — no competing secondary CTAs.",
        textHierarchy: "Hook → one proof line → CTA. Strip body to one sentence on mobile.",
      },
    },
    {
      id: "ad-2",
      angleId: "speed-advantage",
      angleLabel: "Speed Advantage",
      angleColor: "forest",
      performanceScore: 81,
      format: "UGC Video",
      hook: "We went live before our legal review finished",
      body: "A 90-second walkthrough of the exact onboarding path — no consultants, no six-week project plan.",
      cta: "Start Free",
      notes: {
        whyHookWorks:
          "Speed claim is tied to an organizational constraint (legal), which reads as credible, not hype.",
        competitorInspiration: "Brand A UGC cadence; tighter mechanism vs. generic 'fast setup'.",
        psychologicalTrigger: "Competence signaling + risk reduction.",
      },
      productionVideo: {
        scenes: [
          { range: "0–3s", beat: "Pattern interrupt: calendar screenshot + red annotation on 'go-live' date." },
          { range: "3–8s", beat: "Founder POV: one integration, one toggle, one live event firing." },
          { range: "8–15s", beat: "Outcome: rep sees qualified lead routed; CTA on-screen + VO close." },
        ],
        voiceoverScript:
          "We were blocked on legal — so we shipped the smallest live slice. Same stack. Same security review. Different timeline.",
        retentionMechanism: "Mid-frame 'before/after' timestamp on the same UI surface.",
      },
    },
    {
      id: "ad-3",
      angleId: "comparison-proof",
      angleLabel: "Comparison + Proof",
      angleColor: "ink",
      performanceScore: 77,
      format: "Image",
      hook: "Same pipeline. Different qualification logic.",
      body: "One diagram: your current routing vs. ICP-first routing — with a single proof callout.",
      cta: "See the Diagram",
      notes: {
        whyHookWorks:
          "Analytical buyers engage when the comparison is constrained to one decision dimension.",
        competitorInspiration: "Brand B comparison ads, simplified to one axis.",
        psychologicalTrigger: "Analytical mode + reduction of choice complexity.",
      },
      productionImage: {
        aiPrompt:
          "Split-panel enterprise SaaS diagram, muted slate and warm paper background, precise typography, subtle shadows, no logos, abstract UI wireframes",
        compositionNotes: "Left: chaotic arrows; right: single ICP lane highlighted. Keep 20% negative space top.",
        styleGuidance: "Bloomberg-terminal sobriety: charcoal lines, bone background, one accent color.",
      },
    },
    {
      id: "ad-4",
      angleId: "pain-urgency",
      angleLabel: "Pain Avoidance Urgency",
      angleColor: "clay",
      performanceScore: 74,
      format: "Static",
      hook: "Your CRM is full. Your revenue isn't.",
      body: "Surface the leak: late-stage drops where follow-up latency spikes. Fix routing, not headcount.",
      cta: "Audit My Funnel",
      notes: {
        whyHookWorks: "Contradiction creates tension; promise stays diagnostic before selling transformation.",
        competitorInspiration: "Category-standard CRM pain hooks, tightened with latency specificity.",
        psychologicalTrigger: "Cognitive dissonance → diagnostic relief.",
      },
      productionStatic: {
        fullCopy:
          "Headline: Your CRM is full. Your revenue isn't.\nSub: Find latency spikes before you hire.\nCTA: Audit My Funnel",
        layoutSuggestion: "Two-line hook stack; sub in smaller muted type; single underline CTA.",
        textHierarchy: "Contradiction first, mechanism second, CTA last.",
      },
    },
    {
      id: "ad-5",
      angleId: "speed-advantage",
      angleLabel: "Speed Advantage",
      angleColor: "forest",
      performanceScore: 79,
      format: "Video",
      hook: "Ship the integration your team postponed three quarters",
      body: "Engineering-led POV: sandbox → production in one sitting, with guardrails called out on-screen.",
      cta: "View Integration Map",
      notes: {
        whyHookWorks: "Mechanism + timeline specificity beats abstract 'easy integration' claims.",
        competitorInspiration: "Mid-market PLG demos; shortened to one integration path.",
        psychologicalTrigger: "Competence + reduced implementation anxiety.",
      },
      productionVideo: {
        scenes: [
          { range: "0–3s", beat: "IDE + docs tab; search for webhook; copy key in one motion." },
          { range: "3–8s", beat: "Test event → live event; highlight diff in payload viewer." },
          { range: "8–15s", beat: "Rollback toggle + audit log line; CTA to map." },
        ],
        voiceoverScript:
          "We stopped treating integrations like a project. Same guardrails — we just collapsed the path between sandbox and prod.",
        retentionMechanism: "Continuous screen recording with on-screen chapter labels.",
      },
    },
    {
      id: "ad-6",
      angleId: "comparison-proof",
      angleLabel: "Comparison + Proof",
      angleColor: "slate",
      performanceScore: 72,
      format: "Static",
      hook: "One competitor. One metric. One screenshot.",
      body: "Mid-funnel control: pick the dimension your champion cares about — show receipts, not adjectives.",
      cta: "Get the One-Pager",
      notes: {
        whyHookWorks: "Constrains evaluation anxiety by shrinking the comparison surface area.",
        competitorInspiration: "Classic enterprise battlecards translated to consumer-readable static.",
        psychologicalTrigger: "Analytical confidence.",
      },
      productionStatic: {
        fullCopy:
          "Headline: One competitor. One metric. One screenshot.\nSub: Give your champion a one-pager that survives procurement.\nCTA: Get the One-Pager",
        layoutSuggestion: "Screenshot occupies 45% width; headline locks to top-left grid.",
        textHierarchy: "Rule-of-three headline → procurement line → CTA.",
      },
    },
    {
      id: "ad-7",
      angleId: "pain-urgency",
      angleLabel: "Pain Avoidance Urgency",
      angleColor: "clay",
      performanceScore: 70,
      format: "Image",
      hook: "Pipeline vanity is expensive",
      body: "Visualize spend against qualified opp creation — not meeting count.",
      cta: "See the Model",
      notes: {
        whyHookWorks: "Reframes a familiar metric as a liability, opening room for a new scoreboard.",
        competitorInspiration: "Finance-forward SaaS creative; simplified for paid social.",
        psychologicalTrigger: "Fear of mis-measurement.",
      },
      productionImage: {
        aiPrompt:
          "Minimal chart: two curves diverging, enterprise palette, no readable numbers, abstract axes",
        compositionNotes: "Negative space right for headline overlay in design tool.",
        styleGuidance: "McKinsey-style exhibit: restrained color, emphasis on divergence point.",
      },
    },
    {
      id: "ad-8",
      angleId: "speed-advantage",
      angleLabel: "Speed Advantage",
      angleColor: "forest",
      performanceScore: 68,
      format: "Static",
      hook: "Your first qualified reply in 48 hours",
      body: "Not 'setup' — a defined outcome with a clock. Backed by routing rules you can inspect.",
      cta: "Run the Clock",
      notes: {
        whyHookWorks: "Time-boxed outcome is falsifiable; increases perceived rigor vs. hype.",
        competitorInspiration: "PLG onboarding ads with stricter outcome language.",
        psychologicalTrigger: "Deadline clarity.",
      },
      productionStatic: {
        fullCopy:
          "Headline: Your first qualified reply in 48 hours.\nSub: Inspect the routing rules behind the clock.\nCTA: Run the Clock",
        layoutSuggestion: "Digital timer motif as subtle background texture at 5% opacity.",
        textHierarchy: "Outcome headline → inspectability → CTA.",
      },
    },
  ],
  productionQueue: [
    {
      id: "pq-1",
      label: "Creative #1",
      type: "UGC Video",
      hookStrength: "High",
      angleLabel: "Pain avoidance",
      status: "Recommended",
      imagePromptStructured: {
        subject: "Founder at desk, authentic workspace",
        environment: "Muted home office, shallow depth of field",
        lighting: "Soft window key, low contrast",
        emotion: "Relief, not hype",
        composition: "Rule of thirds, face left, UI insert right third",
        negativeSpace: "Top 15% clean for headline overlay",
        styleReference: "Bloomberg interview still, not influencer neon",
      },
    },
    {
      id: "pq-2",
      label: "Creative #2",
      type: "Image",
      hookStrength: "Medium",
      angleLabel: "Comparison + proof",
      status: "Optional test",
      imagePromptStructured: {
        subject: "Abstract split-panel SaaS diagram",
        environment: "Paper texture background",
        lighting: "Even studio flat",
        emotion: "Analytical calm",
        composition: "Center-weighted diagram, margins for crop",
        negativeSpace: "Right rail empty for CTA block",
        styleReference: "Notion-meets-terminal austerity",
      },
    },
    {
      id: "pq-3",
      label: "Creative #3",
      type: "Static",
      hookStrength: "High",
      angleLabel: "Speed advantage",
      status: "Recommended",
    },
  ],
  pack: {
    staticAds: 10,
    ugcScripts: 5,
    imageConcepts: 6,
    landingVariants: 3,
    dominantAngles: ["Pain Avoidance Urgency", "Speed Advantage"],
  },
};
