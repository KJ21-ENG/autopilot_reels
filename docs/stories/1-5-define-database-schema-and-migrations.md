# Story 1.5: Define database schema and migrations

Status: done

## Story

As a developer,
I want the database schema and migrations explicitly defined,
so that payment linkage and analytics storage are reliable from day one.

## Acceptance Criteria

1. Given the MVP data requirements, when the backend is initialized, then the core tables exist with migrations applied (`payments`, `user_payment_links`, `events`). [Source: docs/epics.md#Story-15-Define-database-schema-and-migrations; docs/tech-spec-epic-1.md#Data-Models-and-Contracts]
2. Required indices/constraints are documented and included (e.g., unique `stripe_session_id`, and foreign keys from `user_payment_links.user_id` → Supabase Auth users and `user_payment_links.payment_id` → `payments.id`). [Source: docs/epics.md#Story-15-Define-database-schema-and-migrations; docs/tech-spec-epic-1.md#Data-Models-and-Contracts]

## Tasks / Subtasks

- [x] Confirm the project’s migration location (use existing conventions; if missing, establish Supabase-standard `supabase/migrations/`) and add an initial migration for `payments`, `user_payment_links`, and `events` with the columns defined in the tech spec (AC: 1). [Source: docs/tech-spec-epic-1.md#Data-Models-and-Contracts; docs/architecture.md#Project-Structure]
  - [x] Ensure all columns use `snake_case` and align with the documented data model field names (AC: 1). [Source: docs/architecture.md#Naming-Conventions; docs/tech-spec-epic-1.md#Data-Models-and-Contracts]
- [x] Add required constraints and indexes: primary keys, unique `stripe_session_id`, and FKs linking `user_payment_links.user_id` to Supabase Auth users and `user_payment_links.payment_id` to `payments.id` (AC: 2). [Source: docs/epics.md#Story-15-Define-database-schema-and-migrations; docs/tech-spec-epic-1.md#Data-Models-and-Contracts]
- [x] Document the schema and constraints in the migration files and ensure references are clear for future stories (AC: 2). [Source: docs/epics.md#Story-15-Define-database-schema-and-migrations]
- [x] Testing: add a lightweight verification step (apply migrations in a local Supabase instance or via a SQL sanity check) and record the expected results (AC: 1, 2). [Source: docs/architecture.md#Testing-Strategy]
  - [x] Apply migrations locally and verify tables + constraints exist (`payments`, `user_payment_links`, `events`, unique `stripe_session_id`, and required FKs) (AC: 1, 2). [Source: docs/tech-spec-epic-1.md#Data-Models-and-Contracts; docs/epics.md#Story-15-Define-database-schema-and-migrations]

## Dev Notes

### Requirements Context Summary

- Define and apply Supabase Postgres migrations for the core MVP tables: `payments`, `user_payment_links`, and `events`, with required constraints (e.g., unique `stripe_session_id`). [Source: docs/epics.md#Story-15-Define-database-schema-and-migrations; docs/tech-spec-epic-1.md#Data-Models-and-Contracts]
- Ensure relationships are captured between `user_payment_links.user_id` and Supabase Auth users, and `user_payment_links.payment_id` to `payments.id`. [Source: docs/tech-spec-epic-1.md#Data-Models-and-Contracts]
- Align schema with the payment-first funnel requirements that depend on reliable payment metadata storage and analytics events. [Source: docs/PRD.md#Stripe-Checkout-Payment-First; docs/PRD.md#Funnel-Analytics]
- Use the existing Next.js + Supabase architecture decisions (Supabase Postgres as the data store) and keep changes consistent with the documented API/data patterns. [Source: docs/architecture.md#Decision-Summary; docs/architecture.md#Data-Architecture]
- Traceability note: Story 1.5 derives from Epic 1 Acceptance Criteria #6 (DB schema/migrations for `payments`, `user_payment_links`, `events`); this is epic-level mapping since the tech spec does not list story-numbered requirements. [Source: docs/tech-spec-epic-1.md#Acceptance-Criteria-Authoritative]

### Architecture Patterns and Constraints

- Data is stored in Supabase Postgres with tables `payments`, `user_payment_links`, and `events`; use the documented column names and types as the source of truth. [Source: docs/tech-spec-epic-1.md#Data-Models-and-Contracts; docs/architecture.md#Data-Architecture]
- Apply naming conventions consistently (`snake_case` tables and columns). [Source: docs/architecture.md#Naming-Conventions]
- Keep time fields as ISO-8601 UTC timestamps (e.g., `created_at`, `linked_at`). [Source: docs/architecture.md#Format-Patterns]

### Testing Standards Summary

- Follow the lightweight testing guidance: verify migrations with a local apply or SQL sanity check rather than heavy E2E tests. [Source: docs/architecture.md#Testing-Strategy]

### Project Structure Notes

- No unified structure doc exists; migration location should align with existing repo patterns and Supabase conventions. [Source: docs/architecture.md#Project-Structure]
- Use `supabase/migrations/` only if it does not conflict with existing structure; otherwise keep schema assets alongside existing docs or tooling references. [Source: docs/architecture.md#Project-Structure]

### Structure Alignment Summary

- No `unified-project-structure.md` found; follow the documented repo layout and place DB/migration assets in the existing docs or database migration location used by the project. [Source: docs/architecture.md#Project-Structure]
- Data layer is Supabase Postgres with tables `payments`, `user_payment_links`, and `events`; schema should reflect the documented column names and relationships to avoid downstream API/analytics mismatches. [Source: docs/architecture.md#Data-Architecture; docs/tech-spec-epic-1.md#Data-Models-and-Contracts]
- Maintain established naming conventions: `snake_case` plural table names and `snake_case` column names. [Source: docs/architecture.md#Naming-Conventions]

### References

- Epic story requirements: [Source: docs/epics.md#Story-15-Define-database-schema-and-migrations]
- Epic 1 technical spec (data models and contracts): [Source: docs/tech-spec-epic-1.md#Data-Models-and-Contracts]
- Architecture data model + conventions: [Source: docs/architecture.md#Data-Architecture; docs/architecture.md#Naming-Conventions; docs/architecture.md#Format-Patterns]
- Architecture testing guidance: [Source: docs/architecture.md#Testing-Strategy]
- PRD payment + analytics requirements: [Source: docs/PRD.md#Stripe-Checkout-Payment-First; docs/PRD.md#Funnel-Analytics]

### Learnings from Previous Story

**From Story 1-4-establish-baseline-analytics-plumbing (Status: done)**

- **Events Table Alignment**: Analytics plumbing already assumes an `events` table; ensure the migration defines `events` with `event_name`, `metadata` (jsonb), and timestamps as specified. [Source: docs/stories/1-4-establish-baseline-analytics-plumbing.md#Requirements-Context-Summary; docs/tech-spec-epic-1.md#Data-Models-and-Contracts]
- **Reuse Established Patterns**: API responses and data handling use the `{ data, error }` envelope; keep schema decisions consistent with the existing backend patterns to avoid rework. [Source: docs/stories/1-4-establish-baseline-analytics-plumbing.md#Architecture-Patterns-and-Constraints; docs/architecture.md#Format-Patterns]
- **Testing Pattern**: Lightweight unit tests were used for analytics validation; mirror the minimal verification approach for migrations (sanity check vs heavy E2E). [Source: docs/stories/1-4-establish-baseline-analytics-plumbing.md#Tasks--Subtasks; docs/architecture.md#Testing-Strategy]
- **New/Modified Files from Story 1.4**: The Story 1.4 file list does not label NEW vs MODIFIED, so treat the following as new unless noted:
  - `frontend/lib/analytics/events.ts`
  - `frontend/lib/analytics/validate.ts`
  - `frontend/lib/analytics/emit.ts`
  - `frontend/app/api/analytics/event/route.ts`
  - `frontend/docs/analytics.md`
  Use these when aligning the `events` table schema and verifying event payload expectations. [Source: docs/stories/1-4-establish-baseline-analytics-plumbing.md#File-List]
- **Completion Notes to Carry Forward**: Baseline analytics schema, validation, emit helper, API route, docs, and tests were completed; avoid reintroducing conflicting event fields or duplicate schema definitions when adding migrations. [Source: docs/stories/1-4-establish-baseline-analytics-plumbing.md#Completion-Notes-List]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->
None (context file not found at `docs/stories/1-5-define-database-schema-and-migrations.context.xml`).

### Agent Model Used

GPT-5

### Debug Log References

- Plan: create `supabase/migrations/` with core tables + constraints, add lightweight SQL sanity check, then run `npm run test` and record results.
- Execution: created Supabase config + migration and verification SQL, started local Supabase, applied migration, ran sanity check (tables + constraints), ran `npm run test` in `frontend/` (vitest).

### Completion Notes List

- Implemented Supabase migration for `payments`, `user_payment_links`, and `events` with required constraints/indexes.
- Added SQL sanity check file and verified local Supabase tables/constraints after applying migrations.
- Tests: `npm run test` in `frontend/` (vitest) passed.

### File List

- supabase/.branches/_current_branch
- supabase/.gitignore
- supabase/.temp/cli-latest
- supabase/config.toml
- supabase/migrations/20260204000100_core_tables.sql
- supabase/verification/20260204_core_tables_sanity.sql

## Change Log

- 2026-02-04: Draft created from Epic 1 story 1.5 requirements.
- 2026-02-04: Added Supabase migrations + verification SQL; applied locally and verified constraints; ran frontend tests.
- 2026-02-04: Senior Developer Review notes appended.
- 2026-02-04: Review outcome updated to Approve after manual verification.

## Senior Developer Review (AI)

Reviewer: darko  
Date: 2026-02-04  
Outcome: Approve — All acceptance criteria and completed tasks verified (manual verification noted).

### Summary
Core migrations for `payments`, `user_payment_links`, and `events` are present with required constraints and indexes. Manual verification confirmed migrations and constraints were applied successfully.

### Tech Stack
Primary stack: Next.js (App Router) + TypeScript in `frontend/` with Supabase Postgres for data. Migrations are in `supabase/migrations` with local config in `supabase/config.toml`.

### Code Quality Review
Reviewed changed SQL files for naming conventions, constraints, indices, and alignment with documented data models. No style, structure, or consistency issues found.

### Key Findings

None.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| --- | --- | --- | --- |
| AC1 | Core tables exist with migrations applied (`payments`, `user_payment_links`, `events`). | IMPLEMENTED | `supabase/migrations/20260204000100_core_tables.sql:7`, `supabase/migrations/20260204000100_core_tables.sql:21`, `supabase/migrations/20260204000100_core_tables.sql:33` |
| AC2 | Required indices/constraints included (unique `stripe_session_id`, FKs for `user_payment_links`). | IMPLEMENTED | `supabase/migrations/20260204000100_core_tables.sql:17`, `supabase/migrations/20260204000100_core_tables.sql:26`, `supabase/migrations/20260204000100_core_tables.sql:28`, `supabase/migrations/20260204000100_core_tables.sql:44`, `supabase/migrations/20260204000100_core_tables.sql:45` |

Summary: 2 of 2 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Confirm migration location and add initial migration for core tables | Completed | VERIFIED COMPLETE | `supabase/migrations/20260204000100_core_tables.sql:1`, `supabase/migrations/20260204000100_core_tables.sql:7` |
| Ensure all columns use snake_case | Completed | VERIFIED COMPLETE | `supabase/migrations/20260204000100_core_tables.sql:7`, `supabase/migrations/20260204000100_core_tables.sql:21`, `supabase/migrations/20260204000100_core_tables.sql:33` |
| Add required constraints and indexes | Completed | VERIFIED COMPLETE | `supabase/migrations/20260204000100_core_tables.sql:17`, `supabase/migrations/20260204000100_core_tables.sql:26`, `supabase/migrations/20260204000100_core_tables.sql:28`, `supabase/migrations/20260204000100_core_tables.sql:44` |
| Document schema and constraints in migration files | Completed | VERIFIED COMPLETE | `supabase/migrations/20260204000100_core_tables.sql:1`, `supabase/migrations/20260204000100_core_tables.sql:6`, `supabase/migrations/20260204000100_core_tables.sql:20` |
| Testing: add a lightweight verification step and record expected results | Completed | VERIFIED COMPLETE | `supabase/verification/20260204_core_tables_sanity.sql:1` |
| Apply migrations locally and verify tables + constraints exist | Completed | VERIFIED COMPLETE | Manual verification confirmed by reviewer (no repo artifact) |

Summary: 6 of 6 completed tasks verified, 0 questionable, 0 falsely marked complete.

### Test Coverage and Gaps
- Verification SQL exists; manual execution confirmed results (no repo artifact).
- Test-to-AC mapping:
  - AC1: Covered by migration definitions in `supabase/migrations/20260204000100_core_tables.sql`.
  - AC2: Covered by constraints/indices in `supabase/migrations/20260204000100_core_tables.sql`.

### Architectural Alignment
- Schema aligns with Epic 1 data model and architectural patterns (Supabase Postgres, snake_case, core tables).
- No architecture violations detected.

### Security Notes
- No security issues detected in the migration files.

### Best-Practices and References
- Supabase CLI migrations live in `supabase/migrations` and applied history is tracked separately in the CLI.
- PostgreSQL unique constraints automatically create unique indexes, so no extra unique index is required for `stripe_session_id`.
- PostgreSQL does not auto-index foreign key referencing columns; indexing them is often recommended for performance.

### File List Review
The listed files appear complete for this story scope (migration + verification SQL and Supabase config artifacts). No additional related files found outside the list.

### MCP/Web References
MCP doc search not available in this workspace; no web fallback performed for this review.

### Action Items

**Code Changes Required:**
- None.

**Advisory Notes:**
- Note: None.
