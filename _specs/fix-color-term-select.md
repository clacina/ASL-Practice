# Spec for fix-color-term-select

branch: claude/feature/fix-color-term-select

## Summary
In the flashcard session, the term drawer contains a `<select>` list of all terms in the current category. Some terms have a `fix: true` attribute in their JSON data, meaning their video URL is missing or needs to be updated. This feature makes those terms visually distinct in the select list so users and developers can immediately see which terms are incomplete.

## Functional Requirements
- In `FlashcardSession.jsx`, each `<option>` in the term `<select>` that corresponds to a term with `fix: true` should render in a different (warning/muted) color compared to normal options.
- Terms without `fix: true` (or where `fix` is absent/false) should display in their default color.
- The color distinction must be visible in both light and dark contexts.
- No change to the select's behavior — navigation and selection work exactly as before.

## Possible Edge Cases
- Terms where `fix` is `undefined` or `false` should be treated identically to terms where `fix` is absent — i.e., normal color, no special styling.
- The `sortedTerms` memo already passes `fix` through; no data-layer changes should be needed.
- Native `<option>` color styling has limited cross-browser support — the implementation may need an inline `style` prop on the `<option>` element rather than a CSS class.

## Acceptance Criteria
- [ ] Options for terms with `fix: true` are visually distinct (e.g. a muted orange or red foreground color) in the term select list.
- [ ] Options for terms without `fix: true` display with default styling.
- [ ] The color change is visible on both Windows and macOS native select rendering.
- [ ] No regressions to select navigation, keyboard shortcuts, or term jumping behavior.

## Open Questions
- Should the color hint only be visible to developers (e.g. toggled by a dev flag), or always shown to end users?
  - always shown
- Is a color change alone sufficient, or should a symbol/prefix (e.g. `⚠️`) also be added to the option text for accessibility?
  - add an appropriate prefix

## Testing Guidelines
Create a test file in the `./tests` folder for this feature and create meaningful tests for the following cases:
- An option rendered from a term with `fix: true` has a non-default color style applied.
- An option rendered from a term with `fix: false` or no `fix` property has no special color style applied.
- The select still renders the correct number of options matching the terms array.
