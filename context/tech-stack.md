# Tech Stack

## Backend

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Laravel | 12.x |
| Language | PHP | ^8.4 |
| Auth | Laravel Fortify | latest |
| OAuth | Laravel Socialite | latest |
| SSR Bridge | Inertia.js (Laravel) | 2.x |
| File Storage | Google Cloud Storage (Flysystem) | custom |
| Routes Typed | Wayfinder | latest |
| Testing | Pest PHP | 4.3 |
| Linting | Laravel Pint | latest |

## Frontend

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Library | React | 19.2.0 |
| Language | TypeScript | 5.7.2 |
| SPA Bridge | Inertia.js React Adapter | 2.3.7 |
| CSS | Tailwind CSS | 4.0.0 |
| Build Tool | Vite | 7.0.4 |
| Icons | Lucide React | latest |
| Icons (alt) | Heroicons | latest |

## UI Components

Built on **Radix UI primitives** with custom styling (shadcn/ui-style pattern):

- Avatar, Checkbox, Dialog, Dropdown Menu, Label, Navigation Menu
- Select, Separator, Slot, Toggle, Toggle Group, Tooltip
- Custom: Button, Input, Textarea, Card, Badge, Alert, Spinner, Skeleton

Utility classes managed with `clsx` + `tailwind-merge` via `lib/utils.ts`.  
Component variants with `class-variance-authority` (CVA).

## Infrastructure / Services

| Service | Purpose |
|---------|---------|
| SQLite (default) | Primary database (can swap to MySQL/PostgreSQL) |
| Database sessions | Session storage |
| Database cache | Cache storage |
| Database queue | Background job queue |
| Google Cloud Storage | File attachment storage (Firebase bucket) |
| GitHub OAuth | Social login |
| Google OAuth | Social login |
| EmailJS | Client-side email sending |

## Development Tools

| Tool | Purpose |
|------|---------|
| `php artisan serve` | Local PHP server |
| `npm run dev` | Vite dev server with HMR |
| Concurrently | Run PHP + Vite in parallel |
| Laravel Pail | Real-time log tailing |
| Laravel Sail | Docker-based local env |
| ESLint + Prettier | JS/TS linting & formatting |
| Pest | PHP testing framework |

## Notable Config

- **SSR**: Enabled — Inertia renders React on server at port `13714`
- **HTTPS**: Forced in production via `AppServiceProvider`
- **Passwords**: Stricter validation rules in production
- **Dates**: `CarbonImmutable` used throughout
- **Destructive commands**: Prohibited in production
