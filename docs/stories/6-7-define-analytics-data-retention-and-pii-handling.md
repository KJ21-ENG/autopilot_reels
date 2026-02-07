# Story 6.7: Define analytics data retention and PII handling

Status: done

## Story

As a Product Owner,
I want a clear data retention and PII handling policy for analytics,
so that payment and event data are managed responsibly.

## Acceptance Criteria

1. **Retention Policy**: Documentation specifies retention periods for payment records and analytics events.
    - [Source: docs/epics.md#Story-6.7]
2. **PII Identification**: Any PII fields are explicitly identified in the documentation.
    - [Source: docs/epics.md#Story-6.7]
3. **Access Control**: Documentation specifies who can access the data.
    - [Source: docs/epics.md#Story-6.7]

## Tasks / Subtasks

- [x] **Create Data Retention Policy Document** (AC: 1, 2, 3)
    - [x] Create `docs/data-retention-policy.md`.
    - [x] Define retention periods for `payments`, `users`, and `events` tables.
    - [x] List all PII fields (email, customer IDs, etc.) and their storage locations.
    - [x] Document access control mechanisms (Supabase RLS, Admin check).
- [x] **Audit Data Schema for PII** (AC: 2)
    - [x] Review `schema.prisma` or Supabase schema definitions (from Story 1.5).
    - [x] Verify if any fields in `events.metadata` contain PII.
- [x] **Review and Link Policy** (AC: 1)
    - [x] Add reference to `docs/data-retention-policy.md` in `docs/architecture.md` (Security/Data sections) if appropriate.

## Dev Notes

### Architecture Patterns

- **Documentation-First**: This story focuses on creating governance documentation rather than code.
- **Data Privacy**: Aligns with "Data handling: Store only essential user and payment metadata" from PRD.

### Learnings from Previous Story

**From Story 6.6 (Status: done)**

- **Access Patterns**: Admin access is controlled via `resolveVerifiedAuthState` and `ADMIN_EMAILS`. This mechanism should be documented as the primary access control for PII in the admin dashboard.
- **Data Sources**: Funnel data comes from the `events` table (aggregates) and `payments` table. The policy must cover these specific tables.
- **New Files**: `frontend/lib/analytics/stats.ts` and `frontend/app/admin/page.tsx` were created; the policy should cover the data exposed by these views.

### Project Structure Notes

- **Docs**: `docs/` is the correct location for policy documents.
- **Alignment**: Follows the pattern of keeping technical documentation alongside code.

### References

- [Epic 6: Funnel Analytics & Admin Visibility](file:///home/darko/Code/autopilotreels/docs/epics.md#Epic-6)
- [PRD - Security & Data Handling](file:///home/darko/Code/autopilotreels/docs/PRD.md#Security)
- [Architecture - Data Architecture](file:///home/darko/Code/autopilotreels/docs/architecture.md#Data-Architecture)
- [Story 6.6: Add minimal admin funnel overview](file:///home/darko/Code/autopilotreels/docs/stories/6-6-add-minimal-admin-funnel-overview.md)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

### File List

- docs/data-retention-policy.md
- docs/architecture.md

## Change Log

- 2026-02-06: Created story 6.7 based on Epic 6 requirements.
- 2026-02-06: Implemented data retention policy and updated architecture docs.
