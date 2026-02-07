# Story 6.5: Provide exportable paid-users list

Status: done

## Story

As a Product Owner,
I want an exportable list of paid users,
so that I can follow up and analyze results.

## Acceptance Criteria

1. **Admin Export**: Authenticated admin can export a CSV of paid users from the admin view.
    - [Source: docs/epics.md#Story-6.5]
2. **Export Data**: The export must include payment date, plan, and user email.
    - [Source: docs/epics.md#Story-6.5]
3. **Security**: The export capability must be restricted to authenticated users (admin scope if available, otherwise protected route).
    - [Source: docs/epics.md#Story-6.6]

## Tasks / Subtasks

- [x] **Implement Export API Endpoint** (AC: 1, 2)
    - [x] Create `POST /api/admin/export-users` (or GET) route handler.
    - [x] Query Supabase for paid users (join `payments`, `user_payment_links`, `users`).
    - [x] Generate CSV content.
    - [x] Returns CSV file download.
    - [x] [Test] Verify data correctness (date, plan, email).
- [x] **Implement Admin UI** (AC: 1)
    - [x] Create `frontend/app/admin/page.tsx` (if not exists) or update.
    - [x] Add "Export Paid Users" button.
    - [x] Handle download action.
- [x] **Security & Verification** (AC: 3)
    - [x] Protect route with server-side auth check.
    - [x] [Test] Verify unauthenticated access is blocked.

## Dev Notes

### Architecture Patterns

- **Admin View**: Embedded in `frontend/app/admin`.
- **Data Access**: `user_payment_links` is the bridge between `payments` and `users`.
- **API Pattern**: Use Next.js Route Handlers for CSV generation.

### Learnings from Previous Story

**From Story 6.4 (Status: done)**

- **Patterns**: Server-Side Auth Verification is established and should be reused for the Admin route.
- **Reference**: `story-6-4` suggests reuse of `resolveVerifiedAuthState`.
- **Documentation**: Note the gap in `tech-spec-epic-6.md`.

### Project Structure Notes

- **API**: `frontend/app/api/admin/export-users/route.ts`
- **UI**: `frontend/app/admin/page.tsx`

### References

- [Epic 6: Funnel Analytics & Admin Visibility](file:///home/darko/Code/autopilotreels/docs/epics.md#Epic-6)
- [Architecture - Data Architecture](file:///home/darko/Code/autopilotreels/docs/architecture.md#Data-Architecture)
- [Story 6.4: Track dashboard access](file:///home/darko/Code/autopilotreels/docs/stories/6-4-track-dashboard-access.md)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

- Implemented secure CSV export endpoint protected by ADMIN_EMAILS env var.
- Created Admin UI page to trigger export.
- Verified with new unit tests and existing regression suite.
- NOTE: User must configure ADMIN_EMAILS in .env.local for access.

### File List

- frontend/app/api/admin/export-users/route.ts
- frontend/app/admin/page.tsx
- frontend/app/api/admin/export-users/route.test.ts

## Change Log

- 2026-02-06: Created story 6.5
- 2026-02-06: Implemented story 6.5. Added Export API and Admin UI.
- 2026-02-06: Senior Developer Review notes appended. Status updated to done.

## Senior Developer Review (AI)

- **Reviewer**: darko
- **Date**: 2026-02-06
- **Outcome**: Approve

### Summary

The implementation fully satisfies the requirements for exporting paid users. The secure API endpoint correctly enforces admin access via email whitelist and generates the required CSV format. The Admin UI provides a simple, functional interface for triggering the export. Tests cover the security and data generation logic adequately.

### Key Findings

- **High Severity**: None.
- **Medium Severity**: None.
- **Low Severity**: None.

### Acceptance Criteria Coverage

| AC# | Description           | Status          | Evidence                                                                                                       |
| --- | --------------------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Admin Export CSV      | **IMPLEMENTED** | `route.ts` implements secure CSV generation; `page.tsx` provides trigger. Admin check enforces `ADMIN_EMAILS`. |
| 2   | Export Data Fields    | **IMPLEMENTED** | `route.ts` selects and maps `created_at` (Date), `price_id` (Plan), `email` (Email).                           |
| 3   | Security (Admin Only) | **IMPLEMENTED** | `route.ts` validates session and checks user email against `ADMIN_EMAILS` whitelist.                           |

**Summary**: 3 of 3 acceptance criteria fully implemented.

### Task Completion Validation

| Task                          | Marked As | Verified As  | Evidence                                                                |
| ----------------------------- | --------- | ------------ | ----------------------------------------------------------------------- |
| Implement Export API Endpoint | [x]       | **VERIFIED** | `frontend/app/api/admin/export-users/route.ts` existing and functional. |
| Implement Admin UI            | [x]       | **VERIFIED** | `frontend/app/admin/page.tsx` existing and functional.                  |
| Security & Verification       | [x]       | **VERIFIED** | Auth checks and admin whitelist logic verified in `route.ts`.           |

**Summary**: 3 of 3 completed tasks verified.

### Test Coverage and Gaps

- **Coverage**: `route.test.ts` provides good coverage for the API endpoint, testing 401 (unauthorized), 403 (forbidden/non-admin), and 200 (success) scenarios.
- **Gaps**: None identified for MVP scope.

### Architectural Alignment

- **Tech Spec**: Implementation aligns with the "Minimal admin endpoint or protected route" guidance.
- **Patterns**: Follows the `route.ts` handler pattern and client-side download pattern established in the project.

### Security Notes

- **Admin Access**: Relies on `ADMIN_EMAILS` environment variable. Ensure this is configured in production.
- **Auth Guard**: Correctly uses `resolveVerifiedAuthState` to verify session validity before checking admin status.

### Best-Practices and References

- **CSV Generation**: Simple string manipulation is appropriate for this scale.

### Action Items

**Advisory Notes:**

- Note: Configure `ADMIN_EMAILS` in your production environment variables (comma-separated list of admin email addresses).
