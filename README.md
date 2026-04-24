# URL → Growth Intelligence & Ad Generator

MVP web app: submit a URL, receive a structured **Growth Pack** (business understanding, simulated competitor ad intelligence, market pattern analysis, pattern-driven ad generation, campaign pack). Uses the Claude API; competitor ads are **simulated** for R&D when live ad libraries are not wired.

## Setup

```bash
cp .env.example .env.local
# Add ANTHROPIC_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

`POST /generate` with JSON body `{ "url": "https://example.com" }` returns the full pack as JSON.

## Modules

- `lib/url-fetch.ts` — fetch URL HTML, text excerpt for context
- `lib/competitor-analysis.ts` — business + competitors + structured ad samples (Claude)
- `lib/ad-decomposition.ts` — hook normalization / grouping helpers
- `lib/pattern-analysis.ts` — hook/angle distributions + gap enrichment (Claude)
- `lib/generation-engine.ts` — new ads + campaign pack from patterns (Claude)
- `lib/pipeline.ts` — orchestration

## Payment placeholder

The Download tab uses a **Stripe placeholder** unlock for the session; replace with Checkout + webhook to issue entitlements before production.
