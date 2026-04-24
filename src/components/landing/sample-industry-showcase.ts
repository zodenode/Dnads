/**
 * Illustrative ad-style snippets for landing conversion only — fictional brands,
 * not scraped copy. Shapes mirror what the product surfaces (hook, body, CTA, platform).
 */

export type SamplePlatform = "Meta" | "TikTok" | "Google";

export type SampleAdCard = {
  platform: SamplePlatform;
  hook_label: string;
  headline: string;
  body: string;
  cta: string;
};

export type IndustryShowcase = {
  id: string;
  name: string;
  /** One line for growth / performance marketers */
  audience: string;
  /** Pre-fills the URL field when user taps "run on this vertical" */
  demo_url: string;
  ads: SampleAdCard[];
};

export const INDUSTRY_SHOWCASES: IndustryShowcase[] = [
  {
    id: "saas",
    name: "B2B SaaS",
    audience: "PLG, sales-led, and vertical SaaS teams benchmarking category narrative.",
    demo_url: "https://www.notion.so",
    ads: [
      {
        platform: "Meta",
        hook_label: "pain",
        headline: "Still patching spreadsheets between tools?",
        body: "Northline pulls CRM + billing into one workspace your reps already live in. No rip-and-replace.",
        cta: "Book a 20-min fit call",
      },
      {
        platform: "Google",
        hook_label: "comparison",
        headline: "Vs. legacy CPQ — see the delta",
        body: "Side-by-side: quote-to-cash time, seat cost, and SOC2 posture. Built for mid-market RevOps.",
        cta: "Get the matrix",
      },
    ],
  },
  {
    id: "dtc",
    name: "DTC / e-commerce",
    audience: "Brand and performance teams fighting CAC in crowded categories.",
    demo_url: "https://www.allbirds.com",
    ads: [
      {
        platform: "TikTok",
        hook_label: "urgency",
        headline: "Last drop of the season — ships free",
        body: "Merino crew in three earth tones. When they’re gone we don’t restock until fall.",
        cta: "Shop the drop",
      },
      {
        platform: "Meta",
        hook_label: "social proof",
        headline: "50k five-star reviews don’t lie",
        body: "Same insole, new upper. Try them for 30 days — full refund, no questionnaire.",
        cta: "Pick your size",
      },
    ],
  },
  {
    id: "fintech",
    name: "Fintech",
    audience: "Product and growth leads in payments, lending, and personal finance.",
    demo_url: "https://wise.com",
    ads: [
      {
        platform: "Google",
        hook_label: "trust",
        headline: "Send USD → EUR at the mid-market rate",
        body: "No hidden spread. Licensed in 50+ corridors. Average arrival under 24h on business days.",
        cta: "Compare your bank",
      },
      {
        platform: "Meta",
        hook_label: "curiosity",
        headline: "What if your card floated?",
        body: "Metal build, zero foreign fees on first $5k/month. Waitlist opens Friday — spots capped.",
        cta: "Join waitlist",
      },
    ],
  },
  {
    id: "health",
    name: "Health & wellness",
    audience: "Subscription brands, clinics, and apps balancing compliance with performance creative.",
    demo_url: "https://www.hims.com",
    ads: [
      {
        platform: "TikTok",
        hook_label: "UGC style",
        headline: "“I finally stopped guessing doses”",
        body: "Telehealth + delivery in 48h. Real member story — not an actor. Rx where eligible.",
        cta: "Check eligibility",
      },
      {
        platform: "Meta",
        hook_label: "authority",
        headline: "Clinician-reviewed plans",
        body: "Same active ingredients you know — transparent pricing, cancel anytime from the app.",
        cta: "Start assessment",
      },
    ],
  },
];
