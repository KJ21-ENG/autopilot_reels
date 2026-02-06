# Story 4.2: Link payment records to authenticated users

Status: done

## Story

As a system,
I want to link a payment to the authenticated user,
so that account access reflects a real paid purchase.

## Requirements Context Summary

- Epic objective for Story 4.2 is to associate a completed payment record with the authenticated Supabase user so downstream authorization can rely on confirmed paid linkage. [Source: docs/epics.md#Story-4.2-Link-payment-records-to-authenticated-users]
- PRD requires post-payment authentication and explicit payment-to-account linking after successful checkout; linkage is a required gate before protected dashboard access logic in later stories. [Source: docs/PRD.md#Post‑Payment-Authentication] [Source: docs/PRD.md#Functional-Requirements]
- Architecture requires storing payments first (webhook path), then creating `user_payment_links` records after auth using stable identifiers (`stripe_session_id` preferred) and Supabase `user_id`. [Source: docs/architecture.md#Payment-Linkage-Expectations] [Source: docs/architecture.md#Data-Architecture]
- API and error contracts for linkage work must follow `{ data, error }` and concise non-technical errors; auth/session handling must use Supabase secure-cookie patterns. [Source: docs/architecture.md#Cross-Cutting-Decisions]
- UX flow continuity: users come from checkout success to auth; linkage should happen at or immediately after successful auth completion so dashboard routing can remain seamless. [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success-→-Auth-→-Dashboard]

## Acceptance Criteria

1. Given a payment record and a newly authenticated user, when the user completes auth, then the payment record is associated with the user ID. [Source: docs/epics.md#Story-4.2-Link-payment-records-to-authenticated-users]
2. The link is stored in the database for future checks. [Source: docs/epics.md#Story-4.2-Link-payment-records-to-authenticated-users]

## Tasks / Subtasks

- [x] Implement payment lookup + linkage logic after successful auth completion, preferring `stripe_session_id` correlation and falling back to validated internal lookup policy where required. (AC: #1) [Source: docs/epics.md#Story-4.2-Link-payment-records-to-authenticated-users] [Source: docs/architecture.md#Payment-Linkage-Expectations]
    - [x] Reuse existing auth completion flow (`frontend/app/auth/auth-actions.ts` and callback handling) to invoke linkage at the correct post-auth point. (AC: #1) [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#File-List] [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success-→-Auth-→-Dashboard]
    - [x] Ensure failures return concise user-safe errors and preserve retry path without breaking session state. (AC: #1) [Source: docs/architecture.md#Cross-Cutting-Decisions]
- [x] Create/extend auth linkage API surface under `frontend/app/api/auth/*` using `{ data, error }` envelope and architecture route conventions. (AC: #1, #2) [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#Cross-Cutting-Decisions]
    - [x] Validate authenticated user context before writing linkage records. (AC: #1) [Source: docs/architecture.md#Authentication-pattern]
    - [x] Enforce idempotent behavior to avoid duplicate linkage rows for repeated callbacks/retries. (AC: #2) [Source: docs/architecture.md#Cross-Cutting-Decisions]
- [x] Persist linkage in `user_payment_links` (`user_id`, `payment_id`, `linked_at`) using existing database naming and relationship patterns. (AC: #2) [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Naming-Patterns]
    - [x] Confirm linkage writes do not mutate existing payment ingestion behavior from Epic 3. (AC: #2) [Source: docs/architecture.md#Payment-Linkage-Expectations]
- [x] Add or update tests for linkage success, duplicate/idempotent handling, and failure paths across auth completion flow. (AC: #1, #2) [Source: docs/architecture.md#Testing-strategy]
    - [x] Integration test: authenticated user with matching payment record results in linkage creation. (AC: #1, #2)
    - [x] Integration test: repeated auth callback does not create duplicate links. (AC: #2)
    - [x] Integration test: no matching payment returns expected safe error and recovery behavior. (AC: #1)

## Dev Notes

- Implement linkage after auth completion using existing Epic 4 auth flow components (`frontend/app/auth/auth-actions.ts`, `frontend/app/auth/callback/page.tsx`) so users continue from `/auth` to dashboard without flow regression. [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success-→-Auth-→-Dashboard] [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#File-List]
- Keep linkage logic in App Router API conventions under `frontend/app/api/auth/*` and shared Supabase access under `frontend/lib/supabase/*`; do not introduce parallel service locations. [Source: docs/architecture.md#Project-Structure]
- Persist linkage through `user_payment_links` using `user_id` + `payment_id` with idempotent handling for callback retries; payments remain authored by webhook ingestion in `payments`. [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Payment-Linkage-Expectations]
- Maintain cross-cutting API envelope and error conventions (`{ data, error }`, concise non-technical user messages, UTC/ISO date handling where timestamps are emitted). [Source: docs/architecture.md#Cross-Cutting-Decisions]
- Testing should prioritize integration coverage for auth/linkage boundaries (success, no-match, retry/idempotency) per project’s lightweight integration-focused strategy. [Source: docs/architecture.md#Testing-strategy]

### Learnings from Previous Story

**From Story 4-1-implement-supabase-auth-email-google (Status: done)**

- **New Auth Foundation Available**: Reuse the implemented auth/session stack instead of rebuilding (`frontend/app/api/auth/session/route.ts`, `frontend/app/auth/auth-actions.ts`, `frontend/app/auth/callback/page.tsx`, `frontend/lib/supabase/client.ts`, `frontend/lib/supabase/server.ts`). [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#File-List]
- **Established Pattern**: Auth flows already enforce redirect safety and user-facing error clarity; linkage should extend these patterns, not replace them. [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#Completion-Notes-List]
- **Pending Review Item**: Google OAuth secret rotation/environment externalization remains unchecked and may affect auth reliability across Story 4.x if left unresolved. [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#Action-Items]
- **Forward Compatibility Note**: Prior advisory highlighted eventual stricter enforcement by user ID after Story 4.2; implement linkage now to remove email-only dependency for paid access logic in Story 4.3. [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#Advisory-Notes] [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control]

### Project Structure Notes

- Align implementation to existing structure: auth routes in `frontend/app/api/auth/*`, auth UI/actions in `frontend/app/auth/*`, and Supabase helpers in `frontend/lib/supabase/*`. [Source: docs/architecture.md#Project-Structure]
- Use existing naming and schema conventions (`snake_case`, plural table names, explicit foreign-key style linkage) for all new persistence code. [Source: docs/architecture.md#Naming-Patterns]
- No structural conflicts detected; Story 4.2 extends existing Epic 4 work and prepares Story 4.3 authorization checks. [Source: docs/epics.md#Story-4.2-Link-payment-records-to-authenticated-users] [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control]

### References

- Epic acceptance criteria and prerequisites for Story 4.2. [Source: docs/epics.md#Story-4.2-Link-payment-records-to-authenticated-users]
- Post-payment authentication + payment linkage requirement context. [Source: docs/PRD.md#Post‑Payment-Authentication] [Source: docs/PRD.md#Functional-Requirements]
- Data/linkage model and architectural contracts (`payments`, `user_payment_links`, API/error envelope, route placement). [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Payment-Linkage-Expectations] [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#Cross-Cutting-Decisions]
- UX flow dependency for checkout-success → auth → dashboard continuity. [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success-→-Auth-→-Dashboard]
- Previous-story implementation learnings and unresolved review item carried into this story. [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#Completion-Notes-List] [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#Action-Items]

## Project Structure Alignment Summary

- Reuse existing auth/session infrastructure from Story 4.1 instead of creating parallel flows: `frontend/app/api/auth/session/route.ts`, `frontend/app/auth/auth-actions.ts`, `frontend/app/auth/callback/page.tsx`, and shared Supabase helpers in `frontend/lib/supabase/*`. [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#File-List] [Source: docs/architecture.md#Project-Structure]
- Implement linkage using existing database contract (`payments` → `user_payment_links`) and keep identifiers in snake_case with `user_id` and `payment_id`; avoid schema drift. [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Naming-Patterns]
- Keep API placement consistent with architecture route conventions (`frontend/app/api/auth/*`) and preserve `{ data, error }` response envelopes. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#Cross-Cutting-Decisions]
- Prior review learning to carry forward: a pending operational action remains to rotate and externalize Google OAuth secret; treat it as environment/security hygiene dependency while implementing linkage changes. [Source: docs/stories/4-1-implement-supabase-auth-email-google.md#Action-Items]
- No project-structure conflicts identified for Story 4.2; linkage work should be additive to established Epic 4 auth foundations and ready Story 4.3 authorization checks. [Source: docs/epics.md#Story-4.2-Link-payment-records-to-authenticated-users] [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

GPT-5 (Codex)

### Debug Log References

- 2026-02-05: Plan for Story 4.2 implementation:
    - Extend `POST /api/auth/session` to resolve a paid payment by `stripe_session_id` when available and fall back to latest paid-by-email record.
    - Create idempotent `user_payment_links` persistence (`user_id` + `payment_id`) and keep session creation resilient if linkage cannot be written.
    - Propagate `session_id` through `/checkout/success` -> `/auth` -> Google callback/session creation to prefer deterministic payment correlation.
    - Add/update tests for linkage creation, idempotent repeated auth callback behavior, and no-match safe handling.

### Completion Notes List

- Linked post-auth users to paid payments by preferring `stripe_session_id` lookup first, then falling back to latest paid-by-email matching when needed.
- Extended `POST /api/auth/session` to persist idempotent `user_payment_links` records without breaking existing session creation flow on retriable linkage issues.
- Propagated `session_id` across checkout success, `/auth`, and Google callback flow to improve deterministic payment correlation.
- Added and updated tests for linkage creation, idempotent repeated callback behavior, and no-match handling; full frontend test + lint suite passes.
- Enforced ownership checks so post-checkout account creation and linkage require checkout-email alignment; mismatched emails are blocked with safe guidance.
- Added provider-aware account guidance and callback recovery so unpaid/unknown Google auth returns to `/auth` with clear error + recovery CTA.
- Improved auth UX for post-payment flows: signup-only mode with confirm password, terms/privacy consent copy, Google button visual alignment, and prefilled checkout email.
- Hardened checkout flow UX: plan-first selector experience, improved duplicate-lock handling, explicit email-linking warning, and navigation refinements.

### File List

- docs/stories/4-2-link-payment-records-to-authenticated-users.md
- frontend/app/api/auth/session/route.ts
- frontend/app/api/auth/session/route.test.ts
- frontend/app/api/auth/account-provider/route.ts
- frontend/app/api/auth/account-provider/route.test.ts
- frontend/app/api/auth/validate-checkout-email/route.ts
- frontend/app/api/auth/validate-checkout-email/route.test.ts
- frontend/app/auth/auth-actions.ts
- frontend/app/auth/auth-actions.test.ts
- frontend/app/auth/auth-utils.ts
- frontend/app/auth/auth-utils.test.ts
- frontend/app/auth/callback/page.tsx
- frontend/app/auth/page.tsx
- frontend/app/checkout/page.tsx
- frontend/app/checkout/success/page.tsx
- frontend/app/checkout/checkout-pages.test.tsx
- frontend/components/Header.tsx

## Change Log

- 2026-02-05: Drafted Story 4.2 from epics, PRD, architecture, UX flow, and prior Story 4.1 implementation/review learnings.
- 2026-02-05: Status updated to ready-for-dev.
- 2026-02-05: Implemented auth-to-payment linkage (`stripe_session_id` first, email fallback), idempotent `user_payment_links` persistence, and added coverage for success/idempotent/no-match auth linkage paths.
- 2026-02-05: Added strict payment ownership validation, post-checkout signup gating, provider-aware auth messaging, and post-payment auth UX hardening (prefill/lock email, signup-only flow, plan-first checkout selector, and recovery guidance).
- 2026-02-06: Senior Developer Review notes appended.
- 2026-02-06: Addressed review findings (auth gating, provider lookup guard, payment lookup scope) and approved.

## Senior Developer Review (AI)

Reviewer: darko  
Date: 2026-02-06  
Outcome: Approve — all acceptance criteria implemented and prior review findings resolved.

### Summary
Core payment-to-user linkage is implemented and tested. The previously reported auth dead-end and account enumeration concerns have been addressed, and payment lookup responses are now scoped to required fields. File list reviewed with no omissions found. Tech stack: Next.js 16.1.6, React 19, TypeScript 5, Tailwind 4, Supabase, Stripe. Code quality and security review completed with no additional issues. No missing acceptance criteria or falsely completed tasks were found.

### Key Findings

**NONE**
- No outstanding issues found after fixes were applied.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| --- | --- | --- | --- |
| AC1 | Link payment record to authenticated user after auth completion. | IMPLEMENTED | `frontend/app/api/auth/session/route.ts:55-177`, `frontend/app/auth/auth-actions.ts:182-193`, `frontend/app/auth/callback/page.tsx:83-183` |
| AC2 | Store link in DB for future checks. | IMPLEMENTED | `frontend/app/api/auth/session/route.ts:102-133` |

Summary: 2 of 2 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Implement payment lookup + linkage logic after successful auth completion. | Completed | VERIFIED COMPLETE | `frontend/app/api/auth/session/route.ts:55-177` |
| Reuse existing auth completion flow to invoke linkage at the correct post-auth point. | Completed | VERIFIED COMPLETE | `frontend/app/auth/auth-actions.ts:182-193`, `frontend/app/auth/callback/page.tsx:83-183` |
| Ensure failures return concise user-safe errors and preserve retry path. | Completed | VERIFIED COMPLETE | `frontend/app/api/auth/session/route.ts:8-49,149-171`, `frontend/app/auth/auth-actions.ts:156-191` |
| Create/extend auth linkage API surface under `frontend/app/api/auth/*` using `{ data, error }`. | Completed | VERIFIED COMPLETE | `frontend/app/api/auth/session/route.ts:8-15`, `frontend/app/api/auth/validate-checkout-email/route.ts`, `frontend/app/api/auth/account-provider/route.ts` |
| Validate authenticated user context before writing linkage records. | Completed | VERIFIED COMPLETE | `frontend/app/api/auth/session/route.ts:45-50,102-133` |
| Enforce idempotent behavior to avoid duplicate linkage rows. | Completed | VERIFIED COMPLETE | `frontend/app/api/auth/session/route.ts:103-133` |
| Persist linkage in `user_payment_links` using existing patterns. | Completed | VERIFIED COMPLETE | `frontend/app/api/auth/session/route.ts:119-123` |
| Confirm linkage writes do not mutate existing payment ingestion. | Completed | VERIFIED COMPLETE | No writes to `payments` in linkage flow; insert only into `user_payment_links`. |
| Add/update tests for linkage success, idempotent handling, and failure paths. | Completed | VERIFIED COMPLETE | `frontend/app/api/auth/session/route.test.ts:116-235`, `frontend/app/auth/auth-actions.test.ts:26-265`, `frontend/app/api/auth/validate-checkout-email/route.test.ts:26-74`, `frontend/app/api/auth/account-provider/route.test.ts:22-99`, `frontend/app/api/auth/resume/request/route.test.ts:39-117`, `frontend/app/api/auth/resume/verify/route.test.ts:38-97`, `frontend/app/checkout/checkout-pages.test.tsx:67-176` |

Summary: 9 of 9 completed tasks verified, 0 questionable, 0 false completions.

### Test Coverage and Gaps
- Tests cover session linkage, idempotency, mismatch handling, and resume flows.  
- Tests mapped to AC1/AC2 via session linkage and auth flow integration tests listed above.
- No gaps identified for the acceptance criteria.

### Architectural Alignment
- Linkage uses `user_payment_links` and `stripe_session_id`-first lookup, consistent with `docs/architecture.md`.
- Email-based lookups remain server-side only and are aligned with the restricted access intent.

### Security Notes
- None.

### Best-Practices and References
- API responses should use `{ data, error }` envelope. (`docs/architecture.md`)
- Linkage via `payments` → `user_payment_links` using `stripe_session_id` as primary lookup. (`docs/architecture.md`)
- Testing strategy: integration tests for checkout/auth flows. (`docs/architecture.md`)
- Note: MCP doc search was unavailable in this environment; local docs were used.

### Action Items

**Code Changes Required:**
- None.

**Advisory Notes:**
- Note: No story context file found; review performed without `.context.xml`.
- Note: No Epic 4 tech spec found (`docs/tech-spec-epic-4*.md`).
