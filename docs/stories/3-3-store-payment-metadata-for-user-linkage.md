# Story 3.3: Store Payment Metadata for User Linkage

Status: done

## Story

As a system,
I want to store payment metadata from Stripe webhooks,
so that payments can be linked to users after authentication.

## Acceptance Criteria

1. **Persist payment metadata on successful webhook**
    - When Stripe sends a successful payment webhook event, store a payment record with session ID, customer email, and price info. [Source: docs/epics.md#Story-33-Store-payment-metadata-for-user-linkage]

2. **Payment record is queryable for linkage**
    - Stored payment metadata can be retrieved later to link a payment to an authenticated user. [Source: docs/epics.md#Story-33-Store-payment-metadata-for-user-linkage]

## Tasks / Subtasks

- [x] Implement Stripe webhook persistence for payments (AC: #1)
    - [x] Ensure `/api/stripe/webhook` extracts session ID, customer email, price info, and payment status from Stripe event payloads. [Source: docs/epics.md#Story-33-Store-payment-metadata-for-user-linkage] [Source: docs/architecture.md#API-Contracts]
    - [x] Insert payment record into Supabase `payments` table with `snake_case` fields and ISO-8601 UTC timestamp. [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Format-Patterns]
    - [x] Keep errors concise and non-technical in any user-facing surfaces; use `{ data, error }` envelopes for API responses. [Source: docs/architecture.md#Cross-Cutting-Decisions] [Source: docs/architecture.md#API-Contracts]

- [x] Enable payment record lookup for later linkage (AC: #2)
    - [x] Implement or extend retrieval path to query `payments` by session ID or customer email for post-payment auth linkage. [Source: docs/epics.md#Story-33-Store-payment-metadata-for-user-linkage] [Source: docs/architecture.md#Data-Architecture]
    - [x] Document or codify linkage expectations for `user_payment_links` usage (no auth linkage yet; just ensure payment metadata is queryable). [Source: docs/architecture.md#Data-Architecture]

- [x] Testing (AC: #1, #2)
    - [x] Add tests for webhook handling to confirm valid events create payment records with required fields. [Source: docs/architecture.md#Cross-Cutting-Decisions]
    - [x] Add tests for payment record lookup path to ensure query returns stored metadata for linkage. [Source: docs/architecture.md#Cross-Cutting-Decisions]

## Dev Notes

### Requirements Context

- Story 3.3 requires storing payment metadata when Stripe sends a successful webhook event, including session ID, customer email, and price info so the record can be queried later for user linkage. [Source: docs/epics.md#Story-33-Store-payment-metadata-for-user-linkage]
- The payment-first flow expects payment metadata storage as part of Stripe Checkout, with webhook handling to confirm success before post-payment auth. [Source: docs/PRD.md#Stripe-Checkout-Payment-First] [Source: docs/PRD.md#Functional-Requirements]
- Implement within existing Next.js App Router structure and API patterns; Stripe webhook handling is expected under `/api/stripe/webhook`, API responses use `{ data, error }`, logging is `console.*`, and dates are stored/transmitted as ISO-8601 UTC. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#API-Contracts] [Source: docs/architecture.md#Cross-Cutting-Decisions]
- Persist metadata in the `payments` table (e.g., `stripe_session_id`, `stripe_customer_id`, `email`, `price_id`, `amount`, `currency`, `status`, `created_at`) and enable linkage via `user_payment_links`. [Source: docs/architecture.md#Data-Architecture]

### Project Structure Notes

#### Structure Alignment Summary

- API route handlers live in `frontend/app/api/**/route.ts`; Stripe webhook handling should remain in `frontend/app/api/stripe/webhook/route.ts` and use `{ data, error }` envelopes. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#API-Contracts]
- Shared Stripe helpers are expected in `frontend/lib/stripe/*`; reuse existing Stripe client/server utilities rather than introducing new patterns. [Source: docs/architecture.md#Project-Structure]
- Supabase access should go through `frontend/lib/supabase/*` for consistent client/server usage. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#Decision-Summary]
- Data tables for payments and linkage already defined in architecture; align column names to `snake_case` and store ISO-8601 UTC timestamps. [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Format-Patterns]

### Learnings from Previous Story

**From Story 3-2-implement-checkout-success-and-cancel-handling (Status: done)**

- **Existing Checkout Entry Point**: Continue using `frontend/app/api/stripe/checkout/route.ts` as the canonical session creation path; do not introduce alternate session creation endpoints. [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#Tasks--Subtasks]
- **Stripe Utilities**: Reuse Stripe helpers in `frontend/lib/stripe/*` for consistent SDK setup and configuration. [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#Dev-Notes]
- **App Router Structure**: Success/cancel pages and related checkout flows stay under `frontend/app/checkout/**`, reinforcing App Router placement for Stripe-related flows. [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#Project-Structure-Notes]
- **Logging Guidance**: Keep logging minimal and `console.*`-based if needed. [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#Dev-Notes]
- **UI/Flow Consistency**: Preserve the CTA → `/checkout` redirect pattern; do not add new entry points that bypass the existing flow. [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#Tasks--Subtasks]
- **New Files Created**: `frontend/app/checkout/success/page.tsx`, `frontend/app/checkout/cancel/page.tsx`, `frontend/app/checkout/success/AuthTabNotice.tsx`, `frontend/app/checkout/checkout-pages.test.tsx` — be aware of existing checkout success/cancel UI and tests when extending webhook flows or adding related coverage. [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#File-List]
- **Completion Notes Highlights**: Prior work reinforced session-aware messaging and auth-tab handling on success; avoid introducing webhook-side changes that would invalidate the existing success/cancel flow expectations or test coverage patterns. [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#Completion-Notes-List]

### Architecture Patterns and Constraints

- API route handlers live in `frontend/app/api/**/route.ts`; Stripe webhook handling remains in `frontend/app/api/stripe/webhook/route.ts`. [Source: docs/architecture.md#Project-Structure]
- Use `{ data, error }` envelopes for API responses and keep user-facing errors concise and non-technical. [Source: docs/architecture.md#API-Contracts] [Source: docs/architecture.md#Cross-Cutting-Decisions]
- Store and transmit dates as ISO-8601 UTC strings; follow `snake_case` for database fields. [Source: docs/architecture.md#Format-Patterns] [Source: docs/architecture.md#Data-Architecture]
- Logging uses `console.info|warn|error` only. [Source: docs/architecture.md#Cross-Cutting-Decisions]

### References

- [Source: docs/epics.md#Story-33-Store-payment-metadata-for-user-linkage]
- [Source: docs/PRD.md#Stripe-Checkout-Payment-First]
- [Source: docs/PRD.md#Functional-Requirements]
- [Source: docs/architecture.md#Project-Structure]
- [Source: docs/architecture.md#API-Contracts]
- [Source: docs/architecture.md#Cross-Cutting-Decisions]
- [Source: docs/architecture.md#Data-Architecture]
- [Source: docs/architecture.md#Format-Patterns]
- [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#Dev-Notes]
- [Source: docs/stories/3-2-implement-checkout-success-and-cancel-handling.md#Tasks--Subtasks]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

GPT-5 (Codex)

### Debug Log References

- Plan: implement Stripe webhook route with signature verification and Supabase insert, add payment lookup API for session/email queries, add tests for both routes, and validate via test + lint runs.

### Completion Notes List

- Implemented Stripe webhook persistence with signature verification, metadata extraction, and Supabase `payments` insert handling (including duplicate-safe behavior).
- Added payments lookup endpoint to query stored metadata by session ID or email to support post-payment linkage expectations.
- Added tests for webhook handling and payment lookup; `npm test` passes. `npm run lint` now passes.
- Added `@supabase/supabase-js` dependency to `frontend/package.json` and installed dependencies so `frontend/package-lock.json` is updated.
- Resolved lint warning by removing unused checkout state; `npm run lint` now passes.

### File List

- docs/sprint-status.yaml
- frontend/app/api/payments/lookup/route.ts
- frontend/app/api/payments/lookup/route.test.ts
- frontend/app/api/stripe/webhook/route.ts
- frontend/app/api/stripe/webhook/route.test.ts
- frontend/lib/supabase/server.ts
- frontend/package-lock.json
- frontend/package.json
- frontend/app/checkout/page.tsx
## Change Log

- 2026-02-04: Drafted story from epics, PRD, architecture, and prior story learnings.
- 2026-02-04: Implemented webhook payment persistence, lookup endpoint, and tests; updated Supabase client dependency.
- 2026-02-04: Senior Developer Review notes appended.
- 2026-02-04: Addressed review findings (email lookup safeguards, linkage expectations doc, added tests).

## Senior Developer Review (AI)

- Reviewer: darko
- Date: 2026-02-04
- Outcome: Approve — All acceptance criteria and completed tasks verified.

### Summary

Core functionality is implemented (webhook persistence + lookup) and all tasks are verified. No story context file or Epic 3 tech spec was found; review proceeded with architecture constraints only.

### Review Process Notes

- Story status verified against allowed values in `docs/sprint-status.yaml` (Status Definitions).
- Tech stack detected: Next.js 16.1.6 (App Router), React 19.2.3, TypeScript 5.x, Stripe SDK 20.1.0, Supabase JS 2.94.0, Vitest.
- MCP doc search not performed (MCP enhancements disabled in config); web fallback used for best-practice references.
- File list reviewed for completeness against touched areas in webhook and lookup flows; no missing files identified.
- Story saved after review updates.

### Code Quality Review

Reviewed changed files for error handling, input validation, logging consistency, and async correctness. No code quality issues found beyond the resolved safeguards and test additions.

### Key Findings

High
- None.

Medium
- None.

Low
- None.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| --- | --- | --- | --- |
| AC1 | Persist payment metadata on successful webhook | IMPLEMENTED | `frontend/app/api/stripe/webhook/route.ts:121-166` |
| AC2 | Payment record is queryable for linkage | IMPLEMENTED | `frontend/app/api/payments/lookup/route.ts:14-65` |

Summary: 2 of 2 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Implement Stripe webhook persistence for payments (AC: #1) | Completed | VERIFIED COMPLETE | `frontend/app/api/stripe/webhook/route.ts:121-166` |
| Ensure `/api/stripe/webhook` extracts session ID, customer email, price info, and payment status | Completed | VERIFIED COMPLETE | `frontend/app/api/stripe/webhook/route.ts:30-59` |
| Insert payment record into `payments` table with snake_case fields and ISO-8601 UTC timestamp | Completed | VERIFIED COMPLETE | `frontend/app/api/stripe/webhook/route.ts:12-20`, `frontend/app/api/stripe/webhook/route.ts:65-75`, `frontend/app/api/stripe/webhook/route.ts:147-148` |
| Keep errors concise and non-technical; use `{ data, error }` envelopes | Completed | VERIFIED COMPLETE | `frontend/app/api/stripe/webhook/route.ts:6-10`, `frontend/app/api/stripe/webhook/route.ts:84-156`, `frontend/app/api/payments/lookup/route.ts:3-7`, `frontend/app/api/payments/lookup/route.ts:27-60` |
| Enable payment record lookup for later linkage (AC: #2) | Completed | VERIFIED COMPLETE | `frontend/app/api/payments/lookup/route.ts:14-65` |
| Implement retrieval path to query `payments` by session ID or customer email | Completed | VERIFIED COMPLETE | `frontend/app/api/payments/lookup/route.ts:23-63` |
| Document or codify linkage expectations for `user_payment_links` usage | Completed | VERIFIED COMPLETE | `docs/architecture.md:200-205` |
| Testing (AC: #1, #2) | Completed | VERIFIED COMPLETE | `frontend/app/api/stripe/webhook/route.test.ts:38-86`, `frontend/app/api/payments/lookup/route.test.ts:34-61` |
| Add tests for webhook handling | Completed | VERIFIED COMPLETE | `frontend/app/api/stripe/webhook/route.test.ts:38-86` |
| Add tests for payment record lookup path | Completed | VERIFIED COMPLETE | `frontend/app/api/payments/lookup/route.test.ts:34-61` |

Summary: 10 of 10 completed tasks verified, 0 questionable, 0 falsely marked complete.

### Test Coverage and Gaps

Webhook signature failure and email-lookup coverage are tested in addition to happy paths.

### Architectural Alignment

Route handler placement, `{ data, error }` envelopes, ISO-8601 UTC timestamps, and `snake_case` fields align with `docs/architecture.md`. No architecture violations detected.

### Security Notes

Webhook signature verification is implemented; email-based lookup is restricted by an internal lookup token.

### Best-Practices and References

- Stripe webhook signature verification requires the raw request body and `Stripe-Signature` header. https://docs.stripe.com/webhooks/signatures
- Supabase `service_role` keys must remain server-only. https://supabase.com/docs/guides/api/api-keys
- Next.js Route Handlers live under the `app` directory and are defined in `route.ts`. https://nextjs.org/docs/app/getting-started/route-handlers

### Action Items

**Code Changes Required:**
- None.

**Advisory Notes:**
- Note: Ensure `PAYMENT_LOOKUP_TOKEN` is configured in environments that need email-based lookup.
