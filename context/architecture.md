# Architecture

## Overview

CS Community is a full-stack Laravel + React + Inertia.js community platform. The backend is a traditional Laravel MVC app; the frontend is a React SPA rendered via Inertia.js (with SSR). There is no REST API — all data flows through Inertia page props.

## Request Flow

```
Browser → Laravel Router → Controller → Inertia::render() → React Page Component
```

On initial load, Inertia returns a full HTML page (SSR via `ssr.tsx`). Subsequent navigations are AJAX — Inertia fetches JSON and swaps the React component client-side without a full reload.

## Directory Layout

```
app/
├── Actions/Fortify/        Auth actions (create user, reset password)
├── Enums/                  PostStatus, PostType, UserRole
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          7 admin-only controllers
│   │   ├── Auth/           GitHub + Google OAuth controllers
│   │   └── Settings/       Profile + Password controllers
│   ├── Middleware/         AdminMiddleware, HandleInertiaRequests, HandleAppearance
│   └── Requests/           Form request validation classes
├── Models/                 User, Post, Comment, Like, Tag, Suggestion
└── Providers/              AppServiceProvider, FortifyServiceProvider

resources/js/
├── pages/                  35+ React TSX pages (one per route)
├── components/             50+ shared React components + ui/ primitives
├── layouts/                App, Admin, Auth, Settings layout wrappers
├── hooks/                  Custom React hooks
├── types/                  TypeScript interfaces (models, auth, nav, ui)
└── lib/                    Utilities (time-ago, utils, clipboard)

routes/
├── web.php                 All web routes (public, auth, admin, OAuth)
└── settings.php            Profile / password / appearance routes
```

## Auth & Authorization

- **Authentication**: Laravel Fortify (email/password) + Socialite (GitHub, Google OAuth)
- **Email verification**: Required for most authenticated actions
- **2FA**: Schema columns in place, Fortify-managed
- **Role-based access**: `UserRole` enum (`admin` | `user`) stored on `users` table. `AdminMiddleware` gates all `/admin/*` routes, returning 403 on failure.

## Shared State (Inertia)

`HandleInertiaRequests` middleware shares these props to every page:

| Prop | Type | Description |
|------|------|-------------|
| `auth.user` | User \| null | Authenticated user |
| `auth.isAdmin` | boolean | Admin status |
| `flash.success` | string \| null | One-time success message |
| `sidebarOpen` | boolean | Sidebar state from session |

## Post Approval Workflow

```
User submits post → status: pending
                  ↓
Admin reviews in /admin/pending
                  ↓
Admin approves → status: approved → visible publicly
         or
Admin deletes → post removed
```

## File Storage

Attachments are stored in **Google Cloud Storage** (Firebase bucket), not locally. The `firebase` disk is a custom GCS Flysystem adapter registered in `AppServiceProvider`. Post model has computed accessors `attachment_url` and `attachment_is_image` for rendering.

## Key Patterns

- **Slug-based routing**: Posts are addressed by slug (`/posts/{slug}`), auto-generated on save via model boot
- **Eloquent scopes**: `Post::approved()`, `Post::pending()`, `Post::ofType()`
- **Model events**: Post deletes its GCS file on cascade; slug generated on `creating`
- **Form Requests**: All controller input validated via dedicated Request classes
- **CarbonImmutable**: Dates are immutable throughout the app
- **SSR**: Inertia SSR server runs at `http://127.0.0.1:13714`
