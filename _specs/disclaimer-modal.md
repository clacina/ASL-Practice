# Spec for disclaimer-modal

branch: claude/feature/disclaimer-modal
figma_component (if used): N/A

## Summary

The footer currently uses a `<details>`/`<summary>` element to show or hide the disclaimer inline. This should be replaced with a modal dialog: clicking the "Disclaimer" text opens a centered overlay modal containing the disclaimer content, and the user can close it via a close button or by clicking the backdrop.

## Functional Requirements

- The footer retains a "Disclaimer" clickable text link in its existing position.
- Clicking "Disclaimer" opens a modal dialog overlaying the page.
- The modal displays all four existing disclaimer bullet points, unchanged in content.
- The modal can be closed by:
  - Clicking a close button inside the modal (e.g. an ✕ button in the header).
  - Clicking the backdrop/overlay area outside the modal panel.
  - Pressing the Escape key.
- While the modal is open, the page behind it is not scrollable.
- The `<details>`/`<summary>` element is removed and replaced by the modal trigger.
- The modal is rendered inside the `Footer` component (no need for a portal unless z-index conflicts arise).

## Possible Edge Cases

- Modal opened on a very small screen — the modal panel should not overflow the viewport; use `max-height` with internal scroll if needed.
- Rapid open/close (double-click) — state should settle correctly with no stuck-open modal.
- Modal open state should reset if the component unmounts (e.g. user navigates away mid-open).
- Multiple footer instances on the same page — each should manage its own open state independently.

## Acceptance Criteria

- [ ] The footer no longer contains a `<details>`/`<summary>` element.
- [ ] A "Disclaimer" trigger link/button is visible in the footer at all times.
- [ ] Clicking the trigger opens the modal with all four disclaimer points visible.
- [ ] Clicking the ✕ close button dismisses the modal.
- [ ] Clicking the backdrop dismisses the modal.
- [ ] Pressing Escape dismisses the modal.
- [ ] The modal does not appear on initial page load.
- [ ] Body scroll is locked while the modal is open.
- [ ] The modal is visually centered on the page with a semi-transparent backdrop.

## Open Questions

- Should the modal have a title/heading (e.g. "Disclaimer") displayed inside the panel, separate from the trigger label?
  - No
- Should focus be trapped inside the modal while it is open, or is a simple focus-on-open sufficient?
  - trapped

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Clicking the Disclaimer trigger sets modal open state to true.
- Clicking the backdrop sets modal open state to false.
- Pressing Escape sets modal open state to false.
- Clicking the close button sets modal open state to false.
- Modal is not rendered (or not visible) when open state is false.
- All four disclaimer bullet points are present in the modal content.
