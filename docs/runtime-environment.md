# Runtime & Environment Baseline

## Current State Audit (2026-02-03)

- `frontend/package.json` defines `engines.node` and runtime pinning is handled via root `.nvmrc`.
- Environment variables are documented in root `.env.example`; local usage is via `.env.local`.
- `frontend/next.config.ts` has no custom env handling; environment loading relies on default Next.js behavior.
- `frontend/README.md` is still the default Next.js template, so project-specific setup is captured here in `docs/`.

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
