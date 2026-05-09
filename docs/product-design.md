# Product Design

Date: 2026-04-13

## Problem Statement

University students regularly need small amounts of funding for campus initiatives — club events, prototypes, community gardens, art installations — but existing crowdfunding platforms (GoFundMe, Kickstarter) are designed for larger-scale campaigns and feel disconnected from campus life. Students end up passing around spreadsheets or collecting cash informally, with no visibility, no accountability, and no community around the process.

CampusLift fills this gap: a lightweight, campus-scoped crowdfunding platform where students can publish project ideas, receive micro-pledges from their peers, and build a public track record of community support.

## Target Users

### Persona 1 — Maya, the Student Creator

| Attribute | Detail |
|-----------|--------|
| Age | 21 |
| Role | 3rd-year Environmental Science student |
| Goal | Raise $950 to expand the campus community garden with new raised beds |
| Frustration | GoFundMe feels too "serious" for a campus project and takes a cut she can't afford |
| Tech comfort | Uses Instagram daily, comfortable with web forms, never used a dev tool |
| What she needs | A simple way to describe her project, share the link in her WhatsApp group, and track who pledged |

**Key behaviors**: creates one project per semester, checks her dashboard weekly, shares the project link on social media, values seeing supporter names.

### Persona 2 — Alex, the Casual Supporter

| Attribute | Detail |
|-----------|--------|
| Age | 19 |
| Role | 1st-year Computer Science student |
| Goal | Support 2-3 projects that interest him each semester with $5-15 pledges |
| Frustration | Doesn't want to create an account just to browse, but willing to sign up to actually pay |
| Tech comfort | Very high — builds side projects, uses GitHub |
| What he needs | A fast explore page, clear project descriptions, a quick Stripe checkout, and a way to see his donation history |

**Key behaviors**: browses explore page, filters by category, reads project descriptions, pledges via Stripe, occasionally leaves a comment.

### Persona 3 — Dr. Lavoie, the Faculty Moderator

| Attribute | Detail |
|-----------|--------|
| Age | 45 |
| Role | Student Life coordinator, granted admin access |
| Goal | Ensure no inappropriate content, resolve reported comments, maintain platform trust |
| Frustration | Doesn't have time to check every project — needs a queue-based moderation workflow |
| Tech comfort | Moderate — uses university admin tools daily, not a developer |
| What she needs | A clean moderation dashboard with open/resolved/dismissed states, one-click actions |

**Key behaviors**: checks the moderation dashboard 2-3 times per week, resolves reports in batches, occasionally deletes abusive comments.

## User Journeys

### Journey 1 — Creating and Funding a Project

```
Maya signs up → creates profile → clicks "Start a project"
→ fills title, description, category, goal, deadline, image
→ saves as draft → reviews → publishes
→ shares link on WhatsApp/Instagram
→ receives Stripe payments → sees real-time counter update
→ gets email + in-app notification per supporter
→ checks dashboard for stats and payment history
```

### Journey 2 — Discovering and Supporting a Project

```
Alex visits campuslift.vercel.app → browses explore page
→ filters by "Tech" category → searches "robotics"
→ clicks a project card → reads description
→ clicks "Support this project" → enters $10
→ redirected to Stripe Checkout → pays
→ redirected back to success page
→ sees his pledge in the project's supporters list
→ leaves a comment → gets a reply notification
```

### Journey 3 — Moderating Content

```
Dr. Lavoie logs in → clicks "Admin" in navbar
→ sees moderation dashboard with 3 open reports
→ reads the reported comment and reporter's reason
→ clicks "Resolve" on a valid report
→ clicks "Dismiss" on a false positive
→ clicks "Delete comment" on an abusive one
→ checks resolved queue to confirm actions
```

## Design Decisions

### Why Supabase over a custom backend?

For a student project, Supabase provides auth, Postgres, storage, RLS, and realtime out of the box. Building a custom Express/NestJS backend would add weeks of work for auth middleware, file uploads, and websockets — without adding portfolio value. The RLS layer demonstrates security thinking directly in SQL, which is arguably more impressive than a middleware-based approach.

### Why Stripe Checkout over a custom payment form?

PCI compliance. Handling card data directly would require SAQ-A compliance, tokenization, and liability. Stripe Checkout handles all of this, and the webhook-based architecture (create session → redirect → receive webhook → record atomically) demonstrates a mature integration pattern.

### Why server-side mutations over client-side Supabase calls?

Moving sensitive writes to Route Handlers means: rate limiting at the edge, input validation before database contact, consistent error handling via `ActionResult<T>`, and a clear boundary between UI and business logic. This is the pattern companies use.

### Why in-memory rate limiting?

For a single-instance Vercel deployment, in-memory rate limiting is sufficient and zero-dependency. The architecture is designed so the rate limiter can be swapped to Redis/Upstash when horizontal scaling is needed, without changing the API surface.

### Why feature-oriented structure over route-oriented?

Grouping by feature (`features/projects/`, `features/comments/`) instead of by layer (`controllers/`, `services/`, `models/`) keeps related code together and makes the codebase navigable. Each feature owns its actions, queries, schemas, and tests — reducing cross-cutting dependencies.
