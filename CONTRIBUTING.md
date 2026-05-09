# Contributing

## Purpose

This repository is being used as both:

- a real product build
- a learning project for stronger full-stack engineering practices

Contributions should improve both product quality and repository quality.

## Setup

1. Copy `.env.example` to `.env.local`
2. Install dependencies with `npm install`
3. Run the app with `npm run dev`

## Branching

- use short, focused branches
- keep one concern per pull request
- avoid mixing refactor, feature work, and cleanup unless they are tightly related

Suggested branch names:

- `feat/stripe-checkout`
- `refactor/project-actions`
- `docs/readme-refresh`
- `fix/profile-upload`

## Quality Checks

Before opening a pull request, run:

```bash
npm run lint
npm run typecheck
```

If the change affects user-critical flows, also verify them manually in the browser.

## Coding Guidelines

- keep routes thin and move reusable logic out of page files
- prefer server-side mutations for sensitive business actions
- validate inputs at the boundary
- keep components focused on UI concerns when possible
- avoid large mixed-purpose files
- use TypeScript types intentionally, not as decoration

## Documentation Expectations

When a change affects setup, architecture, or workflow, update the relevant documentation:

- `README.md`
- `docs/architecture.md`
- `docs/database.md`
- `docs/deployment.md`
- `docs/release-checklist.md`
- `docs/testing.md`
- `docs/product-roadmap.md`
- `supabase/README.md`

## Pull Request Checklist

- the change has a clear purpose
- lint passes
- typecheck passes
- documentation is updated when needed
- the change does not introduce unrelated edits
- manual verification steps are described in the PR
