# Growth Intelligence — User Guide

This document is the **in-app guide** ([/guide](/guide)) and the canonical place for “how do I use this?” outside the developer README.

---

## Is the latest code on `main`?

Yes. Library integrations (Meta Ad Library, TikTok Research API, Google transparency via SerpApi), the pipeline, monitor jobs, and Clerk access tiers are merged into **`main`**. Clone or pull `main` to get everything.

---

## What you get

1. **Paste a website URL** → the app infers the business and competitors.
2. **Per-competitor library mapping** (Claude) → sensible search terms / domains for Meta, TikTok, and Google (when keys exist).
3. **Fetch public ad-library rows** → merged and deduped into one dataset.
4. **Pattern analysis** → hook/angle mix, gaps, winning patterns.
5. **Generated pack** → new ads, landing lines, UGC ideas, campaign names.

If few rows come back from APIs, **synthetic structured ads** pad the set so patterns stay meaningful.

---

## Quick start (local)

1. **Clone** the repo and checkout **`main`**.
2. **Install:** `npm install`
3. **Environment:** copy `.env.example` → `.env` and set at least:
   - **`ANTHROPIC_API_KEY`** — required for generation and competitor mapping.
   - **Clerk** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (see Clerk Dashboard). Without them the app may not run as shipped; use your project’s Clerk instance.
4. **Run:** `npm run dev` → open [http://localhost:3000](http://localhost:3000).

Optional (stronger “real market” data):

| Variable | Purpose |
|----------|---------|
| `META_ACCESS_TOKEN` | Meta Graph `ads_archive` |
| `TIKTOK_CLIENT_KEY` / `TIKTOK_CLIENT_SECRET` | TikTok OAuth + ad library query |
| `SERPAPI_API_KEY` | Google Ads Transparency (SerpApi JSON engine) |

---

## Using the web UI

### Home (`/`)

- Enter **https://…** (or your domain); optional **Meta countries** (comma-separated ISO codes, e.g. `US,GB`) and **max competitors** to query per library pass.
- Click **Generate Growth Pack**. Wait for the loading steps; you are sent to **Results** with the pack stored in the session.

### Results (`/results`)

- Tabs: **Market context**, **Competitive intelligence**, **Pattern resolution**, **Creative system**, **Activation & export**.
- **Ad library mix** (on Market context) shows counts: Meta / TikTok / Google / synthetic and any scrape notes.
- **Clerk tiers** (public metadata `plan`): Free preview is shallow; **Pro** / **Studio** unlock full competitor rows, full patterns, full creative grid, and JSON export. Use **Settings → Access** (`/settings/access`) when signed in to see your tier.

### Monitor jobs (`/monitor`)

- **Add job:** URL to watch, **interval** (minutes), **max competitors** per run, **Meta countries**.
- **Run now** executes one full pipeline and saves a **snapshot** on the job.
- **Cron:** schedule HTTP **`GET /api/cron/jobs`** (e.g. every 10 minutes). Set **`CRON_SECRET`** in `.env` and call with `?secret=YOUR_SECRET` or `Authorization: Bearer YOUR_SECRET`.

Jobs are stored under **`data/monitor-jobs.json`** (or **`DATA_DIR`** if set).

### Guide (`/guide`)

- Renders **this file** (`USER_GUIDE.md`) in the app so users always have an in-product manual.

---

## API (for scripts or integrations)

| Method | Path | Body / query | Notes |
|--------|------|--------------|--------|
| `POST` | `/api/generate` | `{ "url", "meta_countries"?, "max_competitors"? }` | Full `GrowthPack` JSON |
| `GET` / `POST` | `/api/jobs` | POST: same shape as monitor form | List or create jobs |
| `GET` / `DELETE` / `POST` | `/api/jobs/:id` | — | Get, delete, or **run now** |
| `GET` | `/api/cron/jobs` | `?secret=` if `CRON_SECRET` set | Run due jobs |

---

## Troubleshooting

- **“ANTHROPIC_API_KEY is not configured”** — set the key and restart the dev server.
- **Meta / TikTok / Google counts are zero** — keys missing or invalid; check `ad_provenance.notes` on the pack or API error messages.
- **TikTok errors** — Research API needs an approved TikTok developer project; date range must be within API rules.
- **Jobs not running on a schedule** — you must hit **`/api/cron/jobs`** from an external scheduler (Vercel Cron, GitHub Actions, etc.); the app does not poll by itself in the background.

---

## Where to change this guide

Edit **`USER_GUIDE.md`** at the repository root. The **`/guide`** page reads that file on each request (local dev) or at deploy time depending on your hosting; keep content user-facing and avoid secrets in this file.
