/**
 * Final pack assembly: LLM produces pattern-grounded ads and assets.
 * This module only defines prompts / parsing helpers; execution lives in claude.ts + pipeline.
 */

import type { GeneratedAd, GrowthPack } from "./types";

export function parseGeneratedAds(raw: unknown): GeneratedAd[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Record<string, unknown> => x != null && typeof x === "object")
    .map((row) => ({
      hook: String(row.hook ?? "").trim(),
      primary_text: String(row.primary_text ?? row.primaryText ?? "").trim(),
      cta: String(row.cta ?? "").trim(),
      angle_label: String(row.angle_label ?? row.angleLabel ?? "").trim(),
      emotional_trigger_label: String(
        row.emotional_trigger_label ?? row.emotionalTriggerLabel ?? "",
      ).trim(),
      cluster: String(row.cluster ?? "General").trim() || "General",
    }))
    .filter((a) => a.hook && a.primary_text);
}

export function validateGrowthPackShape(partial: Partial<GrowthPack>): string[] {
  const errs: string[] = [];
  if (!partial.business?.url) errs.push("missing business.url");
  if (!partial.competitor_ads?.length) errs.push("missing competitor_ads");
  if (!partial.generated_ads?.length) errs.push("missing generated_ads");
  else if (partial.generated_ads.length < 5) {
    errs.push("generated_ads too few for a usable pack");
  }
  return errs;
}
