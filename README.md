# URL → Growth Intelligence & Ad Generator

MVP Next.js app: one URL in, a structured **Growth Pack** out — business read, inferred competitors, **simulated** competitor ads (R&D / no ad-library scraping), local **pattern analysis**, then Claude-driven generation grounded in those patterns.

## Setup

```bash
cp .env.example .env
# Set ANTHROPIC_API_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

- `POST /api/generate` (also rewritten as `POST /generate`) with JSON `{ "url": "https://…" }` returns the full `GrowthPack` JSON.

## Modules

| Path | Role |
|------|------|
| `src/lib/competitor-analysis.ts` | Fetch URL HTML signals (title, description, text snippet) |
| `src/lib/ad-decomposition.ts` | Normalize ad objects from model output |
| `src/lib/pattern-analysis.ts` | Hook/angle distributions, gaps, winning patterns |
| `src/lib/generation-engine.ts` | Parse generated ads, pack validation |
| `src/lib/pipeline.ts` | Two-phase Claude orchestration + pattern pass-through |
| `src/lib/billing.ts` | Download unlock placeholder for future Stripe |

## Notes

- Real Meta / TikTok / Google Ads scraping is **not** implemented; the model produces plausible **fictional** competitor ads for pattern extraction only.
- PDF export is not included; JSON export is available after the payment placeholder unlock.
