import type { Business } from "./types";
import { completeJson } from "./anthropic";

const SYSTEM = `You are a market research analyst. Given a website URL and extracted page text, infer the business and 5-10 closest competitors by category and keyword overlap.
Rules:
- Competitors must be plausible named companies or products in the same category (not generic placeholders like "Competitor A").
- If the page text is thin, still infer from URL domain and any signals.
- Output ONLY valid JSON matching the schema exactly. No markdown.`;

type CompetitorPhase = {
  category: string;
  product_summary: string;
  value_proposition: string[];
  target_audience: string[];
  pricing_tier_inference: string[];
  competitors: string[];
};

export async function analyzeCompetitors(
  url: string,
  pageText: string
): Promise<Business> {
  const user = JSON.stringify({
    url,
    page_text_excerpt: pageText.slice(0, 24_000),
  });

  const out = await completeJson<CompetitorPhase>(SYSTEM, user);

  return {
    url,
    category: out.category || "General",
    value_proposition: Array.isArray(out.value_proposition) ? out.value_proposition : [],
    target_audience: Array.isArray(out.target_audience) ? out.target_audience : [],
    competitors: Array.isArray(out.competitors) ? out.competitors.slice(0, 10) : [],
    product_summary: out.product_summary,
    pricing_tier_inference: Array.isArray(out.pricing_tier_inference)
      ? out.pricing_tier_inference
      : [],
  };
}
