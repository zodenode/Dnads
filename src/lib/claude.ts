import Anthropic from "@anthropic-ai/sdk";

/** Override with ANTHROPIC_MODEL in env when newer IDs roll out. */
const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";

export async function callClaudeJson<T>(system: string, user: string): Promise<T> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const client = new Anthropic({ apiKey: key });
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 16384,
    system,
    messages: [{ role: "user", content: user }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  let raw = textBlock.text.trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  return JSON.parse(raw) as T;
}
