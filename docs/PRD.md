# autopilotreels - Product Requirements Document

**Author:** darko
**Date:** 2026-02-02
**Version:** 1.0

---

## Executive Summary

autopilotreels is a payment-first demand-validation MVP for an AI short-form video SaaS idea. The product's purpose is to test conversion, pricing, and willingness to pay by delivering a high-conversion landing experience, frictionless checkout, and a realistic post-payment onboarding flow. This PRD focuses on the minimum scope needed to validate market demand, not on building AI video capabilities.

### What Makes This Special

The magic is the **pixel‑close landing experience** that mirrors a proven, high‑converting SaaS page and drives users directly into a payment‑first flow. The standout moment is when a visitor sees a familiar, polished layout, trusts it, and completes checkout before ever creating an account.

---

## Project Classification

**Technical Type:** web_app (SaaS landing + checkout + auth + dashboard)
**Domain:** general
**Complexity:** low

- **Product intent:** Validate willingness to pay for a future AI short‑form video automation SaaS by focusing on the payment‑first funnel and a proven SaaS landing experience.
- **Primary artifact:** Pixel‑close landing page modeled on the reference site’s structure and flow, with tailored copy for autopilotreels.
- **Validation loop:** Landing → payment checkout → post‑payment auth → placeholder dashboard.
- **Non‑goal:** No AI generation, automation, or real service delivery; this is strictly a conversion and pricing test.
- **Constraints:** Fast build, lightweight infra (Vercel + Supabase), and minimal operational burden.

---

## Success Criteria

- **Payment-first validation works:** Visitors complete checkout before account creation with minimal friction; the payment flow feels natural and trustworthy.
- **Clear demand signal:** A meaningful number of real users pay for access within the initial launch window, indicating willingness to pay.
- **Funnel continuity:** The majority of paid users complete post‑payment signup/login and reach the dashboard without support intervention.
- **Honest expectations:** Users understand the product is in limited availability and accept the placeholder experience without confusion or backlash.
- **Actionable insights:** The team can confidently decide on pricing, positioning, and whether to build the full AI product based on conversion and feedback.

---

## Product Scope

### MVP - Minimum Viable Product

**MVP must prove demand with the smallest surface area possible.** The MVP includes a pixel‑close landing page, payment‑first checkout, post‑payment authentication, and a placeholder dashboard. It must be production‑ready enough to accept payments, protect user data, and present a trustworthy experience.

**Included in MVP:**

- Landing page that mirrors the reference site’s structure, section order, spacing, and flow
- CTA → Stripe checkout (payment before signup)
- Checkout success/cancel pages
- Post‑payment signup/login (email + Google OAuth)
- User account linking to payment record
- Protected placeholder dashboard with “service unavailable” message
- Basic analytics for funnel measurement (visit → checkout → payment → signup → dashboard)

**Explicitly excluded:**

- Any AI/video generation or automation features
- Content uploading, processing, or publishing
- Social media integrations
- Customer support workflows or refund automation

### Growth Features (Post-MVP)

**Post‑MVP growth focuses on scaling validation, not building AI.**

- A/B testing framework for landing page sections, pricing tiers, and CTAs
- Expanded analytics dashboard (cohorts, source attribution, drop‑off points)
- Email onboarding sequence and waitlist messaging
- Referral/invite flow to drive viral validation
- Multi‑plan pricing experiments (monthly vs annual, tiers)
- Lightweight admin panel for metrics, user export, and manual refunds

### Vision (Future)

**Long‑term vision (if demand is validated):** deliver an AI short‑form video automation platform with real creation, publishing, and growth tooling. This is explicitly out of scope for the MVP but defines the strategic north star.

- AI‑assisted script and storyboard generation
- Automated video creation and voiceover
- Template library and brand kits
- Social publishing and scheduling
- Content performance analytics
- Collaboration for teams and agencies

---

## web_app (SaaS landing + checkout + auth + dashboard) Specific Requirements

This product is a **web application** with a marketing‑first SaaS funnel. The project‑type requirements focus on building a trustworthy, conversion‑optimized web experience with clear performance and SEO expectations.

Key requirements:

- Pixel‑close UI implementation aligned to the reference layout
- Responsive design across desktop and mobile
- Fast initial page load and smooth navigation
- SEO‑friendly structure to support paid + organic traffic
- Tracking for CTA clicks, checkout, and conversion events

---

## User Experience Principles

- **Visual personality:** Polished, modern SaaS marketing look that mirrors the reference site’s hierarchy, spacing, and rhythm.
- **Tone:** Trustworthy, premium, and conversion‑focused.
- **Interaction style:** Minimal friction, clear CTA prominence, and immediate path to payment.
- **Consistency:** Maintain page section order and layout structure to preserve proven conversion patterns.

### Key Interactions

- **Landing → Pricing → Checkout:** User scrolls through features and pricing, then clicks CTA into Stripe checkout.
- **Checkout → Auth:** On successful payment, user is required to sign up or log in.
- **Auth → Dashboard:** After authentication, the user lands on a protected dashboard with the “high demand / unavailable” message.
- **Failure handling:** Clear messaging on checkout cancellation or payment errors, with a path back to pricing.

---

## Functional Requirements

### 1. Landing Page (Reference UI Clone)

**Requirement:** Implement a pixel‑close marketing landing page that mirrors the reference site’s structure and flow.
**Acceptance Criteria:**

- Page sections, hierarchy, spacing, and CTA placement match the reference layout
- Copy is updated for autopilotreels without altering section order
- Fully responsive on desktop and mobile

### 2. Pricing & CTA Flow

**Requirement:** Drive users directly from the landing page into checkout without requiring signup.
**Acceptance Criteria:**

- Primary CTA buttons route to Stripe checkout
- Pricing section contains clear plan details and CTA linkage
- Analytics capture CTA clicks and checkout starts

### 3. Stripe Checkout (Payment First)

**Requirement:** Support payment before account creation.
**Acceptance Criteria:**

- Users can complete payment without an account
- Success and cancel pages are implemented
- Payment metadata is stored for linking to a user later

### 4. Post‑Payment Authentication

**Requirement:** Require signup/login only after successful payment.
**Acceptance Criteria:**

- Email/password and Google OAuth login are available
- Paid sessions are linked to created accounts
- Authenticated users are redirected to dashboard

### 5. Placeholder Dashboard

**Requirement:** Provide a protected dashboard that confirms access but clearly states limited availability.
**Acceptance Criteria:**

- Dashboard is accessible only after auth
- Message communicates “high demand / service unavailable”
- Basic account info is displayed

### 6. Funnel Analytics

**Requirement:** Measure conversion across the payment‑first flow.
**Acceptance Criteria:**

- Track visits, CTA clicks, checkout starts, payments, and post‑payment signups
- Exportable list of paid users
- Minimal admin view for funnel visibility

---

## Non-Functional Requirements

### Performance

- **Page load:** Landing page Largest Contentful Paint (LCP) under ~2.5s on typical 4G mobile.
- **Checkout speed:** CTA → Stripe checkout should feel immediate; no blocking client-side work before redirect.
- **Runtime:** Avoid heavy client bundles; prioritize static rendering for landing where possible.
- **Perceived performance:** Smooth scrolling and no layout shifts during load.

### Security

- **Payment security:** Use Stripe-hosted checkout to minimize PCI scope.
- **Auth security:** Secure session handling and protected routes for the dashboard.
- **Data handling:** Store only essential user and payment metadata in Supabase.
- **OAuth:** Google OAuth configured correctly with verified redirect URIs.
- **Privacy:** Clear disclosure that the product is a validation MVP with limited availability.

### Scalability

- **Traffic readiness:** Support initial paid traffic campaigns without degraded performance.
- **Hosting:** Vercel default scaling is sufficient for MVP; no custom infra required.
- **Data:** Supabase free tier acceptable for validation volume.

### Accessibility

- **Level:** Meet baseline web accessibility (WCAG 2.1 AA where practical).
- **Contrast & focus:** Ensure buttons/links have visible focus states and sufficient contrast.
- **Structure:** Use semantic headings and labels for form fields.

### Integration

- **Payments:** Stripe Checkout with webhook handling for payment confirmation.
- **Auth & DB:** Supabase Auth + Postgres for user records and payment linkage.
- **Analytics:** Basic event tracking (could be simple internal logging or a lightweight analytics tool).

---

## Implementation Planning

### Epic Breakdown Required

Requirements must be decomposed into epics and bite-sized stories (200k context limit).

**Next Step:** Run `workflow epics-stories` to create the implementation breakdown.

---

## References

- Product Brief: product-brief.md

---

## Next Steps

1. **Epic & Story Breakdown** - Run: `workflow epics-stories`
2. **UX Design** (if UI) - Run: `workflow ux-design`
3. **Architecture** - Run: `workflow create-architecture`

---

_This PRD captures the essence of autopilotreels - a pixel‑close, trust‑building landing experience that drives users straight into a payment‑first validation flow_

_Created through collaborative discovery between darko and AI facilitator._
