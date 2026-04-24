# URL → Growth Intelligence & Ad Generator

MVP Next.js app: URL in → competitor pattern intelligence → simulated ad library → market aggregation → recombination-based campaign pack (JSON).

## Setup

```bash
cp .env.example .env.local
# set ANTHROPIC_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

- `POST /api/generate` — body: `{ "url": "https://...", "notes": "optional" }`
- `POST /generate` — same (rewrite to `/api/generate`)

## Modules

- `src/lib/competitor-analysis.ts` — business + competitors
- `src/lib/ad-decomposition.ts` — simulated competitor ads + schema
- `src/lib/pattern-analysis.ts` — market insights
- `src/lib/generation-engine.ts` — pattern-driven ads + campaign pack sections
- `src/lib/orchestrator.ts` — pipeline
