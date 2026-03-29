# Release Checklist

Date: 2026-03-29

This checklist is the recommended path for CampusLift before the UI refactor and before wider GitHub sharing.

## Recommended Order

1. push the current cleaned-up repository state
2. deploy a staging or preview environment from that stable state
3. validate auth, Stripe, comments, and moderation outside localhost
4. start the UI refactor in a separate branch
5. merge the UI refactor only after the staging flow stays stable

This order keeps infrastructure, product logic, and visual redesign from being mixed into one hard-to-review wave.

## Pre-Push Checklist

- confirm `.env.local` is not tracked
- confirm no secrets appear in tracked files
- confirm all required SQL files are committed from `supabase/migrations/`
- confirm `supabase/seed.sql` still reflects the current local development flow
- confirm `README.md` matches the real feature set
- confirm `docs/database.md` and `supabase/README.md` match the current schema and workflow
- confirm `docs/product-roadmap.md` reflects the current priorities
- run `npm run lint`
- run `npm run test`
- run `npm run typecheck`
- review `git status` and remove accidental edits

## Manual Smoke Test Before Push

- sign up or log in
- create a project
- update a profile
- add and remove a favorite
- complete a Stripe test payment
- add a comment and a reply
- react to a comment
- report a comment
- resolve or dismiss a report as admin

## Branching Recommendation

- keep the current clean state on the main working branch
- create a dedicated branch for the UI refactor
- keep deployment fixes and UI redesign separate when possible

Example branch names:

- `refactor/ui-foundation`
- `feat/notifications`
- `docs/deployment-guide`

## Before Opening the Repository Publicly

- replace any placeholder setup text that is still too internal
- make sure screenshots, demo notes, and feature descriptions are accurate
- ensure Stripe uses test mode only unless production billing is intentionally enabled
- ensure admin setup instructions are explicit
- ensure the deployment guide is accurate for the chosen host
