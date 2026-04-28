# Spec for term-input-footer

branch: claude/feature/term-input-footer

## Summary
Add a footer to the TermInput page that includes an ASL-related icon and a disclaimer section informing users about the scope and limitations of the site.

## Functional Requirements
- Display a footer at the bottom of the TermInput page
- Include an icon visually representing American Sign Language (e.g., a signing hand)
- Include a disclaimer section with the following notes:
  - This site is not for professional use and is only for helping study ASL
  - Uses public domain videos that are not owned by the creator
  - Does not promise that the signs provided are the most recent versions of ASL
  - Attempts to restrict signs to ASL vs other sign languages (BSL, etc.)

## Possible Edge Cases
- Footer should not overlap or obscure page content on small/mobile screens
- Icon should be accessible (alt text or aria-label)
- Disclaimer text should remain readable at all screen sizes

## Acceptance Criteria
- The TermInput page renders a footer at the bottom of the page
- The footer contains an ASL-representative icon
- The footer contains all four disclaimer bullet points
- Footer is visible without scrolling past main content on standard viewport sizes
- Footer is responsive and does not break layout on mobile

## Open Questions
- Should the footer appear on all pages or only the TermInput page?
  - all pages.
- Is there a preferred icon (emoji, SVG, image asset) for the ASL representation?
  - no
- Should the disclaimer be collapsible/expandable or always visible?
  - collapsible/expandable

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Footer renders on the TermInput page
- All four disclaimer items are present in the rendered output
- ASL icon element is present and has accessible text
- Footer does not render outside the TermInput page (if scoped to that page only)
