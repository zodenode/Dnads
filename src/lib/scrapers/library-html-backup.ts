/**
 * Lightweight HTML fetch "backup" — NOT a headless browser.
 * Fetches public search result HTML and extracts plain text snippets for pattern use.
 * Fragile and ToS-sensitive: only runs when BACKUP_HTML_FETCH=1 and primary APIs returned few rows.
 */

import type { CompetitorLibraryMapping } from "../types";
import type { Ad } from "../types";

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; DnadsBackupFetch/1.0; +https://example.com/bot)",
      Accept: "text/html",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) return "";
  const html = await res.text();
  return stripTags(html).slice(0, 4000);
}

function metaSearchUrl(q: string): string {
  return `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(q)}`;
}

function tiktokSearchUrl(q: string): string {
  return `https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?keyword=${encodeURIComponent(q)}`;
}

export async function fetchBackupHtmlSnippets(
  mappings: CompetitorLibraryMapping[],
  maxCompetitors: number,
): Promise<{ ads: Ad[]; notes: string[] }> {
  if (process.env.BACKUP_HTML_FETCH !== "1") {
    return { ads: [], notes: [] };
  }
  const notes: string[] = [
    "Backup: HTML fetch mode (BACKUP_HTML_FETCH=1) — snippets only, not full ad API objects.",
  ];
  const ads: Ad[] = [];
  const slice = mappings.slice(0, maxCompetitors);

  for (const m of slice) {
    const name = m.competitor_name;
    const mq = m.meta?.search_terms?.trim();
    if (mq) {
      const text = await fetchText(metaSearchUrl(mq.slice(0, 80)));
      if (text.length > 80) {
        ads.push({
          competitor: name,
          hook_type: "curiosity",
          angle: "html_backup_snippet",
          emotional_trigger: "inferred",
          format: "unknown",
          cta: "View Ad Library",
          text: `Meta library page text (truncated): ${text.slice(0, 1500)}`,
          source: "meta",
        });
      }
    }
    const tq = m.tiktok?.search_term?.trim();
    if (tq) {
      const text = await fetchText(tiktokSearchUrl(tq.slice(0, 40)));
      if (text.length > 80) {
        ads.push({
          competitor: name,
          hook_type: "curiosity",
          angle: "html_backup_snippet",
          emotional_trigger: "inferred",
          format: "unknown",
          cta: "View TikTok ads",
          text: `TikTok page text (truncated): ${text.slice(0, 1500)}`,
          source: "tiktok",
        });
      }
    }
  }

  return { ads, notes };
}
