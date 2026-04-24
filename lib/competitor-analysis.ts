import type { AdIntel, Business } from "@/src/types/growth-pack";
import { claudeJson } from "./claude-client";

type BusinessAndAdsPayload = {
  business: Business;
  competitor_ads: AdIntel[];
};

const SYSTEM_BUSINESS_ADS = `You are a market intelligence analyst. You NEVER copy real ads verbatim from the web. You simulate plausible competitor ad examples for R&D pattern analysis only.

Return ONLY valid JSON matching this shape (no markdown):
{
  "business": {
    "url": string,
    "category": string,
    "value_proposition": string[],
    "target_audience": string[],
    "competitors": string[],
    "product_summary": string,
    "pricing_tier_inference": string[]
  },
  "competitor_ads": AdIntel[]
}

Each AdIntel object must have:
competitor, hook_type (one of: pain, curiosity, urgency, status, comparison), angle, audience_target, offer_type, emotional_trigger, format (e.g. UGC, testimonial, static, video, carousel), cta, text (realistic but invented sample primary text, not copied), platform (meta | tiktok | google).

Rules:
- Identify 5-10 closest competitors by category + inferred keywords from the page.
- For EACH competitor, output 2-3 simulated ads mixing platforms.
- Hooks and angles must vary across the set to enable downstream pattern analysis.
- All copy must be original simulation, informed by the business context.`;

export async function inferBusinessAndCompetitorAds(
  url: string,
  pageText: string
): Promise<BusinessAndAdsPayload> {
  const user = `Target URL: ${url}

Page text excerpt (may be partial):
---
${pageText || "(fetch failed or empty — infer carefully from URL hostname and path only)"}
---

Produce JSON as specified.`;

  return claudeJson<BusinessAndAdsPayload>(SYSTEM_BUSINESS_ADS, user);
}
