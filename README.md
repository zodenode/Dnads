# URL → Growth Intelligence & Ad Generator

Next.js app: one URL in, a structured **Growth Pack** out — inferred competitors, **per-platform library pulls** (Meta Graph `ads_archive`, TikTok Research ad query, Google Transparency via SerpApi when keys exist), local **pattern analysis**, Claude-driven **competitor→query mapping**, then generation. Synthetic ads fill in only when library coverage is thin.

## Setup

```bash
cp .env.example .env
# ANTHROPIC_API_KEY (required)
# Optional library keys: META_ACCESS_TOKEN, TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET, SERPAPI_API_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Monitor UI: [http://localhost:3000/monitor](http://localhost:3000/monitor).

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

- PDF export is not included; JSON export remains behind the billing placeholder on the results page.
- Google path uses **SerpApi** (third-party JSON), not an unofficial HTML scrape of Google’s site.
