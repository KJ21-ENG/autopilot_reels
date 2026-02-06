# Story 5.1: Implement protected dashboard shell

Status: done

## Story

As a paid user,
I want a protected dashboard route,
So that I can access the product after authenticating.

## Acceptance Criteria

1. **Given** a paid, authenticated user, **When** I navigate to the dashboard, **Then** the dashboard renders without access errors.
2. **And** unauthenticated or unpaid users are blocked.

## Tasks / Subtasks

- [x] Extract dashboard shell layout to `frontend/app/dashboard/layout.tsx`. (AC: #1)
    - [x] Create `layout.tsx` with the common main/centering wrapper from `page.tsx`.
    - [x] Ensure `page.tsx` renders inside the new layout.
- [x] Verify access control works with the new layout structure. (AC: #1, #2)
    - [x] Run existing integration tests to confirm no regression.
    - [x] Manual verification (optional): Visit `/dashboard` as (a) guest, (b) unpaid user, (c) paid user.

## Dev Notes

- **Architecture**: `frontend/app/dashboard` is the target. Move specific page content (messaging) to `page.tsx` and structure (centering/container) to `layout.tsx` to support future dashboard pages (e.g. Account settings or specific features) sharing the same shell.
- **Protection**: Access control logic currently resides in `page.tsx` (`getProtectedRouteDecision`). Consider if this should move to `layout.tsx` to protect _all_ dashboard routes, or stay in `page`?
    - Architecture decision: "Protected routes verify session". Middleware is the primary guard (should be), but `page.tsx` verification is good depth defense.
    - For now, keep the verification where it is most effective, or move to `layout` if it applies to all children. Moving to `layout` is cleaner for a "Shell".
- **Source**: `docs/epics.md#Story-5.1`

### Project Structure Notes

- Align with App Router patterns: `layout.tsx` for shared UI, `page.tsx` for route content.

### References

- [Source: docs/epics.md#Story-5.1-Implement-protected-dashboard-shell]
- [Source: docs/architecture.md#Epic-5]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Implemented `DashboardLayout` in `frontend/app/dashboard/layout.tsx` to handle authentication and payment verification.
- Refactored `frontend/app/dashboard/page.tsx` to be a pure presentational component for the dashboard content.
- Migrated and enhanced tests to `frontend/app/dashboard/layout.test.tsx`, verifying protection logic works at the layout level.
- Confirmed tests pass with `npm run test app/dashboard/layout.test.tsx`.

### File List

- frontend/app/dashboard/layout.tsx
- frontend/app/dashboard/page.tsx
- frontend/app/dashboard/layout.test.tsx
- frontend/app/dashboard/page.test.tsx (deleted)

## Change Log

- 2026-02-06: Implemented protected dashboard shell and updated tests.
