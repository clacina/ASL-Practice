# Spec for mobile-responsive-layout

branch: claude/feature/mobile-responsive-layout

## Summary
Make the entire app responsive so it displays well on phones and tablets. The video playback is the primary feature and must always be visible. Secondary controls (navigation, term list, shuffle, etc.) should be shrunk or hidden as needed to prioritize the video on smaller screens.

## Functional Requirements
- The flashcard session screen must display the video at a usable size on all screen sizes down to 375px wide (iPhone SE)
- The term selector list should be hidden on mobile and accessible via a collapsible/toggle control
- Navigation buttons (Prev, Next, Shuffle) should be visible but compact on mobile
- The position indicator (e.g. "3 / 45") should remain visible on mobile
- The Back button should remain accessible on all screen sizes
- The session title and description should be visible but may be reduced in font size on mobile
- The category selector (TermInput) layout should stack to a single column on mobile, with the resources panel below the categories
- The ASL resources panel can be collapsed or hidden on mobile to save space
- On tablets (768px–1024px), a two-column layout may be preserved where it fits; fall back gracefully where it does not
- Touch targets (buttons) must be at least 44×44px on mobile per accessibility guidelines

## Possible Edge Cases
- Very long term names may overflow the flashcard card on narrow screens
- The video iframe aspect ratio must be preserved and never clipped on any viewport
- The term selector list, when toggled open on mobile, should not push the video off screen
- Category button grid may have an odd number of items — the last cell must not stretch awkwardly

## Acceptance Criteria
- Loading the app on a 375px-wide viewport shows the flashcard video without horizontal scroll
- The video occupies the majority of the vertical space on mobile in the session view
- The term list is hidden by default on mobile and can be revealed via a clearly labeled toggle
- All interactive controls remain reachable and meet 44px minimum touch target size
- No horizontal overflow at 375px, 768px, or 1024px viewport widths
- The category selector page is usable on mobile with no overlapping or clipped elements
- Tablet layout (768px) makes sensible use of the available horizontal space

## Open Questions
- Should the term list toggle be a drawer/overlay or an inline expand on mobile?
  - drawer/overlay
- Should the session title/description be hidden entirely on mobile to maximize video space, or just reduced?
  - hidden entirely
- Is there a preferred breakpoint for "tablet" behavior, or should we use 640px and 1024px as the two breakpoints?
  - use 640px and 1024px as the two breakpoints.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- TermInput renders in single-column layout when viewport width is below the mobile breakpoint
- FlashcardSession renders the video element at all viewport sizes
- Term selector toggle button is present in the DOM on mobile viewports
- No critical UI elements are hidden on mobile that should remain accessible (Back button, nav controls)
