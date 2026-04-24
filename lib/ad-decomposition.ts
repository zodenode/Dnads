import type { AdIntel } from "@/src/types/growth-pack";

/** Normalizes hook labels for aggregation */
export function normalizeHook(h: string): string {
  const v = (h || "").toLowerCase().trim();
  if (["pain", "curiosity", "urgency", "status", "comparison"].includes(v)) return v;
  return v || "other";
}

export function listAdsByCompetitor(ads: AdIntel[]): Record<string, AdIntel[]> {
  const m: Record<string, AdIntel[]> = {};
  for (const a of ads) {
    const k = a.competitor || "Unknown";
    if (!m[k]) m[k] = [];
    m[k].push(a);
  }
  return m;
}
