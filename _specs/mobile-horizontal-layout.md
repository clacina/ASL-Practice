# Spec for mobile-horizontal-layout

branch: claude/feature/mobile-horizontal-layout
figma_component (if used): N/A

## Summary

When a device screen is less than 1024px wide and in landscape (horizontal) orientation, the `FlashcardSession` view should switch from its current vertical layout to a compact 3-column layout: controls on the left, video in the center, and the term list on the right. The header (`flashcard-session-header` div) should be hidden in this mode to reclaim vertical space.

## Functional Requirements

- Detect when the viewport width is less than 1024px AND the device is in landscape (horizontal) orientation.
- In that state, hide the `flashcard-session-header` div entirely.
- Switch the session layout to a 3-column arrangement in this order: controls column | video column | term-list column.
- Revert to the default layout when the screen is wider than 1024px or switches back to portrait orientation.
- The layout change must respond dynamically as the user rotates the device (no page reload required).
- Each column should be appropriately sized so all three are visible without horizontal scrolling.
- The video column should take the most space, with controls and term list given narrower fixed or proportional widths.

## Possible Edge Cases

- Device rotates while a card is being shown — the active card and playback state should be preserved.
- Very narrow landscape screens (e.g. older phones) where 3 columns may still be tight — columns should not overflow; use overflow hidden or scroll per column as appropriate.
- User resizes a desktop browser window to below 1024px while in a non-landscape orientation — the 3-column layout should NOT activate; it requires both conditions simultaneously.
- Term list with many items in the narrow right column — the column should scroll independently.

## Acceptance Criteria

- [ ] On a device or browser window narrower than 1024px in landscape orientation, the `flashcard-session-header` div is not visible.
- [ ] On a device or browser window narrower than 1024px in landscape orientation, the session displays three side-by-side columns: controls | video | term list.
- [ ] Rotating back to portrait (or resizing above 1024px) restores the original layout and re-shows the header.
- [ ] No horizontal scrollbar appears in the 3-column layout.
- [ ] Active flashcard state is preserved through orientation changes.
- [ ] The 3-column layout does not activate on a portrait screen narrower than 1024px.

## Open Questions

- Should the controls column show all existing controls (navigation buttons, color picker, etc.) or a reduced set to save space?
  - reduces set to save space
- Should the term list column be scrollable independently or clipped?
  - independently
- Is there a minimum height required before the 3-column layout kicks in, in addition to the width and orientation check?
  - Optimize so the video is the largest it can be

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Verify that the `flashcard-session-header` is hidden when width < 1024px and orientation is landscape.
- Verify that the `flashcard-session-header` is visible when width >= 1024px regardless of orientation.
- Verify that the `flashcard-session-header` is visible when orientation is portrait and width < 1024px.
- Verify that the 3-column layout class or style is applied under the mobile-landscape condition.
- Verify that the default layout is restored when orientation changes back to portrait.
