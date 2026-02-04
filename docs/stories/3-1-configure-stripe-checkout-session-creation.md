# Story 3.1: Configure Stripe Checkout Session Creation

Status: done

## Story

As a visitor,
I want to start checkout directly from the pricing CTA,
so that I can pay without creating an account first.

## Acceptance Criteria

1. **CTA → Stripe Checkout session creation**
   - When a visitor clicks the primary pricing CTA, a Stripe Checkout session is created server-side and the user is redirected to the Stripe-hosted checkout URL. [Source: docs/epics.md#Story-31-Configure-Stripe-Checkout-session-creation]

2. **Plan/price metadata included**
   - The Stripe Checkout session includes plan/price metadata sufficient for later payment-to-user linkage. [Source: docs/epics.md#Story-31-Configure-Stripe-Checkout-session-creation]
## Tasks / Subtasks

- [x] Implement server-side checkout creation API route `frontend/app/api/stripe/checkout/route.ts` (AC: #1, #2)
  - [x] Initialize Stripe SDK with server key and configured API version (AC: #1) [Source: docs/architecture.md#Technology-Stack-Details]
  - [x] Create session with product/price identifiers and metadata for later linkage (AC: #1, #2) [Source: docs/epics.md#Story-31-Configure-Stripe-Checkout-session-creation]
  - [x] Return `{ data: { checkout_url }, error: null }` on success; `{ data: null, error: { code, message } }` on failure. [Source: docs/architecture.md#API-Contracts] [Source: docs/architecture.md#Cross-Cutting-Decisions]

- [x] Wire CTA flow to call checkout API and redirect to Stripe Checkout URL (AC: #1) [Source: docs/ux-design-specification.md#Journey-1-Landing-CTA-Stripe-Checkout]

- [x] Add minimal logging for checkout creation failures using `console.*`. [Source: docs/architecture.md#Logging-Strategy]

- [x] Testing
  - [x] Add integration test(s) for checkout session creation success path (AC: #1, #2) [Source: docs/architecture.md#Cross-Cutting-Decisions]
  - [x] Add integration test(s) for error envelope on Stripe failure (AC: #1) [Source: docs/architecture.md#Cross-Cutting-Decisions]

### Review Follow-ups (AI)
- [x] [AI-Review][Med] Return `{ data, error }` envelope when `STRIPE_SECRET_KEY` is missing (align API contract).
- [x] [AI-Review][Low] Add integration test for missing `STRIPE_SECRET_KEY` to assert error envelope behavior.
## Dev Notes

- Use Stripe Checkout (hosted) for payment-first flow; avoid client-side payment handling to reduce PCI scope. [Source: docs/PRD.md#Stripe-Checkout-Payment-First] [Source: docs/architecture.md#Security-Architecture]
- Create checkout sessions via Next.js App Router route handlers and return `{ data, error }` envelopes. [Source: docs/architecture.md#Cross-Cutting-Decisions] [Source: docs/architecture.md#API-Contracts]
- Maintain fast CTA → checkout redirect; avoid heavy client work before redirect. [Source: docs/PRD.md#Non-Functional-Requirements]
- Use existing Stripe library layout in `frontend/lib/stripe/*` and API route at `frontend/app/api/stripe/checkout/route.ts`. [Source: docs/architecture.md#Project-Structure]
- Log failures using `console.info|warn|error` only. [Source: docs/architecture.md#Logging-Strategy]

### Project Structure Notes

- App Router routes live in `frontend/app/**`; API handlers in `frontend/app/api/**/route.ts`. [Source: docs/architecture.md#Structure-Patterns]
- Shared utilities in `frontend/lib/**`; keep Stripe helpers under `frontend/lib/stripe/*`. [Source: docs/architecture.md#Structure-Patterns]

### References

- [Source: docs/epics.md#Story-31-Configure-Stripe-Checkout-session-creation]
- [Source: docs/PRD.md#Stripe-Checkout-Payment-First]
- [Source: docs/PRD.md#Non-Functional-Requirements]
- [Source: docs/architecture.md#Cross-Cutting-Decisions]
- [Source: docs/architecture.md#API-Contracts]
- [Source: docs/architecture.md#Project-Structure]
- [Source: docs/architecture.md#Structure-Patterns]
- [Source: docs/architecture.md#Security-Architecture]


## Change Log

- 2026-02-04: Drafted story from epics, PRD, and architecture sources.
- 2026-02-04: Implemented Stripe checkout session creation flow, CTA wiring, and integration tests.
- 2026-02-04: Senior Developer Review notes appended.
- 2026-02-04: Updated review notes with tech stack, test mapping, and external references.
- 2026-02-04: Addressed review follow-ups; tests passing; story approved.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

GPT-5 (Codex)

### Debug Log References
1. 2026-02-04: Plan: add Stripe server helper, implement `/api/stripe/checkout` route with env validation + `{ data, error }` envelope, wire `/checkout` page to POST and redirect, pass plan/billing/source metadata from CTAs, add integration tests for success + error, then run `npm test`.

### Completion Notes List
1. Implemented Stripe server helper plus `/api/stripe/checkout` route with env validation, metadata, and error envelopes; wired `/checkout` to POST and redirect while passing CTA plan/billing/source metadata.
2. Added Stripe checkout route integration tests for success + failure; ran `npm test`.
3. Manual validation: Stripe Checkout session completed successfully; metadata included `billing`, `plan`, `source`, `price_id`, and `product_id`.

### File List
docs/sprint-status.yaml
docs/stories/3-1-configure-stripe-checkout-session-creation.md
frontend/app/api/stripe/checkout/route.test.ts
frontend/app/api/stripe/checkout/route.ts
frontend/app/checkout/page.tsx
frontend/components/Hero.tsx
frontend/components/Pricing.tsx
frontend/lib/stripe/server.ts
frontend/package.json

## Senior Developer Review (AI)

Reviewer: darko  
Date: 2026-02-04  
Outcome: Approve — Review follow-ups implemented and tests passing.

### Summary
- CTA → checkout flow is implemented and redirects correctly.
- Stripe session metadata includes plan/billing/source/price/product identifiers.
- Review follow-ups completed: error envelope on missing secret key and test coverage added.
- Warnings: No story context file found; no Epic 3 tech spec found.
- File List reviewed against ACs/tasks and appears complete for this story.

### Tech Stack Detected
- Next.js App Router 16.1.6
- React 19.2.3
- TypeScript 5.x
- Tailwind CSS 4.1.x
- Stripe SDK 20.1.0
- Vitest 2.1.x

### Key Findings
**None.** Review follow-ups addressed and tests passing.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| --- | --- | --- | --- |
| AC1 | CTA → Stripe Checkout session creation with redirect | IMPLEMENTED | `frontend/components/Hero.tsx:75-93`, `frontend/components/Pricing.tsx:98-168`, `frontend/app/checkout/page.tsx:26-47`, `frontend/app/api/stripe/checkout/route.ts:96-117` |
| AC2 | Plan/price metadata included | IMPLEMENTED | `frontend/app/api/stripe/checkout/route.ts:61-107`, `frontend/app/checkout/page.tsx:14-23`, `frontend/components/Pricing.tsx:98-103` |

Summary: 2 of 2 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Implement server-side checkout creation API route | Complete | QUESTIONABLE | `frontend/app/api/stripe/checkout/route.ts:60-124`, `frontend/lib/stripe/server.ts:5-11` |
| Initialize Stripe SDK with server key + API version | Complete | VERIFIED COMPLETE | `frontend/lib/stripe/server.ts:1-11` |
| Create session with product/price identifiers + metadata | Complete | VERIFIED COMPLETE | `frontend/app/api/stripe/checkout/route.ts:61-107` |
| Return `{ data, error }` envelopes | Complete | QUESTIONABLE | `frontend/app/api/stripe/checkout/route.ts:64-123`, `frontend/lib/stripe/server.ts:5-11` |
| Wire CTA flow to call checkout API + redirect | Complete | VERIFIED COMPLETE | `frontend/components/Hero.tsx:75-93`, `frontend/components/Pricing.tsx:98-168`, `frontend/app/checkout/page.tsx:26-47` |
| Add minimal logging for checkout failures | Complete | VERIFIED COMPLETE | `frontend/app/api/stripe/checkout/route.ts:65,79,90,119`, `frontend/app/checkout/page.tsx:52` |
| Add integration test(s) for checkout success | Complete | VERIFIED COMPLETE | `frontend/app/api/stripe/checkout/route.test.ts:23-61` |
| Add integration test(s) for Stripe failure error envelope | Complete | VERIFIED COMPLETE | `frontend/app/api/stripe/checkout/route.test.ts:63-88` |

Summary: 6 of 8 completed tasks verified, 2 questionable, 0 falsely marked complete.

### Test Coverage and Gaps
- Covered: success path, Stripe error envelope, missing price/product env, missing secret key env, missing/invalid origin.  
  Evidence: `frontend/app/api/stripe/checkout/route.test.ts:23-190`
- AC → Test mapping:
  - AC1 (CTA → checkout session + redirect): `frontend/app/api/stripe/checkout/route.test.ts:23-61`, `frontend/app/api/stripe/checkout/route.test.ts:63-88`
  - AC2 (Plan/price metadata included): `frontend/app/api/stripe/checkout/route.test.ts:23-61`
- Gap: none identified for this story's scope.

### Architectural Alignment
- Uses Next.js App Router route handlers and `{ data, error }` envelope per architecture.  
  Evidence: `frontend/app/api/stripe/checkout/route.ts:1-124`, `docs/architecture.md` (API contracts, structure patterns)
- Logging via `console.*` only.  
  Evidence: `frontend/app/api/stripe/checkout/route.ts:65,79,90,119`, `frontend/app/checkout/page.tsx:52`

### Security Notes
- Origin validation reduces open redirect risk for Stripe success/cancel URLs.  
  Evidence: `frontend/app/api/stripe/checkout/route.ts:27-58`

### Best-Practices and References
- Keep Stripe session creation server-side only.
- Preserve `{ data, error }` contract for all API responses.
- Validate redirect origins to prevent open redirect abuse.
- Use concise user-facing error messages.
- External references (web fallback):
```
Stripe Checkout Sessions API: https://docs.stripe.com/api/checkout/sessions/create
Stripe Metadata guide: https://docs.stripe.com/metadata
Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
```

### Action Items

**Code Changes Required:**
- Note: All review follow-ups completed.

**Advisory Notes:**
- Note: Add story context XML for traceability in future reviews.
- Note: Add Epic 3 tech spec to `docs/` for future traceability.
