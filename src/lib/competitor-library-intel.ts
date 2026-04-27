/**
 * LLM: map each inferred competitor to the right query knobs per ad library
 * (Meta keyword / page id, TikTok search term / business ids, Google query / domain).
 */

import { callClaudeJson } from "./claude";
import type { Business, CompetitorIntelResult, CompetitorLibraryMapping } from "./types";

const SYSTEM = `You are an ad-library research assistant. Given a business profile and competitor names, output how to query each transparency system.

Return ONLY valid JSON (no markdown):
{
  "mappings": [
    {
      "competitor_name": string,
      "meta": { "search_terms": string (optional, <=90 chars, English keywords likely in their ads), "search_page_ids": string[] (optional, only if you know real numeric Facebook Page IDs — usually omit) },
      "tiktok": { "search_term": string (optional, <=50 chars), "advertiser_business_ids": string[] (optional, numeric strings if known — usually omit), "search_type": "exact_phrase" | "fuzzy_phrase" (optional) },
      "google": { "search_query": string (optional, for transparency text search), "domain": string (optional, guessed advertiser domain like competitor.com), "advertiser_id": string (optional) }
    }
  ],
  "rationale": string (optional, brief)
}

Rules:
- Prefer short brand-like search_terms for Meta/TikTok (e.g. product category + brand token), not full sentences.
- For google.search_query, use brand + category words that would match Ads Transparency search.
- If unsure about page IDs or TikTok business IDs, omit those arrays or leave empty — the app will keyword-search only.
- Include one mapping object per competitor in the input list, same order when possible.`;

export async function inferCompetitorLibraryMappings(
  business: Pick<
    Business,
    "url" | "category" | "competitors" | "value_proposition" | "target_audience" | "product_summary"
  >,
): Promise<CompetitorIntelResult> {
  const user = `Business profile:
${JSON.stringify(business, null, 2)}

Infer library query mappings for each competitor.`;

  const raw = await callClaudeJson<Record<string, unknown>>(SYSTEM, user);
  const mappings: CompetitorLibraryMapping[] = Array.isArray(raw.mappings)
    ? raw.mappings
        .filter((x): x is Record<string, unknown> => x != null && typeof x === "object")
        .map((row): CompetitorLibraryMapping => {
          const competitor_name = String(row.competitor_name ?? "").trim();
          const meta = row.meta as Record<string, unknown> | undefined;
          const tiktok = row.tiktok as Record<string, unknown> | undefined;
          const google = row.google as Record<string, unknown> | undefined;
          const st = tiktok?.search_type;
          const search_type =
            st === "fuzzy_phrase" || st === "exact_phrase" ? st : undefined;
          return {
            competitor_name,
            meta: meta
              ? {
                  search_terms: meta.search_terms != null ? String(meta.search_terms).slice(0, 100) : undefined,
                  search_page_ids: Array.isArray(meta.search_page_ids)
                    ? meta.search_page_ids.map((id) => String(id).trim()).filter(Boolean).slice(0, 10)
                    : undefined,
                }
              : undefined,
            tiktok: tiktok
              ? {
                  search_term:
                    tiktok.search_term != null ? String(tiktok.search_term).slice(0, 50) : undefined,
                  advertiser_business_ids: Array.isArray(tiktok.advertiser_business_ids)
                    ? tiktok.advertiser_business_ids.map((id) => String(id).trim()).filter(Boolean)
                    : undefined,
                  search_type,
                }
              : undefined,
            google: google
              ? {
                  search_query:
                    google.search_query != null ? String(google.search_query).slice(0, 200) : undefined,
                  domain: google.domain != null ? String(google.domain).trim() : undefined,
                  advertiser_id:
                    google.advertiser_id != null ? String(google.advertiser_id).trim() : undefined,
                }
              : undefined,
          };
        })
        .filter((m) => m.competitor_name)
    : [];

  return {
    mappings,
    rationale: raw.rationale != null ? String(raw.rationale) : undefined,
  };
}
