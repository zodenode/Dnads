/**
 * Turn raw library rows into internal Ad objects (heuristic structure).
 */

import type { Ad, AdSource } from "./types";
import type { MetaArchivedAd } from "./scrapers/meta-ads";
import type { TikTokAdRow } from "./scrapers/tiktok-ads";

function inferHookFromText(text: string): Ad["hook_type"] {
  const t = text.toLowerCase();
  if (/\b(last chance|today only|limited time|running out|deadline|now)\b/.test(t)) return "urgency";
  if (/\b(vs\.?|versus|compared to|#1|best|beat)\b/.test(t)) return "comparison";
  if (/\b(join thousands|trusted|award|pros use)\b/.test(t)) return "status";
  if (/\b(stop|tired of|struggling|pain|fix)\b/.test(t)) return "pain";
  if (/\b(how|secret|why|discover|what if)\b/.test(t)) return "curiosity";
  return "curiosity";
}

function pickCta(titles: string[], captions: string[]): string {
  const t = titles.find(Boolean)?.trim();
  if (t) return t.slice(0, 80);
  const c = captions.find(Boolean)?.trim();
  if (c) return c.slice(0, 80);
  return "Learn more";
}

export function metaArchivedToAds(rows: MetaArchivedAd[], source: AdSource = "meta"): Ad[] {
  const out: Ad[] = [];
  for (const r of rows) {
    const bodies = r.ad_creative_bodies ?? [];
    const titles = r.ad_creative_link_titles ?? [];
    const descs = r.ad_creative_link_descriptions ?? [];
    const caps = r.ad_creative_link_captions ?? [];
    const text = [...bodies, ...descs].filter(Boolean).join(" \n ").trim();
    if (!text) continue;
    const competitor = r.page_name?.trim() || "Meta advertiser";
    const hook_type = inferHookFromText(text);
    const platforms = (r.publisher_platforms ?? []).join(", ") || "Meta";
    out.push({
      competitor,
      hook_type,
      angle: "library_creative",
      emotional_trigger: "inferred_from_copy",
      format: platforms.toLowerCase().includes("instagram") ? "social_static_or_video" : "social_static_or_video",
      cta: pickCta(titles, caps),
      text: text.slice(0, 2000),
      audience_target: undefined,
      offer_type: undefined,
      source,
      external_id: r.id ? String(r.id) : undefined,
    });
  }
  return out;
}

export function tiktokRowsToAds(rows: TikTokAdRow[], source: AdSource = "tiktok"): Ad[] {
  const out: Ad[] = [];
  for (const row of rows) {
    const name =
      row.advertiser?.business_name?.trim() ||
      String(row.advertiser?.business_id ?? row.advertiser?.buisness_id ?? "TikTok advertiser");
    const id = row.ad?.id != null ? String(row.ad.id) : undefined;
    const reach = row.ad?.reach?.unique_users_seen;
    const status = row.ad?.status;
    const text = [
      `TikTok ad${id ? ` ${id}` : ""}`,
      status ? `status: ${status}` : "",
      reach ? `reach: ${reach}` : "",
      row.ad?.videos?.[0]?.url ? `video: ${row.ad.videos[0].url}` : "",
      row.ad?.image_urls?.[0] ? `image: ${row.ad.image_urls[0]}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    if (!text) continue;

    out.push({
      competitor: name,
      hook_type: inferHookFromText(text),
      angle: "library_creative",
      emotional_trigger: "inferred_from_metadata",
      format: row.ad?.videos?.length ? "video" : "static",
      cta: "View on TikTok",
      text: text.slice(0, 2000),
      source,
      external_id: id,
    });
  }
  return out;
}

export function googleSerpItemsToAds(
  items: { title?: string; snippet?: string; video?: string; thumbnail?: string; advertiser?: string }[],
  source: AdSource = "google",
): Ad[] {
  const out: Ad[] = [];
  for (const it of items ?? []) {
    const text = [it.title, it.snippet].filter(Boolean).join(" — ").trim();
    if (!text) continue;
    const competitor = it.advertiser?.trim() || "Google advertiser";
    out.push({
      competitor,
      hook_type: inferHookFromText(text),
      angle: "library_creative",
      emotional_trigger: "inferred_from_copy",
      format: it.video ? "video" : "static",
      cta: "Visit",
      text: text.slice(0, 2000),
      source,
    });
  }
  return out;
}
