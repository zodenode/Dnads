/**
 * Extract first JSON object from model text (shared by Claude + NVIDIA paths).
 */
export function parseJsonFromLlmText<T = unknown>(text: string): T {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Model did not return parseable JSON");
  }
  return JSON.parse(jsonMatch[0]) as T;
}
