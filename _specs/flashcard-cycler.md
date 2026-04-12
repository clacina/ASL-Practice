# Spec for flashcard-cycler

branch: claude/feature/flashcard-cycler
figma_component (if used): N/A

## Summary
A flashcard cycling feature that lets users step through a series of ASL flashcards. The card list is driven by a comma-separated input so users can define their own study set without touching code.

## Functional Requirements
- The user can enter a comma-separated list of terms (e.g. `apple, banana, cherry`) into an input field.
- Submitting the list begins a flashcard session, displaying one term at a time.
- The user can advance to the next card (Next button or keyboard shortcut).
- The user can go back to the previous card (Previous button or keyboard shortcut).
- The current card position is shown (e.g. "3 / 10").
- When the last card is reached and the user goes forward, it wraps to the first card (and vice versa).
- The input list is trimmed of extra whitespace per term before the session starts.
- Empty entries in the comma-separated list are ignored.
- The user can return to the input screen to edit or replace the list.

## Possible Edge Cases
- List with only one term — Previous/Next buttons should still work (wrapping back to the same card).
- List with all blank entries after trimming — show a validation message instead of starting a session.
- Very long term strings — card display should not overflow or break the layout.
- Duplicate terms in the list — allowed, each counts as its own card.

## Acceptance Criteria
- Entering a comma-separated list and confirming shows the first card in the list.
- Next/Previous buttons cycle through all cards in order.
- Position indicator accurately reflects the current card (1-based, e.g. "1 / 5").
- Reaching the end and pressing Next wraps to card 1; at card 1, pressing Previous wraps to the last card.
- Submitting a list that contains only whitespace/empty entries shows an error and does not start the session.
- The user can navigate back to the input screen and change the list.

## Open Questions
- Should the card display only the term text, or will a visual/image (ASL sign illustration) be added later?
- Is keyboard navigation (arrow keys) required for the initial version?
- Should the term list persist between page reloads (localStorage)?

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Parsing the comma-separated input (trimming, deduplication of blanks)
- Navigation wraps correctly at both ends of the list
- Position indicator displays the correct current/total values
- Submitting an empty/blank-only list shows an error and blocks the session from starting
