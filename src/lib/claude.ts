import Anthropic from "@anthropic-ai/sdk";
import { nimCompleteSystemUser } from "./providers/nvidia-nim";

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

function parseJsonFromLlmText<T>(text: string): T {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Model did not return parseable JSON");
  }
  return JSON.parse(jsonMatch[0]) as T;
}

/**
 * JSON structured LLM calls for the growth pipeline.
 * Prefer Anthropic when `ANTHROPIC_API_KEY` is set; otherwise use NVIDIA NIM
 * (`NVIDIA_API_KEY` + `NVIDIA_CHAT_MODEL` on integrate.api.nvidia.com).
 */
export async function callClaudeJson<T>(system: string, user: string): Promise<T> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (anthropicKey) {
    const client = new Anthropic({ apiKey: anthropicKey });
    const res = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8192,
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = res.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("\n");
    return parseJsonFromLlmText<T>(text);
  }

  const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();
  if (nvidiaKey) {
    const text = await nimCompleteSystemUser(system, user, {
      max_tokens: 8192,
      temperature: 0.3,
    });
    return parseJsonFromLlmText<T>(text);
  }

  throw new Error(
    "No LLM configured: set ANTHROPIC_API_KEY (Claude) or NVIDIA_API_KEY + NVIDIA_CHAT_MODEL (NIM on build.nvidia.com).",
  );
}
