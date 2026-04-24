import type { AdIntel, MarketInsights, MarketInsightRow } from "@/src/types/growth-pack";
import { normalizeHook } from "./ad-decomposition";
import { claudeJson } from "./claude-client";

function distribution(
  items: string[],
  topN = 8
): MarketInsightRow[] {
  const counts = new Map<string, number>();
  for (const x of items) {
    const k = (x || "").trim() || "unknown";
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const total = items.length || 1;
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([label, count]) => ({
      label,
      count,
      pct: Math.round((count / total) * 1000) / 10,
    }));
}

export function aggregateFromAds(ads: AdIntel[]): Pick<MarketInsights, "top_hooks" | "top_angles"> {
  const hooks = ads.map((a) => normalizeHook(String(a.hook_type)));
  const angles = ads.map((a) => String(a.angle || "").trim() || "unspecified");
  return {
    top_hooks: distribution(hooks),
    top_angles: distribution(angles),
  };
}

type GapsPayload = {
  saturation_gaps: MarketInsightRow[];
  winning_patterns: MarketInsightRow[];
};

const SYSTEM_GAPS = `You interpret aggregated ad intelligence for a category. Return ONLY JSON:
{
  "saturation_gaps": [{ "label": string, "note": string, "pct"?: number }],
  "winning_patterns": [{ "label": string, "note": string }]
}
saturation_gaps = underused but high-potential angles or hooks vs crowded areas.
winning_patterns = concise labels for what is working in this simulated set.
Use 4-7 items each. Be specific to the inputs, not generic marketing advice.`;

export async function enrichMarketGaps(
  category: string,
  summary: string,
  topHooks: MarketInsightRow[],
  topAngles: MarketInsightRow[],
  sampleAdBullets: string[]
): Promise<GapsPayload> {
  const user = `Category: ${category}
Business summary: ${summary}

Aggregated hooks: ${JSON.stringify(topHooks)}
Aggregated angles: ${JSON.stringify(topAngles)}
Sample ad angles/hooks (truncated): ${sampleAdBullets.slice(0, 40).join(" | ")}`;

  return claudeJson<GapsPayload>(SYSTEM_GAPS, user);
}

export async function buildMarketInsights(ads: AdIntel[], category: string, summary: string): Promise<MarketInsights> {
  const { top_hooks, top_angles } = aggregateFromAds(ads);
  const sampleBullets = ads.map(
    (a) => `${a.competitor}: ${a.hook_type} / ${a.angle} / ${a.emotional_trigger}`
  );
  const { saturation_gaps, winning_patterns } = await enrichMarketGaps(
    category,
    summary,
    top_hooks,
    top_angles,
    sampleBullets
  );
  return {
    top_hooks,
    top_angles,
    saturation_gaps,
    winning_patterns,
  };
}
