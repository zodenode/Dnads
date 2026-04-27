# Meta & TikTok user integrations

## Overview

- **OAuth:** `/settings/integrations` → **Connect Meta** / **Connect TikTok** (requires **Clerk** + `NEXT_PUBLIC_APP_URL`).
- **Manual:** Same page — paste long-lived Meta token and/or TikTok user token; stored **encrypted** with `INTEGRATIONS_SECRET`.
- **Generate:** When signed in, `POST /api/generate` passes your **Clerk user id** into the pipeline so **your** Meta/TikTok tokens are used before server-wide `META_ACCESS_TOKEN` / client credentials.
- **Backup:** Set `BACKUP_HTML_FETCH=1` — if APIs return &lt; 4 rows, fetches public library HTML and extracts text snippets (optional, fragile).

## Meta (Facebook Login)

1. Create a [Meta app](https://developers.facebook.com/) (Consumer or Business type as appropriate).
2. Add **Facebook Login** product. Valid OAuth redirect URI:
   - `{NEXT_PUBLIC_APP_URL}/api/integrations/meta/callback`
3. Env:
   - `NEXT_PUBLIC_META_APP_ID`
   - `META_APP_SECRET`
   - `META_GRAPH_VERSION` (optional, default `v21.0`)
   - `META_OAUTH_SCOPES` (optional, default `ads_read,public_profile,email`)
4. **Permissions:** `ads_read` requires App Review for production users.

## TikTok (Authorization Code)

1. [TikTok for Developers](https://developers.tiktok.com/) — create app with **Login Kit** / OAuth redirect:
   - `{NEXT_PUBLIC_APP_URL}/api/integrations/tiktok/callback`
2. Request scopes your app is approved for (e.g. `research.adlib.basic` for ad library — **approval required**).
3. Env:
   - `TIKTOK_CLIENT_KEY` + `TIKTOK_CLIENT_SECRET` (server)
   - `NEXT_PUBLIC_TIKTOK_CLIENT_KEY` — same key exposed for authorize URL (public)
   - `TIKTOK_OAUTH_SCOPES` — optional override
4. Some TikTok flows require **PKCE**; if authorize fails, add PKCE to the start route (follow TikTok web docs).

## Secrets

- `INTEGRATIONS_SECRET` — long random string; encrypts tokens in `data/integrations/<userId>.json`.
- `NEXT_PUBLIC_APP_URL` — e.g. `https://yourapp.railway.app` (no trailing slash).

## Server-wide fallback

If the user has **not** connected Meta/TikTok, behavior is unchanged: `META_ACCESS_TOKEN` and `TIKTOK_CLIENT_KEY`/`SECRET` in env.
