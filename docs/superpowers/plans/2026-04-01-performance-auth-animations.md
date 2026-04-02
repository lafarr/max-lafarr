# Max LaFarr Site — Performance, Auth & Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Max LaFarr musician site with NextAuth v5 admin protection, server-component data fetching with `unstable_cache`, and cinematic Framer Motion animations across all public pages, plus a visual redesign of the navbar, footer, and contact form.

**Architecture:** Public pages (discography, events) become async Server Components that fetch data during render using `unstable_cache`-wrapped queries; admin components accept pre-fetched data as props and call `router.refresh()` after mutations (which invalidates the cache tag and re-renders the server parent). NextAuth v5 with a Supabase `users` table guards all `/admin/**` routes via middleware; a single Supabase service-role client replaces per-request email/password authentication.

**Tech Stack:** Next.js 15 (App Router), Supabase (service role key), NextAuth v5 (`next-auth@5`), `bcryptjs`, Framer Motion, Zod, react-hook-form, shadcn/ui, Tailwind CSS

---

## File Map

**New files:**
- `lib/supabase.ts` — single server-side Supabase client (service role key)
- `lib/queries.ts` — `unstable_cache`-wrapped read functions
- `auth.ts` — NextAuth v5 config (CredentialsProvider + Supabase users table)
- `app/api/auth/[...nextauth]/route.ts` — NextAuth route handler
- `app/admin/login/page.tsx` — split-screen login page (server component)
- `app/admin/login/login-form.tsx` — `'use client'` form (Zod + react-hook-form + signIn)
- `components/animations/fade-up.tsx`
- `components/animations/stagger-container.tsx`
- `components/animations/stagger-item.tsx`
- `components/animations/parallax-hero.tsx`
- `components/animations/slide-in.tsx`
- `components/animations/index.ts`
- `components/homepage/hero-heading.tsx` — `'use client'` animated letter stagger
- `components/discography/album-dialog-grid.tsx` — `'use client'` dialog + grid
- `components/admin/sign-out-button.tsx` — `'use client'` sign-out

**Modified files:**
- `middleware.ts` — replace CORS with NextAuth session guard
- `lib/actions.ts` — remove `signInWithPassword`, use `lib/supabase.ts`, add `revalidateTag`
- `app/page.tsx` — server component, add ParallaxHero + HeroHeading
- `app/discography/page.tsx` — server component, pass albums to AlbumDialogGrid
- `app/events/page.tsx` — server component, stagger animations
- `app/contact/page.tsx` — cinematic redesign with animations
- `app/admin/layout.tsx` — add sign-out button
- `components/navbar.tsx` — scroll blur, animated underlines, mobile stagger
- `components/footer.tsx` — full three-column redesign
- `components/dashboard/albums-grid.tsx` — accept `initialAlbums` prop, remove fetch, `router.refresh()` after delete
- `components/dashboard/events-table.tsx` — accept `initialEvents` prop, remove fetch, `router.refresh()` after delete
- `components/dashboard/event-form.tsx` — migrate to Zod + react-hook-form
- `components/dashboard/album-form.tsx` — migrate to Zod + react-hook-form

---

## Task 1: Install Dependencies

**Files:** `package.json`

- [ ] **Step 1: Run initial install (fresh GitHub pull)**

```bash
cd /path/to/max-lafarr
pnpm i
```

Expected: all existing packages installed with no errors.

- [ ] **Step 2: Install new dependencies**

```bash
pnpm add framer-motion next-auth@5 bcryptjs
pnpm add -D @types/bcryptjs
```

Expected: packages added, `package.json` updated.

- [ ] **Step 3: Verify build still passes**

```bash
pnpm build
```

Expected: build succeeds. Fix any pre-existing TypeScript errors before continuing.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: install framer-motion, next-auth@5, bcryptjs"
```

---

## Task 2: Supabase Service-Role Client

**Files:**
- Create: `lib/supabase.ts`

- [ ] **Step 1: Add env var to `.env.local`**

Open `.env.local` and add:
```
SUPABASE_SERVICE_ROLE_KEY=<your service role key from Supabase dashboard → Settings → API>
AUTH_SECRET=<run: openssl rand -base64 32>
```

Keep existing `SUPABASE_URL` and `SUPABASE_KEY` (anon key) — the anon key will be removed in a later task once confirmed working.

- [ ] **Step 2: Create `lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

- [ ] **Step 3: Verify TypeScript**

```bash
pnpm build 2>&1 | grep -i error
```

Expected: no errors related to `lib/supabase.ts`.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase.ts .env.local
git commit -m "feat: add supabase service-role client"
```

---

## Task 3: Refactor lib/actions.ts — Remove Per-Request Auth, Add Cache Invalidation

**Files:**
- Modify: `lib/actions.ts`
- Create: `lib/queries.ts`

- [ ] **Step 1: Create `lib/queries.ts` with cached read functions**

```ts
import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

export interface Album {
  id?: number;
  title: string;
  album_cover?: string;
  album_cover_key?: string;
  release_date: string;
  streaming_link: string;
  streaming_platform: string;
}

export interface Event {
  id?: number;
  name: string;
  location: string;
  date: string;
  time: string;
  ticket_link?: string;
}

export interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

export const getAlbums = unstable_cache(
  async (): Promise<Album[]> => {
    const { data, error } = await supabase.from('albums').select();
    if (error) throw new Error(error.message);
    return (data ?? []).sort((a, b) => {
      const [aMonth, aYear] = a.release_date.split('/');
      const [bMonth, bYear] = b.release_date.split('/');
      return new Date(parseInt(bYear), parseInt(bMonth) - 1).getTime() -
             new Date(parseInt(aYear), parseInt(aMonth) - 1).getTime();
    });
  },
  ['albums'],
  { tags: ['albums'] }
);

export const getAlbumById = unstable_cache(
  async (id: number): Promise<Album[]> => {
    const { data, error } = await supabase.from('albums').select().eq('id', id);
    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ['album-by-id'],
  { tags: ['albums'] }
);

export const getEvents = unstable_cache(
  async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('events').select();
    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ['events'],
  { tags: ['events'] }
);

export const getEventById = unstable_cache(
  async (id: number): Promise<Event> => {
    const { data, error } = await supabase.from('events').select().eq('id', id);
    if (error) throw new Error(error.message);
    return data?.[0];
  },
  ['event-by-id'],
  { tags: ['events'] }
);

export const getSubData = unstable_cache(
  async (): Promise<Subscriber[]> => {
    const { data, error } = await supabase.from('subscribers').select();
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => {
      const d = new Date(row.created_at);
      const month = (d.getMonth() + 1).toString();
      const day = d.getDate().toString();
      const year = d.getFullYear().toString();
      return { id: row.id, email: row.email, createdAt: `${month}-${day}-${year}` };
    });
  },
  ['subscribers'],
  { tags: ['subscribers'] }
);
```

- [ ] **Step 2: Rewrite `lib/actions.ts` — remove all `signInWithPassword`, use service-role client, add `revalidateTag`**

Replace the entire file with:

```ts
'use server';

import { revalidateTag } from 'next/cache';
import { supabase } from './supabase';
import { UTApi } from 'uploadthing/server';

export type { Album, Event, Subscriber } from './queries';
export { getAlbums, getAlbumById, getEvents, getEventById, getSubData } from './queries';

// ─── Events ───────────────────────────────────────────────────────────────────

export async function createEvent(formData: {
  name: string;
  location: string;
  date: string;
  time: string;
  ticket_link?: string;
}) {
  const { error } = await supabase.from('events').insert([formData]);
  if (error) throw new Error(error.message);
  revalidateTag('events');
}

export async function updateEventById(
  id: number,
  newData: { name: string; location: string; date: string; time: string; ticket_link?: string }
) {
  if (!id) throw new Error('id cannot be undefined');
  const { error } = await supabase.from('events').update(newData).eq('id', id);
  if (error) throw new Error(error.message);
  revalidateTag('events');
}

export async function deleteEvent(id: number) {
  if (!id) throw new Error('id cannot be undefined');
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateTag('events');
}

// ─── Albums ───────────────────────────────────────────────────────────────────

export async function createAlbum(
  album: { title: string; release_date: string; streaming_link: string; streaming_platform: string },
  file: File
) {
  const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
  const uploadedFiles = await utapi.uploadFiles([file]);
  const fileUrl = uploadedFiles[0]?.data?.ufsUrl;
  const fileKey = uploadedFiles[0]?.data?.key;
  if (!fileUrl) throw new Error('File URL is null after upload');

  try {
    const { error } = await supabase
      .from('albums')
      .insert([{ ...album, album_cover: fileUrl, album_cover_key: fileKey }]);
    if (error) throw new Error(error.message);
    revalidateTag('albums');
  } catch (err) {
    if (fileKey) await utapi.deleteFiles([fileKey]);
    throw err;
  }
}

export async function updateAlbumById(
  id: number,
  data: { title: string; release_date: string; streaming_link: string; streaming_platform: string; album_cover?: string },
  file: File | null
) {
  if (!id) throw new Error('id cannot be undefined');

  if (file) {
    const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
    const uploadedFiles = await utapi.uploadFiles([file]);
    const fileUrl = uploadedFiles[0]?.data?.ufsUrl;
    if (!fileUrl) throw new Error('File URL is null after upload');
    data.album_cover = fileUrl;
  }

  const { error } = await supabase
    .from('albums')
    .update({ ...data, id: undefined })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidateTag('albums');
}

export async function deleteAlbumById(id: number) {
  const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
  const { data, error } = await supabase
    .from('albums')
    .delete()
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  if (data?.[0]?.album_cover_key) {
    await utapi.deleteFiles([data[0].album_cover_key]);
  }
  revalidateTag('albums');
}

// ─── Subscribers ──────────────────────────────────────────────────────────────

export async function createSub(email: string) {
  const { error } = await supabase.from('subscribers').insert([{ email }]);
  if (error) throw new Error(error.message);
  revalidateTag('subscribers');
}

export async function deleteSub(id: number) {
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateTag('subscribers');
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm build 2>&1 | grep -i error
```

Expected: no TypeScript errors. Fix any import mismatches (e.g., components that imported `Album` from `@/lib/actions` still work because the type is re-exported).

- [ ] **Step 4: Commit**

```bash
git add lib/supabase.ts lib/queries.ts lib/actions.ts
git commit -m "feat: replace per-request supabase auth with service-role client + unstable_cache"
```

---

## Task 4: Create `users` Table in Supabase

**Files:** Supabase dashboard (SQL Editor)

- [ ] **Step 1: Run migration in Supabase SQL Editor**

Open the Supabase dashboard → SQL Editor → New query. Paste and run:

```sql
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email varchar NOT NULL UNIQUE,
  password_hash varchar NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 2: Generate bcrypt hashes for the 2 admin users**

After `pnpm i` from Task 1, bcryptjs is available. Run from the project root:

```bash
node -e "
const bcrypt = require('bcryptjs');
Promise.all([
  bcrypt.hash('PASSWORD_FOR_USER_1', 10),
  bcrypt.hash('PASSWORD_FOR_USER_2', 10),
]).then(([h1, h2]) => {
  console.log('User 1 hash:', h1);
  console.log('User 2 hash:', h2);
});
"
```

Replace `PASSWORD_FOR_USER_1` and `PASSWORD_FOR_USER_2` with the actual passwords. Copy the two hashes.

- [ ] **Step 3: Insert users via Supabase SQL Editor**

```sql
INSERT INTO users (email, password_hash) VALUES
  ('admin1@yourdomain.com', '$2b$10$HASH_FROM_STEP_2_USER_1'),
  ('admin2@yourdomain.com', '$2b$10$HASH_FROM_STEP_2_USER_2');
```

Replace emails and hashes with the real values. Do not commit passwords or hashes to git.

- [ ] **Step 4: Verify rows exist**

```sql
SELECT id, email, created_at FROM users;
```

Expected: 2 rows returned.

---

## Task 5: NextAuth v5 Config + Route Handler

**Files:**
- Create: `auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create `auth.ts` at project root**

```ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const { data: user, error } = await supabase
          .from('users')
          .select('id, email, password_hash')
          .eq('email', email)
          .single();

        if (error || !user) return null;

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
```

- [ ] **Step 2: Create `app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Verify TypeScript**

```bash
pnpm build 2>&1 | grep -i error
```

Expected: no errors. If TypeScript complains about `session.user.id`, add a `types/next-auth.d.ts`:

```ts
// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add auth.ts app/api/auth types/next-auth.d.ts
git commit -m "feat: add NextAuth v5 with credentials provider + supabase users"
```

---

## Task 6: Update Middleware — NextAuth Session Guard

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Replace middleware.ts entirely**

```ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  if (!req.auth && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
});

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] **Step 2: Start dev server and verify redirect**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/admin` in a browser. Expected: redirect to `/admin/login` (even though the page doesn't exist yet — you should see a 404 for `/admin/login`, not the dashboard).

- [ ] **Step 3: Verify UploadThing still works**

The `/api/uploadthing` route is NOT in the matcher, so it's unaffected. Confirm the uploadthing route handler at `app/api/uploadthing/route.ts` still exists and is unchanged.

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat: protect /admin/** with NextAuth session middleware"
```

---

## Task 7: Admin Login Page

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/login/login-form.tsx`

- [ ] **Step 1: Create `app/admin/login/login-form.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginValues) {
    setAuthError(null);
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError('Invalid email or password.');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <motion.div
      className="flex flex-col justify-center h-full px-8 md:px-16 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={itemVariants} className="text-sm text-zinc-500 uppercase tracking-widest mb-2">
        Admin Access
      </motion.p>
      <motion.h1 variants={itemVariants} className="artist-name text-4xl font-normal mb-8 text-white">
        SIGN IN
      </motion.h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {authError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-4 py-2"
            >
              {authError}
            </motion.p>
          )}

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      {...field}
                      className="bg-zinc-900 border-zinc-800 text-white focus:border-white transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="bg-zinc-900 border-zinc-800 text-white focus:border-white transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-white text-black hover:bg-zinc-200 font-medium rounded-full py-5 mt-2 transition-colors"
            >
              {form.formState.isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `app/admin/login/page.tsx`**

```tsx
import Image from 'next/image';
import { LoginForm } from './login-form';
import { motion } from 'framer-motion';

// This is a server component — no 'use client'
// Motion on the panels is handled inside client sub-components below

function LeftPanel() {
  return (
    <div className="relative w-full h-full min-h-[40vh] md:min-h-0">
      <Image
        src="https://7x0zshh65t.ufs.sh/f/ef0jRbxJDgdLgzL7khE4tsQJRIvCa1LTgcr0kupZWVyxfOoj"
        alt="Max LaFarr"
        fill
        className="object-cover grayscale"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="artist-name text-white text-4xl md:text-5xl tracking-tight">MAX LAFARR</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row overflow-hidden">
      {/* Left — photo panel */}
      <div className="w-full md:w-1/2 md:h-screen">
        <LeftPanel />
      </div>

      {/* Right — form panel */}
      <div className="w-full md:w-1/2 md:h-screen flex items-center bg-zinc-950">
        <LoginForm />
      </div>
    </main>
  );
}
```

Note: The `LeftPanel` and `RightPanel` slide-in animation will be added in Task 9 once the animation primitives are ready. For now, the page renders correctly without animation.

- [ ] **Step 3: Test login flow**

```bash
pnpm dev
```

1. Navigate to `http://localhost:3000/admin` — should redirect to `/admin/login`
2. Enter an invalid email/password — should show "Invalid email or password."
3. Enter the correct credentials from Task 4 — should redirect to `/admin`

- [ ] **Step 4: Commit**

```bash
git add app/admin/login/
git commit -m "feat: add split-screen admin login page with NextAuth credentials"
```

---

## Task 8: Sign-Out Button + Admin Layout Session

**Files:**
- Create: `components/admin/sign-out-button.tsx`
- Modify: `app/admin/layout.tsx`
- Modify: `components/dashboard/user-nav.tsx`

- [ ] **Step 1: Create `components/admin/sign-out-button.tsx`**

```tsx
'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="text-zinc-400 hover:text-white gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
```

- [ ] **Step 2: Read `components/dashboard/user-nav.tsx` to understand current structure**

Run: `cat components/dashboard/user-nav.tsx`

Then replace its content with:

```tsx
import { SignOutButton } from '@/components/admin/sign-out-button';
import { auth } from '@/auth';

export async function UserNav() {
  const session = await auth();
  return (
    <div className="flex items-center gap-3">
      {session?.user?.email && (
        <span className="text-xs text-zinc-500 hidden sm:block">{session.user.email}</span>
      )}
      <SignOutButton />
    </div>
  );
}
```

- [ ] **Step 3: Verify admin layout still compiles**

```bash
pnpm build 2>&1 | grep -i error
```

- [ ] **Step 4: Commit**

```bash
git add components/admin/ components/dashboard/user-nav.tsx app/admin/layout.tsx
git commit -m "feat: add sign-out button to admin layout"
```

---

## Task 9: Animation Primitives

**Files:**
- Create: `components/animations/fade-up.tsx`
- Create: `components/animations/stagger-container.tsx`
- Create: `components/animations/stagger-item.tsx`
- Create: `components/animations/parallax-hero.tsx`
- Create: `components/animations/slide-in.tsx`
- Create: `components/animations/index.ts`

- [ ] **Step 1: Create `components/animations/fade-up.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `components/animations/stagger-container.tsx`**

```tsx
'use client';

import { motion } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.07 }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create `components/animations/stagger-item.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: shouldReduce ? 0 : 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Create `components/animations/parallax-hero.tsx`**

```tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ParallaxHeroProps {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxHero({ children, className }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduce ? '0%' : '35%']);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 5: Create `components/animations/slide-in.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SlideInProps {
  children: React.ReactNode;
  direction: 'left' | 'right';
  delay?: number;
  className?: string;
}

export function SlideIn({ children, direction, delay = 0, className }: SlideInProps) {
  const shouldReduce = useReducedMotion();
  const x = direction === 'left' ? -60 : 60;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: shouldReduce ? 0 : x }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 6: Create `components/animations/index.ts`**

```ts
export { FadeUp } from './fade-up';
export { StaggerContainer } from './stagger-container';
export { StaggerItem } from './stagger-item';
export { ParallaxHero } from './parallax-hero';
export { SlideIn } from './slide-in';
```

- [ ] **Step 7: Verify TypeScript**

```bash
pnpm build 2>&1 | grep -i error
```

- [ ] **Step 8: Commit**

```bash
git add components/animations/
git commit -m "feat: add Framer Motion animation primitives (FadeUp, Stagger, Parallax, SlideIn)"
```

---

## Task 10: Navbar Redesign

**Files:**
- Modify: `components/navbar.tsx`

- [ ] **Step 1: Replace `components/navbar.tsx` entirely**

```tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Instagram, Youtube } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { FaSpotify } from 'react-icons/fa';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/discography', label: 'DISCOGRAPHY' },
  { href: '/events', label: 'EVENTS' },
  { href: '/contact', label: 'CONTACT' },
];

const socialLinks = [
  {
    href: 'https://open.spotify.com/artist/48cLxcaQBLsUSBvgiOmEe4',
    label: 'Spotify',
    icon: <FaSpotify className="h-5 w-5" />,
  },
  {
    href: 'https://www.instagram.com/maxlafarrmusic/',
    label: 'Instagram',
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    href: 'https://www.youtube.com/@maxlafarrmusic3168',
    label: 'YouTube',
    icon: <Youtube className="h-6 w-6" />,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-white/10'
          : 'bg-black border-white/10'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="artist-name text-xl text-white hover:opacity-80 transition-opacity">
          MAX LAFARR
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-white text-sm font-medium hover:text-gray-300 transition-colors"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </nav>

        {/* Desktop social icons */}
        <div className="hidden md:flex items-center gap-4">
          {socialLinks.map((s) => (
            <motion.div key={s.label} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Link href={s.href} className="text-white hover:text-gray-300 transition-colors" target="_blank">
                {s.icon}
                <span className="sr-only">{s.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black text-white w-full sm:w-full p-0 border-0">
            <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col items-center justify-center">
                <nav className="flex flex-col items-center gap-8">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                      transition={{ duration: 0.35, delay: i * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-2xl hover:text-gray-300 transition-colors font-medium tracking-wider"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile social icons */}
                <div className="flex items-center gap-6 mt-12">
                  {socialLinks.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.35, delay: navLinks.length * 0.07 + i * 0.06 }}
                    >
                      <Link href={s.href} className="text-white hover:text-gray-300 transition-colors" target="_blank">
                        {s.icon}
                        <span className="sr-only">{s.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} MAX LAFARR
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add components/navbar.tsx
git commit -m "feat: redesign navbar with scroll blur, animated underlines, and mobile stagger"
```

---

## Task 11: Footer Redesign

**Files:**
- Modify: `components/footer.tsx`

- [ ] **Step 1: Replace `components/footer.tsx` entirely**

```tsx
import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import { FadeUp } from '@/components/animations';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white border-t border-white/10">
      <FadeUp>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Column 1 — Brand */}
            <div className="flex flex-col gap-3">
              <h2 className="artist-name text-2xl">MAX LAFARR</h2>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Musician, multi-instrumentalist.
              </p>
            </div>

            {/* Column 2 — Nav links */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Navigate</p>
              {[
                { href: '/', label: 'Home' },
                { href: '/discography', label: 'Discography' },
                { href: '/events', label: 'Events' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-400 hover:text-white text-sm transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Column 3 — Social */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Follow</p>
              <div className="flex items-center gap-5">
                {[
                  {
                    href: 'https://open.spotify.com/artist/48cLxcaQBLsUSBvgiOmEe4',
                    label: 'Spotify',
                    icon: <FaSpotify className="h-5 w-5" />,
                  },
                  {
                    href: 'https://www.instagram.com/maxlafarrmusic/',
                    label: 'Instagram',
                    icon: <Instagram className="h-5 w-5" />,
                  },
                  {
                    href: 'https://www.youtube.com/@maxlafarrmusic3168',
                    label: 'YouTube',
                    icon: <Youtube className="h-6 w-6" />,
                  },
                ].map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    className="text-zinc-400 hover:text-white transition-colors hover:-translate-y-0.5 transform duration-200"
                  >
                    {s.icon}
                    <span className="sr-only">{s.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8">
            <p className="text-zinc-600 text-xs font-mono text-center">
              © {new Date().getFullYear()} MAX LAFARR — ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </FadeUp>
    </footer>
  );
}
```

- [ ] **Step 2: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add components/footer.tsx
git commit -m "feat: redesign footer with three-column layout and animations"
```

---

## Task 12: Homepage — Server Component + Cinematic Animations

**Files:**
- Modify: `app/page.tsx`
- Create: `components/homepage/hero-heading.tsx`

- [ ] **Step 1: Create `components/homepage/hero-heading.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

const text = 'MAX LAFARR';

export function HeroHeading() {
  const shouldReduce = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduce ? 0 : 0.04, delayChildren: 0.1 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.h1
      className="artist-name text-6xl md:text-8xl font-normal leading-none flex flex-wrap justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          className={char === ' ' ? 'w-6 md:w-10' : ''}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
```

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeUp, ParallaxHero } from '@/components/animations';
import { HeroHeading } from '@/components/homepage/hero-heading';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <ParallaxHero className="absolute inset-0 z-0">
        <div
          className="w-full h-[130%] grayscale"
          style={{
            backgroundImage: `url('https://7x0zshh65t.ufs.sh/f/ef0jRbxJDgdLgzL7khE4tsQJRIvCa1LTgcr0kupZWVyxfOoj')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </ParallaxHero>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black/80 z-10" />

      {/* Content */}
      <div className="container px-4 flex flex-col items-center justify-center text-center space-y-12 relative z-20">
        <HeroHeading />

        <FadeUp delay={0.4}>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 font-light tracking-wide">
            I play a little bit of everything.
          </p>
        </FadeUp>

        <FadeUp delay={0.6}>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200 font-medium px-12 py-6 rounded-full text-base transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/discography">LISTEN</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium px-12 py-6 rounded-full text-base transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/events">EVENTS</Link>
            </Button>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/homepage/
git commit -m "feat: homepage - server component, parallax hero, letter-stagger heading"
```

---

## Task 13: Discography Page — Server Component + Animations

**Files:**
- Create: `components/discography/album-dialog-grid.tsx`
- Modify: `app/discography/page.tsx`

- [ ] **Step 1: Create `components/discography/album-dialog-grid.tsx`**

```tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { motion } from 'framer-motion';
import type { Album } from '@/lib/queries';

interface AlbumDialogGridProps {
  albums: Album[];
}

function renderEmbed(album: Album) {
  if (album.streaming_platform === 'soundcloud') {
    return (
      <iframe
        width="100%"
        height="500"
        scrolling="no"
        frameBorder="no"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(album.streaming_link)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
        className="rounded-md"
      />
    );
  }
  return (
    <iframe
      src={`https://open.spotify.com/embed/album/${album.streaming_link}`}
      width="100%"
      height="500"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="rounded-md"
    />
  );
}

export function AlbumDialogGrid({ albums }: AlbumDialogGridProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-0">
      {albums.map((album) => (
        <StaggerItem key={album.id}>
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                className="cursor-pointer"
                onClick={() => setSelectedAlbum(album)}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={album.album_cover ?? ''}
                    alt={album.title}
                    className="object-cover md:scale-[0.835] rounded-lg"
                    width={500}
                    height={500}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 rounded-lg" />
                </div>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="text-white max-w-4xl bg-transparent border-none">
              <DialogTitle className="sr-only">
                {selectedAlbum?.title ?? 'Album Player'}
              </DialogTitle>
              {selectedAlbum && (
                <div className="w-full">{renderEmbed(selectedAlbum)}</div>
              )}
            </DialogContent>
          </Dialog>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

- [ ] **Step 2: Replace `app/discography/page.tsx`**

```tsx
import { getAlbums } from '@/lib/queries';
import { FadeUp, SlideIn } from '@/components/animations';
import { AlbumDialogGrid } from '@/components/discography/album-dialog-grid';

export default async function DiscographyPage() {
  const albums = await getAlbums();

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <SlideIn direction="left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">DISCOGRAPHY</h1>
        </SlideIn>
        <FadeUp delay={0.15}>
          <p className="text-center text-gray-300 mb-12">Click any album to listen</p>
        </FadeUp>

        {albums.length > 0 ? (
          <AlbumDialogGrid albums={albums} />
        ) : (
          <FadeUp>
            <p className="text-center text-gray-400 mt-24">No albums yet — check back soon.</p>
          </FadeUp>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add app/discography/page.tsx components/discography/
git commit -m "feat: discography - server component, staggered album grid, hover spring"
```

---

## Task 14: Events Page — Server Component + Animations

**Files:**
- Modify: `app/events/page.tsx`

- [ ] **Step 1: Create `components/events/ticket-button.tsx`**

`motion` cannot be used directly in a server component file — it must live in a `'use client'` component.

```tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function TicketButton({ href }: { href: string }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Button asChild className="bg-white text-black hover:bg-gray-200 px-6 sm:px-8">
        <a href={href}>GET TICKETS</a>
      </Button>
    </motion.div>
  );
}
```

- [ ] **Step 2: Replace `app/events/page.tsx`**

```tsx
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getEvents } from '@/lib/queries';
import { FadeUp, SlideIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { TicketButton } from '@/components/events/ticket-button';

function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${month.replace(/^0/, '')}-${day}-${year}`;
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <SlideIn direction="left">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">UPCOMING EVENTS</h1>
        </SlideIn>

        <div className="max-w-3xl mx-auto">
          {events.length > 0 ? (
            <StaggerContainer className="grid gap-6" staggerDelay={0.1}>
              {events.map((event) => (
                <StaggerItem key={event.id}>
                  <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-6">
                        <div>
                          <h2 className="text-xl font-bold mb-3">{event.name}</h2>
                          <div className="flex items-center gap-2 text-gray-300 mb-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 mb-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          {event.ticket_link && <TicketButton href={event.ticket_link} />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <FadeUp>
              <div className="text-center py-12">
                <p className="text-2xl font-light text-gray-300">
                  No events scheduled right now, check back soon!
                </p>
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add app/events/page.tsx components/events/
git commit -m "feat: events page - server component, staggered cards, ticket button animation"
```

---

## Task 15: Contact Page — Cinematic Redesign

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Replace `app/contact/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { SlideIn, FadeUp, StaggerContainer, StaggerItem } from '@/components/animations';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  function onSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      toast.success('Message sent', {
        description: "Thank you for your message. We'll get back to you soon.",
      });
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <SlideIn direction="left">
            <h1 className="artist-name text-4xl md:text-6xl font-normal mb-4 text-center">CONTACT</h1>
          </SlideIn>
          <FadeUp delay={0.2}>
            <p className="text-zinc-400 text-center mb-12 font-light tracking-wide">
              Have a question or want to book Max LaFarr for a show?<br />
              Send a message and we&apos;ll get back to you.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.06}>
                  <StaggerItem>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-400 text-xs uppercase tracking-widest">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              {...field}
                              className="bg-zinc-900 border-zinc-800 text-white focus:border-white transition-colors rounded-none border-0 border-b-2 px-0 focus-visible:ring-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </StaggerItem>

                  <StaggerItem>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-400 text-xs uppercase tracking-widest">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Your email"
                              {...field}
                              className="bg-zinc-900 border-zinc-800 text-white focus:border-white transition-colors rounded-none border-0 border-b-2 px-0 focus-visible:ring-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </StaggerItem>
                </StaggerContainer>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400 text-xs uppercase tracking-widest">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Subject of your message"
                          {...field}
                          className="bg-zinc-900 border-zinc-800 text-white focus:border-white transition-colors rounded-none border-0 border-b-2 px-0 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400 text-xs uppercase tracking-widest">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your message"
                          {...field}
                          rows={6}
                          className="bg-transparent border-zinc-800 text-white focus:border-white transition-colors resize-none rounded-none border-0 border-b-2 px-0 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200 font-medium rounded-full py-6 tracking-widest text-sm transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </FadeUp>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: contact page - cinematic redesign with underline inputs and animations"
```

---

## Task 16: Add Slide-In Panels to Login Page

**Files:**
- Modify: `app/admin/login/page.tsx`

Now that the animation primitives exist, add the slide-in panels.

- [ ] **Step 1: Update `app/admin/login/page.tsx`**

```tsx
import Image from 'next/image';
import { LoginForm } from './login-form';
import { SlideIn } from '@/components/animations';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row overflow-hidden">
      {/* Left — photo panel */}
      <SlideIn direction="left" className="w-full md:w-1/2 md:h-screen">
        <div className="relative w-full h-full min-h-[40vh] md:min-h-screen">
          <Image
            src="https://7x0zshh65t.ufs.sh/f/ef0jRbxJDgdLgzL7khE4tsQJRIvCa1LTgcr0kupZWVyxfOoj"
            alt="Max LaFarr"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="artist-name text-white text-4xl md:text-5xl tracking-tight">MAX LAFARR</span>
          </div>
        </div>
      </SlideIn>

      {/* Right — form panel */}
      <SlideIn direction="right" delay={0.1} className="w-full md:w-1/2 md:h-screen flex items-center bg-zinc-950">
        <LoginForm />
      </SlideIn>
    </main>
  );
}
```

- [ ] **Step 2: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/login/page.tsx
git commit -m "feat: login page - add slide-in panel animations"
```

---

## Task 17: Admin Albums Grid — Accept Props + router.refresh()

**Files:**
- Modify: `components/dashboard/albums-grid.tsx`
- Modify: `app/admin/albums/page.tsx`

- [ ] **Step 1: Update `components/dashboard/albums-grid.tsx`**

Remove the `useEffect` fetch and accept `initialAlbums` as a prop. After delete, call `router.refresh()` instead of re-fetching.

```tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Search, Trash, AlertCircle } from 'lucide-react';
import { deleteAlbumById } from '@/lib/actions';
import type { Album } from '@/lib/queries';
import { ConfirmationDialog } from './confirmation_dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AlbumsGridProps {
  initialAlbums: Album[];
}

export function AlbumsGrid({ initialAlbums }: Readonly<AlbumsGridProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<number | undefined>(undefined);
  const [deleteError, setDeleteError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const filteredAlbums = initialAlbums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.release_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.streaming_platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete() {
    if (!albumToDelete) return;
    setIsDeleting(true);
    setDeleteError(false);
    try {
      await deleteAlbumById(albumToDelete);
      router.refresh();
    } catch (error) {
      console.error('Error deleting album:', error);
      setDeleteError(true);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {deleteError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to delete album. Please try again.</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search albums by title, date, or platform..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlbums.map((album) => (
          <Card key={album.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={album.album_cover || '/placeholder.svg'}
                alt={album.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{album.title}</h3>
              <p className="text-sm text-muted-foreground">Released: {album.release_date}</p>
              <p className="text-sm text-muted-foreground mt-1">Platform: {album.streaming_platform}</p>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {album.streaming_platform === 'spotify' ? 'Spotify ID: ' : 'SoundCloud: '}
                {album.streaming_link}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/albums/${album.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                onClick={() => { setAlbumToDelete(album.id); setShowDeleteModal(true); }}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {showDeleteModal && (
        <ConfirmationDialog
          confirmationButtonColor="bg-red-500"
          confirmationText="Delete Album"
          confirmationAction={() => { handleDelete(); setShowDeleteModal(false); }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update `app/admin/albums/page.tsx`**

```tsx
import { Button } from '@/components/ui/button';
import { AlbumsGrid } from '@/components/dashboard/albums-grid';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getAlbums } from '@/lib/queries';

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Albums</h2>
        <Button asChild>
          <Link href="/admin/albums/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Album
          </Link>
        </Button>
      </div>
      <AlbumsGrid initialAlbums={albums} />
    </div>
  );
}
```

- [ ] **Step 3: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add components/dashboard/albums-grid.tsx app/admin/albums/page.tsx
git commit -m "feat: albums grid - accept server-fetched props, router.refresh on delete"
```

---

## Task 18: Admin Events Table — Accept Props + router.refresh()

**Files:**
- Modify: `components/dashboard/events-table.tsx`
- Modify: `app/admin/events/page.tsx`

- [ ] **Step 1: Update `components/dashboard/events-table.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Search, Trash } from 'lucide-react';
import { deleteEvent } from '@/lib/actions';
import type { Event } from '@/lib/queries';
import { ConfirmationDialog } from './confirmation_dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EventsTableProps {
  initialEvents: Event[];
}

function formatDate(dateString: string) {
  const parts = dateString.split('-');
  return `${parts[1].replace(/^0/, '')}-${parts[2]}-${parts[0]}`;
}

function formatTime(time: string) {
  const [hourStr, mins] = time.split(':');
  let hours = parseInt(hourStr);
  const period = hours < 12 ? 'AM' : 'PM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${mins} ${period}`;
}

export function EventsTable({ initialEvents }: Readonly<EventsTableProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const filteredEvents = initialEvents.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete() {
    if (!eventToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteEvent(eventToDelete);
      router.refresh();
    } catch (err) {
      console.error('Failed to delete event:', err);
      setError('Failed to delete the event. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Ticket Link</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
                <TableCell>{formatTime(event.time)}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm truncate block max-w-[200px]">
                    {event.ticket_link}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDeleting}
                      onClick={() => { setConfirmation(true); setEventToDelete(event.id); }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {confirmation && (
        <ConfirmationDialog
          confirmationButtonColor="bg-red-500"
          confirmationText="Delete Event"
          confirmationAction={() => { handleDelete(); setConfirmation(false); }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update `app/admin/events/page.tsx`**

```tsx
import { Button } from '@/components/ui/button';
import { EventsTable } from '@/components/dashboard/events-table';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getEvents } from '@/lib/queries';

export default async function EventsAdminPage() {
  const events = await getEvents();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Music Events</h2>
        <Button asChild>
          <Link href="/admin/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Event
          </Link>
        </Button>
      </div>
      <EventsTable initialEvents={events} />
    </div>
  );
}
```

- [ ] **Step 3: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add components/dashboard/events-table.tsx app/admin/events/page.tsx
git commit -m "feat: events table - accept server-fetched props, router.refresh on delete"
```

---

## Task 19: Event Form — Zod + react-hook-form

**Files:**
- Modify: `components/dashboard/event-form.tsx`

- [ ] **Step 1: Replace `components/dashboard/event-form.tsx` entirely**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createEvent, getEventById, updateEventById } from '@/lib/actions';

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  ticket_link: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  eventId?: string;
}

export function EventForm({ eventId }: Readonly<EventFormProps>) {
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { name: '', location: '', date: '', time: '', ticket_link: '' },
  });

  useEffect(() => {
    if (eventId) {
      getEventById(parseInt(eventId))
        .then((event) => {
          form.reset({
            name: event.name ?? '',
            location: event.location ?? '',
            date: event.date ?? '',
            time: event.time ?? '',
            ticket_link: event.ticket_link ?? '',
          });
        })
        .catch(() => {
          form.setError('root', { message: 'Failed to load event. Please try again.' });
        });
    }
  }, [eventId, form]);

  async function onSubmit(values: EventFormValues) {
    try {
      if (eventId) {
        await updateEventById(parseInt(eventId), values);
      } else {
        await createEvent(values);
      }
      router.push('/admin/events');
    } catch {
      form.setError('root', { message: 'Failed to save the event. Please try again.' });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <Card>
          <CardContent className="space-y-4 pt-6">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    {field.value && (
                      <p className="text-xs text-muted-foreground">
                        Displays as: {field.value.split('-').reverse().join('-')}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ticket_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/tickets" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/events')}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : eventId ? 'Update Event' : 'Create Event'}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </form>
  );
}
```

- [ ] **Step 2: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/event-form.tsx
git commit -m "feat: event form - migrate to Zod + react-hook-form"
```

---

## Task 20: Album Form — Zod + react-hook-form

**Files:**
- Modify: `components/dashboard/album-form.tsx`

- [ ] **Step 1: Replace `components/dashboard/album-form.tsx` entirely**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createAlbum, updateAlbumById, getAlbumById } from '@/lib/actions';

const albumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  release_date: z.string().min(1, 'Release date is required'),
  streaming_platform: z.enum(['spotify', 'soundcloud'], { message: 'Select a platform' }),
  streaming_link: z.string().min(1, 'Streaming link is required'),
});

type AlbumFormValues = z.infer<typeof albumSchema>;

interface AlbumFormProps {
  albumId?: string;
}

export function AlbumForm({ albumId }: Readonly<AlbumFormProps>) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string>('');

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: '',
      release_date: '',
      streaming_platform: 'spotify',
      streaming_link: '',
    },
  });

  useEffect(() => {
    if (albumId) {
      getAlbumById(parseInt(albumId))
        .then((data) => {
          const album = data[0];
          form.reset({
            title: album.title ?? '',
            release_date: album.release_date ?? '',
            streaming_platform: (album.streaming_platform as 'spotify' | 'soundcloud') ?? 'spotify',
            streaming_link: album.streaming_link ?? '',
          });
          setExistingCoverUrl(album.album_cover ?? '');
        })
        .catch(() => {
          form.setError('root', { message: 'Failed to load album. Please try again.' });
        });
    }
  }, [albumId, form]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  }

  async function onSubmit(values: AlbumFormValues) {
    try {
      if (albumId) {
        await updateAlbumById(parseInt(albumId), values, file);
      } else {
        if (!file) {
          form.setError('root', { message: 'Please select an album cover image.' });
          return;
        }
        await createAlbum(values, file);
      }
      router.push('/admin/albums');
    } catch {
      form.setError('root', { message: 'Failed to save album. Please try again.' });
    }
  }

  const coverSrc = file ? URL.createObjectURL(file) : existingCoverUrl;
  const platform = form.watch('streaming_platform');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <Card>
          <CardContent className="space-y-4 pt-6">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter album title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Album Cover</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {!coverSrc ? (
                <div
                  className="w-48 h-48 bg-neutral-800 cursor-pointer hover:opacity-70 transition-opacity flex justify-center items-center rounded-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="text-white" />
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-48">
                  <Image alt="Album cover" width={192} height={192} className="object-cover rounded-md" src={coverSrc} />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Replace
                  </Button>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="release_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Date (M/YYYY)</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streaming_platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Streaming Platform</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="spotify" id="spotify" />
                        <Label htmlFor="spotify">Spotify</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="soundcloud" id="soundcloud" />
                        <Label htmlFor="soundcloud">SoundCloud</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streaming_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{platform === 'soundcloud' ? 'SoundCloud Link' : 'Spotify Album ID'}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        platform === 'soundcloud'
                          ? 'https://soundcloud.com/max-lafarr/sets/...'
                          : '5QlSo5Hgas50pzaufIlIxa'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/albums')}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : albumId ? 'Update Album' : 'Create Album'}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </form>
  );
}
```

- [ ] **Step 2: ESLint + build**

```bash
eslint .
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/album-form.tsx
git commit -m "feat: album form - migrate to Zod + react-hook-form"
```

---

## Task 21: Final ESLint + Build Verification

- [ ] **Step 1: Run full ESLint check**

```bash
eslint .
```

Expected: 0 errors. Fix any remaining issues — do not disable rules.

- [ ] **Step 2: Run production build**

```bash
pnpm build
```

Expected: build succeeds with no TypeScript errors. Note any warnings but do not suppress them.

- [ ] **Step 3: Smoke-test in dev mode**

```bash
pnpm dev
```

Verify:
1. `http://localhost:3000` — hero parallax works, heading letters stagger in
2. `http://localhost:3000/discography` — albums load without spinner, stagger in on scroll
3. `http://localhost:3000/events` — events load without spinner, stagger in
4. `http://localhost:3000/contact` — animated underline inputs, form validates
5. `http://localhost:3000/admin` — redirects to `/admin/login`
6. `/admin/login` — split panels slide in, form validates, login works
7. `/admin` (after login) — sign-out button visible
8. `/admin/albums` — albums list loads instantly
9. `/admin/events` — events list loads instantly
10. Navbar scroll blur triggers after scrolling past hero

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final ESLint and build verification"
```
