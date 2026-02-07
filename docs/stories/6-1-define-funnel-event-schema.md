# Story 6.1: Define funnel event schema

Status: done

## Story

As a product owner,
I want a consistent event schema for funnel tracking,
so that analytics are reliable and comparable across the entire payment-first flow.

## Acceptance Criteria

1. **Given** the funnel stages (visit → CTA → checkout → payment → signup → dashboard), **When** events are defined, **Then** each stage has a named event with required properties.
2. **And** the schema includes properties for `plan`, `price`, and `session_id` where applicable.
3. **And** the schema is documented in `lib/analytics/events.ts` for implementation alignment.
4. **And** the event storage strategy using the Supabase `events` table is confirmed and documented.

## Tasks / Subtasks

- [x] Define full funnel event names in `ANALYTICS_EVENT_NAMES` (AC: #1)
    - [x] Add `payment_success`
    - [x] Add `signup_complete`
    - [x] Add `dashboard_view`
- [x] Document event properties and capture points in `ANALYTICS_EVENT_SCHEMA_DOC` (AC: #2, #3)
    - [x] Detail metadata structure for each event
    - [x] Map events to specific code locations in the funnel
- [x] Verify Supabase `events` table schema alignment (AC: #4)
    - [x] Cross-reference with `architecture.md` data architecture section
- [x] Standardize event emission patterns (AC: #3)
    - [x] Update `BASELINE_ANALYTICS_EVENTS` to include new funnel stages

## Dev Notes

- **Baseline Recognition**: This story builds on the plumbing established in Story 1.4 (`lib/analytics/emit.ts` and `lib/analytics/events.ts`).
- **Architecture Alignment**: Events must be stored in the Supabase `events` table as per [architecture.md](file:///home/darko/Code/autopilotreels/docs/architecture.md#L191-199).
- **Event Naming**: Use `snake_case` for all event names to maintain consistency with existing `landing_view`, `cta_click`, and `checkout_start`.
- **Capture Points**:
    - `landing_view`: Landing page load.
    - `cta_click`: Pricing CTA click.
    - `checkout_start`: Stripe Checkout session creation.
    - `payment_success`: Stripe webhook `checkout.session.completed`.
    - `signup_complete`: Post-payment auth completion.
    - `dashboard_view`: Dashboard route load.

### Project Structure Notes

- Analytics utilities are centralized in `frontend/lib/analytics`.
- API endpoint for ingestion is `POST /api/analytics/event`.

### Learnings from Previous Story

**From Story 5-4-perform-accessibility-qa-for-auth-and-dashboard (Status: done)**

- **Accessibility Baseline**: Auth and Dashboard screens now have improved ARIA labels and focus management. Ensure any new analytics-related UI (if any, like admin views) follows these patterns.
- **Sidebar Integration**: The `DashboardSidebar.tsx` was updated with `aria-current`. Tracking dashboard access (`dashboard_view`) should consider where the user lands most frequently.

[Source: stories/5-4-perform-accessibility-qa-for-auth-and-dashboard.md]

### References

- [PRD.md: Funnel Analytics](file:///home/darko/Code/autopilotreels/docs/PRD.md#L178-186)
- [architecture.md: Data Architecture](file:///home/darko/Code/autopilotreels/docs/architecture.md#L191-199)
- [epics.md: Epic 6](file:///home/darko/Code/autopilotreels/docs/epics.md#L446-467)
- [events.ts baseline](file:///home/darko/Code/autopilotreels/frontend/lib/analytics/events.ts)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Antigravity

### Debug Log References

- **2026-02-06**: Initial implementation plan drafted.
    - Plan: Expand `ANALYTICS_EVENT_NAMES`, `ANALYTICS_EVENT_SCHEMA_DOC`, and `BASELINE_ANALYTICS_EVENTS` in `events.ts`. Update `frontend/docs/analytics.md` for consistency. Verify with existing Vitest suite.
    - Status: Planning complete, awaiting approval.

### Completion Notes List

- **2026-02-06**: Completed schema definitions.
    - Added `payment_success`, `signup_complete`, and `dashboard_view` to `ANALYTICS_EVENT_NAMES`.
    - Updated `ANALYTICS_EVENT_SCHEMA_DOC` with metadata examples.
    - Expanded `BASELINE_ANALYTICS_EVENTS` for validation consistency.
    - Updated `frontend/docs/analytics.md` with new funnel stages and capture points.
    - Verified with `npm run test` (Analytics tests passing).

### File List

- `frontend/lib/analytics/events.ts`
- `frontend/docs/analytics.md`

### Change Log

- **2026-02-06**: Senior Developer Review notes appended.

## Senior Developer Review (AI)

### Reviewer: Antigravity

### Date: 2026-02-06

### Outcome: APPROVE

The implementation of the funnel event schema is complete and aligns perfectly with the requirements of Story 6.1 and the project architecture.

### Summary

The developer successfully expanded the analytics event naming system to cover the entire payment-first funnel. Documentation in both code and markdown files has been updated for consistency. All acceptance criteria and claimed tasks have been verified against the code with specific evidence.

### Acceptance Criteria Coverage

| AC# | Description                                         | Status      | Evidence                                                   |
| --- | --------------------------------------------------- | ----------- | ---------------------------------------------------------- |
| 1   | Each funnel stage has a named event with properties | IMPLEMENTED | `events.ts:2-7`                                            |
| 2   | Schema includes `plan`, `price`, `session_id`       | IMPLEMENTED | `events.ts:21-24`                                          |
| 3   | Schema documented in `lib/analytics/events.ts`      | IMPLEMENTED | `events.ts:20-27`                                          |
| 4   | Supabase `events` storage strategy confirmed        | IMPLEMENTED | `6-1-define-funnel-event-schema.md` Dev Notes & migrations |

**Summary:** 4 of 4 acceptance criteria fully implemented.

### Task Completion Validation

| Task                              | Marked As | Verified As       | Evidence                                    |
| --------------------------------- | --------- | ----------------- | ------------------------------------------- |
| Define funnel event names         | [x]       | VERIFIED COMPLETE | `events.ts:2-7`                             |
| Document properties in doc string | [x]       | VERIFIED COMPLETE | `events.ts:21-24`                           |
| Verify Supabase alignment         | [x]       | VERIFIED COMPLETE | `migrations/20260204000100_core_tables.sql` |
| Standardize emission patterns     | [x]       | VERIFIED COMPLETE | `events.ts:29-36`                           |

**Summary:** 4 of 4 completed tasks verified, 0 questionable, 0 falsely marked complete.

### Test Coverage and Gaps

- `lib/analytics/docs.test.ts` covers naming consistency between code and docs.
- `lib/analytics/validate.test.ts` covers schema validation.
- Both tests passed successfully during the verification phase.

### Architectural Alignment

- Matches the Data Architecture section of `architecture.md` (lines 191-199).
- Follows the naming pattern for analytics specified in `epics.md`.

### Security Notes

- No security concerns identified for this schema definition change.

### Best-Practices and References

- Follows [Project Structure Patterns](file:///home/darko/Code/autopilotreels/docs/architecture.md#L130-137).
- Uses TypeScript `as const` for stable event naming.

### Action Items

**Advisory Notes:**

- Note: Implementation of event emission at the specific capture points (Step 6.2+) should follow the documented pattern in `frontend/docs/analytics.md`.
