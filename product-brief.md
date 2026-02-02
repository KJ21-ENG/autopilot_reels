# Product Brief — autopilotreels

## Demand Validation MVP (FacelessReels-Style UI)

## Overview

**autopilotreels** is a demand-validation MVP for a SaaS platform in the AI short-form video automation space.

The client requires:

- A **UI closely replicated from https://www.facelessreels.com/**
- A **payment-first onboarding flow**
- Authentication and a placeholder dashboard
- Lightweight infrastructure suitable for MVP validation

The purpose of this MVP is to **test conversion, pricing, and willingness to pay**, not to build the actual AI product.

---

## Objectives

- Validate real demand using paid signups
- Test conversion using a proven SaaS UI pattern
- Minimize build time and infrastructure cost
- Capture early users for future rollout
- Simulate a real SaaS onboarding experience

---

## UI / Design Requirements (Critical)

- Landing page UI will be **closely replicated from https://www.facelessreels.com/**
- Layout, section structure, spacing, and flow will match the reference site
- Copy/content may be adjusted for autopilotreels
- Minor visual changes may be made for responsiveness or technical feasibility
- No custom design or design iteration included

**Note:**  
All IP, branding, and legal responsibility related to copying the UI rests with the client.

---

## User Flow (Payment-First)

1. User lands on marketing landing page
2. User reviews features & pricing
3. User proceeds directly to **payment checkout**
4. After successful payment:
    - User is required to **sign up or log in**
    - Email/password and Google login options are shown
5. User is redirected to dashboard
6. User sees high-demand / service unavailable message

---

## Scope of Work

### 1. Marketing Landing Page (FacelessReels UI Clone)

Purpose: High-conversion SaaS landing using an existing proven layout.

Includes:

- Hero section
- Feature sections
- How-it-works section
- Pricing section
- CTA buttons leading to payment
- Mobile responsive layout
- Pixel-close UI implementation (best effort)

---

### 2. Payment Integration (Pre-Signup)

Purpose: Validate willingness to pay **before** account creation.

Includes:

- Stripe integration
- Payment initiated without prior signup
- One-time payment or subscription (to be confirmed)
- Checkout success & cancel pages
- Temporary payment session handling
- Redirect to signup/login after successful payment

Note:

- Payments are for MVP validation only
- No real service delivery included

---

### 3. Authentication System (Post-Payment)

Purpose: Allow paid users to create or access accounts.

Includes:

- Email & password signup/login
- Google OAuth login
- Password reset flow
- Link payment record to user account
- Protected routes for dashboard access

---

### 4. User Dashboard (Placeholder Only)

Purpose: Simulate SaaS access after payment + signup.

Includes:

- Protected dashboard page
- Simple SaaS-style layout
- Basic user/account info
- Message such as:

> “Due to extremely high demand, the service is temporarily unavailable. Your account is active and you will be notified once access is enabled.”

No AI, video generation, or automation features included.

---

### 5. Basic Admin / Metrics (Optional)

Includes:

- View total users
- View paid users
- Export user emails
- Basic funnel visibility (visit → pay → signup)

---

## Infrastructure & Hosting

### Frontend

- Framework: Next.js / React
- Styling: Tailwind CSS
- Hosting: **Vercel**
- Domain: **Client’s custom domain connected to Vercel**

### Backend

- Backend-as-a-Service: **Supabase (Free Tier)**
- Authentication: Supabase Auth (Email + Google OAuth)
- Database: Supabase Postgres
- Payment metadata storage

---

## Explicit Non-Goals (Out of Scope)

The following are **NOT included** in this MVP:

- AI video generation
- Script writing or automation
- Voice generation
- Video rendering
- Social media integrations
- Scheduling systems
- Queue or worker systems
- Scalable production infrastructure
- Customer support tooling
- Refund automation

---

## Compliance & Responsibility Notes

- UI replication is performed strictly per client instruction
- Client is responsible for IP, branding, and legal compliance
- Clear messaging around limited availability is recommended
- Refund policy must be defined by the client
- Supabase Free Tier limitations are accepted as part of MVP scope

---

## Delivery Phases

### Phase 1 — Landing Page UI Clone

- FacelessReels-style landing page
- Responsive implementation
- CTA → payment flow

### Phase 2 — Payments (Pre-Signup)

- Stripe integration
- Payment-first flow
- Success & cancel handling

### Phase 3 — Auth + Dashboard

- Email + Google login
- Payment-to-user linking
- Protected dashboard
- Placeholder service message

---

## Acceptance Criteria

- Landing page visually matches facelessreels.com structure
- User can complete payment without prior signup
- User must sign up or log in after payment
- Google login is available
- User can access dashboard after signup
- Dashboard shows service unavailable message
- Frontend is live on Vercel using client domain
- Backend runs on Supabase free tier

---
