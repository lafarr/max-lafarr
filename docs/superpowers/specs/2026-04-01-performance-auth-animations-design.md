# Max LaFarr Site — Performance, Auth & Animations

**Date:** 2026-04-01
**Status:** Approved

---

## 1. Goals

1. Convert client-side data-fetching pages to Server Components so content arrives pre-rendered (no spinners).
2. Cache DB reads with `unstable_cache` + tag-based invalidation on mutations.
3. Swap the per-request Supabase email/password auth for a single service-role client.
4. Add NextAuth v5 (Auth.js) with a `users` table in Supabase protecting `/admin/**`.
5. Add cinematic Framer Motion animations: parallax hero, staggered grid entries, sweep-in headings, hover micro-interactions.
6. Migrate event and album admin forms to `react-hook-form` + Zod (matching the existing contact form pattern).

---

## 2. Architecture

### 2.1 Supabase Client

**Current problem:** Every server action calls `supabase.auth.signInWithPassword()` before each query — an extra ~200ms network round-trip per request.

**Fix:** Create `lib/supabase.ts` — a single server-side Supabase client initialized with `SUPABASE_SERVICE_ROLE_KEY`. This file must never be imported in client components.

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

All existing actions in `lib/actions.ts` are updated to use this client, removing all `signInWithPassword` calls.

### 2.2 Caching

DB read functions are wrapped in `unstable_cache` with named tags:

| Function | Cache tag |
|---|---|
| `getAlbums()` | `albums` |
| `getEvents()` | `events` |
| `getSubData()` | `subscribers` |
| `getAlbumById(id)` | `albums` |
| `getEventById(id)` | `events` |

Every mutation action calls the corresponding `revalidateTag()` after a successful write:

| Action | Invalidates |
|---|---|
| `createAlbum`, `updateAlbumById`, `deleteAlbumById` | `revalidateTag('albums')` |
| `createEvent`, `updateEventById`, `deleteEvent` | `revalidateTag('events')` |
| `createSub`, `deleteSub` | `revalidateTag('subscribers')` |

### 2.3 Server Components

The following pages are converted from `'use client'` with `useEffect` fetches to async Server Components:

| Route | Change |
|---|---|
| `app/discography/page.tsx` | Server Component — `await getAlbums()` at render |
| `app/events/page.tsx` | Server Component — `await getEvents()` at render |
| `app/admin/albums/page.tsx` | Server Component |
| `app/admin/events/page.tsx` | Server Component |
| `app/admin/newsletter/page.tsx` | Server Component |

Interactive sub-components (dialogs, forms, mobile nav) remain `'use client'` and are split into separate files. The `'use client'` boundary is pushed as far down the tree as possible.

---

## 3. Authentication

### 3.1 Library

`next-auth@5` (Auth.js) with `CredentialsProvider`. Uses the new `auth()` helper compatible with Next.js 15 App Router.

### 3.2 Database

A new `users` table in the Max Music Supabase project:

```sql
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email varchar NOT NULL UNIQUE,
  password_hash varchar NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

The 2 admin users are inserted directly via SQL in the Supabase dashboard. Passwords are bcrypt-hashed (cost factor 10). The user provides emails and passwords at implementation time; the implementer generates the hashes and provides the SQL insert.

### 3.3 Auth Flow

1. User visits `/admin/login`
2. Submits email + password (Zod-validated on client)
3. NextAuth `CredentialsProvider.authorize()`:
   - Queries `users` table by email via Supabase service client
   - `bcrypt.compare(password, user.password_hash)`
   - Returns user object on success, `null` on failure
4. NextAuth sets a signed session cookie
5. Middleware reads the session; unauthenticated requests to `/admin/**` redirect to `/admin/login`

### 3.4 Files

| File | Purpose |
|---|---|
| `auth.ts` | NextAuth config — `CredentialsProvider`, session strategy |
| `app/admin/login/page.tsx` | Split-screen login page |
| `app/admin/login/login-form.tsx` | `'use client'` form with Zod + react-hook-form |
| `middleware.ts` | Replace current CORS middleware with NextAuth session guard |

### 3.5 Middleware Guard

```ts
// middleware.ts
export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/admin/:path*'],
};
```

`/api/uploadthing` is excluded from the matcher so uploads still work unauthenticated (UploadThing handles its own auth).

### 3.6 Login Page Layout

- **Desktop:** Two-column split. Left 50%: hero photo (grayscale, `object-cover`), "MAX LAFARR" in Anton font centered over the image. Right 50%: dark background, vertically centered login card.
- **Mobile:** Single column. Photo becomes a top banner (~40vh), form below.
- **Animation:** Left panel slides in from the left on mount; right panel slides in from the right. Form fields stagger in after panels settle.

---

## 4. Animations

### 4.1 Library

`framer-motion` — installed as a production dependency. All animation components are `'use client'`.

### 4.2 Reusable Primitives (`components/animations/`)

| Component | Props | Behaviour |
|---|---|---|
| `FadeUp` | `delay?`, `children` | Fades in + translates up 20px on scroll entry |
| `StaggerContainer` | `children` | Provides stagger context; triggers when container enters viewport |
| `StaggerItem` | `children` | Child of StaggerContainer; each item delays by index |
| `ParallaxHero` | `children` | Wraps hero section; background translates at 0.4x scroll speed |
| `SlideIn` | `direction` (`left`\|`right`), `delay?` | Slides in from left or right on mount |

All primitives check `prefers-reduced-motion` via Framer's `useReducedMotion` hook and skip transforms if set.

### 4.3 Per-Page Animation Plan

**Homepage (`/`)**
- `ParallaxHero` wraps the full-screen hero section
- "MAX LAFARR" heading: characters stagger up from below using `variants` with `staggerChildren: 0.04`
- Subtitle fades up with `delay: 0.3`
- CTA buttons sweep in with `delay: 0.5`

**Discography (`/discography`)**
- Page heading: `FadeUp` + `SlideIn direction="left"`
- Album grid: `StaggerContainer` + `StaggerItem` per card; stagger delay `0.07s`
- Per card hover: `whileHover={{ scale: 1.03 }}` with spring physics; dark overlay fades in via CSS

**Events (`/events`)**
- Page heading: `FadeUp` + `SlideIn direction="left"`
- Event cards: `StaggerContainer` + `StaggerItem`, stagger `0.1s`
- "GET TICKETS" button: `whileHover={{ scale: 1.04 }}`, `whileTap={{ scale: 0.97 }}`

**Admin Login (`/admin/login`)**
- Left panel: `SlideIn direction="left"` on mount
- Right panel: `SlideIn direction="right"` on mount
- Form fields: `StaggerContainer` + `StaggerItem` after panels settle (`delay: 0.3`)

---

## 5. Form Validation

All admin forms migrated to `react-hook-form` + `zodResolver`. Already in use on the contact page — same pattern throughout.

### 5.1 Login Form

```ts
z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})
```

### 5.2 Event Form

```ts
z.object({
  name:        z.string().min(1, "Event name is required"),
  location:    z.string().min(1, "Location is required"),
  date:        z.string().min(1, "Date is required"),
  time:        z.string().min(1, "Time is required"),
  ticket_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})
```

### 5.3 Album Form

```ts
z.object({
  title:              z.string().min(1, "Title is required"),
  release_date:       z.string().min(1, "Release date is required"),
  streaming_platform: z.enum(["spotify", "soundcloud"], { message: "Select a platform" }),
  streaming_link:     z.string().min(1, "Streaming link is required"),
})
```

File upload (album cover) remains outside react-hook-form as a separate `File` state — same as current implementation.

---

## 6. Environment Variables

Add to `.env.local`:

```
# Existing (keep)
SUPABASE_URL=...
SUPABASE_KEY=...           # anon key — can be removed once service role key is added
UPLOADTHING_TOKEN=...

# New
SUPABASE_SERVICE_ROLE_KEY=...   # server-side only, never exposed to browser
AUTH_SECRET=...                  # random 32-char string, generate with: openssl rand -base64 32
```

The `SUPABASE_EMAIL` and `SUPABASE_PASSWORD` env vars used for per-request auth are removed.

---

## 7. Dependencies to Install

```bash
pnpm i
pnpm add framer-motion next-auth@5 bcryptjs
pnpm add -D @types/bcryptjs
```

---

## 8. Navbar & Footer Enhancements

### 8.1 Navbar

**Visual upgrades:**
- Backdrop blur on scroll: navbar background transitions from fully transparent to `bg-black/80 backdrop-blur-md` once the user scrolls past the hero (using `useScroll` + a scroll threshold listener)
- Nav links get an animated underline on hover — a thin white line that slides in from the left using a CSS `::after` pseudo-element with `scaleX` transform
- Social icons get `whileHover={{ scale: 1.15 }}` spring micro-animations
- Mobile sheet menu: nav links stagger in (`StaggerContainer` + `StaggerItem`) when the sheet opens, with a slight slide from the right

**Logo treatment:**
- "MAX LAFARR" in the navbar gets a subtle letter-spacing animation on hover (CSS transition, no JS needed)

### 8.2 Footer

**Visual upgrades:**
- Full redesign: dark background (`bg-zinc-950`), three columns on desktop (artist name + tagline, nav links, social links), single column on mobile
- Social icons row with `whileHover={{ scale: 1.15, y: -2 }}` micro-animations
- Thin top border with a gradient: `border-t border-white/10`
- `FadeUp` animation on scroll entry for the whole footer
- Copyright line in `text-zinc-500` with Geist Mono styling

---

## 9. Out of Scope

- No changes to UploadThing integration
- No changes to contact form (already uses Zod + react-hook-form)
- No new DB tables beyond `users`
- No email sending / newsletter functionality changes
