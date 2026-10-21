# DEV-CRAFT redesign: summary of changes

Work done on 20 October 2026, across the commits from `c652615` ("welcome and login page updates") to `87315a5` ("mainupdate admin side").

This covers a visual redesign of the public and logged-in app, a private messaging feature with its own backend, and performance fixes.

---

## 1. Branding and theme

- **Brand colour is now `#0042FF`** across the whole app, in both dark and light themes. It replaces the old cyan `#00f2ff` and steel blue `#4a7fa8`. Buttons on the brand colour use white text.
  - Theme tokens: `resources/css/app.css` (`--primary`, `--ring`, `--sidebar-primary`, `--chart-4`)
  - Brand helper for pages that force the colour: `resources/js/lib/brand.ts`
- **Remaining hard-coded cyan removed** from Resources, the post page and the password reset page.
- **Loading indicators:** the refresh spinner and the page-change progress bar are now `#0042FF`. The small spinning circle shown during page changes is turned off; the top progress bar remains.
- **Browser tab titles** show only the page name ("Sign up", "Resources", "Post"). The welcome page shows "DEV-CRAFT". The brand name is set in code, not read from `.env`, because the Docker build does not include `.env`.

## 2. Welcome page (`/`)

- Rebuilt layout:
  - Navbar
  - Hero with a looping **background video**
  - "How it works"
  - "Ready to join" section
  - Footer
- **Always dark.** The theme toggle was removed.
- **Background video:** optimised from 3.0 MB to about 1 MB.
  - Trimmed the white ending, faded the last frame to dark for a clean loop, and removed the audio.
  - Two formats: `welcome-bg.webm` (VP9) and `welcome-bg.mp4` (H.264), plus a 9 KB poster image, all in `public/videos/`.
  - Phones, reduced-motion users and data-saver users get the still poster instead of the video.
- **"How it works"** is an animated card deck that shuffles a card to the back every 4.5 seconds.
- Removed: the "What's inside" feature grid, the hero buttons, the `//` code-style labels and the monospace fonts.
- Privacy and Terms links stay visibly underlined, which Google's OAuth verification requires.

## 3. Login, sign-up and password reset

- **Split screen on desktop:** the brand video panel is on the left and the form on the right. On phones only the form shows.
- **Always dark**, with brand-blue buttons and focus rings.
- **Google and GitHub buttons** at the top of both login and sign-up, then "or continue with email".
- **Inputs:** labelled fields, a show/hide password toggle and a "Remember me" checkbox. Placeholder examples now use "Nyasha" and "nyasha@gmail.com".
- **Password reset request page:** uses the same inputs and buttons.
- **Shared code:**
  - `resources/js/components/auth-form-parts.tsx`
  - `resources/js/layouts/auth/auth-simple-layout.tsx`

## 4. Logged-in app layout (Facebook Marketplace style)

- **Top navbar** (`resources/js/components/app-navbar.tsx`):
  - DEV-CRAFT logo and name.
  - Centre icon tabs: Dashboard, Resources, Hackathons, Projects and Suggestions, with a blue underline on the active tab.
  - Messages button with an unread badge, a Settings button, and the account menu.
  - Icon buttons have no background and turn blue on hover or when active.
- **Admin link** moved into the account (avatar) menu, shown to admins only.
- **Left sidebar only where needed:** the dashboard, the Messages page (chat list) and the admin area. All other pages use the full width.
- **Phones:** the ☰ menu lists the section tabs plus the page's own sidebar content.
- **Sidebar rows** (`resources/js/components/sidebar-row.tsx`) show plain icons, blue when selected.
- **Old sidebar system removed.** These 12 files were deleted:
  - `app-sidebar`, `admin-sidebar`, `nav-main`, `nav-user`, `nav-footer`
  - `app-sidebar-header`, `app-header`, `app-shell`, `app-content`
  - the three layouts that used them

## 5. Dashboard (`/dashboard`)

- **Sidebar:** title, search box, "Pending review" (only when you have pending posts), "+ Create new post", and popular tag chips.
- **Feed:** "Today's picks" grid of post tiles, 4 per row on desktop.
- **Filters are server-side:** filtering by tag (and by type through the URL, e.g. `/dashboard?type=hackathon`) works on the server, so results aren't limited to posts already loaded. Controller: `app/Http/Controllers/DashboardController.php`.
- **Empty states:** "No posts yet" or "No matching posts", with a "Clear filters" button.

## 6. Resources, Hackathons and Projects

- **Shared listing design:**
  - title, search-as-you-type, and a blue "Add …" button
  - the same tiles as the dashboard, 4 per row on desktop
  - rounded pagination and a simple footer
- **Resources:** "PDF only" filter chip and a PDF badge on tiles.
- **Hackathons:** "Upcoming" (blue date badge) and "Past events" (greyed out, "Ended · date") sections.
- **Projects:** "View code" link for posts that have a GitHub URL.
- **Page size** changed from 15 to 16, which fills complete rows of 4.
- **Shared code:**
  - `resources/js/components/post-tile.tsx`
  - `resources/js/components/listing.tsx`

## 7. Post page (`/posts/{slug}`)

- Tab title is "Post".
- Smaller title (20–24 px instead of up to 48 px) and 15 px body text.
- New **"Message"** button next to the author, hidden on your own posts.

## 8. Admin area (`/admin`)

- Uses the new top navbar plus an **Admin sidebar**: Overview, Users, Posts, Pending approvals, Suggestions, Announcements and Settings. The active section stays highlighted on sub-pages.
- Files:
  - `resources/js/components/admin-side-nav.tsx`
  - `resources/js/layouts/admin-layout.tsx`
- The admin page contents (tables and forms) still have their previous styling.

## 9. Private messaging (new feature)

### How it works
- **Starting a chat:** "Message author" on a tile or a post sends a **message request** and opens the chat.
- **Answering a request:** the recipient sees it under **Requests** and can **Accept** or **Decline**. They cannot reply until they accept. Declining hides the request from the recipient; the sender is not told.
- **Privacy:** only the two participants can read or post in a conversation. Anyone else gets a 403.
- **Read status:** opening a chat marks it as read. The navbar badge shows the number of chats with unread messages, and the dropdown lists recent chats.
- **New messages** appear within about 10 seconds while the Messages page is open, by polling. It is not real-time.
- **Rate limit:** sending is limited to 30 actions per minute per user.

### Database (additive only, no existing table changed)
Migration: `database/migrations/2026_10_20_120000_create_conversations_and_messages_tables.php`

| Table | Columns |
|---|---|
| `conversations` | `user_one_id`, `user_two_id` (one conversation per pair), `requester_id`, `status` (`pending` / `accepted` / `declined`), `post_id` (nullable), `last_message_at` |
| `messages` | `conversation_id`, `sender_id`, `body`, `read_at` |

- Deleting a user removes their conversations.
- Deleting a post keeps the conversation and clears its "About" link.
- The tables are created on deploy, because `docker/start.sh` runs `php artisan migrate --force`.

### Code
- **Models and enum:**
  - `app/Models/Conversation.php`
  - `app/Models/Message.php`
  - `app/Enums/ConversationStatus.php`
- **Controller:** `app/Http/Controllers/MessageController.php`
- **Routes** in `routes/web.php`:
  - `GET /messages`
  - `GET /messages/preview`
  - `POST /messages/requests`
  - `POST /conversations/{id}/messages`
  - `POST /conversations/{id}/accept`
  - `POST /conversations/{id}/decline`
- **Shared unread count:** `unreadMessages` in `app/Http/Middleware/HandleInertiaRequests.php`. It returns 0 if the tables don't exist yet, so pages don't break.
- **Front end:**
  - `resources/js/pages/messages/index.tsx`
  - `resources/js/components/message-request-dialog.tsx`
  - `resources/js/types/messages.ts`
- **Tests:** `tests/Feature/MessagesTest.php`, 14 tests.

## 10. Performance

Measured database queries per page load (test database with 60 posts):

| Page | Before | After |
|---|---|---|
| Dashboard | 29 | 6 |
| Hackathons | 25 | 5 |
| Resources | 21 | 5 |
| Projects | 21 | 5 |

- **N+1 fixed:** the "has this user liked this post?" check now runs once for all posts (`Post::scopeWithLikedBy`) instead of one query per post.
- **Unused queries removed:** the dashboard no longer loads announcements and recent hackathons, which the new design doesn't show.
- **Lighter search and filter reloads:** they now fetch only the posts.
- **Popular tags** are cached for 10 minutes.
- **Hover prefetch:** post tiles prefetch on hover, so opening a post feels instant.
- **PHP OPcache** is tuned for production (`docker/php/opcache.ini`, copied in the `Dockerfile`).

**Not fixable in code:**
- The app runs on Render in **Oregon, USA**, but the database is on a separate server (`84.8.141.41`). Hosting both in the same region is the biggest remaining speed-up.
- Render's free tier sleeps after about 15 minutes idle, and the next visit can take 30–60 seconds. An external uptime monitor hitting `/ping` every few minutes would keep it awake.

## 11. Tests

- **New:**
  - Dashboard filter tests (by type, by tag, unknown type ignored)
  - The 14 messaging tests
- **Full suite:** 128 tests, all passing.

## 12. Things to know

- **The local `.env` points at the production database.** Running the app locally, logging in or running migrations affects live data. Logging in locally works only with temporary overrides:

  ```
  SESSION_DOMAIN=null
  SESSION_SECURE_COOKIE=false
  APP_URL=http://127.0.0.1:8000
  ```

  `.env` itself was not changed.
- **Wayfinder route files:** the files in `resources/js/actions` and `resources/js/routes` are generated, and the Vite dev server rewrites them. Differences that are only line endings or line-number comments are harmless.
- **`public/Pin on Motion.mp4`** is the 3 MB original video. It is unused and can be removed from the repository.

## 13. Possible next steps

- Restyle the admin page contents (overview stats, user and post tables, approvals).
- Restyle the Submit post, Suggestions and Settings pages to match.
- Real-time chat (WebSockets) instead of 10-second polling.
- A notifications system. The navbar bell was removed because there was no backend for it.
