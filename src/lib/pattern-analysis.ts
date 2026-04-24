import { callClaudeJson } from "./claude";
import type { Ad, MarketInsights } from "./types";

const SYSTEM = `You are a performance marketing strategist. Aggregate competitor ad objects into market pattern intelligence.

Behave like: "What is working in this market?" — derive distributions and gaps from the provided ads only (plus reasonable inference from counts).

hook_type must be bucketed into top_hooks with approximate percentages (sum ~100).
Include top_angles, top_emotional_triggers (same style as top_hooks).
saturation_gaps: angles/hooks that feel crowded.
winning_patterns: 3-6 bullet-style strings of observed winning combos.
underused_opportunities: gaps / white space (high-potential underused hooks or angles).
positioning_saturation_map: 4-8 short strings mapping "positioning x saturation".

Output ONLY valid JSON matching:
{
  "top_hooks": { "label": string, "percent": number }[],
  "top_angles": { "label": string, "percent": number }[],
  "top_emotional_triggers": { "label": string, "percent": number }[],
  "saturation_gaps": string[],
  "winning_patterns": string[],
  "underused_opportunities": string[],
  "positioning_saturation_map": string[]
}`;

export async function analyzePatterns(ads: Ad[]): Promise<MarketInsights> {
  const user = JSON.stringify({ ads }, null, 2);
  return callClaudeJson<MarketInsights>(SYSTEM, user);
}
