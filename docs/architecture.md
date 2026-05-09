# CampusLift Architecture

Date: 2026-03-29

## Current State

CampusLift now uses a feature-oriented Next.js App Router structure with server-first mutations and versioned database changes.

```text
src/
  app/          routes, layouts, route handlers, loading and error boundaries
  components/   reusable UI and route-level presentation
  features/     feature-owned actions, queries, schemas, and business logic
  lib/          Supabase and Stripe infrastructure helpers
  types/        shared application and database types
docs/           architecture, database, deployment, testing, roadmap
supabase/       migrations and local seed
```

## Architectural Rules

### 1. Thin routes

Files inside `src/app` should mostly:

- read params
- call feature queries or actions
- compose page-level UI

Business rules should stay in `src/features/*`.

### 2. Server-first mutations

Sensitive writes should happen on the server through:

- Route Handlers for API-style mutations and integrations
- server-side Supabase clients
- SQL RPC helpers when atomic updates matter

Current examples:

- project creation
- favorite toggles
- profile updates
- support flows
- Stripe webhook handling
- comment moderation actions

### 3. Feature ownership

Each feature owns:

- `queries.ts` for reads
- `actions.ts` for writes
- `schemas.ts` for input validation helpers

Current feature areas:

- `auth`
- `projects`
- `profiles`
- `donations`
- `comments`
- `moderation`

### 4. Validation at the boundary

Validation should stay close to the feature boundary rather than inside page components.

Current approach:

- lightweight validation helpers in `schemas.ts`
- server-side validation before writes
- small unit tests on validation rules

Future option:

- adopt Zod later if the validation layer becomes large enough to justify the extra dependency

### 5. Database as code

The repository should describe database behavior as explicitly as possible.

Current pieces already versioned:

- feature migrations in `supabase/migrations/`
- local seed data in `supabase/seed.sql`
- typed public schema snapshot in `src/types/database.ts`

Current limitation:

- the repository still does not version the full historical baseline schema that existed before this cleanup phase

## Infrastructure Boundaries

### Supabase

Used for:

- auth
- Postgres data
- storage
- RLS-backed data access

Client split:

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`

### Stripe

Used for:

- Checkout session creation
- webhook verification
- idempotent payment recording

Main server entry points:

- checkout route handlers
- webhook route handler
- donation actions and SQL RPC helpers

## Current Hardening Priorities

The next technical improvements with the best payoff are:

1. replace the current in-memory rate limiting with a shared external store for multi-instance deployment
2. project publication states such as `draft`, `published`, and `archived`
3. broader automated coverage beyond schema tests
4. staging deployment validation before the UI refactor
5. centralized deployment monitoring and operational visibility

## Current Environment Validation

Runtime environment access is now centralized through:

- `src/lib/env.ts`
- `src/lib/server-env.ts`

This keeps missing or invalid environment variables from surfacing as scattered runtime failures across multiple features.

## Current Rate Limiting

Write-heavy API routes now use a lightweight in-memory rate limiter keyed by client IP.

That is good enough for:

- local development
- portfolio review
- single-instance staging

It is not the final production architecture for horizontally scaled deployment. The next step at that level would be moving the same policy layer to a shared store such as Redis or Upstash.
