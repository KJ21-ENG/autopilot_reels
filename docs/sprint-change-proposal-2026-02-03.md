# Sprint Change Proposal — autopilotreels

**Date:** 2026-02-03  
**Prepared by:** John (PM)  
**Requested by:** darko  
**Mode:** Incremental

---

## 1. Issue Summary

**Trigger:** A complete landing page UI already exists in the `frontend/` directory. The project planning artifacts (PRD, epics, architecture, UX spec) were still oriented to the pre‑implementation state and referenced `Frontend/` instead of `frontend/`. The team wants to resume from the implemented UI and continue backend work.

**When/How Discovered:** During review of the repository and documents on 2026-02-03.

**Evidence:** Implemented UI in `frontend/` including landing page and supporting pages, with placeholder checkout/auth/dashboard flows.

---

## 2. Impact Analysis

### Epic Impact

- **Epic 2 (Pixel‑Close Marketing Experience):** Completed. UI is implemented in `frontend/`.
- **Epic 1 (Foundation & Delivery Readiness):** Partially complete. Core app scaffold and UI exist; env handling, analytics plumbing, and deploy setup remain pending.
- **Epics 3–5:** Not implemented. They depend on stable existing routes and need real Stripe/Supabase/analytics integration.

### Story Impact

- New or updated story added under Epic 2 to recognize supporting pages: `/privacy`, `/terms`, `/refund`, `/support`, `/contact`, `/blog`.
- Existing stories for checkout/auth/dashboard remain, but are currently placeholders and require full backend integration.

### Artifact Conflicts

- **PRD:** Needed to reflect implemented UI and placeholder status for checkout/auth/dashboard.
- **Epics:** Needed to mark Epic 2 complete and fix `Frontend/` → `frontend/` references.
- **Architecture:** Needed to align to actual folder path and current routes; note pending deploy and missing API routes.
- **UX Spec:** Needed to reflect actual path and source‑of‑truth folder.

### Technical Impact

- Backend API routes for Stripe and analytics do not exist.
- Supabase auth and payment linkage are not yet implemented.
- Deploy template setup is pending.

---

## 3. Recommended Approach

**Selected Path:** Option 1 — Direct Adjustment

**Rationale:** The landing UI is complete; the fastest path is to realign planning artifacts to the current implementation and proceed with backend integration. This minimizes rework and preserves existing progress.

**Effort Estimate:** Medium  
**Risk Level:** Low  
**Timeline Impact:** Minimal; focused on documentation alignment plus planned backend work.

---

## 4. Detailed Change Proposals

### A) Epics and Stories (`docs/epics.md`)

**Change 1 — Epic 2 Status Update**

**OLD:**

- Status referenced `Frontend/`

**NEW:**

- Status references `frontend/`

**Change 2 — New Story 2.6**

```
Story 2.6: Implement marketing/legal supporting pages (privacy, terms, refund, support, contact, blog)

As a visitor,
I want access to trust and support pages,
So that I can validate credibility before checkout.

Acceptance Criteria:
- Pages render with consistent layout and branding
- Routes exist for /privacy, /terms, /refund, /support, /contact, /blog

Prerequisites: Story 2.1
Technical Notes: Implemented in frontend/app/* as static pages.
```

### B) PRD (`docs/PRD.md`)

**Add current state note:** UI implemented in `frontend/`, checkout/auth/dashboard are placeholders pending integration.

**MVP Included updates:**

- Add supporting pages in MVP
- Mark landing as implemented

**Implementation Status fields:**

- Stripe: placeholder pages exist, integration pending
- Auth: placeholder page exists, integration pending
- Dashboard: placeholder page exists, protection/data pending

### C) Architecture (`docs/architecture.md`)

**Updates:**

- Replace `Frontend/` → `frontend/`
- Update project structure to list existing routes and note pending API routes
- Mark deploy template step as pending

### D) UX Spec (`docs/ux-design-specification.md`)

**Updates:**

- Replace `Frontend/` → `frontend/`
- Align references to actual implementation path

---

## 5. Implementation Handoff

**Scope Classification:** Moderate

**Handoff Plan:**

- **PM (John):** Update PRD, epics, architecture, UX spec (done)
- **Dev Team:** Implement Stripe checkout, Supabase auth, analytics, and protected dashboard
- **PO/SM:** Adjust backlog based on updated epics/stories; re-sequence for Epic 1 (infra) → Epic 3 → Epic 4 → Epic 5

**Success Criteria:**

- Docs match current UI state
- Checkout/auth/dashboard no longer placeholders
- Stripe/Supabase/analytics integrated and deployed

---

## 6. Approval

Do you approve this Sprint Change Proposal for implementation?

- Yes
- No (specify changes)
