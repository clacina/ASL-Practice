# Spec for flashcard-session

branch: claude/feature/flashcard-session

## Summary

A full-screen flashcard practice session that displays ASL terms one at a time with color-coded cards, embedded video demonstrations, keyboard and button navigation, shuffle, and an alphabetical term list for direct access.

## Functional Requirements

- Display the current term in a color-coded card that fills the available width
- Show an embedded video (via iframe) for the current term below the card
- Derive the video URL from the term's `code` field; fall back to a constructed StartASL URL when `code` is empty; handle the special `type: "spell"` case by showing a fingerspelling GIF
- Show a position counter (e.g. "3 / 42") below the video
- Provide Prev and Next buttons to step through terms sequentially, wrapping around at the ends
- Support left/right arrow-key navigation equivalent to Prev/Next
- Provide a Shuffle button that randomizes the term order and resets to position 1; card colors follow the shuffle
- Provide a List button that toggles an alphabetical listbox to the right of the main content area
- The listbox must be sorted alphabetically and computed only once per term list (recalculated only after a shuffle)
- Selecting an item in the listbox navigates directly to that term; the selected item stays highlighted and tracks the current card as the user navigates with Prev/Next/arrows
- Provide a Back button that returns to the category selection screen

## Possible Edge Cases

- Term with an empty `code` field and no matching StartASL video URL (video will 404 silently)
- Term with `type: "spell"` and no fingerspelling GIF present in the public folder
- Single-term list (Prev/Next wrapping lands on the same card)
- Very long term labels that overflow the card area
- Shuffling while the listbox is open — listbox should remain open and reflect the new order

## Acceptance Criteria

- Navigating with Prev, Next, and arrow keys updates the card term, video, position counter, and listbox selection
- Shuffle randomizes the card order, resets to position 1, and updates the listbox
- The listbox appears to the right of the card/video column when toggled and does not reflow the main content
- The listbox selection always matches the current card, including after keyboard and button navigation
- The sorted order of the listbox does not change unless a shuffle occurs
- The Back button exits the session without side effects

## Open Questions

- Should the List panel be persistent (always visible) or remain a toggle? 
  - Always visible.
- Should terms with no resolvable video URL show a placeholder rather than a broken iframe?
  - Please show a placeholder when no resolvable URL available.
- Should arrow-key navigation be disabled when focus is inside the listbox to avoid conflicts?
  - yes

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Renders the first term on mount
- Next button advances the index; wraps from last to first
- Prev button decrements the index; wraps from first to last
- ArrowRight and ArrowLeft key events trigger the same navigation as buttons
- Shuffle produces a different order and resets currentIndex to 0
- List button toggles the listbox visibility
- Selecting an option in the listbox sets currentIndex to the correct value
- Listbox value stays in sync with currentIndex after button navigation
- sortedTerms is sorted alphabetically and stable between renders
