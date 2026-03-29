# Testing Notes

Date: 2026-03-29

## Current Checks

Repository-level checks:

- `npm run lint`
- `npm run typecheck`
- `npm run check`

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

- automated unit tests
- component tests
- E2E coverage for critical flows
- documented deployment verification steps

Until those are added, every meaningful feature PR should include manual verification notes.
