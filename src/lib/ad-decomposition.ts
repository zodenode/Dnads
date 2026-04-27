/**
 * Normalise and validate ad objects from model output.
 */

import type { Ad } from "./types";

const HOOK_TYPES = [
  "pain",
  "curiosity",
  "urgency",
  "status",
  "comparison",
] as const;

function coerceString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : fallback;
}

export function normalizeAd(raw: Record<string, unknown>, fallbackCompetitor: string): Ad {
  const competitor = coerceString(raw.competitor, fallbackCompetitor);
  let hook_type = coerceString(raw.hook_type, "curiosity").toLowerCase();
  if (!HOOK_TYPES.includes(hook_type as (typeof HOOK_TYPES)[number])) {
    hook_type = "curiosity";
  }

  const source =
    raw.source === "meta" || raw.source === "tiktok" || raw.source === "google" || raw.source === "synthetic"
      ? raw.source
      : undefined;
  const external_id = raw.external_id != null ? coerceString(raw.external_id) : undefined;

  return {
    competitor,
    hook_type,
    angle: coerceString(raw.angle, "value"),
    emotional_trigger: coerceString(raw.emotional_trigger, "trust"),
    format: coerceString(raw.format, "static"),
    cta: coerceString(raw.cta, "Learn more"),
    text: coerceString(raw.text, ""),
    audience_target: raw.audience_target != null ? coerceString(raw.audience_target) : undefined,
    offer_type: raw.offer_type != null ? coerceString(raw.offer_type) : undefined,
    ...(source ? { source } : {}),
    ...(external_id ? { external_id } : {}),
  };
}

export function parseAdsFromJson(
  items: unknown[],
  defaultCompetitor: string,
): Ad[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((x): x is Record<string, unknown> => x != null && typeof x === "object")
    .map((row) => normalizeAd(row, defaultCompetitor));
}
