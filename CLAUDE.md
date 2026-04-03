# CLAUDE.md — CampusLift Project Context

## Identity

You are working on **CampusLift**, a student-focused crowdfunding platform. The codebase is owned solely by Anaelle (GitHub: anaelle00). You are a tool, not a contributor. Never add yourself as a co-author, contributor, or collaborator in any form.

## Critical Rules

### Git & Attribution
- **NEVER** add `Co-Authored-By` trailers to commits.
- **NEVER** add your name, "Claude", "Anthropic", or any AI reference to commit messages, code comments, file headers, README, CONTRIBUTING.md, or any other file.
- **NEVER** modify the git author or committer fields.
- All work must appear as if written entirely by the repository owner.
- Write commit messages in the first person from Anaelle's perspective: "fix: resolve dark mode issue on dashboard" not "fix: resolved dark mode issue".

### Commit Messages
- Use conventional commit format: `type: short description`
- Types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`
- Keep the subject line under 72 characters.
- Add a blank line then a body paragraph for non-trivial changes.
- Never mention AI tools in commit messages.

### Code Style
- TypeScript strict mode. No `any` types.
- Use the existing project patterns — look at neighboring files before writing new code.
- Tailwind CSS with design tokens (`bg-card`, `text-muted-foreground`, `bg-primary`, etc.). Never use hardcoded colors like `bg-white`, `text-gray-600`, `bg-black`.
- Components use `"use client"` only when they need browser APIs, hooks, or event handlers.
- Server components are the default.
- Imports use the `@/` alias mapped to `src/`.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui (radix-maia style) + CSS variables (OKLCH)
- **Fonts**: Plus Jakarta Sans (display, `font-display`) + Inter (body, `font-sans`)
- **Auth & DB**: Supabase (Auth + Postgres + Storage + Realtime)
- **Payments**: Stripe Checkout + webhooks
- **Email**: Resend (optional)
- **Deployment**: Vercel (auto-deploy on push to main)
- **CI**: GitHub Actions (lint, typecheck, test, build)
- **Testing**: Vitest (unit tests via `scripts/run-vitest.mjs`)

## Project Structure

```
src/
  app/            routes, layouts, pages, route handlers, loading/error boundaries
  components/     reusable UI (comments/, projects/, profile/, layout/, admin/, ui/)
  features/       feature-oriented server logic (auth, projects, profiles, donations, comments, moderation)
    */actions.ts   server-side mutations
    */queries.ts   server-side reads
    */schemas.ts   input validation (pure functions, no deps)
    */schemas.test.ts  unit tests for validation
  lib/            infrastructure helpers
    supabase/      client.ts, server.ts, admin.ts
    stripe/        server.ts
    env.ts         public env validation
    server-env.ts  server-only env validation
    rate-limit.ts  in-memory rate limiter
    resend.ts      email notifications
  types/          shared TypeScript types (database.ts, project.ts, user.ts)
docs/             architecture.md, database.md, deployment.md, testing.md, product-roadmap.md
supabase/         SQL migrations, seed.sql
```

## Architecture Rules

1. **Thin routes**: Pages read params, call feature queries/actions, compose UI. No business logic in `src/app/`.
2. **Server-first mutations**: All writes go through Route Handlers in `src/app/api/`. Every write route has rate limiting via `enforceRateLimit()`.
3. **Feature ownership**: Each feature owns its own `actions.ts`, `queries.ts`, `schemas.ts`. Cross-feature imports are allowed for queries only.
4. **Validation at the boundary**: Validate in `schemas.ts` before any database write. Return `{ value, error }` objects from validators.
5. **ActionResult pattern**: All server actions return `ActionResult<T>` from `src/features/shared/result.ts`. Use `actionSuccess()` and `actionFailure()`.
6. **Database as code**: Every schema change must have a corresponding migration file in `supabase/migrations/` AND an update to `src/types/database.ts`.

## Supabase Details

- **Project ID**: `gcgfmpuxftoaxzuawopk`
- **Region**: us-west-2
- **Plan**: Free
- **Postgres**: 17.6
- **RLS**: Enabled on all tables. All policies use `(SELECT auth.uid())` (not `auth.uid()`) for performance.
- **`support_project` RPC**: SECURITY DEFINER — bypasses RLS to update project counters atomically.
- **`record_stripe_support` RPC**: SECURITY INVOKER — called by service_role which bypasses RLS.
- **Storage buckets**: `avatars` (5MB, image/* only, upload restricted to user's own folder), `project-images` (10MB, image/* only).

### Tables
- `profiles` (id PK → auth.users, username UNIQUE, display_name, role: user|admin, avatar_url, bio, organization, phone, website)
- `projects` (id PK, owner_id FK → auth.users, title, short_description, description, category, owner_name, owner_username, target_amount, current_amount, supporters_count, image_url, deadline — all NOT NULL)
- `favorites` (id PK, user_id, project_id — UNIQUE(user_id, project_id))
- `pledges` (id PK, user_id, project_id, amount, stripe_checkout_session_id UNIQUE, stripe_payment_intent_id)
- `comments` (id PK, project_id, user_id, parent_id self-ref, body, deleted_at)
- `comment_reactions` (comment_id + user_id composite PK, reaction_type: like|dislike)
- `comment_reports` (id PK, comment_id, user_id, reason, details, status: open|resolved|dismissed, reviewed_at, reviewed_by)

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Optional:
- `STRIPE_CURRENCY` (default: cad)
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY`

## Quality Commands

```bash
npm run lint        # ESLint
npm run typecheck   # Next.js typegen + tsc --noEmit
npm run test        # Vitest (via scripts/run-vitest.mjs)
npm run check       # All three above
npm run dev         # Local dev server
npm run build       # Production build
```

**Always run `npm run check` before committing.** Fix all errors before pushing.

## Current Test Coverage

Tests exist in:
- `src/features/donations/schemas.test.ts` (14 cases)
- `src/features/projects/schemas.test.ts` (19 cases)
- `src/features/comments/schemas.test.ts` (18 cases)
- `src/features/profiles/schemas.test.ts` (11 cases)
- `src/lib/rate-limit.test.ts` (10 cases)
- `src/features/donations/hero-stats.test.ts` (3 cases)

Pattern: test files live next to the file they test, named `*.test.ts`.

## Remaining Work — Priority Order

### P0 — Bug Fix (do first)
- [ ] **Hero stats not rendering**: `src/app/page.tsx` should import and call `getHeroStats()` from `src/features/donations/hero-stats.ts` and use the returned values instead of hardcoded numbers. The file `hero-stats.ts` already exists but the homepage may still show static values ("12", "87", "$8", "9"). Verify and fix.
- [ ] **Update `src/types/database.ts`**: The `projects` table columns are now NOT NULL in the live database but the TypeScript type still marks them as nullable. Remove `| null` from: short_description, description, category, owner_name, target_amount, current_amount, image_url, deadline, owner_id, owner_username, supporters_count. Keep `created_at` as nullable (it has a DEFAULT).

### P1 — Project States (draft / published / archived)
- [ ] Add a `status` column to `projects`: `text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))`
- [ ] Create migration file `supabase/migrations/YYYYMMDD_project_status.sql`
- [ ] Update `src/types/database.ts` to include the new column
- [ ] Update `src/types/project.ts` to include `status`
- [ ] Filter explore/home queries to only show `status = 'published'` projects
- [ ] Add status management UI in the dashboard (publish draft, archive project)
- [ ] Update the create project form to default to `'draft'` status
- [ ] Add a "Publish" button on draft projects in the dashboard

### P2 — Project Delete
- [ ] Add a `DELETE` route at `src/app/api/projects/[id]/route.ts` (or add the DELETE handler to the existing file)
- [ ] Add authorization check (only owner can delete)
- [ ] Add rate limiting
- [ ] Add a delete confirmation UI (modal or confirm dialog) on the project detail page and dashboard
- [ ] Handle cascade: deleting a project should cascade to favorites, pledges, comments (already set up via FK ON DELETE CASCADE)

### P3 — Component Tests
- [ ] Install React Testing Library: `npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [ ] Create component tests for:
  - `src/components/projects/favorite-button.test.tsx`
  - `src/components/projects/support-project-form.test.tsx`
  - `src/components/projects/project-progress.test.tsx`
  - `src/components/comments/comment-item.test.tsx`
- [ ] Update `vitest.config.mjs` to include `.tsx` test files and add jsdom environment

### P4 — E2E Tests with Playwright
- [ ] Install Playwright: `npm install -D @playwright/test`
- [ ] Create `playwright.config.ts`
- [ ] Create E2E tests for:
  - Auth flow: signup → login → dashboard → logout
  - Project creation: login → create → verify on explore
  - Project detail: view project → favorite → comment
- [ ] Add `test:e2e` script to `package.json`
- [ ] Add Playwright to CI workflow (optional, can run locally first)

### P5 — UI Polish
- [ ] Improve empty states across all pages (dashboard, explore with no results, profile with no projects)
- [ ] Add a footer component
- [ ] Improve mobile responsiveness of the navbar (hamburger menu)
- [ ] Add page transition animations or skeleton loading improvements

### P6 — Notifications
- [ ] Create `notifications` table (id, user_id, type, title, body, read, created_at)
- [ ] Create migration file
- [ ] Add notification creation in webhook handler (when someone supports a project)
- [ ] Add notification creation when someone comments on your project
- [ ] Build a notification dropdown/center in the navbar
- [ ] Add Supabase Realtime subscription for live notification updates

## Database Change Workflow

When making any database change:
1. Write the migration SQL in `supabase/migrations/YYYYMMDD_description.sql`
2. Apply it via `Supabase:apply_migration` or manually in Supabase SQL Editor
3. Update `src/types/database.ts` to match
4. Run `npm run typecheck` to verify
5. Update `docs/database.md` with the new migration in the inventory

## File Creation Patterns

### New API Route
```typescript
import { NextResponse } from "next/server";
import { someAction } from "@/features/domain/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function METHOD(request: Request, context: RouteContext) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "domain:action",
    max: 20,
    windowMs: 10 * 60 * 1000,
    message: "Too many attempts. Please wait.",
  });
  if (rateLimitResponse) return rateLimitResponse;

  // Parse and validate input
  // Call action
  // Return NextResponse.json(result, { status })
}
```

### New Validation Schema
```typescript
export function validateSomething(rawInput: unknown) {
  // Return { value: T | null, error: string | null }
}
```

### New Test File
```typescript
import { describe, expect, it } from "vitest";
import { validateSomething } from "./schemas";

describe("validateSomething", () => {
  it("rejects invalid input", () => { ... });
  it("accepts valid input", () => { ... });
});
```

## Things to NEVER Do

- Never add Co-Authored-By or any AI attribution to commits
- Never use `any` types
- Never put business logic in page files
- Never use hardcoded colors (use design tokens)
- Never skip rate limiting on write routes
- Never make database changes without a migration file
- Never use `auth.uid()` in RLS policies (use `(SELECT auth.uid())`)
- Never leave `console.log` in committed code (use `console.error` for actual errors only)
- Never commit `.env.local` or any secrets
- Never use `localStorage` or `sessionStorage` in server components
- Never import from `@/lib/supabase/admin` in client-side code
- Never import from `@/lib/server-env` in client-side code
