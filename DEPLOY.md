# Host the app (production)

The app is a **Next.js** service. Easiest paths: **Railway** (Dockerfile) or any **container** host.

## Railway (recommended)

1. **New project** → **Deploy from GitHub** → repo `Dnads` → branch `main`.
2. Railway detects **`Dockerfile`** (see `railway.toml`).
3. **Variables** (Settings → Variables):

   | Variable | Required | Notes |
   |----------|----------|--------|
   | `ANTHROPIC_API_KEY` | Yes | `/api/generate` |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | For auth UI | Or set `NEXT_PUBLIC_CLERK_DISABLED=1` to bypass |
   | `CLERK_SECRET_KEY` | With Clerk | |
   | `META_ACCESS_TOKEN` | No | Meta Ad Library |
   | `TIKTOK_CLIENT_KEY` / `TIKTOK_CLIENT_SECRET` | No | TikTok research API |
   | `SERPAPI_API_KEY` | No | Google transparency via SerpApi |
   | `CRON_SECRET` | No | Protects `GET /api/cron/jobs` |
   | `DATA_DIR` | No | Point to a **volume** mount if you use monitor jobs (e.g. `/data`) |

4. **Cron** (optional): HTTP GET `https://<your-domain>/api/cron/jobs?secret=<CRON_SECRET>` on your schedule.

5. **Volume** (optional): attach a volume, set `DATA_DIR=/data`, so `monitor-jobs.json` survives redeploys.

Railway assigns **HTTPS** and a public URL automatically.

## Docker (anywhere)

```bash
docker build -t dnads .
docker run --rm -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e NEXT_PUBLIC_CLERK_DISABLED=1 \
  dnads
```

Open `http://localhost:3000`.

## Build output

`next.config.ts` sets **`output: "standalone"`** so the Docker image runs **`node server.js`** with a minimal server bundle.
