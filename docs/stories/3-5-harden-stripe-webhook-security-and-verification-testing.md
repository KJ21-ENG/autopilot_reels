# Story 3.5: Harden Stripe Webhook Security and Verification Testing

Status: done

## Story

As a developer,
I want webhook signature verification and replay protection tested,
so that payment events are reliable and secure.

## Acceptance Criteria

1. **Webhook signature verification rejects invalid payloads**
    - Given Stripe webhook handling, when I send webhook payloads with invalid signatures, then the API rejects them and does not process the event. [Source: docs/epics.md#Story-35-Harden-Stripe-webhook-security-and-verification-testing]

2. **Valid webhook payloads are processed successfully**
    - Given Stripe webhook handling, when I send webhook payloads with valid signatures, then the API processes them successfully. [Source: docs/epics.md#Story-35-Harden-Stripe-webhook-security-and-verification-testing]

3. **Replay events are detected or safely idempotent**
    - Given Stripe webhook handling, when I send replayed webhook events, then they are detected or handled safely without duplicating side effects. [Source: docs/epics.md#Story-35-Harden-Stripe-webhook-security-and-verification-testing]

## Tasks / Subtasks

- [x] Add webhook signature verification tests (AC: #1, #2)
    - [x] Extend `frontend/app/api/stripe/webhook/route.test.ts` with a valid signature test that expects a successful response and processing path. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#API-Contracts]
    - [x] Add an invalid signature test that expects a rejection response and no processing. [Source: docs/architecture.md#Security-Architecture] [Source: docs/architecture.md#API-Contracts]

- [x] Add replay/idempotency verification tests (AC: #3)
    - [x] Simulate a replayed event payload and assert the handler detects replay or remains idempotent (no duplicate side effects). [Source: docs/epics.md#Story-35-Harden-Stripe-webhook-security-and-verification-testing]

- [x] Testing and documentation updates (AC: #1, #2, #3)
    - [x] Ensure tests align with `{ data, error }` response envelope expectations for webhook responses. [Source: docs/architecture.md#API-Contracts] [Source: docs/architecture.md#Format-Patterns]
    - [x] Note any security constraints or edge cases discovered during verification testing. [Source: docs/epics.md#Story-35-Harden-Stripe-webhook-security-and-verification-testing]

### Review Follow-ups (AI)

- [x] [AI-Review][High] Add assertions that no processing occurs when webhook signature verification fails (e.g., `insert` and `listLineItems` not called). (AC #1)
    - **Resolution**: Verified in `route.test.ts`. Invalid signature tests confirm no side effects (no Supabase calls).
- [x] [AI-Review][High] Document security constraints or edge cases discovered during verification testing in Dev Notes or Completion Notes.
    - **Resolution**: Documented below in Security Notes.

## Dev Notes

### Requirements Context

- Harden Stripe webhook security by verifying signatures and explicitly testing valid vs invalid webhook payloads. [Source: docs/epics.md#Story-35-Harden-Stripe-webhook-security-and-verification-testing]
- Ensure replayed webhook events are detected or safely idempotent during verification testing. [Source: docs/epics.md#Story-35-Harden-Stripe-webhook-security-and-verification-testing]
- The payment-first funnel relies on secure Stripe webhook handling as part of the MVP flow (checkout → post-payment auth). [Source: docs/PRD.md#Stripe-Checkout-Payment-First] [Source: docs/PRD.md#Functional-Requirements]
- Stripe webhooks are handled via `/api/stripe/webhook` in `frontend/app/api/stripe/webhook/route.ts`, which is the target for verification tests. [Source: docs/architecture.md#Project-Structure] [Source: docs/architecture.md#API-Contracts]
- Webhook security requires Stripe signature verification per the security architecture. [Source: docs/architecture.md#Security-Architecture]
- Security/edge-case notes:
    - **Invalid Signatures**: Must return 400 immediately. No database operations or Stripe API calls are permitted. Verified by test "returns invalid_signature when signature verification fails".
    - **Replay Attacks**: Duplicate webhook events are handled gracefully via database unique constraints (idempotent). Verified by test "treats replayed events as idempotent".

### Architecture Patterns and Constraints

- Route handlers live in `frontend/app/api/**/route.ts`, so webhook verification and tests must remain aligned to `frontend/app/api/stripe/webhook/route.ts`. [Source: docs/architecture.md#Project-Structure]
- API responses must use the `{ data, error }` envelope; tests should assert this format on both valid and invalid signatures. [Source: docs/architecture.md#API-Contracts] [Source: docs/architecture.md#Format-Patterns]
- Errors are concise and non-technical; ensure invalid signature handling returns a clear, minimal error response. [Source: docs/architecture.md#Cross-Cutting-Decisions]
- Logging uses basic `console` methods only; avoid adding structured logging when exercising verification tests. [Source: docs/architecture.md#Cross-Cutting-Decisions]

### Testing Guidance

- The testing strategy emphasizes lightweight integration tests for webhook flows; focus on signature verification and idempotency without adding end-to-end tests. [Source: docs/architecture.md#Cross-Cutting-Decisions]
- Keep test coverage co-located with the webhook route (`frontend/app/api/stripe/webhook/route.test.ts`) and follow established patterns from prior stories. [Source: docs/architecture.md#Project-Structure] [Source: docs/stories/3-4-validate-payment-first-flow-end-to-end.md#File-List]

### Project Structure Notes

- Stripe webhook logic remains in `frontend/app/api/stripe/webhook/route.ts`; verification tests should be added alongside existing route tests at `frontend/app/api/stripe/webhook/route.test.ts`. [Source: docs/architecture.md#Project-Structure] [Source: docs/stories/3-4-validate-payment-first-flow-end-to-end.md#Learnings-from-Previous-Story]
- API route handlers live under `frontend/app/api/**/route.ts` and should continue using that structure for webhook and related tests. [Source: docs/architecture.md#Project-Structure]
- No `unified-project-structure.md` was found in `docs/`; align to the architecture structure definitions instead. [Source: docs/architecture.md#Project-Structure]

### Learnings from Previous Story

**From Story 3-4-validate-payment-first-flow-end-to-end (Status: done)**

- **Existing Webhook Tests**: `frontend/app/api/stripe/webhook/route.test.ts` is already in use; extend it for signature verification and replay/idempotency checks rather than creating new test files. [Source: docs/stories/3-4-validate-payment-first-flow-end-to-end.md#File-List]
- **Recent Stripe Flow Validation**: Prior story validated the end-to-end payment-first path and webhook persistence; focus this story on security verification tests only, not revalidating the checkout flow. [Source: docs/stories/3-4-validate-payment-first-flow-end-to-end.md#Completion-Notes-List]

### References

- [Source: docs/epics.md#Story-35-Harden-Stripe-webhook-security-and-verification-testing]
- [Source: docs/PRD.md#Stripe-Checkout-Payment-First]
- [Source: docs/PRD.md#Functional-Requirements]
- [Source: docs/architecture.md#Project-Structure]
- [Source: docs/architecture.md#API-Contracts]
- [Source: docs/architecture.md#Format-Patterns]
- [Source: docs/architecture.md#Security-Architecture]
- [Source: docs/architecture.md#Cross-Cutting-Decisions]
- [Source: docs/stories/3-4-validate-payment-first-flow-end-to-end.md#File-List]
- [Source: docs/stories/3-4-validate-payment-first-flow-end-to-end.md#Completion-Notes-List]

## Change Log

- 2026-02-04: Drafted story from epics, architecture, UX context, and prior story learnings.
- 2026-02-04: Added webhook signature verification and replay/idempotency tests; validated webhook response envelope; ran frontend test suite.
- 2026-02-04: Senior Developer Review notes appended.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

GPT-5 (Codex)

### Debug Log References

- 2026-02-04: Plan: extend webhook route tests to assert valid signature processing, invalid signature rejection, and replay/idempotency handling via duplicate insert response; ensure `{ data, error }` envelope checks for all cases.

### Completion Notes List

- Added webhook tests for valid signature processing, invalid signature rejection, and replay/idempotent handling via duplicate insert response.
- Verified webhook responses consistently use the `{ data, error }` envelope and replayed events safely return success without double side effects.
- Tests: `npm test` (frontend/vitest).
- Acceptance criteria alignment confirmed for AC #1-3 via updated webhook verification tests.
- File List reviewed and complete for this change set.
- Regression suite executed via `npm test` (frontend/vitest).
- Only permitted story sections were modified (Tasks/Subtasks, Dev Agent Record, File List, Change Log, Status).

### File List

- frontend/app/api/stripe/webhook/route.test.ts
- docs/stories/3-5-harden-stripe-webhook-security-and-verification-testing.md
- docs/sprint-status.yaml

## Senior Developer Review (AI)

Reviewer: darko  
Date: 2026-02-04  
Outcome: Approve  
Justification: Acceptance criteria and completed tasks are now fully verified with evidence.

Summary
The acceptance criteria are implemented in the webhook handler and tests, and all tasks are now verified complete. No story context file or epic tech spec was available; review used `docs/architecture.md` as the primary reference.

Key Findings

- WARNING: No story context file found for this story.
- WARNING: No epic tech spec found for Epic 3.

Acceptance Criteria Coverage

| AC# | Description                                             | Status      | Evidence                                                                                                |
| --- | ------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| AC1 | Webhook signature verification rejects invalid payloads | IMPLEMENTED | frontend/app/api/stripe/webhook/route.ts:90-118                                                         |
| AC2 | Valid webhook payloads are processed successfully       | IMPLEMENTED | frontend/app/api/stripe/webhook/route.ts:109-165, frontend/app/api/stripe/webhook/route.test.ts:38-89   |
| AC3 | Replay events are detected or safely idempotent         | IMPLEMENTED | frontend/app/api/stripe/webhook/route.ts:147-151, frontend/app/api/stripe/webhook/route.test.ts:134-173 |

Summary: 3 of 3 acceptance criteria fully implemented.

Task Completion Validation

| Task                                                             | Marked As | Verified As       | Evidence                                                                          |
| ---------------------------------------------------------------- | --------- | ----------------- | --------------------------------------------------------------------------------- |
| Add webhook signature verification tests (AC: #1, #2)            | Complete  | VERIFIED COMPLETE | frontend/app/api/stripe/webhook/route.test.ts:38-134                              |
| Extend valid signature test expecting success                    | Complete  | VERIFIED COMPLETE | frontend/app/api/stripe/webhook/route.test.ts:38-89                               |
| Add invalid signature test expecting rejection and no processing | Complete  | VERIFIED COMPLETE | frontend/app/api/stripe/webhook/route.test.ts:110-134                             |
| Add replay/idempotency verification tests (AC: #3)               | Complete  | VERIFIED COMPLETE | frontend/app/api/stripe/webhook/route.test.ts:134-173                             |
| Simulate replayed payload and assert idempotent handling         | Complete  | VERIFIED COMPLETE | frontend/app/api/stripe/webhook/route.test.ts:134-173                             |
| Testing and documentation updates (AC: #1, #2, #3)               | Complete  | VERIFIED COMPLETE | frontend/app/api/stripe/webhook/route.test.ts:74-75,103-107,127-134,170-171       |
| Ensure tests align with `{ data, error }` envelope               | Complete  | VERIFIED COMPLETE | frontend/app/api/stripe/webhook/route.test.ts:74-75,103-107,127-131,170-171       |
| Note any security constraints or edge cases discovered           | Complete  | VERIFIED COMPLETE | docs/stories/3-5-harden-stripe-webhook-security-and-verification-testing.md:37-45 |

Summary: 7 of 7 completed tasks verified, 0 questionable, 0 falsely marked complete.

Test Coverage and Gaps

- Invalid signature test now asserts "no processing" (`insert` and `listLineItems` not called). [file: frontend/app/api/stripe/webhook/route.test.ts:110-134]

Architectural Alignment

- API responses follow `{ data, error }` envelope. [file: frontend/app/api/stripe/webhook/route.ts:6-166]
- Webhook signature verification enforced before processing events. [file: frontend/app/api/stripe/webhook/route.ts:90-118]

Security Notes

- Signature verification enforced and failures return `invalid_signature`. [file: frontend/app/api/stripe/webhook/route.ts:109-118]
- Idempotency for duplicate inserts handled via `23505`. [file: frontend/app/api/stripe/webhook/route.ts:147-151]

Best-Practices and References

- `docs/architecture.md` (API Contracts, Security Architecture, Cross-Cutting Decisions)

Action Items

Code Changes Required:

- Note: No open code-change items after applied fixes.

Advisory Notes:

- Note: Consider adding a short comment in the test clarifying the idempotency expectation (duplicate inserts treated as success).
