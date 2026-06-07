# Database

## Driver

**PostgreSQL via [Neon](https://neon.tech)** (serverless Postgres). SSL is required — `sslmode=require` is the default.

Connect using the Neon connection string in `.env`:
```
DB_CONNECTION=pgsql
DB_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

For local development you can still use SQLite by setting `DB_CONNECTION=sqlite` locally.

## Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| name | string | |
| email | string unique | |
| email_verified_at | timestamp \| null | |
| password | string \| null | null for OAuth-only users |
| role | enum | `admin` \| `user` (default: `user`) |
| two_factor_secret | text \| null | Fortify 2FA |
| two_factor_recovery_codes | text \| null | Fortify 2FA |
| two_factor_confirmed_at | timestamp \| null | |
| remember_token | string \| null | |
| created_at / updated_at | timestamps | |

### `posts`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | FK → users | |
| title | string | |
| slug | string unique | auto-generated from title on create |
| content | text | |
| type | enum | `resource` \| `hackathon` \| `project` \| `announcement` |
| status | enum | `pending` \| `approved` (default: `pending`) |
| event_date | date \| null | for hackathon posts |
| github_url | string \| null | for project posts |
| file_path | string \| null | GCS path |
| file_size | integer \| null | bytes |
| created_at / updated_at | timestamps | |

**Scopes**: `approved()`, `pending()`, `ofType($type)`  
**Accessors**: `attachment_url`, `attachment_is_image`  
**Model events**: slug auto-generated on `creating`; GCS file deleted on `deleting`

### `comments`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| post_id | FK → posts | cascades on delete |
| user_id | FK → users | cascades on delete |
| comment | text | |
| created_at / updated_at | timestamps | |

### `likes`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| post_id | FK → posts | |
| user_id | FK → users | |
| created_at / updated_at | timestamps | |
| — | unique(post_id, user_id) | one like per user per post |

### `tags`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| name | string(50) unique | |
| created_at / updated_at | timestamps | |

### `post_tag` (pivot)
| Column | Type |
|--------|------|
| post_id | FK → posts |
| tag_id | FK → tags |

### `suggestions`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | FK → users | |
| message | text | |
| created_at / updated_at | timestamps | |

### Framework Tables
- `password_reset_tokens` — email, token, created_at
- `sessions` — id, user_id, ip_address, user_agent, payload, last_activity
- `cache` / `cache_locks` — database cache driver
- `jobs` / `job_batches` / `failed_jobs` — database queue driver

## Relationships

```
User
 ├── hasMany → Post
 ├── hasMany → Comment
 ├── hasMany → Like
 └── hasMany → Suggestion

Post
 ├── belongsTo → User
 ├── hasMany → Comment
 ├── hasMany → Like
 └── belongsToMany → Tag (via post_tag)

Comment → belongsTo Post, User
Like    → belongsTo Post, User
Tag     → belongsToMany Post (via post_tag)
Suggestion → belongsTo User
```

## Enums

```php
PostType:   Resource | Hackathon | Project | Announcement
PostStatus: Pending  | Approved
UserRole:   Admin    | User
```
