# Database Notes

Date: 2026-03-29

## Purpose

This file documents the current Supabase-side responsibilities that matter for local development and repository maintenance.

## Migration Inventory

Current versioned migrations:

1. `20260326_support_project_rpc.sql`
   Atomic legacy support RPC for the direct support flow.
2. `20260326_record_stripe_support.sql`
   Stripe support recording, idempotency fields on `pledges`, and webhook-safe support recording.
3. `20260327_comments.sql`
   Base comment threads and RLS.
4. `20260327_comment_reactions.sql`
   Like / dislike reactions on comments.
5. `20260329_comments_hard_delete.sql`
   Hard delete policy for comments.
6. `20260329_comment_reports.sql`
   User reports for comment moderation.
7. `20260329_profile_roles.sql`
   `profiles.role` with `user` / `admin`.

## Core Tables

The application currently depends on these main public tables:

- `profiles`
  Public user profile data plus the `role` field used for admin access.
- `projects`
  Main crowdfunding entities shown in explore, dashboard, profile, and detail pages.
- `favorites`
  User-to-project saved project relationship.
- `pledges`
  Legacy supports and Stripe-backed supports, including idempotency fields.
- `comments`
  Project discussion threads with optional `parent_id` for replies.
- `comment_reactions`
  One reaction per user per comment for like / dislike state.
- `comment_reports`
  Moderation reports for comment review and admin actions.

## RPC Functions

Current versioned SQL functions:

- `support_project`
  Atomic non-Stripe support flow that inserts a pledge and updates project totals.
- `record_stripe_support`
  Stripe webhook-safe support recording with idempotency by checkout session id.

## Typed Schema Snapshot

- `src/types/database.ts` contains the current TypeScript snapshot of the Supabase public schema used by the app.
- When the remote schema changes, update the SQL first, then realign `src/types/database.ts`.
- The goal is to keep the repository self-describing even before a full CLI-based type generation workflow is added.

## Important Notes

- The repository migrations should always match the real state of the Supabase project.
- If a migration is adjusted manually in Supabase during debugging, the versioned SQL must be updated afterward.
- Stripe webhook handling and admin moderation both rely on `SUPABASE_SERVICE_ROLE_KEY` server-side.

## Seed Strategy

- `supabase/seed.sql` is a local-development helper, not a production migration.
- It is safe to re-run and currently does two things:
  1. syncs `profiles` from existing `auth.users`
  2. creates one demo project if the database has profiles but no projects yet
- The seed does not create auth users. Create at least one user first through the app or Supabase Auth tooling.

## Admin Setup

To access `/admin/moderation`, promote a profile manually:

```sql
update public.profiles
set role = 'admin'
where username = 'your_username';
```

After changing the role, log out and back in so the app reloads the current profile state.

## Recommended Next Cleanup

- export and version the pre-existing baseline schema that still lives only in the remote project
- move from a manual type snapshot to a repeatable Supabase type-generation workflow
- version any remaining RLS policies that still live only in the remote project
