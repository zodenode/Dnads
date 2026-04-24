import { callClaudeJson } from "./claude";
import type { Business } from "./types";

const SYSTEM = `You are a market research analyst. Given a business URL (and optional short description from the user), infer the product category and closest competitors.

Rules:
- Output ONLY valid JSON matching the schema exactly. No markdown.
- Identify 5-10 closest competitors by category + keyword inference. Use real plausible competitor names/brands for the space (simulated if you cannot verify live data).
- This is R&D pattern intelligence; competitor names are for structural analysis only.

JSON schema:
{
  "url": string,
  "category": string,
  "value_proposition": string[],
  "target_audience": string[],
  "competitors": string[],
  "product_service": string,
  "pricing_tier_inference": string[]
}`;

export async function analyzeBusinessAndCompetitors(
  url: string,
  notes?: string
): Promise<Business> {
  const user = `URL: ${url}
${notes ? `Notes: ${notes}` : ""}

Return the JSON object.`;

  return callClaudeJson<Business>(SYSTEM, user);
}
