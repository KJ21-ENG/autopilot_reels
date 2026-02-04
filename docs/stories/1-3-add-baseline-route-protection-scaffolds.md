# Story 1.3: Add baseline route protection scaffolds

Status: done

## Change Log

- 2026-02-04: Draft created from Epic 1 story 1.3 requirements.
- 2026-02-04: Senior Developer Review notes appended.

## Story

As a developer,
I want route protection scaffolds in place,
so that protected areas can be enforced once auth is wired.

## Acceptance Criteria

1. Given public marketing routes and a placeholder dashboard, when a user navigates to protected routes, then unauthenticated access is redirected to the post‑payment auth flow or a clear access message is shown. [Source: docs/epics.md#Story-13-Add-baseline-route-protection-scaffolds]
2. Protection logic is centralized and reusable. [Source: docs/epics.md#Story-13-Add-baseline-route-protection-scaffolds]

## Tasks / Subtasks

- [x] Implement baseline route protection scaffolds in `frontend/middleware.ts` and `frontend/lib/auth/guards.ts` (AC: 2). [Source: docs/tech-spec-epic-1.md#System-Architecture-Alignment; docs/architecture.md#Project-Structure]
  - [x] Ensure middleware/guards default to redirect or deny when auth/payment state is unknown (AC: 1). [Source: docs/tech-spec-epic-1.md#Non-Functional-Requirements]
- [x] Wire protected routes (e.g., `/dashboard`) to use the shared guard logic and show access messaging for unauthenticated users (AC: 1, 2). [Source: docs/epics.md#Story-13-Add-baseline-route-protection-scaffolds]
  - [x] Add clear access message or redirect target for unauthenticated users (AC: 1). [Source: docs/epics.md#Story-13-Add-baseline-route-protection-scaffolds]
- [x] Testing: verify protected route access behavior for unauthenticated users (AC: 1). [Source: docs/tech-spec-epic-1.md#Test-Strategy-Summary]
  - [x] Testing: verify centralized guard logic is reused by middleware and routes (AC: 2). [Source: docs/tech-spec-epic-1.md#System-Architecture-Alignment]

## Dev Notes

### Requirements Context Summary

- Route protection scaffolds must be in place so protected areas can be enforced once auth is wired. [Source: docs/epics.md#Story-13-Add-baseline-route-protection-scaffolds]
- Unauthenticated access to protected routes should redirect to the post‑payment auth flow or show a clear access message. [Source: docs/epics.md#Story-13-Add-baseline-route-protection-scaffolds]
- Protection logic must be centralized and reusable (middleware/guards). [Source: docs/epics.md#Story-13-Add-baseline-route-protection-scaffolds; docs/tech-spec-epic-1.md#System-Architecture-Alignment]
- Implement scaffolds within the existing `frontend/` Next.js App Router app; no new app surface. [Source: docs/architecture.md#Project-Initialization; docs/tech-spec-epic-1.md#System-Architecture-Alignment]

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
- Detected conflicts or variances (with rationale)

### Structure Alignment Summary

- Expected route protection scaffolds should live in `frontend/middleware.ts` and `frontend/lib/auth/guards.ts` per architecture and tech spec; create these if missing. [Source: docs/architecture.md#Project-Structure; docs/tech-spec-epic-1.md#System-Architecture-Alignment]
- Keep all changes within the existing `frontend/` Next.js App Router app; do not introduce new app surfaces. [Source: docs/architecture.md#Project-Initialization]
- No unified project structure doc found; follow current repo patterns and naming in `frontend/`. [Source: docs/architecture.md#Project-Structure]

### Learnings from Previous Story

**From Story 1-2-set-up-deployment-baseline-and-preview-pipeline (Status: done)**

- **Runtime Baseline**: Node 24.x pinning and deployment baseline docs are already established; do not alter runtime pinning in this story. [Source: docs/stories/1-2-set-up-deployment-baseline-and-preview-pipeline.md#Dev-Notes]
- **Docs Location**: Deployment/runtime docs live in `docs/runtime-environment.md`; keep route protection notes in story and code, not in deployment docs. [Source: docs/stories/1-2-set-up-deployment-baseline-and-preview-pipeline.md#Dev-Agent-Record]

### References

- Epic story requirements: [Source: docs/epics.md#Story-13-Add-baseline-route-protection-scaffolds]
- Epic 1 technical spec (route protection scaffolds): [Source: docs/tech-spec-epic-1.md#System-Architecture-Alignment; docs/tech-spec-epic-1.md#Detailed-Design]
- Architecture (project initialization and structure): [Source: docs/architecture.md#Project-Initialization; docs/architecture.md#Project-Structure]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- 2026-02-04: Plan to add centralized guard helpers in `frontend/lib/auth/guards.ts`, wire `frontend/middleware.ts` to enforce deny/redirect on protected routes, and reuse the same guard logic in `frontend/app/dashboard/page.tsx` for access messaging. Add unit tests for guard decisions and a source-level check that middleware + dashboard import the shared helper.

### Completion Notes List

- Added centralized guard helpers and Next.js middleware to deny/redirect by default when auth/payment state is unknown.
- Reused guard logic in the dashboard route to display access messaging with clear redirect targets.
- Added unit tests for guard decisions and wiring reuse checks; lint and tests passed.

### File List

- docs/stories/1-3-add-baseline-route-protection-scaffolds.md
- frontend/app/dashboard/page.tsx
- frontend/lib/auth/guards.test.ts
- frontend/lib/auth/guards.ts
- frontend/middleware.ts
- frontend/package-lock.json
- frontend/package.json

## Senior Developer Review (AI)

### Reviewer

darko

### Date

2026-02-04

### Outcome

Approve — all acceptance criteria implemented and all completed tasks verified with evidence.

### Summary

Route protection scaffolds are centralized in a shared guard module and reused by middleware and the dashboard route. Middleware defaults to redirect/deny when auth/payment state is unknown, and the dashboard shows clear access messaging for unauthenticated users. Tests cover guard decision logic and verify reuse of shared helpers. No blocking issues found.

### Review Inputs and Evidence

- Story status verified as "review" prior to approval; updated to "done" after approval.
- Story context file: not found; warning recorded. (Dev Agent Record → Context Reference is empty.)
- Epic tech spec located: `docs/tech-spec-epic-1.md`.
- Architecture/standards docs loaded: `docs/architecture.md`, `docs/ux-design-specification.md`.
- File List reviewed for completeness: matches all files referenced in AC/task validation evidence.

### Tech Stack Detected

- Next.js App Router 16.1.6, React 19.2.3, TypeScript 5.x, Tailwind CSS 4.x, Vitest 2.x (from `frontend/package.json`).

### Best-Practices and References

- MCP doc search unavailable; web fallback used for Next.js Middleware and cookies APIs.
- References:
  ```
  https://nextjs.org/docs/app/api-reference/file-conventions/middleware
  https://nextjs.org/docs/app/guides/upgrading/version-16
  https://nextjs.org/docs/14/app/building-your-application/routing/middleware
  https://nextjs.org/docs/14/app/api-reference/file-conventions/middleware
  https://nextjs.org/docs/app/api-reference/functions/cookies
  ```

### Key Findings

**LOW**
- Guard “known” state treats any session or paid cookie as sufficient to mark state as known. This is acceptable for scaffolding but should be hardened once real auth is wired. Evidence: `frontend/lib/auth/guards.ts:23-33`
- Next.js 16 deprecates the `middleware.ts` convention in favor of `proxy.ts`; plan a migration when runtime standards are revisited. Evidence: Next.js Proxy documentation (see references above).

### Code Quality Review

- Reviewed `frontend/lib/auth/guards.ts`, `frontend/middleware.ts`, and `frontend/app/dashboard/page.tsx` for correctness, redirect behavior, and consistency with architecture and tech spec. No defects found.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| --- | --- | --- | --- |
| AC1 | Unauthenticated users are redirected to post‑payment auth or shown a clear access message for protected routes. | IMPLEMENTED | `frontend/lib/auth/guards.ts:47-71`, `frontend/middleware.ts:5-17`, `frontend/app/dashboard/page.tsx:10-24` |
| AC2 | Protection logic is centralized and reusable. | IMPLEMENTED | `frontend/lib/auth/guards.ts:1-78`, `frontend/middleware.ts:3-10`, `frontend/app/dashboard/page.tsx:4-9` |

Summary: 2 of 2 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Implement baseline route protection scaffolds in `frontend/middleware.ts` and `frontend/lib/auth/guards.ts` (AC: 2). | Completed | VERIFIED COMPLETE | `frontend/lib/auth/guards.ts:1-78`, `frontend/middleware.ts:1-21` |
| Ensure middleware/guards default to redirect or deny when auth/payment state is unknown (AC: 1). | Completed | VERIFIED COMPLETE | `frontend/lib/auth/guards.ts:47-71` |
| Wire protected routes (e.g., `/dashboard`) to use the shared guard logic and show access messaging for unauthenticated users (AC: 1, 2). | Completed | VERIFIED COMPLETE | `frontend/app/dashboard/page.tsx:6-24`, `frontend/middleware.ts:5-17` |
| Add clear access message or redirect target for unauthenticated users (AC: 1). | Completed | VERIFIED COMPLETE | `frontend/app/dashboard/page.tsx:10-24`, `frontend/lib/auth/guards.ts:51-70` |
| Testing: verify protected route access behavior for unauthenticated users (AC: 1). | Completed | VERIFIED COMPLETE | `frontend/lib/auth/guards.test.ts:33-53` |
| Testing: verify centralized guard logic is reused by middleware and routes (AC: 2). | Completed | VERIFIED COMPLETE | `frontend/lib/auth/guards.test.ts:56-69` |

Summary: 6 of 6 completed tasks verified, 0 questionable, 0 falsely marked complete.

### Test Coverage and Gaps

- Guard decision logic covered by unit tests for unknown + authorized branches. Evidence: `frontend/lib/auth/guards.test.ts:33-53`
- Wiring test confirms shared guard logic is used in middleware and dashboard. Evidence: `frontend/lib/auth/guards.test.ts:56-69`
- No integration/E2E tests present (acceptable for scaffold phase, per epic test strategy).
- AC mapping: AC1 -> `frontend/lib/auth/guards.test.ts:33-43`; AC2 -> `frontend/lib/auth/guards.test.ts:56-69`

### Architectural Alignment

- Centralized guard in `frontend/lib/auth/guards.ts` and middleware usage aligns with architecture and tech spec for Epic 1. Evidence: `frontend/lib/auth/guards.ts:1-78`, `frontend/middleware.ts:1-21`
- No deviations from project structure or routing conventions observed.

### Security Notes

- Redirect target is encoded and limited to local paths; no open redirect detected. Evidence: `frontend/lib/auth/guards.ts:35-38`
- Middleware defaults to redirect/deny when auth/payment state is unknown (fail‑closed). Evidence: `frontend/lib/auth/guards.ts:47-71`

### Best-Practices and References

- See “Best-Practices and References” above for source links used in this review.

### Action Items

**Code Changes Required:**
- None.

**Advisory Notes:**
- Note: Harden the “known” auth state check when real auth is wired (e.g., validate session contents, handle stale cookies). Evidence: `frontend/lib/auth/guards.ts:23-33`
- Note: Track Next.js 16 middleware deprecation and plan migration to `proxy.ts` when upgrading runtime standards.
