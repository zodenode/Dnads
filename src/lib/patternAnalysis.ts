import type { Ad, MarketInsights } from "./types";

const HOOK_ORDER = ["pain", "curiosity", "urgency", "status", "comparison"];

function percentDistribution(counts: Map<string, number>): { label: string; percent: number }[] {
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  return [...counts.entries()]
    .map(([label, n]) => ({ label, percent: Math.round((n / total) * 1000) / 10 }))
    .sort((a, b) => b.percent - a.percent);
}

export function aggregatePatterns(ads: Ad[]): MarketInsights {
  const hooks = new Map<string, number>();
  const angles = new Map<string, number>();
  const triggers = new Map<string, number>();

  for (const ad of ads) {
    const h = String(ad.hook_type || "other").toLowerCase();
    hooks.set(h, (hooks.get(h) || 0) + 1);
    const ang = (ad.angle || "unspecified").trim() || "unspecified";
    angles.set(ang, (angles.get(ang) || 0) + 1);
    const tr = (ad.emotional_trigger || "neutral").trim() || "neutral";
    triggers.set(tr, (triggers.get(tr) || 0) + 1);
  }

  const top_hooks = percentDistribution(hooks);
  const top_angles = percentDistribution(angles).slice(0, 8);
  const top_triggers = percentDistribution(triggers).slice(0, 8);

  const usedHooks = new Set(top_hooks.map((x) => x.label.toLowerCase()));
  const saturation_gaps: string[] = [];
  for (const h of HOOK_ORDER) {
    if (!usedHooks.has(h)) {
      saturation_gaps.push(`Hook type "${h}" is underrepresented vs. category norms — test variants here.`);
    }
  }
  if (angles.size <= 2) {
    saturation_gaps.push("Angle diversity is low — opportunity to own a contrarian angle cluster.");
  }

  const winning_patterns: string[] = [];
  if (top_hooks[0]) {
    winning_patterns.push(`Dominant hook mechanic: ${top_hooks[0].label} (${top_hooks[0].percent}%) — double down with proof-led variants.`);
  }
  if (top_angles[0]) {
    winning_patterns.push(`Leading angle cluster: "${top_angles[0].label}" — recombine with secondary triggers from lower-share angles.`);
  }
  if (top_triggers[0]) {
    winning_patterns.push(`Primary emotional trigger: ${top_triggers[0].label} (${top_triggers[0].percent}%) — pair with urgency or social proof in retargeting.`);
  }
  if (top_angles.length >= 2) {
    winning_patterns.push(
      `Positioning saturation: "${top_angles[0].label}" is the most common angle; "${top_angles[1].label}" is a potential whitespace wedge for differentiated landing.`
    );
  }

  return {
    top_hooks,
    top_angles,
    saturation_gaps,
    winning_patterns,
  };
}
