# CS Community — Content Automation

Daily content engine for the CS Community site. A scheduled **GitHub Action** runs this
Node project, which **collects** CS content from trusted sources, **enriches** it with
**Google Gemini**, and **publishes** it to the site via a secured **Laravel API**. No manual
posting, no paid services.

```
GitHub Actions (cron, 09:00 SAST)
   → collectors (Hacker News, Dev.to[tags], Reddit, GitHub Trending, arXiv)
   → de-dupe (intra-run)
   → rank by editorial focus (AI engineering, WhatsApp Cloud APIs, web frameworks, Python, Laravel, Meta/Google…)
   → Gemini (summary, category, difficulty, tags — JSON schema enforced)
   → POST {LARAVEL_API_URL}/api/automation/posts   (Bearer token)
   → Laravel validates, de-dupes (unique source_url + content_hash), stores in Neon Postgres
   → visible in Admin ▸ Content Feed
```

## Editorial focus

The community cares about **AI engineering, WhatsApp Cloud APIs, web-dev frameworks, Python,
Laravel**, and notable news from **Meta/Google/OpenAI/etc.** Collectors pull broadly, then a
relevance ranker (`src/services/relevance.js`) scores each item against `FOCUS_KEYWORDS`,
publishing the most on-topic first. Tune via env: `FOCUS_KEYWORDS`, `REDDIT_SUBREDDITS`,
`DEVTO_TAGS`, `MIN_RELEVANCE` (defaults live in `src/config.js`).

> The pipeline never touches the database directly — Laravel owns all validation, de-dup, and
> storage. (The DB is Neon Postgres; the app is hosted on Render. No Supabase/GCloud involved.)

## Layout

```
src/
  config.js              env + category whitelist (mirror of app/Enums/FeedCategory.php)
  index.js               entrypoint
  pipeline.js            collect → dedupe → cap → enrich → publish
  collectors/            one module per source, shared Collector interface (index.js = registry)
  ai/                    gemini.js (REST + JSON schema), prompts.js
  services/              laravel.js (publish), duplicateChecker.js, logger.js
  utils/                 http (retry/backoff), hash, text, readingTime
tests/                   vitest unit tests (mocked fetch — no network)
```

## Run locally

```bash
cd automation
npm install
cp .env.example .env          # fill in GEMINI_API_KEY, LARAVEL_API_URL, LARAVEL_API_TOKEN
npm run dry-run               # collect + enrich, log payloads, publish NOTHING
npm start                     # full run (publishes); or: node --env-file=.env src/index.js
npm test                      # vitest
```

`DRY_RUN=1` (or `--dry-run`) logs the assembled payloads without POSTing — safe for testing.

## Adding a source (open/closed)

1. Create `src/collectors/mysource.js` exporting `{ name, category, async collect() }` that
   returns `RawItem[]` (`{title, description, url, source, image, author, publishedAt}`).
2. Add it to the registry array in `src/collectors/index.js`.

That's it — the pipeline, Gemini, dedupe, and publishing are source-agnostic. No backend change
is needed unless you introduce a brand-new category (then add a case to `FeedCategory.php` and
the `CATEGORIES` list in `src/config.js`).

## Configuration / Secrets

| Var | Required | Notes |
|-----|----------|-------|
| `GEMINI_API_KEY` | yes | Google AI Studio free tier |
| `LARAVEL_API_URL` | yes (unless dry-run) | base URL, no trailing slash |
| `LARAVEL_API_TOKEN` | yes (unless dry-run) | = Laravel `AUTOMATION_API_TOKEN` |
| `GITHUB_TOKEN` | no | raises GitHub Search API rate limit |
| `MAX_ITEMS` | no | per-run cap (default 15) |
| `DRY_RUN` | no | `1` = log only |

Scheduling and secrets are wired in [`.github/workflows/automation.yml`](../.github/workflows/automation.yml).
