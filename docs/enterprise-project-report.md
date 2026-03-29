# CampusLift Enterprise Project Report

Date: 2026-03-26

Note:

This report is a snapshot of the repository at the time of the initial assessment on March 26, 2026.
Several gaps identified here have since been addressed, including repository docs, CI, Stripe support,
threaded comments, comment moderation, and explicit admin roles.

## 1. Executive summary

CampusLift is already a real full-stack MVP, not a toy. The stack is modern, the app has auth, profiles, project pages, favorites, uploads, and a dashboard. That is already valuable.

What makes it feel "cafouille" is not the choice of stack. It is mainly the level of separation between:

- UI
- data access
- business rules
- security-sensitive mutations
- docs/tests/CI around the code

In short:

- The project is technically credible.
- The repository does not yet look mature enough for an "enterprise-style" portfolio piece.
- The biggest gap is architecture and repo hygiene, not missing flashy features.

## 2. What companies value in a portfolio project

Companies usually value projects that look like a real product, not just a demo page. The strongest signals are:

1. A clear full-stack use case
   Example: marketplace, internal tool, dashboard product, booking app, crowdfunding platform, collaboration tool.

2. Real business flows
   Auth, permissions, CRUD, validation, payments, file uploads, search/filtering, notifications, analytics.

3. Clean structure
   Clear boundaries between routes, UI, server mutations, database access, validation, and shared types.

4. Safety around data
   Validation, authorization, race-condition handling, transactions, idempotency, webhook handling, auditability.

5. Testing and automation
   Unit tests, critical E2E tests, linting, CI, predictable scripts.

6. Developer-facing quality
   Real README, env example, contribution notes, architecture notes, deployment notes.

The good news is that CampusLift is already in a category companies understand:

- social product
- funding platform
- dashboard product
- user-generated content platform

That is a very good portfolio direction because it naturally justifies auth, profiles, uploads, comments, payments, notifications, admin tools, and analytics.

## 3. Local audit of the current repository

### What is already good

- Modern stack: Next.js 16, React 19, TypeScript strict, ESLint.
- App Router structure is already recognizable.
- Supabase client/server split exists.
- UI is already separated into components.
- There is already a real product direction, not just isolated pages.

Concrete examples:

- [`package.json`](../package.json) uses Next.js, React, TypeScript, and ESLint.
- [`src/lib/supabase-server.ts`](../src/lib/supabase-server.ts) and [`src/lib/supabase-client.ts`](../src/lib/supabase-client.ts) already split browser/server access.
- [`middleware.ts`](../middleware.ts) already handles Supabase auth session refresh.

### What makes it feel less "enterprise"

#### A. Too much business logic lives in pages and client components

Examples:

- [`src/app/page.tsx`](../src/app/page.tsx) directly queries `projects` and `favorites`.
- [`src/app/dashboard/page.tsx`](../src/app/dashboard/page.tsx) directly queries multiple tables and computes dashboard data inline.
- [`src/components/projects/create-project-form.tsx`](../src/components/projects/create-project-form.tsx) does auth lookup, profile lookup, image upload, and DB insert from the browser.
- [`src/components/projects/support-project-form.tsx`](../src/components/projects/support-project-form.tsx) inserts a pledge and then updates counters from the browser.
- [`src/components/profile/profile-form.tsx`](../src/components/profile/profile-form.tsx) uploads files and updates profile data directly from the browser.

This is acceptable for an MVP, but a more enterprise-style app would move most mutations into:

- Server Actions for app-internal mutations
- Route Handlers for API-style endpoints, webhooks, and third-party integrations
- dedicated query/action files per feature

#### B. The pledge flow is fragile

[`src/components/projects/support-project-form.tsx`](../src/components/projects/support-project-form.tsx) calculates:

- `newCurrentAmount = currentAmount + parsedAmount`
- `newSupportersCount = supportersCount + 1`

in the browser, then writes those values back.

That creates a classic race condition:

- supporter A reads old total
- supporter B reads same old total
- both update
- one update can overwrite the other

In a more mature design, this would be handled by:

- a database function / RPC
- or a server-side transaction
- or a route handler that performs the mutation atomically

This is one of the clearest examples of "works now, but not enterprise-safe".

#### C. The repository maturity is still low

Current signals:

- [`README.md`](../README.md) is still the default Next.js README.
- [`package.json`](../package.json) has `dev`, `build`, `start`, `lint`, but no `test`, `test:e2e`, `typecheck`, or CI-oriented scripts.
- No `.github/workflows` folder detected.
- No local test files detected in the app code.
- No obvious `CONTRIBUTING.md`, `ARCHITECTURE.md`, `TESTING.md`, or `.env.example`.
- No visible database migration/versioning folder.

This is one of the main reasons a project feels less professional, even if the app itself works.

#### D. A few quality details weaken the polish

- Lint currently passes with warnings only, but still shows issues such as raw `<img>` usage and an unused variable in [`middleware.ts`](../middleware.ts).
- There were visible encoding artifacts in strings such as `Here's` and `|` in:
  - [`src/app/dashboard/page.tsx`](../src/app/dashboard/page.tsx)
  - [`src/app/projects/[id]/page.tsx`](../src/app/projects/[id]/page.tsx)
- Some UI text is still placeholder-like or static rather than derived from real analytics.
- The "Save draft" button in [`src/components/projects/create-project-form.tsx`](../src/components/projects/create-project-form.tsx) is visible but does not implement a draft flow yet.

None of this is fatal, but it contributes to the "prototype" feeling.

## 4. What a stronger enterprise structure would look like

For a Next.js App Router project like this, a good target is:

```text
src/
  app/
    (marketing)/
      page.tsx
    (app)/
      dashboard/page.tsx
      explore/page.tsx
      create/page.tsx
      profile/page.tsx
      projects/[id]/page.tsx
    api/
      stripe/webhook/route.ts
      uploads/presign/route.ts
  features/
    auth/
      actions.ts
      queries.ts
      schemas.ts
      components/
    projects/
      actions.ts
      queries.ts
      schemas.ts
      components/
    donations/
      actions.ts
      queries.ts
      schemas.ts
    comments/
      actions.ts
      queries.ts
      schemas.ts
    profiles/
      actions.ts
      queries.ts
      schemas.ts
  lib/
    supabase/
      client.ts
      server.ts
      admin.ts
    env.ts
    utils.ts
  types/
```

### Why this structure works

- `app/` stays focused on routing and page composition.
- `features/` contains business logic by domain.
- `actions.ts` owns server-side mutations.
- `queries.ts` owns reads and composition logic.
- `schemas.ts` owns validation.
- UI components stay smaller and more reusable.

This is close to what companies like because it scales without becoming over-engineered.

## 5. Recommended architecture rules for CampusLift

### Rule 1. Keep routes thin

Pages should mainly:

- read params
- call a query/action layer
- render UI

Avoid putting many raw queries directly in route files.

### Rule 2. Move sensitive mutations to the server

Use:

- Server Actions for forms like create project, update profile, toggle favorite, add comment
- Route Handlers for Stripe webhooks, upload signing, admin endpoints, external API callbacks

This is especially important for:

- payments
- counters
- moderation
- roles
- audit-sensitive flows

### Rule 3. Validate at the boundary

Add a schema layer with Zod for:

- project creation
- profile update
- comment creation
- donation request
- search/filter params

Do not trust form state alone.

### Rule 4. Treat the database as part of the codebase

Version:

- schema changes
- indexes
- RLS policies
- seed data for local dev
- database functions / RPCs

If you stay with Supabase, add a real migrations folder and keep SQL under version control.

### Rule 5. Separate "display data" from "write logic"

Example:

- `features/projects/queries.ts` -> list, detail, dashboard stats
- `features/projects/actions.ts` -> create, edit, publish, archive
- `features/donations/actions.ts` -> create checkout session, confirm donation, reconcile counters

## 6. Documentation and repo files you should add

### Must-have

- `README.md`
- `.env.example`
- `CONTRIBUTING.md`
- `.github/workflows/ci.yml`

### Strongly recommended

- `docs/architecture.md`
- `docs/testing.md`
- `docs/product-roadmap.md`
- `supabase/migrations/...` or equivalent SQL migration folder

### Optional but strong if public

- `LICENSE`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `CHANGELOG.md`

### What should be in the README

At minimum:

- what CampusLift does
- target users
- main features
- tech stack
- project structure
- local setup
- environment variables
- scripts
- screenshots
- architecture summary
- testing commands
- deployment link

For your case, a good README matters a lot because GitHub is often the first impression.

## 7. Testing strategy that looks serious without overdoing it

Recommended stack:

- Vitest + React Testing Library for unit/component tests
- Playwright for core E2E flows

What to test first:

1. Auth flow
   Sign up, log in, protected routes, log out

2. Project creation
   Valid form, invalid form, unauthorized access

3. Favorite flow
   Add/remove favorite and persistence

4. Donation flow
   Create donation request, counters update, success/failure path

5. Profile update
   Text fields, avatar upload, validation

Do not try to hit 100 percent coverage. For a portfolio project, companies care more about:

- good choice of critical scenarios
- deterministic tests
- CI running them automatically

## 8. Supabase vs AWS S3: what is really better seen

### Short answer

Supabase is not "badly seen". S3 is not automatically "better". The right answer depends on what skill you want the project to demonstrate.

### Best option for your specific portfolio goal

The strongest compromise is usually:

- Supabase for Postgres, auth, and maybe realtime
- AWS S3 for image/file storage
- Stripe for payments

Why this mix is strong:

- You keep product velocity.
- You still learn a major cloud service used in companies.
- You avoid rebuilding auth, DB, storage, realtime, and payments all at once.

### When staying on Supabase Storage is perfectly fine

Keep Supabase Storage if your goal is:

- ship faster
- learn product architecture first
- focus on database, auth, and RLS
- avoid cloud complexity for now

This is a valid choice. Supabase Storage is real object storage with access control, not a toy.

### When switching to AWS S3 is worth it

Switch image upload to S3 if your goal is explicitly to show:

- AWS familiarity
- IAM / bucket policies / presigned URLs
- common enterprise cloud concepts
- file pipeline design closer to large-company infra

For a recruiter or engineer, "Supabase + S3 + Stripe" is often more impressive than "AWS everywhere" done superficially.

### My recommendation

Do not replace all of Supabase with AWS.

Do this instead:

- keep Supabase DB/Auth
- add S3 only for uploads
- later add presigned upload URLs
- keep Stripe server-side

That gives you breadth without chaos.

## 9. Evaluation of your ambitious feature list

### Highest-value features

These give the best enterprise signal for effort spent:

1. Auth done properly
   Roles, protected routes, server-side checks

2. Project CRUD with publish states
   Draft, published, archived

3. Comments system
   Threads, pagination, moderation basics

4. Dashboard analytics
   Real stats, charts, recent activity

5. Stripe donations
   Checkout session, webhook, donation history

6. S3-based image upload
   Ideally with presigned URLs

7. Notifications
   Start simple: in-app notifications, realtime later

### Good but not first priority

- bookmarks/watchlist
- search + filters + sorting
- trending algorithm
- admin moderation panel

### Nice bonus, but not a priority if the goal is company readiness

- AI-generated descriptions
- recommendation engine

Those can impress, but only after the fundamentals are solid. A weak architecture with AI features is less convincing than a well-structured product without AI.

## 10. Concrete roadmap I would recommend

### Phase 0. Repo professionalism

Goal: make the repository look credible in 1 week.

- replace the default README
- add `.env.example`
- add `CONTRIBUTING.md`
- add `typecheck`, `test`, `test:e2e` scripts
- add GitHub Actions CI
- add migrations folder / DB docs
- fix lint warnings and encoding issues

### Phase 1. Architecture refactor

Goal: make the app easier to grow.

- move Supabase utilities into `src/lib/supabase/`
- introduce `features/` folders
- create `queries.ts` and `actions.ts` per feature
- move browser-side mutations to server actions where appropriate
- add Zod validation
- make routes thinner

### Phase 2. Core product maturity

Goal: make CampusLift feel like a real SaaS/product.

- draft/published/archived project states
- better dashboard
- proper comments
- better search/filter/sort
- role-based access for admin/user

### Phase 3. High-value integrations

Goal: add strong enterprise signals.

- Stripe Checkout session
- Stripe webhook route
- donation history
- S3 image upload with presigned URLs
- in-app notifications

### Phase 4. Polish and credibility

Goal: show operational maturity.

- Playwright tests for main flows
- observability basics
- error handling strategy
- loading/error states
- admin moderation tooling

## 11. Skills you should learn to support this project

Focus on these, in this order:

1. Next.js App Router deeply
   Server Components, Server Actions, Route Handlers, caching, revalidation

2. Database design
   foreign keys, indexes, uniqueness, transactions, race conditions

3. Supabase security
   RLS, policies, storage policies, auth flow, server vs browser boundaries

4. Testing
   Vitest, RTL, Playwright, mocking strategy

5. Payments
   Stripe Checkout, webhooks, idempotency, reconciliation

6. Cloud storage
   S3 buckets, IAM, presigned URLs, object lifecycle

7. Git/GitHub
   branches, PRs, reviews, CI, issue templates

8. Observability
   logs, traces, error monitoring, basic metrics

## 12. My final recommendation for CampusLift

If the goal is "be valued by companies" and "touch a lot without getting lost", do not chase every shiny feature at once.

The best version of this project is:

- a well-structured full-stack crowdfunding/community product
- with strong auth
- a clean data model
- comments
- dashboard
- Stripe
- S3
- tests
- docs
- CI

That is already strong enough for internship and junior full-stack conversations.

The project does not need to become "AWS everywhere" to be taken seriously.

It needs to become:

- more structured
- more testable
- more server-driven for important mutations
- better documented

## 13. Practical next move

If I were sequencing the work from here, I would do these in order:

1. Rewrite the README and add repo hygiene files.
2. Introduce a `features/` structure plus server actions.
3. Refactor donations so the amount update is atomic and server-side.
4. Add tests and CI.
5. Add Stripe.
6. Add S3.
7. Add comments and notifications.

That path is much more valuable than adding AI first.

## Sources

Official sources used for this report:

- Next.js project structure and colocation: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js route handlers: https://nextjs.org/docs/15/app/getting-started/route-handlers-and-middleware
- Next.js updating data / server actions: https://nextjs.org/docs/app/getting-started/updating-data
- Next.js testing with Vitest: https://nextjs.org/docs/14/app/building-your-application/testing/vitest
- Next.js testing with Playwright: https://nextjs.org/docs/14/app/building-your-application/testing/playwright
- Next.js OpenTelemetry instrumentation: https://nextjs.org/docs/app/guides/open-telemetry
- GitHub on README files: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub on healthy contribution setup: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions
- GitHub Actions for Node.js CI: https://docs.github.com/en/actions/how-tos/writing-workflows/building-and-testing/building-and-testing-nodejs
- Supabase SSR client setup for Next.js: https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage access control: https://supabase.com/docs/guides/storage/security/access-control
- Supabase Storage S3 compatibility: https://supabase.com/docs/guides/storage/s3/compatibility
- Stripe Checkout Sessions: https://docs.stripe.com/api/checkout/sessions
- Stripe webhook verification: https://docs.stripe.com/webhooks/signature
- Stripe webhook endpoint behavior: https://docs.stripe.com/webhooks/test
- Amazon S3 overview: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html
