# CS Community — Content Automation

Daily content engine for the CS Community site. A scheduled **GitHub Action** runs this
Node project, which **collects** CS content from trusted sources, **enriches** it with
**Google Gemini**, and **publishes** it to the site via a secured **Laravel API**. No manual
posting, no paid services.

```
GitHub Actions (cron, 09:00 SAST)
   → collectors:
       • Official dev blogs (RSS): GitHub Blog + Changelog, OpenAI, Meta for Developers,
         Google AI + Research, Hugging Face, n8n
       • OpenRouter (new models via the models API)
       • Reddit (r/AiAutomations + AI subs), GitHub Trending
   → de-dupe (intra-run)
   → rank by editorial focus (NEW tools / NEW models / releases / updates)
   → Gemini (summary, category, difficulty, tags — JSON schema enforced)
   → POST {LARAVEL_API_URL}/api/automation/posts   (Bearer token)
   → Laravel validates, de-dupes (by source URL), stores as an approved `resource`
     post authored by the `auto-post` user → visible on /resources
```

## Editorial focus

Content is aimed at **student development updates — new tools and new models**. A relevance
ranker (`src/services/relevance.js`) scores each item against `FOCUS_KEYWORDS` (release/launch/
new-model signal words + orgs like OpenAI, Google, Meta, Hugging Face, n8n, OpenRouter) and
publishes the most on-topic first.

## Sources (all verified readable)

| Source | How |
|--------|-----|
| GitHub | Blog + Changelog RSS, plus Trending repos (Search API) |
| OpenAI | `openai.com/news/rss.xml` |
| Meta for Developers | `developers.facebook.com/blog/feed/` |
| Google | `blog.google/technology/ai/rss/` + `research.google/blog/rss/` |
| Hugging Face | `huggingface.co/blog/feed.xml` |
| n8n | `blog.n8n.io/rss/` |
| OpenRouter | models API (`/api/v1/models`) — new models only (no RSS exists) |
| Reddit | `r/AiAutomations` (+ AI subs) via RSS |

Add a blog by appending `{ name, url, category }` to `DEFAULT_FEEDS` in `src/config.js`
(or set the `FEEDS` env var). Tune topics via `FOCUS_KEYWORDS`, `REDDIT_SUBREDDITS`,
`DEVTO_TAGS`, `OPENROUTER_DAYS`, `MIN_RELEVANCE`.

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
