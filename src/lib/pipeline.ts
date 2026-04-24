/**
 * End-to-end orchestration: URL signals → Claude (competitors + simulated ads)
 * → local pattern analysis → Claude (pattern-grounded generation).
 */

import { parseAdsFromJson } from "./ad-decomposition";
import { callClaudeJson } from "./claude";
import { fetchUrlSignals } from "./competitor-analysis";
import { parseGeneratedAds, validateGrowthPackShape } from "./generation-engine";
import { analyzePatterns } from "./pattern-analysis";
import type { Ad, Business, GrowthPack } from "./types";

type Phase2Out = {
  generated_ads: unknown;
  landing_headlines: unknown;
  landing_subcopy: unknown;
  ugc_script_ideas: unknown;
  campaign_structure: unknown;
};

const SYSTEM_PHASE1 = `You are a market intelligence analyst. You do NOT copy real ads from the web. You infer category and competitors from the URL and any fetched page signals, then SIMULATE realistic competitor ad examples that could plausibly run on Meta, TikTok, or Google Ads — clearly fictional but structurally authentic.

Return ONLY valid JSON (no markdown fences) matching this shape:
{
  "business": {
    "url": string,
    "category": string,
    "value_proposition": string[],
    "target_audience": string[],
    "competitors": string[] (5-10 names),
    "product_summary": string (optional, 2-4 sentences),
    "pricing_tiers": string[] (optional, inferred tiers or "unknown")
  },
  "competitor_ads": Ad[]
}

Each Ad must be:
{
  "competitor": string (must match one of business.competitors),
  "hook_type": one of "pain"|"curiosity"|"urgency"|"status"|"comparison",
  "angle": string (short label, e.g. "speed", "ROI", "risk reversal"),
  "emotional_trigger": string,
  "format": string (e.g. "UGC", "testimonial", "static", "video", "carousel"),
  "cta": string,
  "text": string (primary ad body, not a copy of any known brand line),
  "audience_target": string (optional),
  "offer_type": string (optional, e.g. "free trial", "discount", "bundle")
}

Produce at least 18 competitor_ads spread across competitors and hook types. Everything must be derived from plausible market behaviour for the inferred category, not generic motivational copy.`;

const SYSTEM_PHASE2 = `You are a performance strategist. You receive structured competitor ad simulations and computed market pattern stats. You MUST generate new ads by recombining winning patterns and deliberately exploiting underused gaps — not generic AI copy.

Rules:
- Reference patterns explicitly in your reasoning only inside JSON fields as short labels where relevant.
- Output 14-18 generated ad variations grouped into angle clusters (cluster field).
- Hooks and angles should reflect top patterns AND gap opportunities from the input.

Return ONLY valid JSON (no markdown fences):
{
  "generated_ads": [
    {
      "hook": string,
      "primary_text": string,
      "cta": string,
      "angle_label": string,
      "emotional_trigger_label": string,
      "cluster": string
    }
  ],
  "landing_headlines": string[] (exactly 3),
  "landing_subcopy": string[] (exactly 3),
  "ugc_script_ideas": string[] (exactly 5, short-form video beats, bullet style ok),
  "campaign_structure": [
    { "name": string, "objective": string, "notes": string (optional) }
  ] (5-8 items, Meta/TikTok style campaign naming)
}`;

function buildPhase1User(signals: Awaited<ReturnType<typeof fetchUrlSignals>>) {
  return `URL and page signals (may be partial if fetch failed):
${JSON.stringify(signals, null, 2)}

Infer the business, list 5-10 closest competitors by category + keywords, then output competitor_ads as specified.`;
}

function buildPhase2User(
  business: Business,
  ads: Ad[],
  marketJson: string,
) {
  return `Business:
${JSON.stringify(business, null, 2)}

Competitor ad samples (simulated for R&D — do not treat as real scraped ads):
${JSON.stringify(ads, null, 2)}

Computed market pattern analysis (authoritative — base generation on this):
${marketJson}

Generate the campaign pack JSON. Ensure generated_ads are visibly informed by top_hooks, top_angles, saturation_gaps, and winning_patterns.`;
}

function coerceBusiness(raw: Record<string, unknown>, url: string): Business {
  const competitors = Array.isArray(raw.competitors)
    ? raw.competitors.map((c) => String(c).trim()).filter(Boolean)
    : [];
  return {
    url: String(raw.url || url),
    category: String(raw.category || "General").trim() || "General",
    value_proposition: Array.isArray(raw.value_proposition)
      ? raw.value_proposition.map((v) => String(v).trim()).filter(Boolean)
      : [],
    target_audience: Array.isArray(raw.target_audience)
      ? raw.target_audience.map((v) => String(v).trim()).filter(Boolean)
      : [],
    competitors: competitors.length ? competitors : ["Category peer A", "Category peer B"],
    product_summary:
      raw.product_summary != null ? String(raw.product_summary).trim() : undefined,
    pricing_tiers: Array.isArray(raw.pricing_tiers)
      ? raw.pricing_tiers.map((p) => String(p).trim()).filter(Boolean)
      : undefined,
  };
}

export async function runPipeline(inputUrl: string): Promise<GrowthPack> {
  const signals = await fetchUrlSignals(inputUrl.trim());
  const phase1 = await callClaudeJson<Record<string, unknown>>(SYSTEM_PHASE1, buildPhase1User(signals));

  const business = coerceBusiness(
    (phase1.business as Record<string, unknown>) ?? {},
    signals.url,
  );
  const rawAds = phase1.competitor_ads;
  const competitorList = business.competitors[0] ?? "Competitor";
  const competitor_ads = parseAdsFromJson(
    Array.isArray(rawAds) ? rawAds : [],
    competitorList,
  );

  const market = analyzePatterns(competitor_ads);

  const phase2 = await callClaudeJson<Phase2Out>(
    SYSTEM_PHASE2,
    buildPhase2User(business, competitor_ads, JSON.stringify(market, null, 2)),
  );

  const generated_ads = parseGeneratedAds(phase2.generated_ads);
  const landing_headlines = Array.isArray(phase2.landing_headlines)
    ? phase2.landing_headlines.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const landing_subcopy = Array.isArray(phase2.landing_subcopy)
    ? phase2.landing_subcopy.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const ugc_script_ideas = Array.isArray(phase2.ugc_script_ideas)
    ? phase2.ugc_script_ideas.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const campaign_structure = Array.isArray(phase2.campaign_structure)
    ? phase2.campaign_structure
        .filter((x): x is Record<string, unknown> => x != null && typeof x === "object")
        .map((row) => ({
          name: String(row.name ?? "").trim() || "Campaign",
          objective: String(row.objective ?? "").trim() || "Conversion",
          notes: row.notes != null ? String(row.notes).trim() : undefined,
        }))
    : [];

  const pack: GrowthPack = {
    business,
    competitor_ads,
    market,
    generated_ads,
    landing_headlines: landing_headlines.slice(0, 3),
    landing_subcopy: landing_subcopy.slice(0, 3),
    ugc_script_ideas: ugc_script_ideas.slice(0, 5),
    campaign_structure,
  };

  const errs = validateGrowthPackShape(pack);
  if (errs.length) {
    throw new Error(`Invalid pack: ${errs.join("; ")}`);
  }
  return pack;
}
