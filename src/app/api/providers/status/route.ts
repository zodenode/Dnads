import { NextResponse } from "next/server";
import { createAsrFromEnv, isNvidiaNimConfigured } from "@/lib/providers";

/**
 * Which optional multimodal backends are configured (no secrets returned).
 */
export async function GET() {
  return NextResponse.json({
    nvidia_nim: {
      configured: isNvidiaNimConfigured(),
      chat_model: process.env.NVIDIA_CHAT_MODEL || null,
      image_model: process.env.NVIDIA_IMAGE_MODEL || null,
      base_url: process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1",
    },
    asr_openai_compatible: {
      configured: Boolean(createAsrFromEnv()),
      base_url: process.env.ASR_OPENAI_BASE_URL || null,
      model: process.env.ASR_OPENAI_MODEL || null,
    },
    video: { wired: false, note: "stub — add NVIDIA or other video NIM when entitled" },
    tts: { wired: false, note: "stub — add NVIDIA Speech NIM or OpenAI TTS" },
  });
}
