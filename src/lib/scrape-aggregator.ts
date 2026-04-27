/**
 * Fan-out: for each competitor mapping, query Meta / TikTok / Google and merge.
 */

import type { CompetitorLibraryMapping } from "./types";
import type { LibraryFetchContext } from "./scrapers/library-context";
import { fetchBackupHtmlSnippets } from "./scrapers/library-html-backup";
import { fetchGoogleTransparencyAds, isGoogleSerpConfigured } from "./scrapers/google-transparency";
import { fetchMetaAdsArchive, isMetaConfiguredWithOptionalToken } from "./scrapers/meta-ads";
import { fetchTikTokAds, isTikTokConfiguredWithOptionalUser } from "./scrapers/tiktok-ads";
import {
  googleSerpItemsToAds,
  metaArchivedToAds,
  tiktokRowsToAds,
} from "./scraped-ad-converters";
import type { Ad } from "./types";

export type ScrapeAggregatorOptions = {
  metaCountries: string[];
  tiktokCountry?: string;
  /** YYYYMMDD */
  tiktokDateMin: string;
  tiktokDateMax: string;
  maxCompetitors?: number;
  metaMaxPages?: number;
  metaPerQueryLimit?: number;
  /** User tokens from integrations store */
  libraryContext?: LibraryFetchContext | null;
};

function dedupeAds(ads: Ad[]): Ad[] {
  const seen = new Set<string>();
  const out: Ad[] = [];
  for (const a of ads) {
    const key = a.external_id && a.source
      ? `${a.source}:${a.external_id}`
      : `${a.source ?? "x"}:${a.competitor}:${a.text.slice(0, 120)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}

function defaultDateRange(): { min: string; max: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return { min: fmt(start), max: fmt(end) };
}

export async function aggregateLibraryAds(
  mappings: CompetitorLibraryMapping[],
  opts?: Partial<ScrapeAggregatorOptions>,
): Promise<{ ads: Ad[]; notes: string[] }> {
  const notes: string[] = [];
  const range = defaultDateRange();
  const metaCountries = opts?.metaCountries?.length ? opts.metaCountries : ["US"];
  const tiktokDateMin = opts?.tiktokDateMin ?? range.min;
  const tiktokDateMax = opts?.tiktokDateMax ?? range.max;
  const maxN = opts?.maxCompetitors ?? 10;
  const slice = mappings.slice(0, maxN);
  const ctx = opts?.libraryContext;

  const metaOk = isMetaConfiguredWithOptionalToken(ctx?.meta_access_token ?? null);
  const tikOk = isTikTokConfiguredWithOptionalUser({
    user_access_token: ctx?.tiktok?.user_access_token,
    client_key: ctx?.tiktok?.client_key,
    client_secret: ctx?.tiktok?.client_secret,
  });
  const googleOk = isGoogleSerpConfigured();

  if (!metaOk) notes.push("Meta: skipped (connect Meta in settings or set META_ACCESS_TOKEN)");
  if (!tikOk) {
    notes.push(
      "TikTok: skipped (connect TikTok in settings or set TIKTOK_CLIENT_KEY/SECRET for client_credentials)",
    );
  }
  if (!googleOk) notes.push("Google: skipped (SERPAPI_API_KEY unset)");

  const all: Ad[] = [];

  for (const m of slice) {
    const label = m.competitor_name;

    if (metaOk && m.meta?.search_terms?.trim()) {
      const r = await fetchMetaAdsArchive({
        search_terms: m.meta.search_terms,
        search_page_ids: m.meta.search_page_ids,
        ad_reached_countries: metaCountries,
        limit: opts?.metaPerQueryLimit ?? 25,
        max_pages: opts?.metaMaxPages ?? 2,
        access_token: ctx?.meta_access_token ?? undefined,
      });
      if (r.error) notes.push(`Meta (${label}): ${r.error}`);
      all.push(...metaArchivedToAds(r.ads));
    }

    if (tikOk && (m.tiktok?.search_term?.trim() || m.tiktok?.advertiser_business_ids?.length)) {
      const r = await fetchTikTokAds(
        {
          search_term: m.tiktok?.search_term,
          search_type: m.tiktok?.search_type,
          country_code: opts?.tiktokCountry || "US",
          date_min: tiktokDateMin,
          date_max: tiktokDateMax,
          max_count: 30,
          advertiser_business_ids: m.tiktok?.advertiser_business_ids,
        },
        {
          user_access_token: ctx?.tiktok?.user_access_token,
          client_key: ctx?.tiktok?.client_key,
          client_secret: ctx?.tiktok?.client_secret,
        },
      );
      if (r.error) notes.push(`TikTok (${label}): ${r.error}`);
      all.push(...tiktokRowsToAds(r.rows));
    }

    if (googleOk && (m.google?.search_query || m.google?.domain || m.google?.advertiser_id)) {
      const r = await fetchGoogleTransparencyAds({
        q: m.google?.search_query,
        domain: m.google?.domain,
        advertiser_id: m.google?.advertiser_id,
      });
      if (r.error) notes.push(`Google (${label}): ${r.error}`);
      all.push(...googleSerpItemsToAds(r.items ?? []));
    }
  }

  let merged = dedupeAds(all);

  if (merged.length < 4 && process.env.BACKUP_HTML_FETCH === "1") {
    const backup = await fetchBackupHtmlSnippets(slice, maxN);
    notes.push(...backup.notes);
    merged = dedupeAds([...merged, ...backup.ads]);
  }

  return { ads: merged, notes };
}
