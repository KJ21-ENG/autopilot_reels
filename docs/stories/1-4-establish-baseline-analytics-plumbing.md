# Story 1.4: Establish baseline analytics plumbing

Status: review

## Story

As a product owner,
I want a minimal analytics plumbing baseline,
so that funnel events can be wired quickly once checkout and auth are live.

## Acceptance Criteria

1. Given the marketing and placeholder routes, when a user performs key actions (view landing, click CTA), then events are captured in a consistent format and can be extended for later funnel steps. [Source: docs/epics.md#Story-14-Establish-baseline-analytics-plumbing]
2. The tracking system is documented for future story implementation. [Source: docs/epics.md#Story-14-Establish-baseline-analytics-plumbing]

## Tasks / Subtasks

- [x] Define baseline event schema and payload shape for key actions (view landing, CTA click) using the `{ data, error }` envelope and document it in code comments or a short doc note (AC: 1, 2). [Source: docs/tech-spec-epic-1.md#APIs-and-Interfaces; docs/tech-spec-epic-1.md#Observability; docs/epics.md#Story-14-Establish-baseline-analytics-plumbing]
  - [x] Confirm event names align with funnel stages for later expansion (AC: 1). [Source: docs/PRD.md#Funnel-Analytics; docs/ux-design-specification.md#User-Journey-Flows]
- [x] Implement baseline analytics plumbing in `frontend/lib/analytics/*` and the API route at `/api/analytics/event` with `{ data, error }` response shape (AC: 1). [Source: docs/architecture.md#Project-Structure; docs/architecture.md#API-Contracts; docs/tech-spec-epic-1.md#Detailed-Design]
  - [x] Ensure event capture is lightweight and uses console logging only (no external tooling) (AC: 1). [Source: docs/architecture.md#Logging-Strategy; docs/tech-spec-epic-1.md#Observability]
- [x] Add minimal usage guidance for future stories (where to emit events, expected payload) (AC: 2). [Source: docs/epics.md#Story-14-Establish-baseline-analytics-plumbing]
- [x] Testing: add lightweight unit coverage for event payload validation/formatting and API response shape (AC: 1). [Source: docs/architecture.md#Testing-Strategy; docs/tech-spec-epic-1.md#Test-Strategy-Summary]
  - [x] Testing: add a documentation-focused check (e.g., lint or unit test that asserts event schema/docs are exported or referenced) to cover AC: 2. [Source: docs/architecture.md#Testing-Strategy]

## Dev Notes

### Requirements Context Summary

- Establish a minimal analytics plumbing baseline so funnel events can be captured and extended later (landing view, CTA click, checkout start). [Source: docs/epics.md#Story-14-Establish-baseline-analytics-plumbing; docs/PRD.md#Funnel-Analytics; docs/ux-design-specification.md#User-Journey-Flows]
- Events must be captured in a consistent format with a documented tracking approach for future stories. [Source: docs/epics.md#Story-14-Establish-baseline-analytics-plumbing]
- Use the existing `frontend/` Next.js App Router app; analytics plumbing is expected in `frontend/lib/analytics/*` with an API route at `/api/analytics/event` returning the `{ data, error }` envelope. [Source: docs/architecture.md#Project-Structure; docs/architecture.md#API-Contracts; docs/tech-spec-epic-1.md#Detailed-Design; docs/tech-spec-epic-1.md#APIs-and-Interfaces]
- Baseline observability is lightweight (console logging); keep event capture minimal and aligned to the Supabase `events` table schema for later analytics work. [Source: docs/architecture.md#Logging-Strategy; docs/tech-spec-epic-1.md#Detailed-Design; docs/tech-spec-epic-1.md#Observability]

### Architecture Patterns and Constraints

- Analytics plumbing should follow the documented App Router layout: shared utilities in `frontend/lib/analytics/*` and API route handler at `frontend/app/api/analytics/event/route.ts`. [Source: docs/architecture.md#Project-Structure; docs/architecture.md#API-Contracts]
- Responses must use the `{ data, error }` envelope and errors follow `{ error: { code, message } }` where applicable. [Source: docs/architecture.md#Format-Patterns; docs/architecture.md#Error-Handling]
- Logging is console-only; avoid external analytics tooling in this baseline story. [Source: docs/architecture.md#Logging-Strategy]

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
- Detected conflicts or variances (with rationale)

### Structure Alignment Summary

- No unified project structure doc found; follow the current repo patterns and the architecture-defined layout under `frontend/`. [Source: docs/architecture.md#Project-Structure]
- Analytics plumbing should live in `frontend/lib/analytics/*` with the event capture API at `frontend/app/api/analytics/event/route.ts`, consistent with the documented App Router structure. [Source: docs/architecture.md#Project-Structure; docs/architecture.md#API-Contracts]
- Event storage aligns to Supabase `events` table per epic tech spec; avoid introducing new storage surfaces in this story. [Source: docs/tech-spec-epic-1.md#Detailed-Design; docs/tech-spec-epic-1.md#Data-Models-and-Contracts]

### References

- Epic story requirements: [Source: docs/epics.md#Story-14-Establish-baseline-analytics-plumbing]
- Epic 1 technical spec (analytics plumbing + API envelope): [Source: docs/tech-spec-epic-1.md#Detailed-Design; docs/tech-spec-epic-1.md#APIs-and-Interfaces; docs/tech-spec-epic-1.md#Observability]
- Epic-level AC mapping: Story 1.4 implements Epic 1 AC5 “Baseline analytics plumbing is defined with an event schema and capture mechanism.” [Source: docs/tech-spec-epic-1.md#Acceptance-Criteria-Authoritative]
- Architecture (project structure, API contracts, logging, testing strategy): [Source: docs/architecture.md#Project-Structure; docs/architecture.md#API-Contracts; docs/architecture.md#Logging-Strategy; docs/architecture.md#Testing-Strategy]
- PRD funnel analytics requirements: [Source: docs/PRD.md#Funnel-Analytics]
- UX journey context for key actions to instrument: [Source: docs/ux-design-specification.md#User-Journey-Flows]

### Learnings from Previous Story

**From Story 1-3-add-baseline-route-protection-scaffolds (Status: done)**

- **Guard Reuse**: Route protection uses centralized helpers in `frontend/lib/auth/guards.ts` and middleware in `frontend/middleware.ts`; keep analytics plumbing separate but follow the same centralized utility pattern for reuse. [Source: docs/stories/1-3-add-baseline-route-protection-scaffolds.md#Tasks--Subtasks]
- **Fail-Closed Defaults**: Scaffolds default to deny/redirect when state is unknown; apply the same conservative approach for analytics payload validation (reject invalid events rather than silently accepting). [Source: docs/stories/1-3-add-baseline-route-protection-scaffolds.md#Dev-Notes]
- **Testing Pattern**: Unit tests exist in `frontend/lib/auth/guards.test.ts` validating behavior and reuse; mirror this pattern for analytics payload validation/tests. [Source: docs/stories/1-3-add-baseline-route-protection-scaffolds.md#Dev-Agent-Record]
- **Advisory Note**: Next.js 16 deprecates `middleware.ts` in favor of `proxy.ts` (advisory only); no action required for analytics, but keep future routing upgrades in mind. [Source: docs/stories/1-3-add-baseline-route-protection-scaffolds.md#Senior-Developer-Review-AI]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References
- 2026-02-04: Planned baseline analytics schema + validation, API route handler, CTA/landing emitters, docs, and tests.
- 2026-02-04: Switched CTA tracking to beacon-only delivery for navigation-safe capture; re-ran tests and lint.

### Completion Notes List
- ✅ Added baseline analytics schema, validation, and emit helper for landing + CTA events.
- ✅ Implemented `/api/analytics/event` route with `{ data, error }` envelope and console logging.
- ✅ Added usage guidance in `frontend/docs/analytics.md` and tests for validation, API response, and documentation coverage.
- ✅ Updated CTA tracking to use `sendBeacon` only to avoid navigation race conditions; tests + lint green.

### File List
- frontend/lib/analytics/events.ts
- frontend/lib/analytics/validate.ts
- frontend/lib/analytics/emit.ts
- frontend/lib/analytics/index.ts
- frontend/lib/analytics/validate.test.ts
- frontend/lib/analytics/docs.test.ts
- frontend/app/api/analytics/event/route.ts
- frontend/app/api/analytics/event/route.test.ts
- frontend/components/LandingAnalytics.tsx
- frontend/app/page.tsx
- frontend/components/Header.tsx
- frontend/components/Hero.tsx
- frontend/components/Pricing.tsx
- frontend/docs/analytics.md

## Change Log

- 2026-02-04: Draft created from Epic 1 story 1.4 requirements.
- 2026-02-04: Implemented baseline analytics plumbing, docs, and tests; added CTA + landing instrumentation.
