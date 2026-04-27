/**
 * Google Ads Transparency — SerpApi engine (JSON) when SERPAPI_API_KEY is set.
 * Without a key, returns empty (no HTML scraping in-repo).
 */

export type SerpGoogleAdCreative = {
  title?: string;
  description?: string;
  image?: string;
  video?: string;
  /** varies by SerpApi response shape */
  link?: string;
};

export type SerpGoogleTransparencyResult = {
  ads?: {
    title?: string;
    snippet?: string;
    video?: string;
    thumbnail?: string;
    advertiser?: string;
    advertiser_id?: string;
  }[];
  organic_results?: unknown;
  error?: string;
};

export function isGoogleSerpConfigured(): boolean {
  return Boolean(process.env.SERPAPI_API_KEY?.trim());
}

export type FetchGoogleTransparencyParams = {
  q?: string;
  advertiser_id?: string;
  domain?: string;
  engine?: string;
};

/**
 * Uses SerpApi's google_ads_transparency_center engine when configured.
 * @see https://serpapi.com/google-ads-transparency-center-api
 */
export async function fetchGoogleTransparencyAds(
  params: FetchGoogleTransparencyParams,
): Promise<{ items: SerpGoogleTransparencyResult["ads"]; error?: string }> {
  const key = process.env.SERPAPI_API_KEY?.trim();
  if (!key) {
    return { items: [], error: "SERPAPI_API_KEY not set (Google transparency disabled)" };
  }

  const u = new URL("https://serpapi.com/search.json");
  u.searchParams.set("engine", params.engine || "google_ads_transparency_center");
  u.searchParams.set("api_key", key);
  if (params.advertiser_id) u.searchParams.set("advertiser_id", params.advertiser_id);
  if (params.domain) u.searchParams.set("domain", params.domain);
  if (params.q) u.searchParams.set("q", params.q);

  const res = await fetch(u.toString(), { next: { revalidate: 0 } });
  const json = (await res.json()) as SerpGoogleTransparencyResult & {
    error?: string;
  };

  if (!res.ok || json.error) {
    return { items: [], error: json.error || `SerpApi HTTP ${res.status}` };
  }

  return { items: json.ads ?? [] };
}
