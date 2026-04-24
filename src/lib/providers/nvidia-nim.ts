/**
 * NVIDIA NIM — hosted OpenAI-compatible APIs (API catalog / build.nvidia.com).
 * Keys typically start with `nvapi-`. Docs: https://docs.api.nvidia.com/nim/
 * Chat: POST https://integrate.api.nvidia.com/v1/chat/completions
 * Images: POST https://integrate.api.nvidia.com/v1/images/generations (when enabled for your key)
 */

import type { ChatMessage, ImageGenResult, ImageProvider, LlmTextProvider } from "./types";

const DEFAULT_BASE = "https://integrate.api.nvidia.com/v1";

function baseUrl(): string {
  return process.env.NVIDIA_API_BASE_URL?.replace(/\/$/, "") || DEFAULT_BASE;
}

function apiKey(): string | null {
  const k = process.env.NVIDIA_API_KEY?.trim();
  return k || null;
}

export function isNvidiaNimConfigured(): boolean {
  return Boolean(apiKey());
}

type ChatCompletionResponse = {
  choices?: { message?: { content?: string | null } }[];
  error?: { message?: string };
};

type ImageGenerationResponse = {
  data?: { url?: string; b64_json?: string }[];
  error?: { message?: string };
};

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const key = apiKey();
  if (!key) {
    throw new Error("NVIDIA_API_KEY is not set");
  }
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    const msg = (json as { error?: { message?: string } }).error?.message || res.statusText;
    throw new Error(`NVIDIA NIM ${path}: ${msg}`);
  }
  return json;
}

function messagesToOpenAi(messages: ChatMessage[]) {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

/** Text / JSON-capable chat via NIM (pick model on build.nvidia.com, set NVIDIA_CHAT_MODEL). */
export function createNvidiaNimTextProvider(): LlmTextProvider {
  const model =
    process.env.NVIDIA_CHAT_MODEL?.trim() || "meta/llama-3.1-8b-instruct";
  return {
    id: `nvidia-nim-chat:${model}`,
    async completeChat({ messages, temperature = 0.3, max_tokens = 4096 }) {
      const json = await postJson<ChatCompletionResponse>("/chat/completions", {
        model,
        messages: messagesToOpenAi(messages),
        temperature,
        max_tokens,
        stream: false,
      });
      const text = json.choices?.[0]?.message?.content;
      if (typeof text !== "string" || !text.trim()) {
        throw new Error("NVIDIA NIM: empty completion");
      }
      return text.trim();
    },
  };
}

/** Image generation when your catalog entitlement includes a visual model (set NVIDIA_IMAGE_MODEL). */
export function createNvidiaNimImageProvider(): ImageProvider {
  const model = process.env.NVIDIA_IMAGE_MODEL?.trim();
  if (!model) {
    throw new Error("NVIDIA_IMAGE_MODEL is not set — pick a model id from build.nvidia.com (e.g. FLUX / SD)");
  }
  return {
    id: `nvidia-nim-image:${model}`,
    async generate({ prompt, n = 1, size = "1024x1024" }) {
      const json = await postJson<ImageGenerationResponse>("/images/generations", {
        model,
        prompt,
        n,
        size,
        response_format: "url",
      });
      const rows = json.data ?? [];
      return rows.map((r) => ({ url: r.url, b64_json: r.b64_json }));
    },
  };
}
