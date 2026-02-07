# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date       | Story | Epic | Type     | Severity | Owner | Status | Notes                                                                                                                                                                                                        |
| ---------- | ----- | ---- | -------- | -------- | ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-02-04 | 3.1   | 3    | Bug      | Med      | TBD   | Closed | Return `{ data, error }` envelope when `STRIPE_SECRET_KEY` is missing. Verified by tests. [file: frontend/lib/stripe/server.ts:5-11, frontend/app/api/stripe/checkout/route.ts:93]                           |
| 2026-02-04 | 3.1   | 3    | TechDebt | Low      | TBD   | Closed | Add integration test for missing `STRIPE_SECRET_KEY` to assert error envelope behavior. Verified by tests. [file: frontend/app/api/stripe/checkout/route.test.ts]                                            |
| 2026-02-04 | 3.5   | 3    | Bug      | High     | TBD   | Closed | Add assertions that no processing occurs when webhook signature verification fails (e.g., `insert` and `listLineItems` not called). Verified by tests. [file: frontend/app/api/stripe/webhook/route.test.ts] |
| 2026-02-04 | 3.5   | 3    | Bug      | High     | TBD   | Open   | Document security constraints or edge cases discovered during verification testing in Dev Notes or Completion Notes. [file: docs/stories/3-5-harden-stripe-webhook-security-and-verification-testing.md]     |
| 2026-02-05 | 4.1   | 4    | Bug      | Low      | TBD   | Open   | Rotate Google OAuth client secret and set `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`. [file: supabase/config.toml:314]                                                                                           |

| 2026-02-06 | 6.5 | 6 | TechDebt | Low | TBD | Open | Configure ADMIN_EMAILS in production environment variables. [file: .env.local] |
