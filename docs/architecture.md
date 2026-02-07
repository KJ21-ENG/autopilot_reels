# Architecture

## Executive Summary

Project context confirmed: 6 epics, 20 stories, payment‑first funnel (landing → Stripe checkout → post‑payment auth → protected dashboard). UX is low complexity, responsive, and pixel‑close to the reference, with `frontend/` as the source of truth. Key NFRs: fast LCP/redirects, Stripe‑hosted security, secure Supabase auth/session handling, and baseline WCAG 2.1 AA.

## Project Initialization

Starter template: **None**. We will **use the existing `frontend/` app as the foundation** and not re‑initialize with a starter.

Notes:

- `create-next-app@latest` is the standard Next.js initializer, but is not used here because the UI is already implemented.
- Repo uses Next.js 16.1.6 (see `frontend/package.json`).
- Node.js LTS is v24.13.0 (Active LTS line) as of 2026‑02‑03. Ensure Vercel runtime is set to Node 24.x.

## Cross-Cutting Decisions

- Error handling: JSON error responses with `{ error: { code, message } }`; user-facing errors are concise and non-technical.
- Logging approach: Basic logs only via `console` (no structured logging).
- Date/time handling: UTC only; store and transmit ISO-8601 strings.
- Authentication pattern: Supabase session cookies; protected routes verify session + paid linkage.
- API response format: `{ data, error }` envelope for all internal API responses.
- Testing strategy: Lightweight unit tests for key utilities + integration tests for checkout/auth/webhook flows; no E2E for MVP.

## Decision Summary

| Category    | Decision                                | Version                          | Affects Epics | Rationale                           |
| ----------- | --------------------------------------- | -------------------------------- | ------------- | ----------------------------------- |
| Framework   | Next.js App Router                      | 16.1.6                           | 1,3,4,5,6     | Existing `frontend/` implementation |
| Language    | TypeScript                              | 5.x                              | 1–6           | Existing repo standard              |
| Styling     | Tailwind CSS                            | 4.1.12                           | 1–3           | Existing repo standard              |
| Payments    | Stripe Checkout + `stripe` SDK          | 20.1.0 / API `2025-12-15.clover` | 3,4,6         | Payment‑first MVP                   |
| Auth        | Supabase Auth + `@supabase/supabase-js` | 2.94.0                           | 4,5           | Post‑payment auth                   |
| Data        | Supabase Postgres                       | Managed                          | 3–6           | Minimal ops                         |
| API Pattern | Next.js Route Handlers                  | 16.1.6                           | 3,4,6         | Same app API                        |
| Analytics   | Supabase `events` table (DB‑backed)     | N/A                              | 1,6           | MVP speed + queryable funnel counts |
| Admin       | Embedded admin views in main app        | N/A                              | 6             | Reduce deployment/auth complexity   |
| Logging     | Basic `console` logs                    | N/A                              | 1,3–6         | MVP scope                           |

## Project Structure

```
autopilotreels/
  frontend/
    app/
      (marketing)/
        page.tsx
      checkout/
        page.tsx
        success/page.tsx
        cancel/page.tsx
      auth/
        page.tsx
      dashboard/
        page.tsx
      admin/
        page.tsx
      api/
        stripe/checkout/route.ts
        stripe/webhook/route.ts
        auth/link-payment/route.ts
        analytics/event/route.ts
    components/
    lib/
      supabase/
        client.ts
        server.ts
      stripe/
        client.ts
        server.ts
      analytics/
        events.ts
        emit.ts
      auth/
        guards.ts
    styles/
    public/
    middleware.ts
  docs/
  .env.example
  README.md
```

## Epic to Architecture Mapping

| Epic                          | Architecture Components                                                   |
| ----------------------------- | ------------------------------------------------------------------------- |
| Epic 1: Foundation & Delivery | `frontend/`, `middleware.ts`, `lib/`, `.env.example`, deploy config       |
| Epic 2: Marketing (Completed) | `frontend/app/(marketing)`, `components/`, `styles/`                      |
| Epic 3: Stripe Checkout       | `frontend/app/api/stripe/*`, `lib/stripe/*`, `checkout/*`                 |
| Epic 4: Auth & Linking        | `frontend/app/auth`, `frontend/app/api/auth/*`, `lib/supabase/*`          |
| Epic 5: Dashboard             | `frontend/app/dashboard`, `lib/auth/guards.ts`                            |
| Epic 6: Analytics & Admin     | `frontend/app/api/analytics/*`, `lib/analytics/*`, `frontend/app/admin/*` |

## Technology Stack Details

### Core Technologies

- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5.x
- Tailwind CSS 4.1.12
- Supabase (Postgres + Auth) + `@supabase/supabase-js` 2.94.0
- Stripe Checkout + `stripe` SDK 20.1.0 (API `2025-12-15.clover`)

### Integration Points

- Stripe webhook handling via Next.js route handler
- Supabase Auth via `@supabase/supabase-js`
- Internal analytics via app API route

## Novel Pattern Designs

None required. All patterns in this project have established solutions.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Patterns

- API routes: `/api/{domain}/{action}` (e.g., `/api/stripe/checkout`)
- Route parameters: `:id` in server code; `[id]` in Next.js route segments
- Database tables: `snake_case` plural (e.g., `payments`, `user_profiles`)
- Database columns: `snake_case` (e.g., `user_id`, `stripe_session_id`)
- React components: `PascalCase` (e.g., `PricingCard`)
- File names: `kebab-case` for non-React utilities, `PascalCase.tsx` for components

### Structure Patterns

- App Router pages live in `frontend/app/**`
- API route handlers live in `frontend/app/api/**/route.ts`
- Shared utilities in `frontend/lib/**`
- UI components in `frontend/components/**`
- Tests co-located as `*.test.ts` next to source

### Format Patterns

- API responses: `{ data, error }` envelope
- Errors: `{ error: { code, message } }`
- Dates: ISO-8601 UTC strings

### Communication Patterns

- Frontend → API: `fetch` with JSON body
- Webhooks: Stripe → `/api/stripe/webhook` only
- Auth linkage: POST `/api/auth/link-payment`

### Lifecycle Patterns

- Loading states: render skeleton or inline spinner
- Error recovery: display inline error + retry button
- Retries: only for idempotent server actions

### Location Patterns

- Env vars: `.env.local`; documented in `.env.example`
- Static assets: `frontend/public/**`
- Docs: `docs/**`

### Consistency Patterns

- User-facing errors are short, actionable, non-technical
- Logging uses `console.info|warn|error` only

## Consistency Rules

### Naming Conventions

- API routes: `/api/{domain}/{action}`
- DB tables: `snake_case` plural
- Components: `PascalCase`
- Files: `kebab-case` (utils), `PascalCase.tsx` (components)

### Code Organization

- `frontend/app/**` for routes
- `frontend/app/api/**/route.ts` for API
- `frontend/lib/**` for shared utilities
- `frontend/components/**` for UI

### Error Handling

All API errors use `{ error: { code, message } }`. User-facing messages are concise and non-technical.

### Logging Strategy

Basic `console` logs only (info/warn/error).

## Data Architecture

Primary tables:

- `payments`: `id`, `stripe_session_id`, `stripe_customer_id`, `email`, `price_id`, `amount`, `currency`, `status`, `created_at`
- `users` (Supabase Auth)
- `user_payment_links`: `id`, `user_id`, `payment_id`, `linked_at`
- `events`: `id`, `event_name`, `user_id`, `session_id`, `metadata`, `created_at`

### Payment Linkage Expectations

- Payments are stored first via Stripe webhooks in the `payments` table using `stripe_session_id` as the stable lookup key.
- User linkage is created later by inserting into `user_payment_links` with `user_id` (Supabase Auth) and `payment_id` (from `payments.id`).
- Linkage creation does not happen in Epic 3; it is expected in Epic 4 when auth is introduced.
- Payment lookup by email is restricted to internal tooling via `x-payment-lookup-token` matching `PAYMENT_LOOKUP_TOKEN`.

### Data Governance

- **Retention & PII:** See [Data Retention Policy](./data-retention-policy.md) for retention periods and PII handling specifics.

## API Contracts

`POST /api/stripe/checkout` → `{ data: { checkout_url }, error: null }`  
`POST /api/stripe/webhook` → `{ data: { received: true }, error: null }`  
`POST /api/auth/link-payment` → `{ data: { linked: true }, error: null }`  
`POST /api/analytics/event` → `{ data: { recorded: true }, error: null }`

## Security Architecture

- Stripe Checkout for PCI scope reduction
- Supabase Auth sessions with secure cookies
- Webhook signature verification for Stripe
- Protected routes require paid linkage

## Performance Considerations

- Static rendering for marketing routes where possible
- Minimal client JS on landing
- Fast CTA → checkout redirect

## Deployment Architecture

- Single Vercel deployment for `frontend/` (includes embedded admin routes)

## Development Environment

### Prerequisites

- Node.js 24.13.0 LTS
- Supabase project + keys
- Stripe account + webhook secret

### Setup Commands

```bash
cd frontend
npm install
npm run dev
```

## Architecture Decision Records (ADRs)

- ADR-001: Use existing `frontend/` app; no new starter
- ADR-002: Stripe Checkout for payment-first flow
- ADR-003: Supabase Auth + Postgres with direct client (no ORM)
- ADR-004: Next.js Route Handlers for API + webhooks
- ADR-005: Analytics stored in Supabase `events` table (no external tool)

## Validation Results

- Architecture Completeness: Complete
- Version Specificity: All Verified
- Pattern Clarity: Clear
- AI Agent Readiness: Ready

Critical Issues Found: None

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2026-02-03_
_For: darko_
