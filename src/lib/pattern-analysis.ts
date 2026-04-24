/**
 * Aggregate competitor ads into market pattern distributions and gap hypotheses.
 */

import type { Ad, MarketInsights } from "./types";

function countDistribution<T extends string>(
  items: T[],
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const x of items) {
    const k = x || "unknown";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function toPercents(rows: { label: string; count: number }[], total: number) {
  if (total === 0) return [];
  return rows.map((r) => ({
    label: r.label,
    percent: Math.round((r.count / total) * 1000) / 10,
  }));
}

const ALL_HOOKS = ["pain", "curiosity", "urgency", "status", "comparison"] as const;

export function analyzePatterns(ads: Ad[]): MarketInsights {
  const n = ads.length;
  const hooks = toPercents(
    countDistribution(ads.map((a) => a.hook_type as string)),
    n,
  );
  const angles = toPercents(
    countDistribution(ads.map((a) => a.angle)),
    n,
  );

  const presentHooks = new Set(ads.map((a) => a.hook_type));
  const saturation_gaps: string[] = [];
  for (const h of ALL_HOOKS) {
    if (!presentHooks.has(h)) {
      saturation_gaps.push(
        `No sampled ${h} hooks in this set — test ${h}-led creative if it fits compliance and brand.`,
      );
    }
  }
  const rareAngles = angles.filter((a) => a.percent > 0 && a.percent <= 15);
  for (const a of rareAngles.slice(0, 3)) {
    saturation_gaps.push(
      `Angle "${a.label}" is underrepresented (${a.percent}%) — potential whitespace if validated.`,
    );
  }

  const topHook = hooks[0]?.label;
  const topAngle = angles[0]?.label;
  const winning_patterns: string[] = [];
  if (topHook) {
    winning_patterns.push(`Dominant hook type: ${topHook} (${hooks[0]?.percent ?? 0}% of sampled ads).`);
  }
  if (topAngle) {
    winning_patterns.push(`Most common angle: ${topAngle} — category may be self-reinforcing around this narrative.`);
  }
  const formats = countDistribution(ads.map((a) => a.format));
  const topFormat = formats[0];
  if (topFormat) {
    winning_patterns.push(
      `Format skew: ${topFormat.label} appears most often — consider format diversification (UGC vs static) when testing.`,
    );
  }

  return {
    top_hooks: hooks,
    top_angles: angles,
    saturation_gaps,
    winning_patterns,
  };
}
