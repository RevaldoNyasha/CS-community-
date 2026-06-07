# Frontend

## Stack

React 19 + TypeScript 5.7 + Tailwind CSS 4, served via Inertia.js v2. No REST API — data arrives as Inertia page props. Built and bundled by Vite 7.

Entry points:
- [app.tsx](resources/js/app.tsx) — client-side hydration
- [ssr.tsx](resources/js/ssr.tsx) — server-side rendering

## Pages (`resources/js/pages/`)

### Public
| Page | Route |
|------|-------|
| `welcome.tsx` | `/` |
| `resources/index.tsx` | `/resources` |
| `hackathons/index.tsx` | `/hackathons` |
| `projects/index.tsx` | `/projects` |
| `posts/show.tsx` | `/posts/{slug}` |
| `posts/create.tsx` | `/posts/create` |

### Authenticated
| Page | Route |
|------|-------|
| `dashboard.tsx` | `/dashboard` |
| `suggestions/index.tsx` | `/suggestions` |

### Admin (`admin/`)
| Page | Route |
|------|-------|
| `dashboard.tsx` | `/admin` |
| `users/index.tsx` | `/admin/users` |
| `users/show.tsx` | `/admin/users/{user}` |
| `posts/index.tsx` | `/admin/posts` |
| `pending/index.tsx` | `/admin/pending` |
| `suggestions/index.tsx` | `/admin/suggestions` |
| `announcements/index.tsx` | `/admin/announcements` |
| `settings/index.tsx` | `/admin/settings` |

### Auth (`auth/`)
`login.tsx`, `register.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `verify-email.tsx`, `confirm-password.tsx`, `password-reset-request.tsx`

### Settings (`settings/`)
`profile.tsx`, `password.tsx`, `appearance.tsx`

## Layouts

```
layouts/
├── app-layout.tsx              Main wrapper (sidebar + header)
├── admin-layout.tsx            Admin section wrapper
├── auth-layout.tsx             Auth pages wrapper
├── settings/layout.tsx         Settings section wrapper
├── app/
│   ├── app-sidebar-layout.tsx
│   ├── app-header-layout.tsx
│   └── admin-sidebar-layout.tsx
└── auth/
    ├── auth-card-layout.tsx
    ├── auth-simple-layout.tsx
    └── auth-split-layout.tsx
```

## Component Library (`resources/js/components/`)

### UI Primitives (`ui/`)
Built on Radix UI with CVA variants + Tailwind:

`button`, `input`, `textarea`, `label`, `checkbox`, `select`, `card`, `badge`, `alert`, `dialog`, `dropdown-menu`, `separator`, `tooltip`, `toggle`, `toggle-group`, `navigation-menu`, `avatar`, `skeleton`, `breadcrumb`, `input-otp`, `spinner`, `icon`, `placeholder-pattern`

### App Shell Components
- `app-shell.tsx` — Root shell
- `app-sidebar.tsx` / `app-sidebar-header.tsx` — Sidebar chrome
- `app-header.tsx` — Top header bar
- `app-content.tsx` — Main content area
- `app-logo.tsx` / `app-logo-icon.tsx` — Brand logo
- `admin-sidebar.tsx` — Admin-specific sidebar

### Navigation
- `nav-main.tsx` — Primary nav items
- `nav-footer.tsx` — Bottom nav items
- `nav-user.tsx` — User nav entry

### Feature Components
- `post-card.tsx` — Post listing card
- `auth-prompt-modal.tsx` — Login prompt for unauthenticated actions
- `confirm-dialog.tsx` — Generic confirmation dialog
- `user-menu-content.tsx` — User dropdown menu
- `user-info.tsx` — User avatar + name display
- `alert-error.tsx` — Error alert display
- `appearance-tabs.tsx` — Dark/light/system theme tabs
- `delete-user.tsx` — Account deletion form
- `breadcrumbs.tsx` — Page breadcrumb trail
- `heading.tsx` — Page heading component
- `input-error.tsx` — Inline field error
- `text-link.tsx` — Styled anchor link

## Custom Hooks (`resources/js/hooks/`)

| Hook | Purpose |
|------|---------|
| `use-appearance.tsx` | Reads/writes dark mode preference |
| `use-clipboard.ts` | Copy text to clipboard |
| `use-current-url.ts` | Tracks current page URL |
| `use-initials.ts` | Generates initials from full name |
| `use-mobile.tsx` | Detects mobile breakpoint |
| `use-mobile-navigation.ts` | Mobile nav open/close state |

## TypeScript Types (`resources/js/types/`)

### `types/models.ts` — Core data shapes
```ts
User         { id, name, email, role, ... }
Post         { id, title, slug, content, type, status, user, tags, likes_count, ... }
Comment      { id, comment, user, created_at, ... }
Tag          { id, name }
Suggestion   { id, message, user, created_at }
PaginatedData<T>  { data, links, meta }
```

### `types/auth.ts`
```ts
Auth { user: User | null, isAdmin: boolean }
```

### `types/navigation.ts`
Navigation item shapes for sidebar/nav menus.

### `types/ui.ts`
Generic UI component prop types.

## Utilities (`resources/js/lib/`)

- `utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `time-ago.ts` — Converts timestamps to relative strings ("2 hours ago")
- `clipboard.ts` — Clipboard write utility

## Styling Notes

- **Tailwind CSS v4** — utility-first, configured via Vite plugin (no `tailwind.config.js`)
- **Dark mode** — supported via `use-appearance` hook + CSS variables
- **CVA** — component variants defined in each `ui/` component file
- **Responsive** — mobile breakpoints handled via `use-mobile` hook and Tailwind responsive prefixes

## Navigation / Routing

All navigation uses Inertia's `<Link>` component — never `<a href>` for internal routes. Form submissions use Inertia's `useForm` or `router.post/put/delete`.

Route URLs are generated from **Wayfinder** (typed Laravel route helpers imported from `@/actions` or `@/routes`).
