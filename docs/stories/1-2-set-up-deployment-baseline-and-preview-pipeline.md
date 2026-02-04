# Story 1.2: Set up deployment baseline and preview pipeline

Status: done

## Story

As a product owner,
I want a reliable deployment baseline,
so that the payment-first flow can be validated in production-like previews.

## Change Log

- 2026-02-04: Draft created from Epic 1 story 1.2 requirements.
- 2026-02-04: Documented deployment baseline, env vars, and Node 24.x pinning.
- 2026-02-04: Senior Developer Review notes appended.
- 2026-02-04: Senior Developer Review updated with preview deployment evidence; outcome approved.

## Acceptance Criteria

1. Given the current repository, when a preview or production deployment is triggered, then the app builds and serves the existing `frontend/` routes without missing assets or route errors. [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline]
2. Deployment configuration documents required environment variables and secrets for preview/production. [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline]
3. Deployment runtime is pinned to Node 24.x to match local/tooling expectations. [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline; docs/tech-spec-epic-1.md#Acceptance-Criteria-Authoritative]

## Tasks / Subtasks

- [x] Audit current deployment configuration (Vercel or equivalent) for build target, output paths, and `frontend/` routing assumptions; document any gaps (AC: 1). [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline; docs/architecture.md#Deployment-Architecture]
  - [x] Confirm build output serves `frontend/` routes without missing asset or route errors in preview (AC: 1).
- [x] Document deployment baseline steps and required env vars/secrets (preview + production) in `docs/` (AC: 2). [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline]
  - [x] Ensure documentation references existing `.env.example` for placeholder keys and does not introduce secrets (AC: 2). [Source: docs/tech-spec-epic-1.md#Objectives-and-Scope]
  - [x] Testing: verify deployment docs enumerate required env vars/secrets for preview and production (AC: 2). [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline]
- [x] Verify Node 24.x runtime pin for deployment and update deployment docs/settings if needed (AC: 3). [Source: docs/architecture.md#Project-Initialization; docs/tech-spec-epic-1.md#Acceptance-Criteria-Authoritative]
  - [x] Testing: validate preview deployment build uses Node 24.x runtime (AC: 3). [Source: docs/architecture.md#Project-Initialization]
  - [x] Testing: verify preview deployment serves `frontend/` routes and static assets without errors (AC: 1). [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline]

## Dev Notes

### Requirements Context Summary

- Establish a reliable deployment baseline so preview and production builds serve the existing `frontend/` routes without missing assets or route errors. [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline]
- Deployment configuration must document required environment variables/secrets and pin runtime to Node 24.x to align with local/tooling expectations. [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline; docs/tech-spec-epic-1.md#Acceptance-Criteria-Authoritative]
- Keep the existing `frontend/` app as the only deployable surface; do not introduce a new starter app. [Source: docs/architecture.md#Project-Initialization]
- Deployment target is a single Vercel deployment for `frontend/`, consistent with the architecture. [Source: docs/architecture.md#Deployment-Architecture]
- Scope is deployment readiness only; no Stripe/Auth feature implementation in this story. [Source: docs/tech-spec-epic-1.md#Objectives-and-Scope]

### Architecture Patterns and Constraints

- Deploy only the existing `frontend/` app; no new starter or parallel app surfaces. [Source: docs/architecture.md#Project-Initialization]
- Use a single Vercel deployment for `frontend/` and align deployment runtime to Node 24.x. [Source: docs/architecture.md#Deployment-Architecture; docs/architecture.md#Project-Initialization]
- Deployment baseline must include documented env vars and runtime pinning to avoid mismatch between local and preview/prod. [Source: docs/tech-spec-epic-1.md#Acceptance-Criteria-Authoritative]

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
- Detected conflicts or variances (with rationale)

### Structure Alignment Summary

- Previous story (1-1) established runtime/env scaffolding and documented build verification; reuse `.env.example` and `.nvmrc` rather than recreating. [Source: docs/stories/1-1-initialize-project-runtime-environment-scaffolding.md#Completion-Notes-List]
- Node 24.x pinning is already in place (`.nvmrc`) and should be referenced/validated for deployment baseline rather than altered. [Source: docs/stories/1-1-initialize-project-runtime-environment-scaffolding.md#Completion-Notes-List]
- Deployment work should remain within existing `frontend/` app and root-level config/docs; do not introduce new app directories. [Source: docs/architecture.md#Project-Initialization]
- Expected deployment surface is a single Vercel build for `frontend/` with runtime documented in `docs/` and root config. [Source: docs/architecture.md#Deployment-Architecture]
- No unresolved review items from previous story; proceed without pending carryovers. [Source: docs/stories/1-1-initialize-project-runtime-environment-scaffolding.md#Senior-Developer-Review-AI]

### Learnings from Previous Story

**From Story 1-1-initialize-project-runtime-environment-scaffolding (Status: done)**

- **New Files**: `.env.example`, `.nvmrc`, `docs/runtime-environment.md` are already established; reuse and reference these instead of recreating. [Source: docs/stories/1-1-initialize-project-runtime-environment-scaffolding.md#Completion-Notes-List]
- **Runtime Pinning**: Node 24.13.0 pin added; deployment baseline should align to Node 24.x to prevent runtime mismatch. [Source: docs/stories/1-1-initialize-project-runtime-environment-scaffolding.md#Completion-Notes-List]
- **Build Verification**: Previous story confirms `npm run build` success on Node 24.x; use this as the baseline expectation for preview deploys. [Source: docs/stories/1-1-initialize-project-runtime-environment-scaffolding.md#Completion-Notes-List]
- **Warnings**: None recorded; no pending review items. [Source: docs/stories/1-1-initialize-project-runtime-environment-scaffolding.md#Senior-Developer-Review-AI]

### References

- Epic story requirements: [Source: docs/epics.md#Story-12-Set-up-deployment-baseline-and-preview-pipeline]
- Epic 1 technical spec (deployment ACs and constraints): [Source: docs/tech-spec-epic-1.md#Acceptance-Criteria-Authoritative]
- Architecture (deployment target, project initialization, structure): [Source: docs/architecture.md#Deployment-Architecture; docs/architecture.md#Project-Initialization; docs/architecture.md#Project-Structure]
- PRD (deployment readiness context): [Source: docs/PRD.md#Product-Scope]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- 2026-02-04: Plan
  - Review deployment baseline requirements and existing runtime docs.
  - Audit repo for deployment config (Vercel settings, root directory, build commands).
  - Document deployment baseline, env vars, and Node 24.x pinning in `docs/runtime-environment.md`.
  - Run lint/build to confirm `frontend/` builds cleanly.
  - Update story tasks, file list, and status once validation passes.
- 2026-02-04: Validation
  - `npm run lint` succeeded.
  - `npm run build` succeeded (run locally by user).

### Completion Notes List

- Documented deployment baseline, env vars, and Node 24.x runtime expectations in `docs/runtime-environment.md`.
- Tests: `npm run lint` (pass), `npm run build` (pass, run locally by user).

### File List
- `docs/runtime-environment.md`

## Status

done

## Senior Developer Review (AI)

**Reviewer:** darko  
**Date:** 2026-02-04  
**Outcome:** Approve  
**Justification:** Preview deployment evidence captured, Node 24.x runtime pin verified, and all ACs and completed tasks now have supporting evidence.

### Summary

The deployment baseline documentation is solid and now includes preview deployment evidence and runtime pin verification. All acceptance criteria are fully evidenced and tasks marked complete are verified. Tech stack detected: Next.js 16.1.6, React 19.2.3, Node 24.x. File List reviewed: `docs/runtime-environment.md`.

### Key Findings

No high or medium severity findings.

**LOW**
- Warning: No story context file found.

### Acceptance Criteria Coverage

| AC # | Description | Status | Evidence |
| --- | --- | --- | --- |
| AC1 | Preview/prod deploy builds and serves `frontend/` routes without missing assets or route errors. | IMPLEMENTED | Preview evidence recorded in `docs/runtime-environment.md:25-31`; deploy baseline notes in `docs/runtime-environment.md:10-23,64-69`. |
| AC2 | Deployment configuration documents required env vars/secrets for preview/prod. | IMPLEMENTED | `docs/runtime-environment.md:33-46`, `.env.example:4-21`. |
| AC3 | Deployment runtime pinned to Node 24.x. | IMPLEMENTED | `.nvmrc:1`, `frontend/package.json:11-12`, `docs/runtime-environment.md:48-52`, preview evidence in `docs/runtime-environment.md:25-31`. |

**Summary:** 3 of 3 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Audit deployment config and document gaps (AC1) | Complete | VERIFIED COMPLETE | `docs/runtime-environment.md:12-23` |
| Confirm build output serves `frontend/` routes in preview (AC1) | Complete | VERIFIED COMPLETE | `docs/runtime-environment.md:25-31` |
| Document deployment baseline steps and required env vars/secrets (AC2) | Complete | VERIFIED COMPLETE | `docs/runtime-environment.md:10-69` |
| Ensure docs reference `.env.example` and do not introduce secrets (AC2) | Complete | VERIFIED COMPLETE | `docs/runtime-environment.md:33-46`, `.env.example:1-21` |
| Testing: verify deployment docs enumerate required env vars/secrets (AC2) | Complete | VERIFIED COMPLETE | `docs/runtime-environment.md:33-46` |
| Verify Node 24.x runtime pin for deployment and update docs/settings if needed (AC3) | Complete | VERIFIED COMPLETE | `.nvmrc:1`, `frontend/package.json:11-12`, `docs/runtime-environment.md:48-52`. |
| Testing: validate preview deployment build uses Node 24.x runtime (AC3) | Complete | VERIFIED COMPLETE | `docs/runtime-environment.md:25-31`. |
| Testing: verify preview deployment serves `frontend/` routes/assets (AC1) | Complete | VERIFIED COMPLETE | `docs/runtime-environment.md:25-31`. |

**Summary:** 8 of 8 completed tasks verified, 0 questionable, 0 falsely marked complete.

### Test Coverage and Gaps

- No automated tests added for deployment verification (expected; validation is manual).  
- Manual preview deployment evidence captured in `docs/runtime-environment.md:25-31`.

### Architectural Alignment

- Documentation aligns with the single `frontend/` deployment target and Node 24.x expectations. No architectural violations found.

### Code Quality Notes

- Documentation-only changes; no code quality issues observed.

### Security Notes

- No code changes affecting security in this story.

### Best-Practices and References

- Vercel Node.js runtime versions (pinning guidance): https://vercel.com/docs/functions/runtimes/node-js/node-js-versions  
- Vercel build settings (root directory / defaults): https://vercel.com/docs/deploy-button/build-settings  
- Next.js environment variable loading conventions: https://nextjs.org/docs/13/pages/building-your-application/configuring/environment-variables

### Action Items

**Code Changes Required:**
- None.

**Advisory Notes:**
- Note: Keep preview deployment evidence updated if settings change.
