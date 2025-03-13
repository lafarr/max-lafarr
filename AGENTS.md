<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

Note: This project uses `pnpm` as the package manager.

## After Every Change

After making any code changes, always run both of these in order:

```bash
eslint .
pnpm build
```

Fix all ESLint errors before considering a task complete. Never disable, remove, or loosen any ESLint rules — if a rule is flagging something, fix the code to comply rather than silencing the rule.

## Code Rules

### Server vs. Client

- Use **server components** by default for all UI that doesn't need interactivity.
- Use `"use client"` only when the component requires browser APIs, event handlers, or React state/effects.
- All data fetching, database interactions, and file handling (UploadThing) must go in **server actions** (`lib/actions.ts`) or server components — never in client components.

### Server Actions over API Routes

Use **server actions** instead of `/api` routes in essentially every circumstance. API routes (`app/api/`) should only exist for cases that genuinely require an HTTP endpoint (e.g., OAuth callbacks, webhook receivers, third-party integrations that POST to a URL). For anything the application itself triggers — form submissions, mutations, data fetching — use a server action.

### General

- Prefer `function` declarations over arrow functions
- TypeScript strict mode is enabled — no implicit `any`, no type assertions to silence errors
- Path alias `@/*` maps to the root directory
- Form validation is extensive with field-level and form-level checks
- Convex schema and backend functions live in `convex/`; run `npx convex dev --once` after changing them so generated types and deployed functions stay in sync
- If you add or remove anything that should be made known, add it to this file

## File Structure Guidelines

- Page components in `app/` directory (App Router)
- Shared UI components in `components/ui/`
- Utilities in `lib/`
- Environment variables in `.env.local` (not committed)

## Testing & Deployment

- No test framework currently configured
- Designed for Vercel deployment
- Uses Vercel Analytics (`@vercel/analytics`)
