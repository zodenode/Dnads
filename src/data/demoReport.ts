import type { GrowthReportData } from '../types/report'

export const demoReport: GrowthReportData = {
  generatedAt: '2026-04-24T12:00:00Z',
  market: {
    category: 'SaaS',
    marketPressure: 'high',
    competitorIntensity: 'High',
    opportunityLevel: 'medium',
    dominantStrategy: 'Pain + Speed Claims',
    saturationNotes:
      'Paid social is crowded on urgency + demo CTAs; lifecycle and partner channels show lower creative parity.',
    weakGap: 'Status / Identity Positioning',
    confidence: 0.79,
    reasonSignals: [
      {
        label: 'Ad corpus',
        detail: 'Top quartile spenders lean on loss framing and time-to-value.',
      },
      {
        label: 'Landing parity',
        detail: 'Most funnels mirror the same urgency ladder; differentiation is thin.',
      },
    ],
  },
  angles: [
    {
      id: 'a1',
      title: 'Pain Avoidance Urgency',
      confidence: 0.82,
      marketUsage: { level: 'High', percent: 67 },
      opportunity: 'medium',
      whyItWorks:
        'Users in this category respond to immediate loss aversion when switching costs feel low.',
      examplePositioning: 'Stop losing qualified pipeline every day you wait on setup.',
      psychologicalFraming: 'Loss aversion + temporal discounting',
      saturationLevel: 'High in paid social; lower in lifecycle email.',
      usageRecommendation:
        'Pair with proof of speed; avoid pure fear without a credible mitigation path.',
      underusedOpportunity:
        'Peer proof in niche verticals (e.g. finance ops) is still thin vs horizontal SaaS.',
      colorKey: 'rose',
      reasonSignals: [{ label: 'Corpus', detail: '67% of sampled winners open with loss framing.' }],
    },
    {
      id: 'a2',
      title: 'Proof-First Comparison',
      confidence: 0.76,
      marketUsage: { level: 'Medium', percent: 41 },
      opportunity: 'high',
      whyItWorks:
        'Buyers comparing 3+ vendors anchor on verifiable claims and third-party validation.',
      examplePositioning: 'See how teams your size cut CAC after week two.',
      psychologicalFraming: 'Social proof + analytical decision mode',
      saturationLevel: 'Moderate; strongest on search and review sites.',
      usageRecommendation:
        'Use when intent is mid-funnel; keep claims narrow and defensible.',
      underusedOpportunity:
        'Short-form video with primary-source stats (not logos) is under-tested vs static comparison grids.',
      colorKey: 'indigo',
      reasonSignals: [{ label: 'Intent', detail: 'Strongest where evaluation mode is already active.' }],
    },
    {
      id: 'a3',
      title: 'Workflow Relief',
      confidence: 0.71,
      marketUsage: { level: 'Medium', percent: 38 },
      opportunity: 'medium',
      whyItWorks:
        'Operators respond to concrete removal of tasks, not abstract productivity.',
      examplePositioning: 'Automate the three reports your team rebuilds every Monday.',
      psychologicalFraming: 'Cognitive ease + endowment of existing habits',
      saturationLevel: 'Rising in demo-led channels.',
      usageRecommendation: 'Lead with a named workflow, not generic automation.',
      underusedOpportunity:
        'Ops-led creative that names a single recurring artifact outperforms generic “save time” hooks.',
      colorKey: 'emerald',
      reasonSignals: [{ label: 'Channel', detail: 'Rising share in demo-led programs vs last quarter.' }],
    },
  ],
  competitors: [
    {
      id: 'c1',
      name: 'Brand A',
      spendBand: 'high',
      confidence: 0.87,
      dominantAngle: 'Urgency',
      trend: 'up',
      reasonSignals: [{ label: 'Spend proxy', detail: 'Sustained SOV in category prospecting for 90+ days.' }],
      ads: [
        {
          id: 'c1-ad1',
          hookType: 'Curiosity Gap',
          angle: 'Speed Advantage',
          emotionalTrigger: 'Fear of Delay',
          format: 'UGC Video',
          cta: 'Try Free Trial',
          adText:
            'We almost doubled reply rates in 9 days—here is the one change we made first.',
        },
      ],
    },
    {
      id: 'c2',
      name: 'Brand B',
      spendBand: 'medium',
      confidence: 0.74,
      dominantAngle: 'Comparison',
      trend: 'flat',
      reasonSignals: [{ label: 'Format mix', detail: 'Heavy static + occasional UGC; less video depth.' }],
      ads: [
        {
          id: 'c2-ad1',
          hookType: 'Direct Challenge',
          angle: 'Proof Stack',
          emotionalTrigger: 'Competitive Anxiety',
          format: 'Static',
          cta: 'See the benchmark',
          adText:
            'If your outbound stack still looks like 2021, you are funding inefficiency.',
        },
      ],
    },
  ],
  winningAds: [
    {
      id: 'w1',
      angleId: 'a1',
      angleTitle: 'Pain Avoidance Urgency',
      angleColorKey: 'rose',
      performanceScore: 86,
      format: 'static',
      hook: 'Stop wasting money on bad leads',
      body: 'Qualify in real time. Route revenue-ready conversations to reps automatically.',
      cta: 'Get instant results',
      confidence: 0.81,
      reasonSignals: [
        { label: 'Pattern match', detail: 'Mirrors top spenders in your category.' },
        { label: 'Hook clarity', detail: 'Single outcome; no stacked promises.' },
      ],
      strategyNotes: {
        hookRationale:
          'Names a tangible leak (budget on bad leads) before the product appears.',
        competitorInspiration: 'Brand A urgency ladder, tightened to one metric.',
        psychologicalTrigger: 'Loss aversion on capital, not vanity metrics.',
      },
      staticDetails: {
        fullCopy:
          'Stop wasting money on bad leads.\n\nQualify in real time. Route revenue-ready conversations to reps automatically.\n\nGet instant results — book a 12-minute walkthrough.',
        layoutSuggestion:
          'Headline top-left; single proof row (logo strip or stat) beneath; CTA bottom-right.',
        textHierarchy: 'H1 hook → 2-line value → micro-proof → CTA.',
      },
    },
    {
      id: 'w2',
      angleId: 'a2',
      angleTitle: 'Proof-First Comparison',
      angleColorKey: 'indigo',
      performanceScore: 79,
      format: 'video',
      hook: 'Your stack is not slow — your handoffs are',
      body: 'Show the before/after workflow in one screen recording. No actors required.',
      cta: 'See the benchmark',
      confidence: 0.74,
      reasonSignals: [
        { label: 'Format fit', detail: 'UGC-style demo outperforms polished explainers here.' },
      ],
      strategyNotes: {
        hookRationale: 'Reframes blame away from the buyer toward a fixable interface.',
        competitorInspiration: 'Brand B comparison frame, shortened to one villain.',
        psychologicalTrigger: 'Competence signaling for the economic buyer.',
      },
      videoDetails: {
        scenes: [
          { range: '0–3s', beat: 'Screen cap: messy handoff (labels blurred).' },
          { range: '3–8s', beat: 'Split view: same task, automated routing overlay.' },
          { range: '8–15s', beat: 'Rep inbox with fewer threads, higher intent tags.' },
        ],
        voiceoverScript:
          'If revenue teams live in handoffs, speed does not matter. Here is one routing rule we turned on first.',
        retentionMechanism:
          'Pattern interrupt in frame one; payoff visible by second eight with a concrete UI change.',
      },
    },
    {
      id: 'w3',
      angleId: 'a3',
      angleTitle: 'Workflow Relief',
      angleColorKey: 'emerald',
      performanceScore: 72,
      format: 'image',
      hook: 'Automate the three reports your team rebuilds every Monday',
      body: 'Template library + scheduled delivery. Finance stays in sync without chasing Slack.',
      cta: 'Ship the first report this week',
      confidence: 0.69,
      reasonSignals: [
        { label: 'Specificity', detail: 'Named artifact beats generic save time messaging.' },
      ],
      strategyNotes: {
        hookRationale: 'Anchors to a recurring calendar pain executives recognize.',
        competitorInspiration: 'Lifted cadence from Brand B lifecycle, applied to ops.',
        psychologicalTrigger: 'Relief from recurring cognitive load.',
      },
      imageDetails: {
        promptSections: {
          subject: 'Operations lead reviewing a clean dashboard on a laptop',
          environment: 'Bright, minimal office with soft daylight',
          lighting: 'High-key, soft shadows, premium editorial',
          emotion: 'Calm focus, subtle satisfaction',
          composition: 'Rule of thirds; dashboard legible; generous negative space top-right for copy',
          'negative space instruction':
            'Reserve top-right quadrant for headline overlay; keep uncluttered',
          'style reference': 'Bloomberg Businessweek still life, muted palette',
        },
        compositionNotes: 'Leave headline zone clean; avoid busy UI chrome in focal area.',
        styleGuidance: 'Muted enterprise palette; no neon gradients.',
      },
    },
    {
      id: 'w4',
      angleId: 'a1',
      angleTitle: 'Pain Avoidance Urgency',
      angleColorKey: 'rose',
      performanceScore: 68,
      format: 'static',
      hook: 'Pipeline leaks while you debate tooling',
      body: 'Instrument handoffs this week. Measure what actually moves stage velocity.',
      cta: 'Start with one workflow',
      confidence: 0.66,
      reasonSignals: [{ label: 'Risk', detail: 'Strong line; needs proof snippet nearby.' }],
      strategyNotes: {
        hookRationale: 'Time-cost framing for committees stuck in evaluation.',
        competitorInspiration: 'Synthesis of Brand A urgency + Brand B proof hint.',
        psychologicalTrigger: 'Opportunity cost of inaction.',
      },
      staticDetails: {
        fullCopy:
          'Pipeline leaks while you debate tooling.\n\nInstrument handoffs this week. Measure what actually moves stage velocity.\n\nStart with one workflow — we will map it live.',
        layoutSuggestion: 'Bold hook; thin divider; proof callout in a tinted band.',
        textHierarchy: 'Hook → mechanism → CTA with time-bound offer.',
      },
    },
    {
      id: 'w5',
      angleId: 'a2',
      angleTitle: 'Proof-First Comparison',
      angleColorKey: 'indigo',
      performanceScore: 77,
      format: 'video',
      hook: 'Benchmark reply rate without adding headcount',
      body: 'Walk through the experiment design in plain language. No jargon wall.',
      cta: 'Watch the breakdown',
      confidence: 0.72,
      reasonSignals: [
        { label: 'Audience match', detail: 'Speaks to lean growth teams under hiring freeze.' },
      ],
      strategyNotes: {
        hookRationale: 'Promises analytical rigor with an efficiency constraint.',
        competitorInspiration: 'Brand B benchmark CTA, reframed as methodology.',
        psychologicalTrigger: 'Competence + resource scarcity.',
      },
      videoDetails: {
        scenes: [
          { range: '0–3s', beat: 'Whiteboard: baseline vs target metric.' },
          { range: '3–8s', beat: 'Simple funnel diagram with one highlighted lever.' },
          { range: '8–15s', beat: 'Customer quote on screen; CTA lower third.' },
        ],
        voiceoverScript:
          'We did not hire SDRs. We changed one qualification rule and measured for 14 days.',
        retentionMechanism: 'Promise of a number by mid-video; deliver before CTA.',
      },
    },
    {
      id: 'w6',
      angleId: 'a3',
      angleTitle: 'Workflow Relief',
      angleColorKey: 'emerald',
      performanceScore: 70,
      format: 'image',
      hook: 'One source of truth for weekly revenue review',
      body: 'Finance and growth see the same cohort definitions. No more shadow spreadsheets.',
      cta: 'See the template pack',
      confidence: 0.7,
      reasonSignals: [{ label: 'Clarity', detail: 'Single meeting artifact reduces ambiguity.' }],
      strategyNotes: {
        hookRationale: 'Meetings are expensive; the ad names the meeting type.',
        competitorInspiration: 'Internal playbook language from mid-market winners.',
        psychologicalTrigger: 'Relief from coordination tax.',
      },
      imageDetails: {
        promptSections: {
          subject: 'Two executives aligned over a single tablet dashboard',
          environment: 'Glass meeting room, late afternoon light',
          lighting: 'Warm rim light, controlled contrast',
          emotion: 'Mutual understanding, decisive calm',
          composition: 'Center-weighted subjects; dashboard visible between them',
          'negative space instruction': 'Lower third reserved for CTA strip',
          'style reference': 'McKinsey Quarterly photography tone',
        },
        compositionNotes: 'Avoid cluttered charts; one hero number allowed.',
        styleGuidance: 'Desaturated suits; accent only on UI highlights.',
      },
    },
    {
      id: 'w7',
      angleId: 'a1',
      angleTitle: 'Pain Avoidance Urgency',
      angleColorKey: 'rose',
      performanceScore: 64,
      format: 'static',
      hook: 'Every day without routing rules is tax season for pipeline',
      body: 'Stand up guardrails in hours, not quarters. Start with one segment.',
      cta: 'Talk to routing specialist',
      confidence: 0.63,
      reasonSignals: [{ label: 'Metaphor risk', detail: 'Pair with concrete stat in body.' }],
      strategyNotes: {
        hookRationale: 'Metaphor bridges finance and revops vocabulary.',
        competitorInspiration: 'Novel extension of dominant urgency theme.',
        psychologicalTrigger: 'Anticipated pain of future crunch.',
      },
      staticDetails: {
        fullCopy:
          'Every day without routing rules is tax season for pipeline.\n\nStand up guardrails in hours, not quarters. Start with one segment.\n\nTalk to a routing specialist — 20 minutes.',
        layoutSuggestion: 'Metaphor headline; stat callout box; human photo optional.',
        textHierarchy: 'Metaphor → concrete offer → human CTA.',
      },
    },
  ],
  productionQueue: [
    {
      id: 'p1',
      label: 'Creative #1',
      type: 'UGC Video',
      hookStrength: 'High',
      angle: 'Pain avoidance',
      status: 'Recommended',
      confidence: 0.84,
      reasonSignals: [
        { label: 'Signal strength', detail: 'Matches highest-confidence angle + format pair.' },
      ],
    },
    {
      id: 'p2',
      label: 'Creative #2',
      type: 'Static',
      hookStrength: 'Medium',
      angle: 'Proof-first comparison',
      status: 'Test',
      confidence: 0.71,
      reasonSignals: [{ label: 'Portfolio balance', detail: 'Adds analytical mode coverage.' }],
      imagePromptSections: {
        subject: 'Minimal product UI on device with annotated callouts',
        environment: 'Desk scene, neutral background',
        lighting: 'Softbox key, low specularity',
        emotion: 'Clarity and trust',
        composition: 'UI dominant; annotations in brand accent',
        'negative space instruction': 'Right rail empty for headline',
        'style reference': 'Apple-style product still, subdued palette',
      },
    },
    {
      id: 'p3',
      label: 'Creative #3',
      type: 'Image',
      hookStrength: 'High',
      angle: 'Workflow relief',
      status: 'Recommended',
      confidence: 0.78,
      reasonSignals: [{ label: 'Differentiation', detail: 'Under-indexed vs competitors in feed.' }],
      imagePromptSections: {
        subject: 'Team whiteboarding a simplified workflow map',
        environment: 'Modern office wall, sticky notes in monochrome',
        lighting: 'Even, documentary',
        emotion: 'Collaborative focus',
        composition: 'Wide shot; map readable',
        'negative space instruction': 'Top band reserved for logo + hook',
        'style reference': 'Notion brand photography',
      },
    },
  ],
  campaignPack: {
    staticAds: 10,
    ugcScripts: 5,
    imageConcepts: 6,
    landingVariants: 3,
    dominantAngles: 2,
  },
}
