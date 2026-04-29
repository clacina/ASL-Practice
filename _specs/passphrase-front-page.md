# Spec for passphrase-front-page

branch: claude/feature/passphrase-front-page

## Summary
Add a passphrase-gated front page that is the first thing a user sees when they open the application. The page displays an application banner and a passphrase entry field. Only after the correct passphrase is entered does the user proceed to the existing landing page. The `Footer` component is included on this page.

## Functional Requirements
- The app opens to the new front page instead of the landing page.
- The front page displays an application banner (app name/logo/title).
- The front page displays a passphrase input field (type password) and a submit control.
- When the user submits the correct passphrase (`DororthASL`), the app transitions to the existing landing page.
- When the user submits an incorrect passphrase, an error message is shown and the input is cleared; the user remains on the front page.
- The `Footer` component is rendered at the bottom of the front page.
- The passphrase is not displayed in plain text at any point.
- The passphrase should not be stored in `localStorage`, `sessionStorage`, or any persistent client-side store — it only needs to gate the current session.

## Possible Edge Cases
- Submitting an empty passphrase should show an error (not silently fail).
- The passphrase comparison is case-sensitive (`DororthASL` is the only valid value).
- Once the user has passed the gate, navigating back (browser back button) should not re-show the front page within the same session.
- The passphrase should not appear in the page source, git history, or bundle in a way that is trivially discoverable — consider keeping it out of the component render logic if possible (e.g. an env variable or a hashed comparison).

## Acceptance Criteria
- [ ] Opening the app shows the front page with a banner and passphrase field.
- [ ] Entering `DororthASL` and submitting advances the user to the landing page.
- [ ] Entering any other value shows an inline error and clears the input.
- [ ] Submitting an empty field shows an error.
- [ ] The `Footer` component is visible on the front page.
- [ ] The front page is not shown again after a successful passphrase entry within the same session.
- [ ] The passphrase input masks the entered text.

## Open Questions
- Should the banner be a new component or a simple styled heading on the front page?
  - new component
- Should session-level gating use React state only (resets on page reload) or `sessionStorage` (survives reload within the tab)?
  - use sessionStorage

## Testing Guidelines
Create a test file in the `./tests` folder for this feature and create meaningful tests for the following cases:
- Renders the front page (banner + passphrase input + footer) on initial load.
- Entering the correct passphrase and submitting transitions to the landing page view.
- Entering an incorrect passphrase shows an error message and does not advance.
- Submitting with an empty passphrase shows a validation error.
- The passphrase input field has `type="password"`.
