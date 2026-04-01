# Testing Notes

Date: 2026-03-29

## Current Checks

Repository-level checks:

- `npm run lint`
- `npm run test`
- `npm run typecheck`
- `npm run check`

## Current Automated Coverage

The repository now includes a first Vitest layer for feature validation helpers:

- `vitest.config.mjs`
- `src/features/donations/schemas.test.ts`
- `src/features/projects/schemas.test.ts`
- `src/features/comments/schemas.test.ts`
- `src/features/profiles/schemas.test.ts`

These tests cover the most visible input validation rules before moving on to component and end-to-end coverage.

## Manual Smoke Test Flows

The most important manual checks right now are:

1. Auth
   Sign up, log in, log out, profile update.
2. Projects
   Create a project, view it, favorite/unfavorite it, confirm dashboard updates.
3. Stripe
   Start Checkout, complete test payment, confirm webhook processing and donation history updates.
4. Comments
   Post a root comment, reply, like/dislike, delete, report.
5. Moderation
   Report a comment from one account, review it from an admin account, resolve/dismiss/delete it.

## Gaps

The project still needs:

- component tests
- E2E coverage for critical flows
- documented deployment verification steps

Until those are added, every meaningful feature PR should include manual verification notes.
