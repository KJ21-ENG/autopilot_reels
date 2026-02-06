# Story 5.4: Perform accessibility QA for auth and dashboard

Status: done

## Story

As a product owner,
I want accessibility verification for auth and dashboard screens,
So that post‑payment flows are inclusive and usable.

## Acceptance Criteria

1. **Given** the auth and dashboard screens, **When** I run a11y checks and keyboard-only navigation, **Then** there are no critical accessibility violations.
2. **And** all interactive elements have proper labels and focus indicators.
3. **And** screen readers can navigate effectively.

## Tasks / Subtasks

- [x] Audit and improve Auth page accessibility <!-- id: 4a -->
    - [x] Update form labels and associations
    - [x] Ensure error messages are properly announced
- [x] Audit and improve Dashboard accessibility <!-- id: 4b -->
    - [x] Update Sidebar navigation with `aria-current`
    - [x] Enhance User Menu trigger with `aria-expanded` and `aria-haspopup`
    - [x] Add `aria-hidden="true"` to decorative icons
- [x] Manual verification with keyboard and screen reader simulation <!-- id: 4c -->

## Dev Notes

- Focus on `aria-label`, `aria-describedby`, and ensuring focus states are visible.
- Ensure buttons have descriptive text for screen readers.
