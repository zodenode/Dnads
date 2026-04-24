/**
 * TikTok Commercial Content / Ad Library API (Research).
 * Client credentials token + POST /v2/research/adlib/ad/query/
 */

const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_AD_QUERY = "https://open.tiktokapis.com/v2/research/adlib/ad/query/";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getClientAccessToken(): Promise<string | null> {
  const key = process.env.TIKTOK_CLIENT_KEY?.trim();
  const secret = process.env.TIKTOK_CLIENT_SECRET?.trim();
  if (!key || !secret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const body = new URLSearchParams({
    client_key: key,
    client_secret: secret,
    grant_type: "client_credentials",
  });

  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
    message?: string;
  };

  if (!res.ok || !json.access_token) {
    cachedToken = null;
    return null;
  }

  const ttlSec = typeof json.expires_in === "number" ? json.expires_in : 3600;
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + ttlSec * 1000,
  };
  return cachedToken.token;
}

export function isTikTokConfigured(): boolean {
  return Boolean(
    process.env.TIKTOK_CLIENT_KEY?.trim() && process.env.TIKTOK_CLIENT_SECRET?.trim(),
  );
}

export type TikTokAdRow = {
  ad?: {
    id?: string | number;
    first_shown_date?: string | number;
    last_shown_date?: string | number;
    status?: string;
    videos?: { url?: string }[];
    image_urls?: string[];
    reach?: { unique_users_seen?: string };
  };
  advertiser?: {
    business_id?: string | number;
    business_name?: string;
    paid_by?: string;
    /** API examples sometimes typo this */
    buisness_id?: string | number;
  };
};

type TikTokQueryResponse = {
  data?: {
    ads?: TikTokAdRow[];
    has_more?: boolean | string;
    search_id?: string;
  };
  error?: { code?: string; message?: string; http_status_code?: number };
};

export type FetchTikTokAdsParams = {
  search_term?: string;
  search_type?: "exact_phrase" | "fuzzy_phrase";
  country_code?: string;
  date_min: string; // YYYYMMDD
  date_max: string;
  max_count?: number;
  search_id?: string;
  advertiser_business_ids?: string[];
};

const DEFAULT_FIELDS =
  "ad.id,ad.first_shown_date,ad.last_shown_date,ad.status,ad.videos,ad.image_urls,ad.reach,advertiser.business_id,advertiser.business_name,advertiser.paid_for_by";

export async function fetchTikTokAds(
  params: FetchTikTokAdsParams,
): Promise<{ rows: TikTokAdRow[]; search_id?: string; has_more?: boolean; error?: string }> {
  const token = await getClientAccessToken();
  if (!token) {
    return { rows: [], error: "TikTok client credentials not configured or token failed" };
  }

  const fields = process.env.TIKTOK_ADLIB_FIELDS?.trim() || DEFAULT_FIELDS;
  const url = new URL(TIKTOK_AD_QUERY);
  url.searchParams.set("fields", fields);

  const body: Record<string, unknown> = {
    filters: {
      ad_published_date_range: {
        min: params.date_min,
        max: params.date_max,
      },
      ...(params.country_code && params.country_code !== "ALL"
        ? { country_code: params.country_code }
        : {}),
      ...(params.advertiser_business_ids?.length
        ? {
            advertiser_business_ids: params.advertiser_business_ids
              .map((x) => Number(x))
              .filter((n) => !Number.isNaN(n)),
          }
        : {}),
    },
    max_count: Math.min(Math.max(params.max_count ?? 20, 1), 50),
  };

  if (params.search_term?.trim()) {
    body.search_term = params.search_term.trim().slice(0, 50);
    if (params.search_type) body.search_type = params.search_type;
  }
  if (params.search_id) body.search_id = params.search_id;

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as TikTokQueryResponse;
  const errCode = json.error?.code;
  if (!res.ok || (errCode != null && errCode !== "ok")) {
    return {
      rows: [],
      error: json.error?.message || `TikTok HTTP ${res.status}`,
    };
  }

  const rows = json.data?.ads ?? [];
  const hasMore =
    typeof json.data?.has_more === "string"
      ? json.data.has_more === "true"
      : Boolean(json.data?.has_more);

  return {
    rows,
    search_id: json.data?.search_id,
    has_more: hasMore,
  };
}
