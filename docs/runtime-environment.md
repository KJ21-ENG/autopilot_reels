# Runtime & Environment Baseline

## Current State Audit (2026-02-03)

- `frontend/package.json` defines `engines.node` and runtime pinning is handled via root `.nvmrc`.
- Environment variables are documented in root `.env.example`; local usage is via `.env.local`.
- `frontend/next.config.ts` has no custom env handling; environment loading relies on default Next.js behavior.
- `frontend/README.md` is still the default Next.js template, so project-specific setup is captured here in `docs/`.

## Deployment Baseline (Preview + Production)

### Deployment Configuration Audit (2026-02-04)

- No `vercel.json` is present in the repo; deployment configuration lives in the Vercel project settings.
- The deployment target is the existing `frontend/` Next.js app; this must remain the only build surface.
- Build output and routing assume the `frontend/` app is the project root for preview/production builds.

**Potential Gaps / Checks**

- Ensure Vercel "Root Directory" is set to `frontend/` (if unset, builds may target repo root and miss routes/assets).
- Confirm the Build Command is `npm run build` and the Install Command is `npm install` (run within `frontend/`).
- Verify Preview + Production environment variables are set to match `.env.example` keys.
- Confirm Node.js Version is pinned to `24.x` in Vercel project settings.

### Preview Deployment Evidence (2026-02-04)

- Root Directory: default (empty)
- Build Command: default (Vercel auto-detect)
- Install Command: default (Vercel auto-detect)
- Node.js Version: `24.x`
- Preview URL: https://nextjs-boilerplate-mu-flame-76.vercel.app/

### Required Environment Variables (Preview + Production)

Use `.env.example` as the source of truth for required keys. Set these in both Preview and Production:

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`
- `STRIPE_PRODUCT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

No secrets are stored in the repo. Populate values in the Vercel dashboard for each environment.

## Runtime Pinning

- **Local**: use Node `24.13.0` (see `.nvmrc`).
- **Preview/Prod**: configure Vercel (or equivalent) to build with Node `24.x` and ensure the same env vars are set.
    - `frontend/package.json` sets `engines.node` to `24.x` as an additional guard.

## Local Setup

```bash
cd frontend
npm install
```

1. Copy `.env.example` to `.env.local` and populate values.
2. Start dev server with `npm run dev`.

## Preview/Deployment Checklist

- Node runtime set to `24.x`.
- Environment variables defined based on `.env.example`.
- Build command: `npm run build` from `frontend/`.
- Root directory set to `frontend/` for Vercel previews/production.

## Build Verification

```bash
cd frontend
npm run lint
npm run build
```

### Build Verification Evidence (2026-02-03)

- Ran `npm run build` with Node v24.13.0; build succeeded.

## Notes

- Next.js loads environment variables from `.env.local`, `.env.development`, and `.env.production` by default.
- Preview runtime pin verified in Vercel: Node.js Version set to `24.x` (2026-02-03).
