# Deployment

Date: 2026-03-29

This project should be deployed in two steps:

1. staging or preview first
2. production later

Do not wait until the very end of the project to integrate deployment. For CampusLift, the right moment is now that the core flows work and the repository cleanup is in progress.

## Recommended Timing

Deploy a staging version before the UI refactor.

Why:

- it validates environment variables early
- it validates Supabase auth outside localhost
- it validates Stripe webhook handling on a real URL
- it keeps future UI work separate from infrastructure debugging

## Environment Strategy

Use three environments:

1. local
   for day-to-day development
2. staging or preview
   for real deployment validation and branch-based review
3. production
   only after staging is stable and the public-facing polish is ready

## Deployment Readiness Checklist

Before creating a staging deployment:

- the repository is pushed to GitHub
- `npm run lint` passes
- `npm run typecheck` passes
- the latest SQL files are committed
- `.env.example` is up to date
- `README.md` and setup docs are current

## Required Environment Variables

Set these in the deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Optional:

- `NEXT_PUBLIC_APP_URL`
- `STRIPE_CURRENCY`

For deployed environments, `NEXT_PUBLIC_APP_URL` should match the deployed base URL.

## External Configuration To Update

After the app is deployed on a real URL, also update the external services:

### Supabase

- confirm the deployed URL is allowed by your auth configuration
- confirm any redirect URLs used by the app point to the deployed environment

### Stripe

- create or update the webhook endpoint for the deployed environment
- use the deployed webhook secret, not the local CLI secret
- keep test mode enabled for staging

## Staging Smoke Test

After the first staging deployment, verify:

- log in works
- sign up works
- project creation works
- favorites update correctly
- Stripe Checkout redirects correctly
- Stripe webhook records the payment
- comments can be created
- comment reactions work
- comment reports work
- admin moderation works

## Recommended Workflow After Staging

1. push the current clean repository state
2. deploy staging
3. fix environment or deployment-specific issues
4. start the UI refactor in a separate branch
5. use preview deployments during the refactor
6. deploy production only after the refactor is stable and documented

## Production Gate

Do not call the project production-ready until:

- staging has passed the smoke tests
- Stripe production keys are intentionally configured, if needed
- documentation matches the real setup
- the UI refactor is merged
- the repository is presentable for recruiters or collaborators
