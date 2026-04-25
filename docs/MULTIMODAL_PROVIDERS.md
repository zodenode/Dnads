# Multimodal providers (NVIDIA + pluggable stack)

The app’s **growth pipeline** uses **`callClaudeJson` in `src/lib/claude.ts`**: if **`ANTHROPIC_API_KEY`** is set, requests go to **Claude**; otherwise if **`NVIDIA_API_KEY`** is set (and **`NVIDIA_CHAT_MODEL`** on the catalog), the same JSON steps run on **NVIDIA NIM** chat completions. This document also describes the **separate provider layer** under `src/lib/providers/` for images, ASR, and future modalities.

> **Free ≠ unlimited.** NVIDIA’s hosted NIM endpoints on [build.nvidia.com](https://build.nvidia.com/) are intended for **developer prototyping** (rate limits / fair use). Production typically requires **NVIDIA AI Enterprise** or your own GPUs. Always read the current [NIM FAQ](https://forums.developer.nvidia.com/t/nvidia-nim-faq/300317) and catalog terms.

---

## NVIDIA API catalog (hosted)

| Capability | Typical API | Notes |
|------------|-------------|--------|
| **Structured reasoning / JSON** | `POST …/v1/chat/completions` | OpenAI-compatible; pick a model id from the catalog (e.g. Llama, Nemotron, Gemma). Use system prompts + “return JSON only” in the app layer. |
| **Marketing copy / longform** | Same endpoint | Different `NVIDIA_CHAT_MODEL` or temperature. |
| **Image concepts / storyboards** | `POST …/v1/images/generations` | OpenAI-style image API on NIM when your account includes a visual model (e.g. FLUX / SD family — **model id is catalog-specific**). Set `NVIDIA_IMAGE_MODEL`. |
| **Short video** | *Catalog / NIM specific* | Often async jobs or separate microservices. Repo ships a **stub** until a concrete endpoint + auth flow is chosen. |
| **Text-to-speech** | NVIDIA Speech NIM | Often **gRPC / WebSocket** in docs, not the same curl shape as chat. Repo ships a **stub**; wire your chosen TTS host behind `TtsProvider`. |
| **Ingest competitor audio (ASR)** | OpenAI `POST …/v1/audio/transcriptions` | **Whisper** (and compatible hosts) use multipart `file` + `model`. This repo includes `createOpenAiCompatibleAsrProvider` — set `ASR_OPENAI_BASE_URL` + `ASR_OPENAI_API_KEY` (e.g. `https://api.openai.com` + OpenAI key), or another OpenAI-compatible transcription URL if NVIDIA exposes one for your key. |

**Base URL (chat + images on hosted integrate):** `https://integrate.api.nvidia.com/v1`  
**Auth:** `Authorization: Bearer <API_KEY>` (keys from [build.nvidia.com](https://build.nvidia.com/) — often prefixed `nvapi-`).

Official reference pattern (from NVIDIA docs):  
`curl https://integrate.api.nvidia.com/v1/chat/completions -H "Authorization: Bearer $NVIDIA_API_KEY" …`

---

## Environment variables

See root **`.env.example`** — added:

- `NVIDIA_API_KEY` — catalog key  
- `NVIDIA_API_BASE_URL` — optional override (default integrate host)  
- `NVIDIA_CHAT_MODEL` — chat model id from catalog  
- `NVIDIA_IMAGE_MODEL` — image model id when using NIM image generation  
- `ASR_OPENAI_BASE_URL` / `ASR_OPENAI_API_KEY` / `ASR_OPENAI_MODEL` — OpenAI-compatible Whisper-style transcription  

---

## Runtime status

`GET /api/providers/status` returns **which backends are configured** (no secret values).

---

## Code map

| File | Role |
|------|------|
| `src/lib/providers/types.ts` | Interfaces per modality |
| `src/lib/providers/nvidia-nim.ts` | NVIDIA NIM chat + image (OpenAI-compatible REST) |
| `src/lib/providers/openai-compatible-asr.ts` | Whisper / compatible ASR |
| `src/lib/providers/stubs.ts` | Video + TTS placeholders |
| `src/lib/providers/index.ts` | Barrel exports |

To **route Claude vs NVIDIA** for a specific step later, add a thin `llmRouter` that picks `createNvidiaNimTextProvider()` when `USE_NVIDIA_FOR_*` env flags are set, else keep existing Anthropic calls in `claude.ts`.
