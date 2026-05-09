# Supabase Folder

This folder contains the repository-owned Supabase assets for CampusLift.

## Structure

- `migrations/`
  Versioned SQL changes that must stay aligned with the real remote database.
- `seed.sql`
  Local-only helper seed that is safe to re-run during development.

## Current Convention

- apply migrations first
- create at least one auth user
- run `seed.sql` only for local development convenience
- if a SQL fix is applied manually in Supabase, copy that fix back into the versioned migration file

## Current Gap

The repository currently versions the project-specific changes added during this build, but not yet the full baseline schema that existed before the cleanup phase.

That means the repo is much clearer than before, but not fully self-hosting yet. The next database cleanup step should be exporting and versioning the missing baseline schema and any remaining remote-only policies or triggers.

## Types

The app uses the schema snapshot in `src/types/database.ts`.

When a table, column, enum, or function changes:

1. update the SQL
2. update `src/types/database.ts`
3. run `npm run typecheck`
