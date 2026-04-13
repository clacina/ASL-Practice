# Spec for card-colors-and-shuffle

branch: claude/feature/card-colors-and-shuffle
figma_component (if used): N/A

## Summary
Enhances the flashcard session with two visual improvements: the term list is shuffled into a random order when a session starts, and each card is assigned a background color randomly drawn from a centralized palette in `src/data/card-colors.js`. The text on each card automatically uses a contrasting color so it remains readable against any background. All cards share a fixed size that fits within the viewport without requiring the user to scroll.

## Functional Requirements
- When a session starts, the parsed term list is shuffled into a random order before any card is shown.
- `src/data/card-colors.js` exports a list of color values (background colors) used for card theming.
- Each card in a session is assigned one color from the palette, chosen at random when the session begins.
- The color assignment is stable for the duration of the session — navigating back and forward does not re-randomize colors.
- The text on each card uses a contrasting color (light text on dark backgrounds, dark text on light backgrounds) derived from the card's background color.
- All cards have the same fixed dimensions, regardless of term length.
- The entire flashcard card must be visible within the viewport without vertical or horizontal scrolling.
- The card size is consistent across all viewport sizes at or above the supported minimum width.

## Possible Edge Cases
- Palette with a single color — every card gets the same color; no error.
- Term with very long text — text wraps or truncates within the fixed card bounds; card does not grow.
- High-contrast mode or forced-color OS setting — contrasting color logic may be overridden by the browser; acceptable for v1.
- Palette is empty — fall back to a default neutral color so the session is not broken.

## Acceptance Criteria
- Starting a session displays cards in a different order than the input list (randomized).
- Each card displays with a background color drawn from `src/data/card-colors.js`.
- The text color on each card visually contrasts with the card background (readable at a glance).
- Navigating forward and backward shows the same background color per card (colors are not re-randomized on navigation).
- The card is fully visible on screen without scrolling on a standard desktop viewport.
- All cards are the same size regardless of the length of the term displayed.

## Open Questions
- Should the shuffle be re-triggered if the user clicks "Back" and restarts the session, or should it only shuffle once per new session start?
- Should the contrast check follow WCAG AA ratio (4.5:1) or a simpler luminance threshold?
- How many colors should the initial palette in `card-colors.js` contain, and in what format (hex, hsl, named)?

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Shuffle produces a permutation of the original array (same elements, possibly different order)
- Shuffle does not mutate the original input array
- Color assignment produces one color per card from the palette
- Contrast color selection returns a light color for dark backgrounds and a dark color for light backgrounds
- Empty palette falls back to a default color without throwing
