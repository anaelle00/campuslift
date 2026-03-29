# CampusLift Architecture

Date: 2026-03-26

## Current State

CampusLift currently uses a straightforward Next.js App Router structure:

```text
src/
  app/
  components/
  lib/
  types/
```

This is enough for an MVP, but it becomes harder to maintain as business rules grow. The current pain points are:

- route files performing direct data fetching
- client components handling sensitive mutations
- business logic mixed with UI code
- no clear feature boundary for auth, projects, profiles, donations, or comments

## Target State

The next structural step is a feature-oriented layout:

```text
src/
  app/
    (marketing)/
    (app)/
    api/
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
    profiles/
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
  lib/
    supabase/
      client.ts
      server.ts
      admin.ts
    env.ts
    utils.ts
  types/
```

## Architectural Rules

### 1. Thin routes

Files inside `src/app` should mostly:

- read params
- call feature queries or actions
- compose UI

### 2. Server-first mutations

Sensitive writes should move away from direct browser-side database updates.

Examples:

- donations
- project creation
- favorite toggles
- profile updates
- future Stripe flows

Preferred mechanisms:

- Server Actions for app-internal writes
- Route Handlers for webhooks and external integrations

### 3. Feature ownership

Each feature should own:

- its data reads
- its mutations
- its validation schemas
- its feature-specific components

### 4. Validation at the boundary

Validation should be centralized per feature rather than spread across form handlers.

Planned approach:

- Zod schemas in `schemas.ts`
- server-side validation before writes

### 5. Database as code

Schema, policies, and SQL helpers should eventually be versioned in the repository.

Target additions:

- `supabase/migrations/`
- seed data for local development
- documented RLS policies

## Near-Term Refactor Plan

1. Add repository hygiene files and CI
2. Introduce `features/` folders without moving every file at once
3. Extract project reads into `features/projects/queries.ts`
4. Move critical writes into server actions
5. Refactor donations to an atomic server-side flow
