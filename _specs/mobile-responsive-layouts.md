# Spec for mobile-responsive-layouts

branch: claude/feature/mobile-responsive-layouts
figma_component (if used): N/A

## Summary

Restructure the flashcard session UI so that the video player is the primary focal element across all major mobile form factors and orientations. Each combination of device class and orientation gets its own dedicated React component with its own scoped CSS, making per-view tweaks straightforward for a developer without touching shared styles.

## Functional Requirements

- Detect the current viewport configuration at runtime and render the appropriate layout component:
  - Phone Portrait
  - Phone Landscape
  - Tablet Portrait
  - Tablet Landscape
- The video player must be the visually dominant element in every layout — it should occupy the largest share of available screen space without being clipped or obscured.
- Each layout component must be a standalone React component (e.g. `PhonePortraitLayout`, `PhoneLandscapeLayout`, `TabletPortraitLayout`, `TabletLandscapeLayout`).
- Each layout component owns its own CSS block (or section in `App.css`) clearly delimited with a comment header so it is easy to find and edit independently.
- All CSS values that a developer is likely to want to tweak (video size ratios, padding, font sizes, button sizes) must use named CSS custom properties defined at the top of each layout's CSS block.
- Navigation controls (previous, next, shuffle, etc.) and the term label must remain accessible and usable in every layout, but they may be repositioned or resized to keep the video dominant.
- The disclaimer / info footer must remain reachable in all layouts (can be collapsed, scrollable, or in a modal — whichever fits the layout best).
- Layout selection logic must be encapsulated in a single place (a custom hook or a small utility) so the detection rules can be updated without touching the layout components themselves.
- Breakpoint definitions (device-class thresholds and orientation detection) must be defined as named constants, not magic numbers.
- Desktop/large-screen behavior must not regress — the existing layout should remain the default for non-mobile viewports.

## Possible Edge Cases

- Device orientation changes mid-session (user rotates phone) — the layout must switch without losing session state (current card index, score, etc.).
- Tablets that report phone-sized viewport widths in certain browser modes.
- Browsers that do not support the `Screen Orientation API` — fall back to `window.innerWidth / window.innerHeight` comparison.
- Very small phones (320 px wide) where landscape video + controls compete for limited vertical space.
- Foldable devices that change form factor dynamically.
- Keyboard/split-screen multitasking on tablets that narrows the effective viewport.
- Videos with non-standard aspect ratios that would overflow or leave large empty areas.

## Acceptance Criteria

- [ ] Rotating a phone between portrait and landscape re-renders the correct layout component without navigating away or resetting the flashcard session.
- [ ] On a phone in portrait mode the video player occupies at least 55% of the visible viewport height.
- [ ] On a phone in landscape mode the video player occupies at least 65% of the visible viewport width.
- [ ] On a tablet in portrait mode the video player occupies at least 50% of the visible viewport height.
- [ ] On a tablet in landscape mode the video player occupies at least 55% of the visible viewport width.
- [ ] Each layout's CSS custom properties (tweakable values) are documented with a short inline comment describing what they control.
- [ ] The layout detection logic is covered by unit tests covering phone portrait, phone landscape, tablet portrait, tablet landscape, and desktop classifications.
- [ ] No existing desktop functionality regresses (verified by manual walkthrough and ESLint passing).
- [ ] `yarn lint` passes with no new errors.

## Open Questions

- Should the term label (the sign word being practiced) overlay the video or sit outside it? This affects the layout significantly in landscape mode.
  - Overlay on phone, outside on tablets
- Should navigation buttons (prev/next) be gesture-swipe driven on mobile, or remain as tap targets?
  - gesture-swipe
- What are the exact pixel breakpoints that define "phone" vs "tablet"? (Common choice: < 768 px = phone, ≥ 768 px = tablet.)
  - use common 
- Should each layout component render the full session UI (video + controls + header) or be a layout shell that accepts children for the controls?
  - layout shell that accepts children for the controls
- Is there a design mockup / Figma reference that should guide the proportions, or should the developer define them?
  - allow the developer to define it.

## Testing Guidelines

Create a test file(s) in the `./tests` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Layout detection hook returns `phone-portrait` for a narrow, taller-than-wide viewport.
- Layout detection hook returns `phone-landscape` for a narrow, wider-than-tall viewport.
- Layout detection hook returns `tablet-portrait` for a wide, taller-than-wide viewport above the phone threshold.
- Layout detection hook returns `tablet-landscape` for a wide, wider-than-tall viewport above the phone threshold.
- Layout detection hook returns `desktop` for a viewport above the tablet threshold.
- Orientation change event triggers a re-evaluation of the layout classification.
