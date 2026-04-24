/**
 * Meta Ad Library via Graph API `ads_archive` (public transparency data).
 * Requires META_ACCESS_TOKEN with ads_read / Marketing API access as configured in Meta Developer.
 */

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";

export type MetaArchivedAd = {
  id?: string;
  page_id?: string;
  page_name?: string;
  ad_creative_bodies?: string[];
  ad_creative_link_titles?: string[];
  ad_creative_link_descriptions?: string[];
  ad_creative_link_captions?: string[];
  publisher_platforms?: string[];
};

type GraphPaging = { next?: string; cursors?: { after?: string } };

type AdsArchiveResponse = {
  data?: MetaArchivedAd[];
  paging?: GraphPaging;
  error?: { message: string; code?: number };
};

const DEFAULT_FIELDS = [
  "id",
  "page_id",
  "page_name",
  "ad_creative_bodies",
  "ad_creative_link_titles",
  "ad_creative_link_descriptions",
  "ad_creative_link_captions",
  "publisher_platforms",
].join(",");

function getToken(): string | null {
  const t = process.env.META_ACCESS_TOKEN?.trim();
  return t || null;
}

export function isMetaConfigured(): boolean {
  return Boolean(getToken());
}

export type FetchMetaAdsParams = {
  search_terms?: string;
  search_page_ids?: string[];
  ad_reached_countries: string[];
  ad_active_status?: "ACTIVE" | "ALL" | "INACTIVE";
  limit?: number;
  max_pages?: number;
};

export async function fetchMetaAdsArchive(
  params: FetchMetaAdsParams,
): Promise<{ ads: MetaArchivedAd[]; error?: string }> {
  const token = getToken();
  if (!token) {
    return { ads: [], error: "META_ACCESS_TOKEN not set" };
  }
  const countries = params.ad_reached_countries.length
    ? params.ad_reached_countries
    : ["US"];
  const limit = Math.min(params.limit ?? 25, 100);
  const maxPages = params.max_pages ?? 4;

  const base = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/ads_archive`);
  base.searchParams.set("access_token", token);
  base.searchParams.set("ad_reached_countries", JSON.stringify(countries));
  base.searchParams.set("ad_type", "ALL");
  base.searchParams.set("ad_active_status", params.ad_active_status ?? "ACTIVE");
  base.searchParams.set("fields", DEFAULT_FIELDS);
  base.searchParams.set("limit", String(limit));

  if (params.search_page_ids?.length) {
    const ids = params.search_page_ids.slice(0, 10).filter(Boolean);
    if (ids.length) {
      base.searchParams.set("search_page_ids", JSON.stringify(ids));
    }
  } else if (params.search_terms?.trim()) {
    base.searchParams.set("search_terms", params.search_terms.trim().slice(0, 100));
  } else {
    return { ads: [], error: "Meta: provide search_terms or search_page_ids" };
  }

  const out: MetaArchivedAd[] = [];
  let url: string | null = base.toString();
  let pages = 0;

  while (url && pages < maxPages) {
    const res = await fetch(url, { next: { revalidate: 0 } });
    const json = (await res.json()) as AdsArchiveResponse;
    if (json.error) {
      return {
        ads: out,
        error: json.error.message || `Meta API error ${json.error.code}`,
      };
    }
    const chunk = json.data ?? [];
    out.push(...chunk);
    pages += 1;
    url = json.paging?.next ?? null;
    if (!chunk.length) break;
  }

  return { ads: out };
}
