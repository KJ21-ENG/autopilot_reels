# autopilotreels - Epic Breakdown

**Author:** darko
**Date:** 2026-02-03
**Project Level:** MVP
**Target Scale:** Validation MVP

---

## Overview

This document provides the complete epic and story breakdown for autopilotreels, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Proposed Epic Structure (MVP Focused)**

Epic 1: Foundation & Delivery Readiness (Partially Complete)
Value: Establish the production-ready backbone (project setup, env, deploy, instrumentation) to enable secure payments and auth.
Scope: Repo/app scaffolding alignment (frontend UI present), env config, deployment pipeline, baseline observability, route protection scaffolds.

Epic 2: Pixel‑Close Marketing Experience (Completed)
Value: High-conversion, trust-building landing and supporting pages that drive payment-first flow.
Scope: Landing page UI, pricing CTA routing, and supporting trust pages (/privacy, /terms, /refund, /support, /contact, /blog).

Epic 3: Payment‑First Checkout (Stripe)
Value: Enable real payments without requiring prior signup, with reliable success/cancel handling and payment metadata capture.
Scope: Stripe Checkout integration, webhook handling, success/cancel pages, payment record storage.

Epic 4: Post‑Payment Auth & Account Linking
Value: Convert paid sessions into authenticated users with secure access and correct payment-to-user linkage.
Scope: Supabase Auth (email + Google), session handling, linking payment to user, redirect flow to dashboard.

Epic 5: Protected Placeholder Dashboard
Value: Provide a credible post‑payment destination that confirms access while setting correct expectations.
Scope: Protected routes, “high demand / unavailable” messaging, basic account info display.

Epic 6: Funnel Analytics & Admin Visibility
Value: Measure conversion end‑to‑end and enable lightweight admin visibility for paid users.
Scope: Event tracking (visit → CTA → checkout → payment → signup → dashboard), exportable paid users, minimal admin view.

**Suggested Sequencing**

1. Epic 1 → Epic 3 → Epic 4 → Epic 5 → Epic 6
2. Epic 2 is already complete; no new work required except verification.

**Why This Grouping**
Payment-first validation depends on reliable infrastructure, real checkout, and post-payment auth before the dashboard experience is meaningful.
Analytics comes last to instrument the full funnel once the core flow is wired end‑to‑end.

---

<!-- Repeat for each epic (N = 1, 2, 3...) -->

## Epic 1: Foundation & Delivery Readiness (Partially Complete)

Goal: Establish the production-ready backbone (env config, deploy readiness, and route protection scaffolds) to enable secure payments and auth while acknowledging the existing frontend UI.

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story 1.1: Initialize project runtime & environment scaffolding

As a developer,
I want a consistent runtime and environment configuration baseline,
So that all subsequent integrations can be built and deployed reliably.

**Acceptance Criteria:**

**Given** the existing `frontend/` UI and repository,
**When** the project is run locally and in a preview deployment,
**Then** environment variables are loaded correctly and the app builds without manual patching.

**And** a documented `.env.example` (or equivalent) exists with required keys for Stripe/Supabase placeholders.

**Prerequisites:** None

**Technical Notes:** Establish environment loading strategy (e.g., Next.js env config), add baseline config files, and ensure `frontend/` paths are the source of truth.

### Story 1.2: Set up deployment baseline and preview pipeline

As a product owner,
I want a reliable deployment baseline,
So that the payment-first flow can be validated in production-like previews.

**Acceptance Criteria:**

**Given** the current repository,
**When** a deployment is triggered (preview and production),
**Then** the app builds and serves the `frontend/` routes without missing assets or route errors.

**And** deployment configuration documents required environment variables and secrets.
**And** the deployment runtime is pinned to Node 24.x (to match local/tooling expectations).

**Prerequisites:** Story 1.1

**Technical Notes:** Configure Vercel settings or equivalent, ensure build output targets the existing frontend app, and document deploy steps.

### Story 1.3: Add baseline route protection scaffolds

As a developer,
I want route protection scaffolds in place,
So that protected areas can be enforced once auth is wired.

**Acceptance Criteria:**

**Given** public marketing routes and a placeholder dashboard,
**When** a user navigates to protected routes,
**Then** unauthenticated access is redirected to the post‑payment auth flow or a clear access message.

**And** the protection logic is centralized and reusable.

**Prerequisites:** Story 1.1

**Technical Notes:** Implement middleware or route guards aligned with the framework in `frontend/` and document expected auth checks.

### Story 1.4: Establish baseline analytics plumbing

As a product owner,
I want a minimal analytics plumbing baseline,
So that funnel events can be wired quickly once checkout and auth are live.

**Acceptance Criteria:**

**Given** the marketing and placeholder routes,
**When** a user performs key actions (view landing, click CTA),
**Then** events are captured in a consistent format and can be extended for later funnel steps.

**And** the tracking system is documented for future story implementation.

**Prerequisites:** Story 1.1

**Technical Notes:** Choose a lightweight analytics approach (internal logging or simple analytics tool) and define a shared event schema.

### Story 1.5: Define database schema and migrations

As a developer,
I want the database schema and migrations explicitly defined,
So that payment linkage and analytics storage are reliable from day one.

**Acceptance Criteria:**

**Given** the MVP data requirements,
**When** the backend is initialized,
**Then** the core tables exist with migrations applied (`payments`, `user_payment_links`, `events`).

**And** any required indices/constraints (e.g., unique `stripe_session_id`) are documented.

**Prerequisites:** Story 1.1

**Technical Notes:** Use Supabase SQL migrations or equivalent; include schema definitions and constraints.

---

## Epic 2: Pixel‑Close Marketing Experience (Completed)

Goal: Deliver the high‑conversion marketing experience with trust‑building supporting pages and clear pricing → checkout entry, matching the reference layout.

Status: Completed in `frontend/` (landing, pricing CTA flow, and supporting pages `/privacy`, `/terms`, `/refund`, `/support`, `/contact`, `/blog`).

Verification: UI matches the pixel‑close spec; any deviations are logged separately if needed.

### Story 2.1: Add MVP transparency disclosures across key surfaces

As a product owner,
I want clear, consistent disclosure that the product is a validation MVP with limited availability,
So that users are not misled and expectations are honest.

**Acceptance Criteria:**

**Given** the landing, checkout success, auth, and dashboard flows,
**When** a user interacts with any of these surfaces,
**Then** they see a brief, consistent disclosure about limited availability and MVP status.

**And** trust pages (/terms, /refund, /privacy) reflect the same disclosure language where appropriate.

**Prerequisites:** None

**Technical Notes:** Add consistent copy blocks and ensure they appear on key conversion pages and post‑payment flows.

### Story 2.2: Perform accessibility QA for marketing and trust pages

As a product owner,
I want accessibility verification for the marketing experience,
So that the landing and trust pages meet baseline WCAG 2.1 AA expectations.

**Acceptance Criteria:**

**Given** the marketing and trust pages,
**When** I run a11y checks (Lighthouse/axe) and keyboard-only navigation,
**Then** there are no critical accessibility violations and issues are tracked or fixed.

**Prerequisites:** None

**Technical Notes:** Document findings and fixes; prioritize contrast, focus states, and semantic headings.

---

## Epic 3: Payment‑First Checkout (Stripe)

Goal: Enable real payments without requiring prior signup, with reliable success/cancel handling and payment metadata capture.

### Story 3.1: Configure Stripe Checkout session creation

As a visitor,
I want to start checkout directly from the CTA,
So that I can pay without creating an account first.

**Acceptance Criteria:**

**Given** a pricing CTA,
**When** I click “Get Started” (or equivalent),
**Then** a Stripe Checkout session is created and I am redirected to Stripe‑hosted checkout.

**And** the session includes plan/price metadata for later linkage.

**Prerequisites:** Story 1.1

**Technical Notes:** Implement API route or server action to create Stripe Checkout sessions with product/price IDs.

### Story 3.2: Implement checkout success and cancel handling

As a paying user,
I want clear success and cancel outcomes,
So that I know what happened and how to proceed.

**Acceptance Criteria:**

**Given** a completed checkout,
**When** Stripe redirects to the success URL,
**Then** I see a confirmation page with next‑step guidance to authentication.

**And** when checkout is cancelled, I see a cancel page with a path back to pricing.

**Prerequisites:** Story 3.1

**Technical Notes:** Implement success/cancel routes in `frontend/` and handle Stripe redirect parameters.

### Story 3.3: Store payment metadata for user linkage

As a system,
I want to record payment metadata at checkout,
So that I can link the payment to a user after authentication.

**Acceptance Criteria:**

**Given** a successful payment,
**When** Stripe sends a webhook event,
**Then** the payment record is stored with session ID, customer email, and price info.

**And** the record is queryable for later account linkage.

**Prerequisites:** Story 3.1

**Technical Notes:** Implement Stripe webhook handler and persist records in Supabase/Postgres.

### Story 3.4: Validate payment‑first flow end‑to‑end

As a product owner,
I want to verify the payment‑first flow works reliably,
So that I can trust it for demand validation.

**Acceptance Criteria:**

**Given** a test Stripe payment,
**When** I complete checkout and return to the app,
**Then** the success path guides me into post‑payment auth without errors.

**And** the payment record exists for linkage.

**Prerequisites:** Stories 3.1–3.3

**Technical Notes:** Use Stripe test mode; document any known edge cases.

### Story 3.5: Harden Stripe webhook security and verification testing

As a developer,
I want webhook signature verification and replay protection tested,
So that payment events are reliable and secure.

**Acceptance Criteria:**

**Given** Stripe webhook handling,
**When** I send valid and invalid webhook payloads,
**Then** valid payloads are processed and invalid signatures are rejected.

**And** replayed events are detected or safely idempotent.

**Prerequisites:** Story 3.3

**Technical Notes:** Verify Stripe signing secret usage and document test steps.

### Story 3.6: Embed Stripe Checkout for redirect-based payment methods

As a product owner,
I want redirect-based payment methods to return inside the app,
So that customers do not end up in Stripe-hosted tabs after authentication.

**Acceptance Criteria:**

**Given** a Stripe Checkout session that supports redirect-based methods (e.g., Cash App Pay),
**When** the user completes or fails authentication,
**Then** the return flow lands back inside the app (not a Stripe-hosted Checkout page).

**And** the checkout page renders embedded Checkout UI in `/checkout` using Stripe's embedded mode.

**Prerequisites:** Story 3.1, Story 3.2

**Technical Notes:** Use `ui_mode: embedded` with `return_url` and handle the return route inside the app.

---

## Epic 4: Post‑Payment Auth & Account Linking

Goal: Convert paid sessions into authenticated users with secure access and correct payment‑to‑user linkage.

### Story 4.1: Implement Supabase Auth (email + Google)

As a paid user,
I want to sign up or log in after payment,
So that I can access my account.

**Acceptance Criteria:**

**Given** a successful payment,
**When** I choose email/password or Google OAuth,
**Then** I can authenticate successfully and return to the app.

**And** auth errors are shown clearly with recovery guidance.

**Prerequisites:** Story 3.2

**Technical Notes:** Configure Supabase Auth providers, redirect URIs, and UI flow in `frontend/`.

### Story 4.2: Link payment records to authenticated users

As a system,
I want to link a payment to the authenticated user,
So that account access reflects a real paid purchase.

**Acceptance Criteria:**

**Given** a payment record and a newly authenticated user,
**When** the user completes auth,
**Then** the payment record is associated with the user ID.

**And** the link is stored in the database for future checks.

**Prerequisites:** Stories 3.3 and 4.1

**Technical Notes:** Use Stripe session ID or customer email to connect payment and user in Supabase.

### Story 4.3: Enforce post‑payment access control

As a system,
I want to ensure only paid users reach the dashboard,
So that unpaid access is prevented.

**Acceptance Criteria:**

**Given** an authenticated user,
**When** they attempt to access the dashboard,
**Then** access is allowed only if a paid record is linked.

**And** unpaid users see a clear message and a path to checkout.

**Prerequisites:** Stories 1.3 and 4.2

**Technical Notes:** Implement authorization checks using Supabase session + payment linkage.

---

## Epic 5: Protected Placeholder Dashboard

Goal: Provide a credible post‑payment destination that confirms access while setting correct expectations.

### Story 5.1: Implement protected dashboard shell

As a paid user,
I want a protected dashboard route,
So that I can access the product after authenticating.

**Acceptance Criteria:**

**Given** a paid, authenticated user,
**When** I navigate to the dashboard,
**Then** the dashboard renders without access errors.

**And** unauthenticated or unpaid users are blocked.

**Prerequisites:** Story 4.3

**Technical Notes:** Use existing `frontend/` placeholder page and wire protection logic.

### Story 5.2: Display “high demand / unavailable” messaging

As a paid user,
I want clear messaging about limited availability,
So that I understand the current state of the service.

**Acceptance Criteria:**

**Given** the protected dashboard,
**When** I land on the page,
**Then** I see a clear “high demand / unavailable” message with context.

**And** the message avoids misleading promises.

**Prerequisites:** Story 5.1

**Technical Notes:** Implement as copy content on the dashboard placeholder.

### Story 5.3: Show basic account information

As a paid user,
I want to see basic account info,
So that I can confirm my access is recognized.

**Acceptance Criteria:**

**Given** a paid, authenticated session,
**When** I view the dashboard,
**Then** I see my email or account identifier.

**And** the info is pulled from the auth session.

**Prerequisites:** Story 5.1

**Technical Notes:** Render Supabase user fields on the dashboard.

### Story 5.4: Perform accessibility QA for auth and dashboard

As a product owner,
I want accessibility verification for auth and dashboard screens,
So that post‑payment flows are inclusive and usable.

**Acceptance Criteria:**

**Given** the auth and dashboard screens,
**When** I run a11y checks (Lighthouse/axe) and keyboard-only navigation,
**Then** there are no critical accessibility violations and issues are tracked or fixed.

**Prerequisites:** Story 4.1, Story 5.1

**Technical Notes:** Focus on form labels, focus indicators, and error messaging.

---

## Epic 6: Funnel Analytics & Admin Visibility

Goal: Measure conversion end‑to‑end and enable lightweight admin visibility for paid users.

### Story 6.1: Define funnel event schema

As a product owner,
I want a consistent event schema for funnel tracking,
So that analytics are reliable and comparable.

**Acceptance Criteria:**

**Given** the funnel stages (visit → CTA → checkout → payment → signup → dashboard),
**When** events are defined,
**Then** each stage has a named event with required properties.

**And** the schema is documented for implementation.

**Prerequisites:** Story 1.4

**Technical Notes:** Define event names, properties (plan, price, session ID), and capture points.
Store events in Supabase `events` table for queryable funnel counts (no external analytics required for MVP).

### Story 6.2: Track CTA clicks and checkout starts

As a product owner,
I want to track intent signals,
So that I can measure early funnel conversion.

**Acceptance Criteria:**

**Given** the landing page,
**When** a visitor clicks a CTA,
**Then** a `cta_click` event is recorded.

**And** when checkout starts, a `checkout_start` event is recorded.

**Prerequisites:** Stories 3.1 and 6.1

**Technical Notes:** Instrument CTA handler and checkout redirect creation.

### Story 6.3: Track payments and post‑payment auth

As a product owner,
I want to track payments and signup completion,
So that I can measure purchase-to-auth conversion.

**Acceptance Criteria:**

**Given** a successful Stripe payment,
**When** the webhook is processed,
**Then** a `payment_success` event is recorded.

**And** when a paid user completes auth, a `signup_complete` event is recorded.

**Prerequisites:** Stories 3.3 and 4.1

**Technical Notes:** Emit events from Stripe webhook and auth completion handler.

### Story 6.4: Track dashboard access

As a product owner,
I want to track dashboard access,
So that I can measure the final funnel stage.

**Acceptance Criteria:**

**Given** a paid, authenticated user,
**When** they access the dashboard,
**Then** a `dashboard_view` event is recorded.

**Prerequisites:** Story 5.1

**Technical Notes:** Instrument dashboard route load.

### Story 6.5: Provide exportable paid‑users list

As a product owner,
I want an exportable list of paid users,
So that I can follow up and analyze results.

**Acceptance Criteria:**

**Given** stored payments and linked users,
**When** I access the admin view,
**Then** I can export a CSV of paid users.

**And** the export includes payment date, plan, and user email.

**Prerequisites:** Stories 3.3 and 4.2

**Technical Notes:** Minimal admin endpoint or protected route; export CSV from Supabase.

### Story 6.6: Add minimal admin funnel overview

As a product owner,
I want a minimal admin view of funnel counts,
So that I can quickly see conversion health.

**Acceptance Criteria:**

**Given** recorded events,
**When** I open the admin view,
**Then** I see counts for each funnel stage.

**And** the view loads quickly and is protected.

**Prerequisites:** Stories 6.1–6.4

**Technical Notes:** Simple aggregate queries; protect route via auth.
Embed admin view in main app (e.g., `frontend/app/admin`) to avoid a separate deploy.

<!-- End story repeat -->

### Story 6.7: Define analytics data retention and PII handling

As a product owner,
I want a clear data retention and PII handling policy for analytics,
So that payment and event data are managed responsibly.

**Acceptance Criteria:**

**Given** analytics events and payment records,
**When** retention and access policies are defined,
**Then** documentation specifies what is stored, for how long, and who can access it.

**And** any PII fields are explicitly identified.

**Prerequisites:** Story 6.1

**Technical Notes:** Keep this lightweight and documented in `docs/`.

**Scope Note:** Stories 6.5 and 6.6 are optional for the strictest MVP; defer if timeline is tight.

---

<!-- End epic repeat -->

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._
