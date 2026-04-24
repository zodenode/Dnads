# URL → Growth Intelligence & Ad Generator

Next.js app: one URL in, a structured **Growth Pack** out — inferred competitors, **per-platform library pulls** when keys are set (Meta Graph `ads_archive`, TikTok Research ad query, Google Transparency via SerpApi), local **pattern analysis**, Claude-driven **competitor→query mapping**, then generation. Synthetic ads fill in only when library coverage is thin.

## Setup

```bash
cp .env.example .env
# Required: ANTHROPIC_API_KEY (for POST /api/generate)
# Required: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY (Clerk Dashboard)
# Optional library keys: META_ACCESS_TOKEN, TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET, SERPAPI_API_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Monitor UI: [http://localhost:3000/monitor](http://localhost:3000/monitor).

## Authentication & access (Clerk)

- **Clerk** handles sign-in (modal from the header, or `/sign-in` / `/sign-up`). Middleware refreshes sessions on navigations; **generation is not blocked** — users complete a taste experience first.
- **Access tiers** read from Clerk **User → Public metadata** (e.g. `{ "plan": "free" }`, `{ "plan": "pro" }`, `{ "plan": "studio" }`). Aliases `tier` / `subscription` are also accepted.
- **Free / signed-out**: limited market pattern rows, **no** competitor ad breakdowns (teaser only), **three** sample ads with truncated body, no landing/UGC/campaign depth, no export.
- **Pro** (`plan: "pro"`): full competitive intelligence, full market resolution, full creative system, JSON export (activation framing in UI).
- **Studio** (`plan: "studio"`): same as Pro plus a visible **continuous intelligence** panel on the market tab (placeholders for multi-URL / alerts / batch — wire to your product).

Use `/settings/access` (signed-in) to see the resolved `publicMetadata.plan` and how to assign tiers in development.

## API

- **`POST /api/generate`** (also `POST /generate`) — body `{ "url", "meta_countries"?: string[], "max_competitors"?: number }` → full `GrowthPack` JSON including `ad_provenance` (counts per source + scrape notes).
- **`GET/POST /api/jobs`** — list / create monitor jobs (JSON file under `DATA_DIR` or `./data/monitor-jobs.json`).
- **`GET/DELETE/POST /api/jobs/:id`** — fetch job, delete, or **run now** (re-runs full pipeline, stores `last_snapshot`).
- **`GET /api/cron/jobs`** — runs jobs whose `next_run_at` is due. Set **`CRON_SECRET`** and call with `?secret=` or `Authorization: Bearer`.

## Library integrations

| Platform | Implementation | Env |
|----------|----------------|-----|
| Meta | `GET graph.facebook.com/.../ads_archive` (keyword or `search_page_ids`) | `META_ACCESS_TOKEN` |
| TikTok | Client token + `POST /v2/research/adlib/ad/query/` | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` |
| Google | SerpApi `engine=google_ads_transparency_center` | `SERPAPI_API_KEY` |

Competitor-specific search terms / domains are produced by **`src/lib/competitor-library-intel.ts`** (Claude) from the business profile.

## Modules

| Path | Role |
|------|------|
| `src/lib/access-tier.ts` | Tier resolution + free preview slicing |
| `src/lib/competitor-analysis.ts` | Fetch URL HTML signals |
| `src/lib/scrapers/meta-ads.ts` | Meta Ad Library fetch |
| `src/lib/scrapers/tiktok-ads.ts` | TikTok OAuth + ad query |
| `src/lib/scrapers/google-transparency.ts` | SerpApi transparency JSON |
| `src/lib/scrape-aggregator.ts` | Merge + dedupe per competitor mapping |
| `src/lib/scraped-ad-converters.ts` | Raw rows → internal `Ad` |
| `src/lib/competitor-library-intel.ts` | LLM mapping per engine |
| `src/lib/job-store.ts` | Persistent monitor jobs |
| `src/lib/monitor-runner.ts` | Job execution + cron due-runner |
| `src/lib/pipeline.ts` | Full orchestration |

## Notes

- PDF export is not included; Pro tier enables JSON export as the **campaign export system**.
- Google path uses **SerpApi** (third-party JSON), not an unofficial HTML scrape of Google’s site.
