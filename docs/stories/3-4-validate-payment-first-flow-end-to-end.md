# Story 3.4: Validate Payment-First Flow End-to-End

Status: done

## Story

As a product owner,
I want to validate the payment-first flow end-to-end,
so that I can trust it for demand validation.

## Acceptance Criteria

1. **End-to-end success flow guides into auth**
    - Given a test Stripe payment, when checkout completes and the user returns to the app, then the success path guides into post-payment auth without errors. [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end] [Source: docs/PRD.md#Stripe-Checkout-Payment-First] [Source: docs/PRD.md#Functional-Requirements]

2. **Payment record exists for linkage**
    - Given a successful payment, when the webhook is processed, then the payment record exists in `payments` and can be used for later linkage. [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end] [Source: docs/architecture.md#Data-Architecture]

## Tasks / Subtasks

- [x] Validate checkout success → auth navigation (AC: #1)
    - [x] Execute Stripe test payment through `/checkout` → `/checkout/success`, confirming redirect or CTA into `/auth` with no errors. [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end] [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success--Auth--Dashboard]
    - [x] Confirm cancel flow returns to pricing (`/checkout/cancel` → `/#pricing`) to avoid regressions during success-path verification. [Source: docs/ux-design-specification.md#Journey-3-Checkout-CancelFailure--Return-to-Pricing]

- [x] Verify payment metadata persistence (AC: #2)
    - [x] Confirm Stripe webhook processes the test payment and inserts a record into `payments` with required fields (session ID, email, price info, status, created_at). [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end] [Source: docs/architecture.md#Data-Architecture]
    - [x] Verify stored record is queryable via existing lookup path (session ID or email) for later linkage. [Source: docs/architecture.md#Data-Architecture] [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#Tasks--Subtasks]

- [x] Testing and documentation (AC: #1, #2)
    - [x] Add or update integration tests covering the success/cancel flow and `/auth` handoff to lock in end-to-end behavior. [Source: docs/architecture.md#Cross-Cutting-Decisions] [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success--Auth--Dashboard] [Source: docs/ux-design-specification.md#Journey-3-Checkout-CancelFailure--Return-to-Pricing]
    - [x] Add or update tests for webhook → `payments` persistence and lookup queryability to confirm linkage prerequisites. [Source: docs/architecture.md#Cross-Cutting-Decisions] [Source: docs/architecture.md#Data-Architecture]
    - [x] Document any edge cases or issues encountered during end-to-end validation. [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end]

## Dev Notes

### Requirements Context

- Story 3.4 validates the payment-first flow end-to-end: after a test Stripe payment, the success path must guide into post-payment auth without errors, and the payment record must exist for linkage. [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end]
- Use Stripe test mode for validation and document any edge cases encountered during the flow verification. [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end]
- The broader MVP expects payment before signup, with success/cancel handling and payment metadata stored for later linking. [Source: docs/PRD.md#Stripe-Checkout-Payment-First] [Source: docs/PRD.md#Functional-Requirements]
- Architecture constraints for this flow: Next.js App Router with API route handlers under `frontend/app/api/**/route.ts`, Stripe checkout/webhook endpoints under `/api/stripe/*`, `{ data, error }` response envelopes, ISO-8601 UTC timestamps, and payments stored in `payments` for later linking in Epic 4. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#API-Contracts] [Source: docs/architecture.md#Format-Patterns] [Source: docs/architecture.md#Data-Architecture]

### Architecture Patterns and Constraints

- API route handlers live in `frontend/app/api/**/route.ts`, with Stripe webhooks under `/api/stripe/webhook` and checkout under `/api/stripe/checkout`. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#API-Contracts]
- API responses must use the `{ data, error }` envelope and errors remain concise and non-technical. [Source: docs/architecture.md#Cross-Cutting-Decisions] [Source: docs/architecture.md#Format-Patterns]
- Dates are stored/transmitted as ISO-8601 UTC strings; payment metadata remains in `payments` for later linkage in Epic 4. [Source: docs/architecture.md#Format-Patterns] [Source: docs/architecture.md#Data-Architecture]
- Testing should remain lightweight and integration-focused for checkout/auth/webhook flows. [Source: docs/architecture.md#Cross-Cutting-Decisions]

### Project Structure Notes

- Checkout and post-payment surfaces live in `frontend/app/checkout/**` and `frontend/app/auth/page.tsx`; ensure validation exercises these routes and confirms navigation to `/auth` after success. [Source: docs/architecture.md#Project-Structure] [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success--Auth--Dashboard]
- Stripe API entry points remain under `frontend/app/api/stripe/*/route.ts`; validate success/cancel flow without introducing alternate endpoints. [Source: docs/architecture.md#Project-Structure]
- Prior story implemented webhook persistence and payment lookup at `frontend/app/api/stripe/webhook/route.ts` and `frontend/app/api/payments/lookup/route.ts`, with tests co-located. Reuse these paths during end-to-end validation rather than duplicating logic. [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#Tasks--Subtasks] [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#File-List]
- Payments linkage is expected later via `user_payment_links`; this story should only confirm the payment record exists in `payments` for linkage. [Source: docs/architecture.md#Data-Architecture] [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end]

### Learnings from Previous Story

**From Story 3-3-store-payment-metadata-for-user-linkage (Status: done)**

- **Webhook Persistence in Place**: `frontend/app/api/stripe/webhook/route.ts` already handles signature verification and inserts records into `payments`; reuse this endpoint for validation instead of adding new handlers. [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#Tasks--Subtasks]
- **Payment Lookup Path Exists**: `frontend/app/api/payments/lookup/route.ts` supports querying payments by session ID or email for linkage verification. [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#Tasks--Subtasks]
- **Testing Patterns Established**: Webhook and lookup tests are co-located in `frontend/app/api/stripe/webhook/route.test.ts` and `frontend/app/api/payments/lookup/route.test.ts`; follow these patterns when adding end-to-end validation tests. [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#File-List]
- **Security Note**: Email-based lookup is protected by `PAYMENT_LOOKUP_TOKEN`; ensure test environments set this variable when validating lookup. [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#Senior-Developer-Review-AI]
- **Completion Notes Highlights**: Prior work confirmed webhook persistence + lookup are implemented and tests/lint passed; treat this story as validation and avoid re-implementing existing flows. [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#Completion-Notes-List]

### References

- [Source: docs/epics.md#Story-34-Validate-payment-first-flow-end-to-end]
- [Source: docs/PRD.md#Stripe-Checkout-Payment-First]
- [Source: docs/PRD.md#Functional-Requirements]
- [Source: docs/architecture.md#Project-Structure]
- [Source: docs/architecture.md#API-Contracts]
- [Source: docs/architecture.md#Format-Patterns]
- [Source: docs/architecture.md#Data-Architecture]
- [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success--Auth--Dashboard]
- [Source: docs/ux-design-specification.md#Journey-3-Checkout-CancelFailure--Return-to-Pricing]
- [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#Tasks--Subtasks]
- [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#File-List]
- [Source: docs/stories/3-3-store-payment-metadata-for-user-linkage.md#Senior-Developer-Review-AI]

## Change Log

- 2026-02-04: Drafted story from epics, PRD, architecture, UX spec, and prior story learnings.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

GPT-5 (Codex)

### Debug Log References

- Plan: confirm checkout success/cancel pages already guide to `/auth` and `/#pricing`; extend tests to explicitly assert `/auth` handoff messaging/link, validate checkout API success/cancel URLs, and validate webhook + lookup flow via existing route tests. Update story documentation with any edge-case notes.

### Completion Notes List

- Added stronger assertions for checkout success/cancel handoff CTA copy and webhook `created_at` insertion to validate end-to-end expectations.
- Manual Stripe test payment executed successfully: checkout → webhook persisted payment metadata → `/checkout/success` CTA guided to `/auth` (logs captured).
- Tests: `npm test` (frontend).

### File List
- docs/stories/3-4-validate-payment-first-flow-end-to-end.md
- docs/sprint-status.yaml
- frontend/app/checkout/checkout-pages.test.tsx
- frontend/app/api/stripe/webhook/route.test.ts
