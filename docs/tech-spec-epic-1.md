# Epic Technical Specification: Foundation & Delivery Readiness (Partially Complete)

Date: 2026-02-03
Author: darko
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the production-ready foundation for the payment-first MVP: a consistent runtime and environment baseline, deploy readiness, route protection scaffolds, baseline analytics plumbing, and initial database schema/migrations. This work enables secure Stripe checkout and Supabase auth flows that follow in later epics while keeping `frontend/` as the source of truth for the implemented UI.

The focus is on operational readiness and scaffolding rather than feature delivery: ensure the existing Next.js app builds locally and in preview/production, environment variables are documented, and core protection/analytics/database patterns are set to support subsequent Stripe/Auth/Dashboard work.

## Objectives and Scope

**In scope**
- Confirm `frontend/` as the foundation (no new starter) and ensure consistent local + preview builds
- Define and document required environment variables in `.env.example` for Stripe/Supabase placeholders
- Establish deployment baseline (Vercel or equivalent), including Node 24.x runtime pinning
- Add centralized route protection scaffolds for protected routes (auth/payment-aware)
- Implement baseline analytics plumbing and event schema scaffolding
- Define initial database schema + migrations for `payments`, `user_payment_links`, and `events`

**Out of scope**
- Implement Stripe Checkout or webhook handlers (Epic 3)
- Implement Supabase Auth flows or payment-to-user linkage (Epic 4)
- Build or redesign marketing UI (Epic 2 already complete)
- Build dashboard features beyond protection scaffolds (Epic 5)
- Implement full analytics/admin UI (Epic 6)

## System Architecture Alignment

Aligns with the architecture decisions: use the existing Next.js App Router app in `frontend/`, TypeScript + Tailwind, Next.js route handlers for APIs, and Supabase Postgres for data. Deployment targets a single Vercel build with Node 24.x, and route protection uses centralized guards/middleware (`frontend/middleware.ts`, `frontend/lib/auth/guards.ts`) consistent with the documented structure. Environment variables are documented in `.env.example`, and API responses follow the `{ data, error }` envelope pattern.

## Detailed Design

### Services and Modules

- **`frontend/` Next.js app (App Router)**: Primary application surface; hosts marketing routes, future checkout/auth/dashboard routes, and API route handlers. Inputs: env vars, HTTP requests. Outputs: HTML/JS, API responses. Owner: Web.
- **`frontend/middleware.ts` + `frontend/lib/auth/guards.ts`**: Centralized route protection scaffolds. Inputs: request, session cookie, (future) paid linkage. Outputs: allow/redirect decisions. Owner: Web.
- **Env/config (`.env.example`, runtime config)**: Defines required env keys for Stripe/Supabase placeholders and deployment runtime. Inputs: developer/deploy env. Outputs: predictable config surface. Owner: Platform.
- **Deployment configuration (Vercel + Node 24.x)**: Build/runtime settings to ensure consistent previews and production deploys. Inputs: repo + env. Outputs: deployed app. Owner: Platform.
- **Analytics plumbing (`frontend/lib/analytics/*`, `frontend/app/api/analytics/*`)**: Baseline event schema and API route for recording funnel events. Inputs: event payloads. Outputs: DB writes. Owner: Web.
- **Database schema/migrations (Supabase SQL)**: Core tables to enable payment linkage and analytics (`payments`, `user_payment_links`, `events`). Inputs: migration scripts. Outputs: database structure. Owner: Platform.

### Data Models and Contracts

**Primary entities (Supabase Postgres):**
- **`payments`**
  - `id` (uuid, pk)
  - `stripe_session_id` (text, unique)
  - `stripe_customer_id` (text, nullable)
  - `email` (text, nullable)
  - `price_id` (text)
  - `amount` (integer)
  - `currency` (text)
  - `status` (text)
  - `created_at` (timestamptz)
- **`user_payment_links`**
  - `id` (uuid, pk)
  - `user_id` (uuid, fk → auth.users)
  - `payment_id` (uuid, fk → payments.id)
  - `linked_at` (timestamptz)
- **`events`**
  - `id` (uuid, pk)
  - `event_name` (text)
  - `user_id` (uuid, nullable)
  - `session_id` (text, nullable)
  - `metadata` (jsonb)
  - `created_at` (timestamptz)

**Relationships:**
- `user_payment_links.user_id` → Supabase Auth user
- `user_payment_links.payment_id` → `payments.id`

### APIs and Interfaces

**Internal API envelope:** `{ data, error }` with errors shaped as `{ error: { code, message } }`.

**Planned baseline endpoints (scaffolded patterns for later epics):**
- `POST /api/analytics/event` → `{ data: { recorded: true }, error: null }`
  - **Request schema:** `{ event_name: string, user_id?: string, session_id?: string, metadata?: object }`
  - **Response schema:** `{ data: { recorded: true }, error: null }`
  - **Error codes:** `invalid_event`, `unauthorized`, `server_error`
- `POST /api/stripe/checkout` → `{ data: { checkout_url }, error: null }` (Epic 3)
  - **Request schema:** `{ price_id: string, success_url: string, cancel_url: string }`
  - **Response schema:** `{ data: { checkout_url: string }, error: null }`
  - **Error codes:** `invalid_price`, `checkout_failed`, `unauthorized`, `server_error`
- `POST /api/stripe/webhook` → `{ data: { received: true }, error: null }` (Epic 3)
  - **Request schema:** Raw Stripe webhook payload + `Stripe-Signature` header
  - **Response schema:** `{ data: { received: true }, error: null }`
  - **Error codes:** `invalid_signature`, `event_unhandled`, `server_error`
- `POST /api/auth/link-payment` → `{ data: { linked: true }, error: null }` (Epic 4)
  - **Request schema:** `{ stripe_session_id: string }`
  - **Response schema:** `{ data: { linked: true }, error: null }`
  - **Error codes:** `payment_not_found`, `unauthorized`, `server_error`

### Workflows and Sequencing

1. **Local runtime baseline**: Ensure `frontend/` builds with Node 24.x and env vars loaded from `.env.local` using `.env.example` as the canonical template.
2. **Deployment baseline**: Configure Vercel (or equivalent) to build `frontend/` with Node 24.x and documented env vars for preview/prod.
3. **Route protection scaffold**: Add middleware/guards that can later enforce auth + paid linkage; default behavior is redirect/deny for protected routes.
4. **Analytics plumbing**: Define event schema and placeholder API route for event capture; no external analytics required.
5. **DB schema/migrations**: Apply Supabase migrations to create `payments`, `user_payment_links`, `events` for later epics.

## Non-Functional Requirements

### Performance

- Landing and core routes should keep LCP under ~2.5s on typical 4G mobile (from PRD).
- CTA → Stripe checkout should feel immediate with no blocking client-side work before redirect.
- Keep client bundles lightweight; prefer static rendering for marketing routes where possible.

### Security

- Stripe-hosted checkout to reduce PCI scope; do not collect card data directly.
- Supabase Auth session handling and protected routes (scaffolded here, fully enforced in later epics).
- Store only essential payment metadata; avoid unnecessary PII.
- OAuth configured with verified redirect URIs (Google OAuth planned).

### Reliability/Availability

- Vercel default scaling acceptable for MVP; ensure preview and production builds are stable.
- Environment configuration documented to reduce deploy-time failures.
- Route protection scaffolds must fail closed (deny/redirect when auth/payment state is unknown).

### Observability

- Basic console logging only (info/warn/error) per architecture.
- Baseline analytics plumbing with consistent event schema for funnel stages.
- Track key events (visit, CTA click, checkout start) once wiring begins.

## Dependencies and Integrations

- **Runtime/Framework**
  - `next` 16.1.6
  - `react` 19.2.3
  - `react-dom` 19.2.3
- **Build/Tooling**
  - `typescript` ^5
  - `tailwindcss` ^4
  - `@tailwindcss/postcss` ^4
  - `eslint` ^9
  - `eslint-config-next` 16.1.6
  - `babel-plugin-react-compiler` 1.0.0
  - `@types/node` ^20
  - `@types/react` ^19
  - `@types/react-dom` ^19
- **Integrations (planned for later epics)**
  - Stripe Checkout + webhook handling (Epic 3)
  - Supabase Auth + Postgres (Epic 4/5)

## Acceptance Criteria (Authoritative)

1. Local dev and preview builds succeed using `frontend/` as the source of truth with Node 24.x.
2. A documented `.env.example` exists and lists required Stripe/Supabase placeholders for later epics.
3. Deployment baseline is configured (Vercel or equivalent) with Node 24.x runtime and documented env vars.
4. Route protection scaffolds exist and are centralized (middleware/guards) for protected routes.
5. Baseline analytics plumbing is defined with an event schema and capture mechanism.
6. Supabase migrations define `payments`, `user_payment_links`, and `events` tables with required constraints.

**Story-Level Mapping (Epic 1)**

- Story 1.1 → AC1, AC2
- Story 1.2 → AC3
- Story 1.3 → AC4
- Story 1.4 → AC5
- Story 1.5 → AC6

## Traceability Mapping

| Acceptance Criteria | Spec Section(s) | Component(s)/API(s) | Test Idea |
| --- | --- | --- | --- |
| AC1: Local + preview builds succeed on Node 24.x | Overview; Detailed Design; NFR Reliability | `frontend/`, deploy config | Run `npm run build` locally and verify preview deploy succeeds |
| AC2: `.env.example` documented | Objectives/Scope; Detailed Design | `.env.example` | Verify file includes Stripe/Supabase placeholders |
| AC3: Deployment baseline configured | Objectives/Scope; NFR Reliability | Vercel config | Validate runtime pin to Node 24.x + env vars documented |
| AC4: Route protection scaffolds | Detailed Design | `middleware.ts`, `lib/auth/guards.ts` | Attempt access to protected route unauthenticated |
| AC5: Analytics plumbing baseline | Detailed Design; NFR Observability | `lib/analytics/*`, `/api/analytics/event` | Emit sample event and verify persistence/logging |
| AC6: DB schema/migrations | Detailed Design → Data Models | Supabase migrations | Apply migrations and check table/constraint existence |

## Risks, Assumptions, Open Questions

- **Risk:** Deployment/runtime mismatch (Node version differences between local and Vercel).  
  **Mitigation:** Pin Node 24.x in deployment settings and document in `.nvmrc` or README.
- **Risk:** Route protection scaffolds incorrectly allow access (fail-open).  
  **Mitigation:** Default deny/redirect when auth/payment status is unknown; add smoke checks.
- **Risk:** Analytics plumbing introduces performance overhead on core routes.  
  **Mitigation:** Keep event capture lightweight and asynchronous.
- **Assumption:** `frontend/` is the sole app to deploy; no separate backend service required for MVP.
- **Assumption:** Supabase Auth + Postgres will be used as described in architecture.
- **Question:** Where should Supabase migrations live (`frontend/` vs `docs/` vs dedicated `supabase/` folder)?
- **Question:** What is the exact deployment target (Vercel project + settings), and is there a required preview workflow?

## Test Strategy Summary

- **Unit tests:** Minimal utilities (env loader, guards logic) if present.
- **Integration tests:** Build + route protection smoke tests; analytics event submission to local API.
- **Manual checks:** Local `npm run build`, preview deploy validation, protected route access without auth.
- **Coverage focus:** ACs for env documentation, deploy baseline, guard behavior, and migrations.
