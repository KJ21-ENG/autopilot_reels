# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| 2026-02-04 | 3.1 | 3 | Bug | Med | TBD | Open | Return `{ data, error }` envelope when `STRIPE_SECRET_KEY` is missing. [file: frontend/lib/stripe/server.ts:5-11, frontend/app/api/stripe/checkout/route.ts:93] |
| 2026-02-04 | 3.1 | 3 | TechDebt | Low | TBD | Open | Add integration test for missing `STRIPE_SECRET_KEY` to assert error envelope behavior. [file: frontend/app/api/stripe/checkout/route.test.ts] |
