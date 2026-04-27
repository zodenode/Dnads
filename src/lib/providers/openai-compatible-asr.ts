/**
 * Speech-to-text via any OpenAI-compatible `POST /v1/audio/transcriptions` endpoint.
 * Use for OpenAI Whisper API, or point `baseUrl` + `apiKey` at a compatible NVIDIA / self-hosted NIM
 * if your catalog exposes the same multipart contract.
 *
 * Reference: https://platform.openai.com/docs/api-reference/audio/createTranscription
 */

import type { AsrProvider } from "./types";

export type OpenAiCompatibleAsrConfig = {
  baseUrl: string;
  apiKey: string;
  /** e.g. whisper-1 or a NIM model id if supported */
  model?: string;
};

export function createOpenAiCompatibleAsrProvider(config: OpenAiCompatibleAsrConfig): AsrProvider {
  const base = config.baseUrl.replace(/\/$/, "");
  const model = config.model?.trim() || "whisper-1";
  return {
    id: `openai-compatible-asr:${base}`,
    async transcribe({ audio, filename = "audio.webm", language }) {
      const form = new FormData();
      const blob = audio instanceof Blob ? audio : new Blob([new Uint8Array(audio)]);
      form.append("file", blob, filename);
      form.append("model", model);
      if (language) form.append("language", language);

      const res = await fetch(`${base}/v1/audio/transcriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${config.apiKey}` },
        body: form,
      });
      const json = (await res.json()) as { text?: string; error?: { message?: string } };
      if (!res.ok) {
        throw new Error(json.error?.message || `ASR HTTP ${res.status}`);
      }
      if (typeof json.text !== "string") {
        throw new Error("ASR: missing text in response");
      }
      return json.text.trim();
    },
  };
}

/** Reads ASR_* env vars; returns null if not configured. */
export function createAsrFromEnv(): AsrProvider | null {
  const baseUrl = process.env.ASR_OPENAI_BASE_URL?.trim();
  const apiKey = process.env.ASR_OPENAI_API_KEY?.trim();
  if (!baseUrl || !apiKey) return null;
  return createOpenAiCompatibleAsrProvider({
    baseUrl,
    apiKey,
    model: process.env.ASR_OPENAI_MODEL?.trim(),
  });
}
