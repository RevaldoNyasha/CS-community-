# Project Steps

## Status Legend
- ✅ Done
- 🔄 In Progress
- ⬜ Todo

---

## Phase 1 — Infrastructure Migration

### Database
- ✅ Changed DB driver from SQLite → PostgreSQL (Neon)
- ✅ Updated `config/database.php` default to `pgsql`, `sslmode=require`
- ✅ Updated `.env.example` with Neon connection string format
- ✅ Ran `php artisan migrate` on Neon — all tables created
- ✅ Decided to start fresh on Neon (no data migration from Railway MySQL)

### File Storage
- ✅ Firebase Storage already wired (`config/filesystems.php`, `AppServiceProvider`)
- ✅ Set `FILESYSTEM_DISK=firebase` in `.env.example`
- ⬜ Add Firebase credentials to Cloud Run environment variables

### Hosting — Google Cloud Run
- ✅ Created `Dockerfile` (multi-stage: Node 22 build + PHP 8.4-fpm-alpine)
- ✅ Created `docker/nginx.conf` (listens on port 8080)
- ✅ Created `docker/supervisord.conf` (manages php-fpm + nginx + SSR node)
- ✅ Created `docker/start.sh` (caches config, runs migrations, starts supervisord)
- ✅ Created `cloudbuild.yaml` (Cloud Build CI/CD pipeline)
- ✅ Enabled Cloud Run, Cloud Build, Artifact Registry APIs on GCP project `dev-craft-app`
- 🔄 First deploy via `gcloud run deploy --source .` — build failed, paused here
- ⬜ Fix build error (open Cloud Build logs URL and check the red error at the bottom)
- ⬜ Re-run `gcloud run deploy cs-community --source . --region us-central1 --allow-unauthenticated`
- ⬜ Set environment variables on Cloud Run service
- ⬜ Verify app is live and working
- ⬜ Set up custom domain
- ⬜ Delete Railway project (only after Cloud Run is confirmed working)

---

## Phase 2 — Environment Variables on Cloud Run

These need to be set on the Cloud Run service after successful deploy:

| Variable | Value |
|----------|-------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | (from current `.env`) |
| `APP_URL` | Cloud Run URL |
| `DB_CONNECTION` | `pgsql` |
| `DB_URL` | Neon connection string |
| `FILESYSTEM_DISK` | `firebase` |
| `FIREBASE_PROJECT_ID` | |
| `FIREBASE_CREDENTIALS` | (JSON, single line) |
| `FIREBASE_STORAGE_BUCKET` | |
| `GOOGLE_CLIENT_ID` | |
| `GOOGLE_CLIENT_SECRET` | |
| `GOOGLE_REDIRECT_URI` | |
| `GITHUB_CLIENT_ID` | |
| `GITHUB_CLIENT_SECRET` | |
| `GITHUB_REDIRECT_URI` | |
| `SESSION_DRIVER` | `database` |
| `QUEUE_CONNECTION` | `database` |
| `CACHE_STORE` | `database` |

---

## Phase 3 — Post-Deploy

- ⬜ Update OAuth redirect URIs (Google + GitHub) to Cloud Run URL
- ⬜ Test login, post creation, file upload, comments, likes
- ⬜ Set up custom domain on Cloud Run
- ⬜ Update OAuth redirect URIs again to custom domain
- ⬜ Rotate Railway MySQL password (exposed in chat)
- ⬜ Rotate Neon password (exposed in chat)
- ⬜ Delete Railway project
