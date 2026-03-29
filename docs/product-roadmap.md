# CampusLift Product Roadmap

Date: 2026-03-29

## Completed Foundation

- [x] Replace the default README
- [x] Add `CONTRIBUTING.md`
- [x] Add `.env.example`
- [x] Add a baseline GitHub Actions CI workflow
- [x] Add an architecture document
- [x] Add an engineering assessment report
- [x] Stabilize lint / typecheck commands
- [x] Move critical reads and writes into feature modules

## Completed Architecture Work

- [x] Introduce `src/features/`
- [x] Create `queries.ts` and `actions.ts` modules
- [x] Add API routes for critical mutations
- [x] Move project creation to a server-side flow
- [x] Move profile updates to a server-side flow
- [x] Move favorite toggles to a server-side flow
- [x] Move project support to a server-side flow
- [x] Add validation at feature boundaries
- [ ] Move the remaining auth flows to a more explicit server-aware design

## Completed Product Work

- [x] Stripe Checkout
- [x] Stripe webhook handling
- [x] Donation history and reconciliation
- [x] Threaded comments
- [x] Comment likes / dislikes
- [x] Comment reports
- [x] Admin moderation dashboard
- [x] Explicit roles (`user`, `admin`)

## Cleanup and Repo Quality

- [ ] Align all SQL migrations with the live Supabase schema
- [ ] Add generated Supabase types
- [ ] Add seed data for local development
- [ ] Finish removing dead wrapper files and unused helpers
- [ ] Add deployment documentation
- [ ] Expand testing documentation and root setup guidance

## UI and Product Polish

- [ ] Refine the visual identity and page hierarchy
- [ ] Improve landing page personality
- [ ] Improve explore, project, profile, dashboard, and admin UI consistency
- [ ] Add stronger empty states and loading states
- [ ] Add project edit and delete flows
- [ ] Add draft / published / archived project states
- [ ] Add search, filters, and backend pagination
- [ ] Add better creator dashboard analytics

## Next Feature Wave

- [ ] Notifications
- [ ] In-app notification center
- [ ] Realtime updates for comments and support events
- [ ] Trending logic
- [ ] AWS S3 uploads with presigned URLs
- [ ] Add Vitest
- [ ] Add React Testing Library
- [ ] Add Playwright
- [ ] Add monitoring/logging basics
