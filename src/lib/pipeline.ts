/**
 * URL signals → business (Claude) → per-library competitor mapping (Claude)
 * → Meta/TikTok/Google fetches → pattern analysis → generation (Claude).
 */

import { inferCompetitorLibraryMappings } from "./competitor-library-intel";
import { parseAdsFromJson } from "./ad-decomposition";
import { callClaudeJson } from "./claude";
import { fetchUrlSignals } from "./competitor-analysis";
import { parseGeneratedAds, validateGrowthPackShape } from "./generation-engine";
import { analyzePatterns } from "./pattern-analysis";
import { decryptMetaToken, decryptTikTokTokens, loadUserIntegrations } from "./integrations/store";
import { aggregateLibraryAds } from "./scrape-aggregator";
import type { LibraryFetchContext } from "./scrapers/library-context";
import type { Ad, AdSource, Business, GrowthPack } from "./types";

export type PipelineOptions = {
  metaCountries?: string[];
  maxCompetitors?: number;
  /** Clerk user id — loads encrypted Meta/TikTok tokens from integrations store */
  clerkUserId?: string | null;
};

type Phase1Out = {
  business: Record<string, unknown>;
  competitor_ads?: unknown;
};

type Phase2Out = {
  generated_ads: unknown;
  landing_headlines: unknown;
  landing_subcopy: unknown;
  ugc_script_ideas: unknown;
  campaign_structure: unknown;
};

const SYSTEM_PHASE1_BUSINESS = `You are a market intelligence analyst. Infer the business from the URL and optional page signals.

Return ONLY valid JSON (no markdown):
{
  "business": {
    "url": string,
    "category": string,
    "value_proposition": string[],
    "target_audience": string[],
    "competitors": string[] (6-12 distinct competitor / peer brand names in this category),
    "product_summary": string (optional),
    "pricing_tiers": string[] (optional)
  }
}

Competitors should be real-world brand or product names a user would recognize in the category. Do not include ad creative text.`;

const SYSTEM_FILL_SYNTHETIC = `You output ONLY synthetic structured competitor ads for pattern analysis when live library samples are thin. These must be plausible category creatives, not copies of real ads.

Return ONLY valid JSON (no markdown): { "competitor_ads": Ad[] }

Ad shape:
{
  "competitor": string (from the provided competitor list),
  "hook_type": "pain"|"curiosity"|"urgency"|"status"|"comparison",
  "angle": string,
  "emotional_trigger": string,
  "format": string,
  "cta": string,
  "text": string,
  "audience_target": string (optional),
  "offer_type": string (optional)
}

Produce 12-20 ads spread across competitors and hook types.`;

const SYSTEM_PHASE2 = `You are a performance strategist. You receive structured competitor ad rows (from transparency libraries and/or synthetic fill) plus computed market pattern stats. Generate new ads by recombining winning patterns and underused gaps — not generic copy.

Rules:
- Output 14-18 generated ad variations with cluster field for angle grouping.
- Ground hooks and angles in top_hooks, top_angles, saturation_gaps, winning_patterns.

Return ONLY valid JSON (no markdown):
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
  "ugc_script_ideas": string[] (exactly 5),
  "campaign_structure": [
    { "name": string, "objective": string, "notes": string (optional) }
  ] (5-8 items)
}`;

function buildPhase1User(signals: Awaited<ReturnType<typeof fetchUrlSignals>>) {
  return `URL and page signals (may be partial if fetch failed):
${JSON.stringify(signals, null, 2)}`;
}

function buildPhase2User(
  business: Business,
  ads: Ad[],
  marketJson: string,
) {
  return `Business:
${JSON.stringify(business, null, 2)}

Competitor ad rows (library + optional synthetic; treat as R&D dataset):
${JSON.stringify(ads, null, 2)}

Computed market pattern analysis (authoritative):
${marketJson}

Generate the campaign pack JSON.`;
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

function countBySource(ads: Ad[]): {
  meta_count: number;
  tiktok_count: number;
  google_count: number;
  synthetic_count: number;
} {
  const c = { meta: 0, tiktok: 0, google: 0, synthetic: 0 };
  for (const a of ads) {
    const s = (a.source ?? "synthetic") as AdSource;
    if (s === "meta") c.meta += 1;
    else if (s === "tiktok") c.tiktok += 1;
    else if (s === "google") c.google += 1;
    else c.synthetic += 1;
  }
  return {
    meta_count: c.meta,
    tiktok_count: c.tiktok,
    google_count: c.google,
    synthetic_count: c.synthetic,
  };
}

export async function runPipeline(
  inputUrl: string,
  options?: PipelineOptions,
): Promise<GrowthPack> {
  const signals = await fetchUrlSignals(inputUrl.trim());
  const phase1 = await callClaudeJson<Phase1Out>(SYSTEM_PHASE1_BUSINESS, buildPhase1User(signals));

  const business = coerceBusiness(
    (phase1.business as Record<string, unknown>) ?? {},
    signals.url,
  );

  const intel = await inferCompetitorLibraryMappings({
    url: business.url,
    category: business.category,
    competitors: business.competitors,
    value_proposition: business.value_proposition,
    target_audience: business.target_audience,
    product_summary: business.product_summary,
  });

  let libraryContext: LibraryFetchContext | undefined;
  if (options?.clerkUserId) {
    const rec = await loadUserIntegrations(options.clerkUserId);
    const metaTok = decryptMetaToken(rec);
    const tt = decryptTikTokTokens(rec);
    libraryContext = {
      meta_access_token: metaTok,
      tiktok: {
        user_access_token: tt.access,
        client_key: tt.clientKey ?? process.env.TIKTOK_CLIENT_KEY?.trim() ?? null,
        client_secret: tt.clientSecret ?? process.env.TIKTOK_CLIENT_SECRET?.trim() ?? null,
      },
    };
  }

  const { ads: scraped, notes } = await aggregateLibraryAds(intel.mappings, {
    metaCountries: options?.metaCountries ?? ["US"],
    maxCompetitors: options?.maxCompetitors ?? 10,
    libraryContext,
  });

  let competitor_ads = scraped;
  const minScraped = 8;
  if (competitor_ads.length < minScraped) {
    const fill = await callClaudeJson<Record<string, unknown>>(
      SYSTEM_FILL_SYNTHETIC,
      `Business:\n${JSON.stringify(business, null, 2)}\n\nLibrary scrape returned ${competitor_ads.length} rows. Add structured competitor_ads to reach strong pattern coverage.`,
    );
    const rawFill = fill.competitor_ads;
    const synth = parseAdsFromJson(
      Array.isArray(rawFill) ? rawFill : [],
      business.competitors[0] ?? "Competitor",
    ).map((a) => ({ ...a, source: "synthetic" as const }));
    competitor_ads = [...competitor_ads, ...synth];
  }

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

  const provenance = countBySource(competitor_ads);
  const extraNotes = [...notes];
  if (intel.rationale) extraNotes.push(`Mapping: ${intel.rationale}`);

  const pack: GrowthPack = {
    business,
    competitor_ads,
    ad_provenance: {
      ...provenance,
      notes: extraNotes.length ? extraNotes : undefined,
    },
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
