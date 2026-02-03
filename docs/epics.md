# autopilotreels - Epic Breakdown

**Author:** darko
**Date:** 2026-02-02
**Project Level:** Low
**Target Scale:** MVP validation

---

## Overview

This document provides the complete epic and story breakdown for autopilotreels, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Proposed Epic Structure (value-based)**

1. **Foundation & Delivery Readiness**
    - **Value:** Establishes a stable, secure, and deployable MVP base.
    - **Scope:** Repo setup, CI/CD baseline, environment config (Vercel/Supabase), core routing, shared UI primitives, analytics plumbing, security/privacy defaults.
    - **Why:** De-risks all downstream work and ensures a production-grade baseline for paid traffic.

2. **Pixel-Close Marketing Experience**
    - **Value:** Delivers the trust-building landing flow that drives conversion.
    - **Scope:** FacelessReels-structured landing, responsive layout, SEO structure, CTA wiring, copy adaptation, performance tuning for LCP.
    - **Why:** The landing page is the primary conversion asset and must feel polished before payment.

3. **Payment-First Checkout Flow**
    - **Value:** Enables real payment conversion without pre-signup friction.
    - **Scope:** Stripe Checkout integration, success/cancel handling, payment metadata capture, secure redirect to post-payment auth.
    - **Why:** Payment-first flow is the core validation mechanism.

4. **Post-Payment Auth & Access**
    - **Value:** Converts paid sessions into authenticated users and grants access.
    - **Scope:** Email + Google OAuth, account creation/login, payment-user linkage, protected dashboard access.
    - **Why:** Maintains funnel continuity and validates post-payment completion.

5. **Funnel Analytics & Admin Visibility**
    - **Value:** Provides actionable demand signals and operational visibility.
    - **Scope:** Event tracking (visit → CTA → checkout → payment → signup → dashboard), exportable paid user list, minimal admin view.
    - **Why:** Enables pricing/positioning decisions and supports MVP validation goals.

**Suggested Sequencing:** 1 → 2 → 3 → 4 → 5  
**Rationale:** Foundation supports landing performance and reliability; marketing experience must be credible before payments; payment flow precedes post-payment auth; analytics rounds out validation insights.

---

## Epic 1: Foundation & Delivery Readiness

Establish a stable, secure, and deployable MVP foundation with core infrastructure, configuration, and shared primitives that enable all downstream work.

### Story 1.1: Initialize project and deployment baseline

As a developer,
I want the repo, framework, and deployment baseline initialized,
So that the MVP can be built and deployed reliably from day one.

**Acceptance Criteria:**

**Given** a new project workspace
**When** I initialize the app and deployment config
**Then** the project builds locally and has a deployable baseline target (Vercel)

**And** the repository includes standard scripts, environment templates, and linting defaults

**Prerequisites:** None

**Technical Notes:** Use Next.js + Tailwind baseline; add `.env.example` for Vercel/Supabase/Stripe; keep configs minimal.

### Story 1.2: Configure core environment and secrets handling

As a developer,
I want structured environment and secrets handling,
So that integrations can be safely configured across local and production.

**Acceptance Criteria:**

**Given** the app configuration
**When** I load environment variables
**Then** missing secrets are validated and local/dev/prod values are separated

**And** secrets never ship to the client unless explicitly required

**Prerequisites:** Story 1.1

**Technical Notes:** Centralize env access; document required keys for Supabase + Stripe + OAuth.

### Story 1.3: Establish core routing shell and shared UI primitives

As a developer,
I want a minimal app shell and shared UI primitives,
So that feature pages can be assembled consistently and quickly.

**Acceptance Criteria:**

**Given** the app router and layout
**When** I navigate between core routes
**Then** the shell renders consistently and shared UI components are available

**And** global styles and typography are applied across pages

**Prerequisites:** Story 1.1

**Technical Notes:** Include layout, nav/footer placeholders, buttons, section wrappers; avoid final marketing copy here.

### Story 1.4: Add baseline analytics event plumbing

As a product owner,
I want a minimal analytics event pipeline,
So that funnel events can be captured consistently across the app.

**Acceptance Criteria:**

**Given** a shared analytics helper
**When** a page or CTA triggers an event
**Then** the event is recorded with consistent naming and metadata

**And** events can be swapped between providers without code changes per page

**Prerequisites:** Story 1.1

**Technical Notes:** Implement a lightweight event wrapper; defer provider choice (simple internal logging acceptable).

---

## Epic 2: Pixel-Close Marketing Experience

Deliver the trust-building, facelessreels-style landing experience with pixel-close layout, responsive behavior, and performance/SEO readiness.

### Story 2.1: Map and scaffold landing page structure

As a product owner,
I want the landing page sections and structure scaffolded to match the reference,
So that the overall hierarchy and flow mirrors the proven layout.

**Acceptance Criteria:**

**Given** the reference layout structure
**When** I create the landing page scaffold
**Then** the section order, spacing rhythm, and CTA placements mirror the reference

**And** each section has clear placeholders for final copy and visuals

**Prerequisites:** Story 1.3

**Technical Notes:** Use semantic sections; keep spacing tokens consistent; create section components for reuse.

### Story 2.2: Implement pixel-close hero and primary CTA

As a visitor,
I want the hero section to feel polished and familiar,
So that I trust the product and follow the primary CTA.

**Acceptance Criteria:**

**Given** the hero section
**When** I view it on desktop and mobile
**Then** the layout, spacing, typography, and CTA prominence mirror the reference

**And** the primary CTA routes to the checkout entry point

**Prerequisites:** Story 2.1

**Technical Notes:** Use responsive typography and spacing; avoid layout shifts on load.

### Story 2.3: Implement feature and “how it works” sections

As a visitor,
I want the feature and explanation sections to be clear and scannable,
So that I quickly understand the value before pricing.

**Acceptance Criteria:**

**Given** the feature and how-it-works sections
**When** I scroll the page
**Then** the section structure, spacing, and visual hierarchy mirror the reference

**And** copy is adapted for autopilotreels without changing section order

**Prerequisites:** Story 2.1

**Technical Notes:** Use reusable cards/rows; ensure mobile stacking matches reference.

### Story 2.4: Implement pricing section and CTA wiring

As a visitor,
I want pricing to be clear with immediate checkout access,
So that I can start payment without signing up.

**Acceptance Criteria:**

**Given** the pricing section
**When** I click a primary CTA
**Then** I am routed to Stripe checkout

**And** CTA click events are tracked

**Prerequisites:** Story 2.1, Story 1.4

**Technical Notes:** Wire CTA to checkout route; ensure pricing cards are consistent with reference.

### Story 2.5: Optimize landing performance, SEO, and accessibility

As a marketing owner,
I want the landing page to load fast and be SEO-ready,
So that paid and organic traffic convert effectively.

**Acceptance Criteria:**

**Given** the landing page
**When** performance and accessibility are checked
**Then** LCP is ~2.5s on typical 4G and no major layout shifts occur

**And** semantic headings, metadata, and focus states meet baseline SEO/WCAG expectations

**Prerequisites:** Stories 2.1–2.4

**Technical Notes:** Prefer static rendering; optimize images; ensure focus styles and contrast.

---

## Epic 3: Payment-First Checkout Flow

Enable a frictionless Stripe checkout experience prior to signup, with proper success/cancel handling and payment metadata capture.

### Story 3.1: Create checkout initiation route and session creation

As a visitor,
I want to start payment directly from the landing CTA,
So that I can pay without creating an account.

**Acceptance Criteria:**

**Given** a pricing CTA
**When** I click it
**Then** a Stripe Checkout session is created and I am redirected to Stripe-hosted checkout

**And** the session includes product/price metadata for later linking

**Prerequisites:** Story 2.4

**Technical Notes:** Use server-side route to create sessions; include plan identifiers in metadata.

### Story 3.2: Implement checkout success and cancel pages

As a paid or canceled user,
I want clear success/cancel pages,
So that I understand what happens next and how to proceed.

**Acceptance Criteria:**

**Given** a successful payment
**When** I return from Stripe
**Then** I see a success page that directs me to signup/login

**And** cancel returns me to pricing with a clear retry CTA

**Prerequisites:** Story 3.1

**Technical Notes:** Success page should carry checkout session reference for linking.

### Story 3.3: Capture and store payment metadata

As a system,
I want to record payment metadata,
So that I can link payments to users after auth.

**Acceptance Criteria:**

**Given** a successful checkout
**When** the payment completes
**Then** the payment metadata is stored in the database

**And** records are queryable by session or customer id

**Prerequisites:** Story 3.1

**Technical Notes:** Use Stripe webhook or success redirect handler; store minimal metadata in Supabase.

---

## Epic 4: Post-Payment Auth & Access

Convert paid sessions into authenticated users and ensure only authenticated users reach the dashboard.

### Story 4.1: Implement email/password auth

As a paid user,
I want to sign up or log in with email and password,
So that I can access the dashboard after payment.

**Acceptance Criteria:**

**Given** the auth page
**When** I submit valid credentials
**Then** I am authenticated and redirected to the dashboard

**And** errors are shown clearly for invalid or existing accounts

**Prerequisites:** Story 3.2

**Technical Notes:** Use Supabase Auth; keep UX minimal and aligned to landing style.

### Story 4.2: Implement Google OAuth login

As a paid user,
I want to log in with Google,
So that I can authenticate quickly after payment.

**Acceptance Criteria:**

**Given** the auth page
**When** I choose Google login
**Then** I complete OAuth and land in the dashboard

**And** redirect URIs are correctly configured for local and production

**Prerequisites:** Story 4.1

**Technical Notes:** Supabase OAuth config; ensure callback handling.

### Story 4.3: Link payment records to user accounts

As a system,
I want to link payments to user accounts,
So that I can verify paid access and track conversions.

**Acceptance Criteria:**

**Given** a user with a successful payment session
**When** they authenticate
**Then** their account links to the payment record

**And** access is granted only if payment exists

**Prerequisites:** Story 3.3, Story 4.1

**Technical Notes:** Match using session id or customer id; store linkage in Supabase.

### Story 4.4: Protect dashboard routes

As a paid user,
I want the dashboard to be protected,
So that only authenticated paid users can access it.

**Acceptance Criteria:**

**Given** an unauthenticated or unpaid user
**When** they navigate to the dashboard
**Then** they are redirected to auth or pricing appropriately

**And** authenticated paid users can access the dashboard without friction

**Prerequisites:** Story 4.1, Story 4.3

**Technical Notes:** Use server-side session checks where possible; avoid exposing dashboard data publicly.

---

## Epic 5: Funnel Analytics & Admin Visibility

Provide baseline analytics and minimal admin visibility for MVP validation insights.

### Story 5.1: Track funnel events end-to-end

As a product owner,
I want funnel events tracked consistently,
So that I can measure conversion across the flow.

**Acceptance Criteria:**

**Given** a user journey
**When** they move through the funnel
**Then** events are captured for visit, CTA click, checkout start, payment, signup, and dashboard

**And** event data includes timestamps and key identifiers

**Prerequisites:** Story 1.4, Story 3.1, Story 4.1

**Technical Notes:** Map event names clearly; avoid PII in event payloads unless required.

### Story 5.2: Build minimal admin view and export

As an operator,
I want a minimal admin view and export,
So that I can see paid users and download their emails.

**Acceptance Criteria:**

**Given** an admin route
**When** I access it
**Then** I can view total users, paid users, and export emails

**And** access to admin view is protected

**Prerequisites:** Story 5.1, Story 4.1

**Technical Notes:** Simple table + CSV export; secure with environment-flagged admin allowlist.

---

---

## Epic Breakdown Summary

**Coverage:** All MVP functional requirements are mapped: pixel-close landing (Epic 2), payment-first Stripe checkout (Epic 3), post-payment auth and access (Epic 4), and funnel analytics/admin visibility (Epic 5). Foundation work (Epic 1) establishes deployment, environment, routing, and analytics plumbing.

**Sequencing:** Epic 1 establishes delivery readiness; Epic 2 builds the conversion-critical landing experience; Epic 3 enables payment-first validation; Epic 4 converts paid sessions into authenticated users with protected access; Epic 5 completes validation insights with end-to-end funnel tracking and minimal admin visibility.

**Story sizing:** Each story is vertically sliced and scoped for a single focused implementation session, with clear prerequisites and BDD-style acceptance criteria.

**Compliance & constraints:** Uses Stripe-hosted checkout (minimizes PCI scope), Supabase Auth for secure sessions, minimal data storage, and explicit limited-availability messaging on the dashboard. Performance and accessibility requirements are included in Epic 2.

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._
