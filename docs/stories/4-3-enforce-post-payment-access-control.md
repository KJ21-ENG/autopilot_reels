# Story 4.3: Enforce post-payment access control

Status: done

## Story

As an authenticated paid user,
I want dashboard access to be granted only when my payment is linked,
so that access is protected and aligned with purchase status.

## Requirements Context Summary

- Epic objective for Story 4.3 is to ensure dashboard access is limited to authenticated users with a linked paid record, while unpaid users get a clear message and path back to checkout. [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control]
- PRD requires a protected placeholder dashboard and post-payment authentication flow that gates access based on paid linkage. [Source: docs/PRD.md#Placeholder-Dashboard] [Source: docs/PRD.md#Post‑Payment-Authentication] [Source: docs/PRD.md#Functional-Requirements]
- Architecture mandates protected routes verify Supabase session + paid linkage and follow cross-cutting API/error conventions. [Source: docs/architecture.md#Cross-Cutting-Decisions] [Source: docs/architecture.md#Security-Architecture] [Source: docs/architecture.md#Data-Architecture]
- UX flow requires a seamless post-payment journey from checkout success through auth to dashboard, with recovery paths that return users to checkout when access is blocked. [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success-→-Auth-→-Dashboard] [Source: docs/ux-design-specification.md#Journey-3-Checkout-Cancel/Failure-→-Return-to-Pricing]

## Acceptance Criteria

1. Given an authenticated user, when they attempt to access the dashboard, then access is allowed only if a paid record is linked. [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control]
2. Unpaid users see a clear message and a path to checkout. [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control]

## Tasks / Subtasks

- [x] Implement dashboard access guard that verifies Supabase session and paid linkage before allowing `/dashboard`. (AC: #1) [Source: docs/architecture.md#Security-Architecture] [Source: docs/architecture.md#Cross-Cutting-Decisions]
    - [x] Reuse existing auth/session helpers and linkage surfaces (no new endpoints). (AC: #1) [Source: docs/stories/4-2-link-payment-records-to-authenticated-users.md#File-List]
    - [x] Ensure guard relies on `user_payment_links` (not email-only checks) and preserves `{ data, error }` response envelope where API access is used. (AC: #1) [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Cross-Cutting-Decisions]
- [x] Add unpaid-user fallback UX on dashboard route with clear message and checkout path. (AC: #2) [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control] [Source: docs/ux-design-specification.md#Journey-3-Checkout-Cancel/Failure-→-Return-to-Pricing]
    - [x] Ensure messaging is concise and non-technical. (AC: #2) [Source: docs/architecture.md#Cross-Cutting-Decisions]
- [x] Add/update tests for paid access, unpaid access, and auth edge cases. (AC: #1, #2) [Source: docs/architecture.md#Testing-strategy]
    - [x] Integration test: authenticated + linked user reaches dashboard. (AC: #1)
    - [x] Integration test: authenticated + unlinked user sees block message and checkout path. (AC: #2)
    - [x] Integration test: unauthenticated user is redirected to auth flow. (AC: #1) [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success-→-Auth-→-Dashboard]

## Dev Notes

- Enforce access control by validating Supabase session + paid linkage (`user_payment_links`) before allowing `/dashboard`; avoid email-only checks. [Source: docs/architecture.md#Security-Architecture] [Source: docs/architecture.md#Data-Architecture]
- Prefer existing auth/session helpers and flows from Story 4.2 rather than introducing new endpoints or parallel linkage logic. [Source: docs/stories/4-2-link-payment-records-to-authenticated-users.md#File-List]
- Route protections should align with the project’s App Router structure and auth guard placement (`frontend/middleware.ts` or `frontend/lib/auth/guards.ts`). [Source: docs/architecture.md#Project-Structure]
- Maintain API response and error handling conventions (`{ data, error }`, concise user-facing errors, ISO-8601 UTC timestamps where applicable). [Source: docs/architecture.md#Cross-Cutting-Decisions]
- Testing should follow the lightweight strategy with integration coverage for auth/checkout/dashboard boundaries. [Source: docs/architecture.md#Testing-strategy]

### Learnings from Previous Story

**From Story 4-2-link-payment-records-to-authenticated-users (Status: done)**

- **New Auth + Linkage Surfaces**: Reuse the established post-auth linkage flow and helpers (`frontend/app/api/auth/session/route.ts`, `frontend/app/auth/auth-actions.ts`, `frontend/app/auth/callback/page.tsx`, `frontend/lib/supabase/*`) instead of creating new linkage endpoints. [Source: docs/stories/4-2-link-payment-records-to-authenticated-users.md#File-List]
- **Linkage Logic**: Payment linkage uses `stripe_session_id` first and persists idempotent records in `user_payment_links`; access control must rely on these linked records. [Source: docs/stories/4-2-link-payment-records-to-authenticated-users.md#Completion-Notes-List]
- **Auth UX Expectations**: Post-payment auth flow enforces clear, non-technical error messaging and recovery paths; access-control messaging should match this tone. [Source: docs/stories/4-2-link-payment-records-to-authenticated-users.md#Dev-Notes]
- **Testing Baseline**: Integration tests were added for linkage success/idempotency/no-match; extend this pattern for dashboard access gating. [Source: docs/stories/4-2-link-payment-records-to-authenticated-users.md#Tasks-/-Subtasks]

### Project Structure Notes

- Maintain established structure: `frontend/app/api/auth/*` for auth API, `frontend/middleware.ts` or `frontend/lib/auth/guards.ts` for route protection, and `frontend/app/dashboard/*` for the protected UI. [Source: docs/architecture.md#Project-Structure]
- Keep naming conventions consistent (snake_case DB columns, plural table names) and avoid creating new linkage tables for access control. [Source: docs/architecture.md#Naming-Patterns] [Source: docs/architecture.md#Data-Architecture]
- No structural conflicts expected; Story 4.3 extends existing Epic 4 auth linkage and prepares Epic 5 dashboard work. [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control] [Source: docs/epics.md#Story-5.1-Implement-protected-dashboard-shell]

### References

- Epic acceptance criteria for Story 4.3. [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control]
- Post-payment auth and protected dashboard requirements. [Source: docs/PRD.md#Post‑Payment-Authentication] [Source: docs/PRD.md#Placeholder-Dashboard] [Source: docs/PRD.md#Functional-Requirements]
- Access-control architecture (session + linkage) and response/error conventions. [Source: docs/architecture.md#Security-Architecture] [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Cross-Cutting-Decisions]
- UX flows for checkout → auth → dashboard and recovery to pricing. [Source: docs/ux-design-specification.md#Journey-2-Checkout-Success-→-Auth-→-Dashboard] [Source: docs/ux-design-specification.md#Journey-3-Checkout-Cancel/Failure-→-Return-to-Pricing]

## Project Structure Alignment Summary

- Enforce access control in existing auth/session and route-guard locations only; keep API logic under `frontend/app/api/auth/*`, route protections in `frontend/middleware.ts` or `frontend/lib/auth/guards.ts`, and dashboard in `frontend/app/dashboard/*`. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#Security-Architecture]
- Reuse the existing post-payment auth flow and linkage surfaces from Story 4.2 (`frontend/app/api/auth/session/route.ts`, `frontend/app/auth/auth-actions.ts`, `frontend/app/auth/callback/page.tsx`, and Supabase helpers in `frontend/lib/supabase/*`) instead of introducing new linkage endpoints. [Source: docs/stories/4-2-link-payment-records-to-authenticated-users.md#File-List]
- Authorization checks must rely on `user_payment_links` linkage (not email-only lookups) and adhere to `{ data, error }` response envelope and concise user-facing errors. [Source: docs/architecture.md#Data-Architecture] [Source: docs/architecture.md#Cross-Cutting-Decisions]
- No structural conflicts detected; Story 4.3 should be additive to the existing Epic 4 auth foundations and align with the established dashboard route. [Source: docs/epics.md#Story-4.3-Enforce-post‑payment-access-control] [Source: docs/architecture.md#Project-Structure]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

GPT-5 (Codex)

### Debug Log References

- 2026-02-06: Plan — update dashboard guard flow so unauthenticated users are redirected to auth, unpaid users see dashboard fallback with checkout CTA; add dashboard integration tests for paid/unpaid/unauthenticated; validate middleware behavior aligns with guard decisions.

### Completion Notes List

- Implemented dashboard access flow to redirect unauthenticated users to auth while allowing unpaid users to see the dashboard fallback and checkout CTA.
- Added dashboard access integration tests and middleware redirect coverage for unauthenticated users; introduced Vitest alias config to keep app-path imports consistent in tests.

### File List

- docs/stories/4-3-enforce-post-payment-access-control.md
- frontend/app/dashboard/page.test.tsx
- frontend/middleware.ts
- frontend/middleware.test.ts
- frontend/vitest.config.ts

## Change Log

- 2026-02-06: Drafted Story 4.3 from epics, PRD, architecture, UX flow, and prior Story 4.2 implementation/review learnings.
- 2026-02-06: Marked story as ready-for-dev.
- 2026-02-06: Implemented dashboard access gating adjustments, added unpaid fallback coverage, and shipped access-control integration tests.
- 2026-02-06: Senior Developer Review (AI) performed - Approved.

## Senior Developer Review (AI)

### Reviewer

darko

### Date

2026-02-06

### Outcome

**Approve**

Implementation fully satisfies acceptance criteria and architectural patterns.

### Summary

Solid implementation of dashboard access control. The route protection strategy correctly balances middleware redirection for unauthenticated users with page-level fallback for unpaid users, providing a smooth UX as requested. Security enforcement using `user_payment_links` is correctly implemented.

### Key Findings

- **High Quality**: Middleware and page-level guards are well-coordinated.
- **Security**: Correctly uses database linkage rather than just metadata.
- **Testing**: Good integration test coverage for authentication states.

### Acceptance Criteria Coverage

| AC# | Description                                            | Status      | Evidence                                                               |
| --- | ------------------------------------------------------ | ----------- | ---------------------------------------------------------------------- |
| 1   | Authenticated users allowed only if paid record linked | IMPLEMENTED | `frontend/lib/auth/guards.ts:85`, `frontend/app/dashboard/page.tsx:13` |
| 2   | Unpaid users see clear message and checkout path       | IMPLEMENTED | `frontend/app/dashboard/page.tsx:19`, `frontend/middleware.ts:15`      |

**Summary**: 2 of 2 acceptance criteria fully implemented.

### Task Completion Validation

| Task                                      | Marked As | Verified As       | Evidence                                                              |
| ----------------------------------------- | --------- | ----------------- | --------------------------------------------------------------------- |
| Implement dashboard access guard          | [x]       | VERIFIED COMPLETE | `frontend/lib/auth/guards.ts`                                         |
| Reuse existing auth/session helpers       | [x]       | VERIFIED COMPLETE | `frontend/lib/auth/guards.ts` imports                                 |
| Ensure guard relies on user_payment_links | [x]       | VERIFIED COMPLETE | `frontend/lib/auth/guards.ts:76`                                      |
| Add unpaid-user fallback UX               | [x]       | VERIFIED COMPLETE | `frontend/app/dashboard/page.tsx:18`                                  |
| Add/update tests                          | [x]       | VERIFIED COMPLETE | `frontend/app/dashboard/page.test.tsx`, `frontend/middleware.test.ts` |

**Summary**: 5 of 5 completed tasks verified.

### Test Coverage and Gaps

- `frontend/app/dashboard/page.test.tsx`: Covers paid/unpaid rendering.
- `frontend/middleware.test.ts`: Covers unauthenticated redirect.
- No significant gaps found for this scope.

### Architectural Alignment

- Code follows `frontend/lib/auth` and `frontend/app` structure.
- Reuses Supabase client pattern.
- API/Error handling conventions respected (though mostly UI logic here).

### Security Notes

- Linkage check properly verifies DB record, preventing metadata spoofing.

### Best-Practices and References

- Good separation of AuthState resolution and GuardDecision logic.

### Action Items

**Advisory Notes:**

- Note: `console.warn` in `guards.ts` is appropriate for MVP logging.
