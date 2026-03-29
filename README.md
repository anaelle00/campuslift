# CampusLift

CampusLift is a student-focused crowdfunding platform where creators can publish projects, build a public profile, receive community support, and interact through threaded discussions.

The repository is used both as:

- a real full-stack product build
- a portfolio project aimed at stronger company-style engineering quality

## Current Product Scope

CampusLift currently includes:

- Supabase authentication
- public project listing and project detail pages
- project creation with image upload
- favorites / saved projects
- user profiles
- a creator dashboard
- Stripe Checkout with webhook-based support recording
- donation history in the dashboard and profile
- threaded comments with replies
- comment likes / dislikes
- comment reports
- an admin moderation dashboard

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Stripe Checkout

## Repository Structure

```text
src/
  app/          routes, layouts, pages, route handlers
  components/   reusable UI and page sections
  features/     feature-oriented server logic and queries
  lib/          framework and infrastructure helpers
  types/        shared TypeScript types
docs/           architecture, roadmap, database, testing
supabase/       SQL migrations
```

See [architecture.md](docs/architecture.md) for the architecture direction.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- a Supabase project
- a Stripe account for payment testing

### Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Optional:

- `STRIPE_CURRENCY` defaults to `cad`
- `NEXT_PUBLIC_APP_URL` can override the URL used in Stripe redirects

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Apply the SQL migrations in `supabase/migrations/`.

3. Create at least one account in the app, then optionally run `supabase/seed.sql`
   to sync `profiles` from `auth.users` and create one demo project locally.

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`

6. If you want admin moderation access, promote a profile manually:

```sql
update public.profiles
set role = 'admin'
where username = 'your_username';
```

7. If you want to test Stripe locally, forward webhooks to the Next.js route:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Then copy the webhook signing secret printed by Stripe into
`STRIPE_WEBHOOK_SECRET`.

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run lint` runs ESLint
- `npm run test` runs Vitest unit tests
- `npm run test:watch` runs Vitest in watch mode
- `npm run typegen` generates Next.js route types
- `npm run typecheck` generates Next.js types and runs TypeScript checks
- `npm run check` runs lint, typecheck, and unit tests together

## Key Documentation

- [architecture.md](docs/architecture.md)
- [database.md](docs/database.md)
- [deployment.md](docs/deployment.md)
- [release-checklist.md](docs/release-checklist.md)
- [testing.md](docs/testing.md)
- [product-roadmap.md](docs/product-roadmap.md)
- [enterprise-project-report.md](docs/enterprise-project-report.md)
- [supabase/README.md](supabase/README.md)

## Current Priorities

1. deploy a staging version and validate external integrations
2. UI refinement and stronger visual identity
3. server-side filtering, pagination, and route hardening
4. project states and richer creator workflows
5. notifications, search, and S3 uploads

## Status

CampusLift is an active in-progress product. The core flows work, the repository is now feature-oriented, and the next phase is cleanup, UI improvement, and stronger repo polish before another large feature wave.
