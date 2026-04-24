# URL → Growth Intelligence & Ad Generator

MVP Next.js app: one URL in, a structured **Growth Pack** out — business read, inferred competitors, **simulated** competitor ads (R&D / no ad-library scraping), local **pattern analysis**, then Claude-driven generation grounded in those patterns.

## Setup

```bash
cp .env.example .env
# Required: ANTHROPIC_API_KEY (for POST /api/generate)
# Required: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY (Clerk Dashboard)

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Authentication & access (Clerk)

- **Clerk** handles sign-in (modal from the header, or `/sign-in` / `/sign-up`). Middleware refreshes sessions on navigations; **generation is not blocked** — users complete a taste experience first.
- **Access tiers** read from Clerk **User → Public metadata** (e.g. `{ "plan": "free" }`, `{ "plan": "pro" }`, `{ "plan": "studio" }`). Aliases `tier` / `subscription` are also accepted.
- **Free / signed-out**: limited market pattern rows, **no** competitor ad breakdowns (teaser only), **three** sample ads with truncated body, no landing/UGC/campaign depth, no export.
- **Pro** (`plan: "pro"`): full competitive intelligence, full market resolution, full creative system, JSON export (activation framing in UI).
- **Studio** (`plan: "studio"`): same as Pro plus a visible **continuous intelligence** panel on the market tab (placeholders for multi-URL / alerts / batch — wire to your product).

Use `/settings/access` (signed-in) to see the resolved `publicMetadata.plan` and how to assign tiers in development.

## API

- `POST /api/generate` with JSON `{ "url": "https://…" }` returns the full `GrowthPack` JSON.

## Modules

| Path | Role |
|------|------|
| `src/lib/access-tier.ts` | Tier resolution + free preview slicing (depth, not credits) |
| `src/lib/competitor-analysis.ts` | Fetch URL HTML signals (title, description, text snippet) |
| `src/lib/ad-decomposition.ts` | Normalize ad objects from model output |
| `src/lib/pattern-analysis.ts` | Hook/angle distributions, gaps, winning patterns |
| `src/lib/generation-engine.ts` | Parse generated ads, pack validation |
| `src/lib/pipeline.ts` | Two-phase Claude orchestration + pattern pass-through |

## Notes

- Real Meta / TikTok / Google Ads scraping is **not** implemented; the model produces plausible **fictional** competitor ads for pattern extraction only.
- PDF export is not included; Pro tier enables JSON export as the **campaign export system** (handoff to downstream tools).
