  # Context Analysis: My Conversation with Client
**Source Document:** `docs/my conversation with client.md`
**Project Name:** Autopilotreels
**Domain:** Autopilotreels.com

## 1. Project Overview & Objective
**Goal:** Build a "Pay-First" MVP funnel to test market demand for an automated faceless video creation tool (similar to AutoShorts.ai).
**Current State:** The backend is under construction. The Client (Jane Alan) wants to launch the frontend funnel immediately to capture sales/interest.
**Core Functionality:** A high-converting landing page that collects payment *before* account creation, ultimately leading to a placeholder dashboard.

## 2. Critical User Flow (The "Pay-First" Model)
1.  **Landing Page**: User views offer.
2.  **CTA Click**: User clicks "Start" or "Buy".
3.  **Payment**: User is redirected immediately to **Stripe Checkout** (Subscription model).
4.  **Account Creation**: *After* successful payment, user creates their account (login/signup).
5.  **Dashboard**: User logs in and sees a message: *"Service is currently down due to high traffic"*. (No actual video generation yet).

## 3. Design & Aesthetic Direction
**Vibe:** Simple, straightforward, high-converting, "Premium but Simple".

**Key References:**
*   **Primary Inspiration (Structure/Simplicity):** [FacelessReels.com](https://www.facelessreels.com/)
    *   *What to take:* Simple layout, one main CTA, clear promise, 3-step flow explanation.
*   **Secondary Inspiration (Features/Trust):** [Clippie.ai](https://clippie.ai/)
    *   *What to take:* "Sneak preview" of the internal studio (show how it works), clear pricing, high-conversion elements.
    *   *Avoid:* Making it too busy/salesy.
*   **Anti-Pattern:** [faceless.so](https://faceless.so/)
    *   *Why:* Too complex/heavy UI.

**Hybrid Design Requirement:**
*   Clean Hero Section (Headline + CTA + Proof).
*   "How it Works" section (Simple 3-step).
*   **Studio Preview**: A visual representation of the app's interface (from Clippie inspiration) to build trust.
*   Pricing Section (Clear).
*   Trust Signals (Support, Policy).

## 4. Technical Specifications
*   **Frontend**: Landing Page + Auth Pages + Dashboard.
*   **Payments**: Stripe Subscription (USD default, support local currencies).
*   **Hosting**: Vercel.
*   **Authentication**: Required (but placed *after* payment in the flow).

## 5. Scope of Work (MVP - $300 Budget)
**Milestone 1 ($150):**
*   Landing page layout.
*   "Studio/Sneak Preview" sections.
*   Pricing section.

**Milestone 2 ($150):**
*   Stripe Subscription integration.
*   Implementation of Pay-First Flow (Checkout -> Create Account -> Dashboard).
*   Deployment to Vercel.

## 6. Detailed Analysis of Conversation Log
*   **Initial Request:** Client wants to clone the `autoshorts.ai` concept but strictly as a funnel test first.
*   **Clarification:** Developer clarified this is connected to a "Web Scraper" backend project, but this specific task is the frontend sales funnel.
*   **Negotiation:** Agreed on a fixed price ($300) MVP rather than hourly to keep scope tight.
*   **Design Iteration:** Client rejected the initial generic prototype in favor of a specific hybrid between `FacelessReels` (layout) and `Clippie` (app preview).
*   **Final Decision:** Client purchased domain `Autopilotreels.com` and confirmed Vercel hosting. Work begins on Milestone 1 immediately.
