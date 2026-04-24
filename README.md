# URL → Growth Intelligence & Ad Generator

MVP web app: enter a URL, get a **Growth Pack** built from **competitor pattern intelligence** (simulated ad samples when live scraping is unavailable), structured analysis, and pattern-driven generation — not a generic ad writer.

## Setup

```bash
cp .env.example .env.local
# Set ANTHROPIC_API_KEY in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

- **POST** `/generate` — body: `{ "url": "https://example.com" }` — returns the full Growth Pack JSON.

## Architecture

| Module | Path |
|--------|------|
| Competitor analysis | `src/lib/competitorAnalysis.ts` |
| Ad decomposition / synthetic samples | `src/lib/adDecomposition.ts` |
| Pattern analysis | `src/lib/patternAnalysis.ts` |
| Generation engine | `src/lib/generationEngine.ts` |
| Orchestration | `src/lib/growthPack.ts` |

Optional model override: `ANTHROPIC_MODEL` in `.env.local`.

## Compliance note

Simulated competitor ads are for R&D pattern extraction only. Respect Meta, TikTok, Google, and site terms when integrating real ad libraries later.
