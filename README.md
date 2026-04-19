# CampusLift

CampusLift is a student-focused crowdfunding platform where creators can publish projects, build a public profile, receive community support, and interact through threaded discussions.

The repository is used both as:

- a real full-stack product build
- a portfolio project aimed at stronger company-style engineering quality

## Current Product Scope

CampusLift currently includes:

- Supabase authentication (sign up, login, logout)
- public project listing with search, category filters, and pagination
- project detail pages with live funding counter (Supabase Realtime)
- project creation with image upload and draft/published/archived status
- project deletion with confirmation
- favorites / saved projects
- user profiles with donation history
- a creator dashboard with project status management
- Stripe Checkout with webhook-based support recording
- in-app notification system with real-time bell (Supabase Realtime)
- email notifications via Resend when a project receives a new supporter
- threaded comments with replies
- comment likes / dislikes
- comment reports
- an admin moderation dashboard
- dark mode via next-themes
- mobile-responsive navbar with hamburger menu
- footer with navigation links
- custom 404 page

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4 + shadcn/ui
- Supabase Auth + Postgres + Storage + Realtime
- Stripe Checkout + webhooks
- Resend (email notifications)
- Vitest (unit and component tests)
- Playwright (E2E tests)

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
e2e/            Playwright end-to-end tests
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
- `RESEND_API_KEY` enables email notifications

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Apply the SQL migrations in `supabase/migrations/` via the Supabase SQL Editor or CLI.

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

Then copy the webhook signing secret printed by Stripe into `STRIPE_WEBHOOK_SECRET`.

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run lint` runs ESLint
- `npm run test` runs Vitest unit and component tests
- `npm run test:watch` runs Vitest in watch mode
- `npm run test:e2e` runs Playwright end-to-end tests
- `npm run typecheck` generates Next.js types and runs TypeScript checks
- `npm run check` runs lint, typecheck, and unit tests together

### Running E2E tests

Create a `.env.test.local` file at the root with credentials for a test account:

```
E2E_USER_EMAIL=your-test-account@example.com
E2E_USER_PASSWORD=your-password
```

Then run:

```bash
npm run test:e2e
```

Playwright will start the dev server automatically.

## Key Documentation

- [architecture.md](docs/architecture.md)
- [database.md](docs/database.md)
- [deployment.md](docs/deployment.md)
- [testing.md](docs/testing.md)
- [product-roadmap.md](docs/product-roadmap.md)

## Status

CampusLift is an active in-progress product. Core flows are fully functional: authentication, project lifecycle (draft → published → archived), Stripe payments, real-time notifications, threaded comments, and admin moderation. The codebase follows server-first Next.js patterns with RLS-secured Supabase queries throughout.
