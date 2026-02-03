# Architecture

## Executive Summary

autopilotreels is a Next.js + Supabase + Stripe MVP optimized for a payment‑first validation funnel.
Architecture prioritizes pixel‑close marketing UI, fast checkout, and tight linkage between Stripe payments and Supabase Auth users.

## Project Initialization

First implementation story should execute via Vercel “Deploy Template” using:
Stripe & Supabase SaaS Starter Kit (`dzlau/stripe-supabase-saas-template`)

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| Runtime | Node.js | 24.13.0 (LTS) | All | Active LTS baseline |
| Framework | Next.js App Router | 16.0.10 | All | Latest patched in 16.x line |
| Styling | Tailwind CSS | 4.1.18 | 1,2 | Latest stable |
| Data | Supabase Postgres | 15 (managed; verify via `select version()`) | 3,4,5 | Simple MVP persistence |
| SDK | supabase-js | 2.90.0 | 3,4,5 | Latest stable |
| Auth | Supabase Auth (GoTrue) | v2.x (managed; verify via `/auth/v1/health`) | 4 | Email + Google OAuth |
| Payments | Stripe Checkout | API 2025-12-15.clover | 3,4,5 | Payment‑first flow |
| SDK | stripe-node | 20.1.0 | 3,4,5 | Latest stable |
| API Pattern | Next.js route handlers | n/a | 3,4,5 | Simple REST-style endpoints |
| Analytics | Supabase events table | n/a | 1–5 | Minimal deps, MVP funnel |
| Webhooks | Next.js `/api/stripe/webhook` | n/a | 3–5 | Simple + idempotent |
| Error format | `{error:{code,message,details}}` | n/a | All | Consistent client parsing |
| Logging | JSON logs w/ request_id | n/a | All | Debuggability |
| Tests | Unit only | n/a | 1 | MVP speed |
| Admin export | CSV only | n/a | 5 | Simplest to implement |

## Project Structure

```
autopilotreels/
├─ app/
│  ├─ (marketing)/page.tsx
│  ├─ (marketing)/pricing/page.tsx
│  ├─ checkout/success/page.tsx
│  ├─ checkout/cancel/page.tsx
│  ├─ auth/page.tsx
│  ├─ dashboard/page.tsx
│  ├─ admin/page.tsx
│  ├─ api/stripe/checkout/route.ts
│  ├─ api/stripe/webhook/route.ts
│  └─ api/analytics/route.ts
├─ components/
│  ├─ marketing/
│  ├─ ui/
│  └─ dashboard/
├─ lib/
│  ├─ env.ts
│  ├─ supabase/server.ts
│  ├─ supabase/client.ts
│  ├─ stripe.ts
│  ├─ analytics.ts
│  ├─ auth.ts
│  └─ types.ts
├─ db/schema.sql
├─ public/assets/
├─ tests/unit/
├─ .env.example
├─ next.config.js
├─ package.json
└─ README.md
```

## Epic to Architecture Mapping

- Epic 1 (Foundation) → `app/`, `lib/`, `.env.example`, `next.config.js`, `components/ui/`, `tests/unit/`
- Epic 2 (Marketing) → `app/(marketing)/`, `components/marketing/`, `public/assets/`
- Epic 3 (Checkout) → `app/api/stripe/*`, `app/checkout/*`, `lib/stripe.ts`, `db/schema.sql`
- Epic 4 (Auth) → `app/auth/`, `app/dashboard/`, `lib/supabase/*`, `lib/auth.ts`
- Epic 5 (Analytics/Admin) → `lib/analytics.ts`, `app/api/analytics/route.ts`, `app/admin/`

## Technology Stack Details

### Core Technologies

- Next.js 16.0.10 (App Router)
- Node.js 24.13.0 LTS
- Tailwind CSS 4.1.18
- Supabase (Postgres + Auth) with supabase-js 2.90.0
- Stripe Checkout + stripe-node 20.1.0 (API 2025-12-15.clover)
- Vercel hosting

### Integration Points

- Stripe Checkout → success page → Supabase Auth login → dashboard
- Stripe webhook → Supabase `payments` table (server-side)
- Analytics events → Supabase `events` table

## Novel Pattern Designs

None required.

## Implementation Patterns

Naming Conventions:
- REST endpoints plural (`/users`), params `:id`
- DB tables snake_case plural (`users`), columns snake_case (`user_id`)
- Components + filenames PascalCase (`UserCard.tsx`)

Code Organization:
- Components by feature (`components/marketing`, `components/dashboard`, `components/ui`)
- Tests under `tests/unit/`

Error Handling:
- API errors `{error:{code,message,details}}`

Logging Strategy:
- Structured JSON logs with `level` + `request_id`

## Data Architecture

Core tables (Supabase):
- `users` (from Supabase Auth)
- `payments` (Stripe session/intent metadata)
- `payment_user_link` (payment ↔ user)
- `events` (analytics funnel events)

## API Contracts

All API responses use `{data, error, meta}` envelope.
Dates are ISO 8601 strings.

## Security Architecture

- Stripe Checkout (hosted) to minimize PCI scope.
- Supabase Auth for sessions and OAuth.
- Server-side guards for paid access.
- Webhook signature verification + idempotency key.

## Performance Considerations

- Static rendering for landing page where possible.
- Minimize client bundle; avoid heavy client work before checkout redirect.
- Optimize LCP (~2.5s target) and prevent layout shifts.

## Deployment Architecture

- Vercel for hosting + serverless route handlers.
- Supabase for database + auth.
- Stripe for payments.

## Development Environment

### Prerequisites

- Node.js 24.13.0
- Supabase project + keys
- Stripe account + webhook secret

### Setup Commands

```bash
# Vercel “Deploy Template” (recommended)
# Set env vars in Vercel dashboard after deploy
```

## Architecture Decision Records (ADRs)

1) Use Supabase Auth + Stripe Checkout for payment-first flow (min PCI + fast MVP).  
2) Next.js App Router + Vercel for rapid delivery and performance.  
3) Analytics via Supabase events table to avoid external dependencies.

## Validation Results (Checkpoint)

- Decision completeness: Complete (no placeholders).
- Version specificity: Mostly verified; Supabase Postgres/Auth are managed and require per-project verification at setup.
- Pattern clarity: Clear.
- AI agent readiness: Ready.

Critical issues found: None.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2026-02-02_
_For: darko_

## Completion Summary (Checkpoint)

✅ Decision Architecture workflow complete.

Deliverables:
- architecture.md
- bmm-architecture-2026-02-02.md

Next required workflow: solutioning-gate-check (agent: architect).

## Executive Summary

{{executive_summary}}

{{project_initialization_section}}

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |

{{decision_table_rows}}

## Project Structure

```
{{project_root}}/
{{source_tree}}
```

## Epic to Architecture Mapping

{{epic_mapping_table}}

## Technology Stack Details

### Core Technologies

{{core_stack_details}}

### Integration Points

{{integration_details}}

{{novel_pattern_designs_section}}

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

{{implementation_patterns}}

## Consistency Rules

### Naming Conventions

{{naming_conventions}}

### Code Organization

{{code_organization_patterns}}

### Error Handling

{{error_handling_approach}}

### Logging Strategy

{{logging_approach}}

## Data Architecture

{{data_models_and_relationships}}

## API Contracts

{{api_specifications}}

## Security Architecture

{{security_approach}}

## Performance Considerations

{{performance_strategies}}

## Deployment Architecture

{{deployment_approach}}

## Development Environment

### Prerequisites

{{development_prerequisites}}

### Setup Commands

```bash
{{setup_commands}}
```

## Architecture Decision Records (ADRs)

{{key_architecture_decisions}}

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: {{date}}_
_For: {{user_name}}_
