# Plan: Mobile-Responsive Layouts

## Context

`FlashcardSession` currently has two rendering paths gated by a single boolean (`isMobileHorizontal`) that fires when `window.innerWidth < 1424 && landscape`. This is a rough heuristic that doesn't distinguish phones from tablets and has no portrait/landscape per device class. The spec calls for four explicit layout shells — one per form factor + orientation — with the video player as the dominant visual element in each, CSS custom properties for easy tweaking per layout, and swipe-gesture navigation on mobile.

---

## New Files

| Path | Purpose |
|---|---|
| `src/constants/breakpoints.js` | Named breakpoint constants (no magic numbers anywhere else) |
| `src/hooks/useLayoutMode.js` | Returns current layout mode string; owns all detection logic |
| `src/hooks/useSwipe.js` | Returns `{ onTouchStart, onTouchEnd }` spread onto a container for swipe nav |
| `src/components/layouts/PhonePortraitLayout.jsx` | Layout shell — phone portrait |
| `src/components/layouts/PhoneLandscapeLayout.jsx` | Layout shell — phone landscape |
| `src/components/layouts/TabletPortraitLayout.jsx` | Layout shell — tablet portrait |
| `src/components/layouts/TabletLandscapeLayout.jsx` | Layout shell — tablet landscape |
| `tests/useLayoutMode.test.js` | Hook unit tests |

## Modified Files

| Path | Change |
|---|---|
| `src/components/FlashcardSession.jsx` | Replace `isMobileHorizontal` state+effect with `useLayoutMode()`; add `useSwipe()`; switch on mode to render appropriate shell |
| `src/App.css` | Add four new CSS sections with custom properties per layout |

**Not changed:** `FlashcardNav.jsx`, `FlashcardPlayer.jsx`, `App.jsx`, `main.jsx`, `vite.config.js`

---

## Step 1 — Breakpoint Constants

`src/constants/breakpoints.js`:
```js
export const PHONE_MAX_WIDTH = 767;   // ≤767px = phone
export const TABLET_MAX_WIDTH = 1023; // 768–1023px = tablet; ≥1024px = desktop
```

---

## Step 2 — `useLayoutMode` Hook

Returns one of: `'phone-portrait' | 'phone-landscape' | 'tablet-portrait' | 'tablet-landscape' | 'desktop'`

**Detection logic (`getLayoutMode()`):**
1. Read `window.innerWidth` / `window.innerHeight`
2. Determine `isLandscape`:
   - If `screen.orientation` is available → use `screen.orientation.type` (`'landscape-primary'` or `'landscape-secondary'`)
   - Fallback → `innerWidth > innerHeight`
3. Classify:
   - `width ≤ 767` → `phone-portrait` or `phone-landscape`
   - `768 ≤ width ≤ 1023` → `tablet-portrait` or `tablet-landscape`
   - `width ≥ 1024` → `desktop`

**Event listeners** (in `useEffect`): `window resize`, `window orientationchange`, and `screen.orientation change` (if available). All three are cleaned up on unmount. React bails out on same-value `setState` so there is no extra render cost from deduplication.

---

## Step 3 — `useSwipe` Hook

```js
useSwipe({ onSwipeLeft, onSwipeRight, minDistance = 50 })
// returns { onTouchStart, onTouchEnd }
```

Stores `touchStartX` in a `useRef` (no re-render between start/end). On `touchEnd`, if `|deltaX| ≥ minDistance`: swipe left → `onSwipeLeft()` (go next), swipe right → `onSwipeRight()` (go prev). React 19 registers JSX touch handlers as passive by default, so no scroll-jank.

---

## Step 4 — Layout Shell Components

All four shells accept the same named slot props — they are purely presentational:

```js
{
  video,         // <FlashcardPlayer> element (fully constructed in FlashcardSession)
  nav,           // <FlashcardNav> element
  termList,      // <select> / drawer JSX (with ref attached in FlashcardSession)
  positionLabel, // <p className="flashcard-position">N / M</p>
  termText,      // string — current term word
  termBg,        // hex background color
  termFg,        // hex contrast text color
  onBack,        // callback
  swipeHandlers, // { onTouchStart, onTouchEnd } — spread on outermost div
  title,
  description,
}
```

### PhonePortraitLayout
```
.layout-phone-portrait (swipeHandlers)
  ← Back button
  .layout-phone-portrait__video-wrap          ← 55%+ vh, position:relative
    .layout-phone-portrait__term-overlay      ← termText overlays video (position:absolute)
    {video}
  {positionLabel}
  {nav}
  {termList}   ← drawer overlay
```
Term overlays video on phones (per spec).

### PhoneLandscapeLayout
```
.layout-phone-landscape (swipeHandlers, flex row)
  .layout-phone-landscape__video-wrap    ← 65%+ vw
    {video}
  .layout-phone-landscape__sidebar       ← narrow column
    ← Back button
    .layout-phone-landscape__term        ← term card (outside video)
    {positionLabel}
    {nav}                                ← stacked vertically
```

### TabletPortraitLayout
```
.layout-tablet-portrait (swipeHandlers, flex column)
  ← Back button
  .layout-tablet-portrait__header   ← title + description (visible on tablets)
  .layout-tablet-portrait__video-wrap    ← 50%+ vh
    {video}
  .layout-tablet-portrait__term     ← term card below video (outside)
  {positionLabel}
  {nav}
  {termList}   ← inline panel (no drawer needed at tablet width)
```

### TabletLandscapeLayout
```
.layout-tablet-landscape (swipeHandlers, flex row)
  .layout-tablet-landscape__video-col    ← 55%+ vw
    {video}
    .layout-tablet-landscape__term       ← below video, outside
    {positionLabel}
  .layout-tablet-landscape__sidebar
    {nav}
    {termList}   ← inline
```

---

## Step 5 — `FlashcardSession` Changes

**Remove:** `isMobileHorizontal` state and its `useEffect`.

**Add at top of component body:**
```js
const layoutMode = useLayoutMode();
const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });
```

**Build shared slot objects once** (derived from existing state — no new state):
```js
const sharedSlots = {
  video: <FlashcardPlayer url={playbackUrl} playing={playing} loop={repeat} ... />,
  nav: <FlashcardNav onPrev={goPrev} onNext={goNext} ... />,
  termList: <TermDrawerOrSelect />,   // selectRef stays attached here
  positionLabel: <p className="flashcard-position">{currentIndex+1} / {localTerms.length}</p>,
  termText: localTerms[currentIndex].term,
  termBg: bg, termFg: fg,
  onBack, swipeHandlers, title, description,
};
```

**Render switch:**
```js
switch (layoutMode) {
  case 'phone-portrait':  return <PhonePortraitLayout {...sharedSlots} />;
  case 'phone-landscape': return <PhoneLandscapeLayout {...sharedSlots} />;
  case 'tablet-portrait': return <TabletPortraitLayout {...sharedSlots} />;
  case 'tablet-landscape':return <TabletLandscapeLayout {...sharedSlots} />;
  default:                return <existing desktop JSX>;  // unchanged
}
```

All session state (`currentIndex`, `playing`, `repeat`, `playbackRate`, etc.) lives in `FlashcardSession` and is **not affected by orientation changes** — only the shell re-renders.

**`onOpenTerms` for `FlashcardNav`:** pass `() => setTermDrawerOpen(true)` for phone layouts (drawer); pass `undefined` for tablet layouts (term list is inline — hides "📋 Terms" button automatically via existing FlashcardNav logic).

**`selectRef`:** The `<select>` is constructed inside `FlashcardSession` (as `termList`), so the ref attachment and the ArrowKey guard `useEffect` are unaffected.

---

## Step 6 — CSS in `App.css`

Four new clearly-delimited sections appended near the existing session styles. Each defines custom properties at the top of its root selector. BEM naming.

**Prefix key:** `lpp` = phone-portrait, `lpl` = phone-landscape, `ltp` = tablet-portrait, `ltl` = tablet-landscape.

Example section structure:
```css
/* ═══════════════════════════════════════════════════════════
   Layout: Phone Portrait
   ══════════════════════════════════════════════════════════ */
.layout-phone-portrait {
  --lpp-video-height: 55vh;                     /* video player height */
  --lpp-term-font-size: clamp(18px, 5vw, 32px); /* term label size */
  --lpp-term-overlay-padding: 8px 12px;          /* padding on video overlay badge */
  --lpp-nav-btn-min-size: 44px;                  /* minimum tap-target for nav buttons */
  --lpp-nav-font-size: 14px;                     /* font size inside nav buttons */
  --lpp-gap: 8px;                                /* gap between layout regions */
  --lpp-position-font-size: 13px;                /* position counter font size */
}
```

Existing `.fcs-landscape` CSS block is **kept but commented as deprecated** — it becomes dead code once the switch is in place, but is left as a safety net for the first PR.

---

## Step 7 — Tests (`tests/useLayoutMode.test.js`)

Uses `renderHook` + `act` from `@testing-library/react`. Setup mocks `window.innerWidth`/`innerHeight` via `Object.defineProperty`; `screen.orientation` mocked or set to `undefined` to test the fallback path.

**Required test cases:**
1. `(375×667)` → `'phone-portrait'`
2. `(667×375)` → `'phone-landscape'`
3. `(768×1024)` → `'tablet-portrait'`
4. `(1024×768)` → `'tablet-landscape'`
5. `(1440×900)` → `'desktop'`
6. Boundary: `(767×430)` → `'phone-landscape'`
7. Boundary: `(768×1024)` → `'tablet-portrait'`
8. Orientation change event fires → mode re-evaluates
9. `screen.orientation.type = 'landscape-primary'` path used when API is available
10. `screen.orientation = undefined` → fallback `innerWidth > innerHeight` used

---

## Implementation Order

1. `src/constants/breakpoints.js`
2. `src/hooks/useLayoutMode.js` + `tests/useLayoutMode.test.js` → `yarn test`
3. `src/hooks/useSwipe.js`
4. Four layout shell `.jsx` files (structure only)
5. Update `FlashcardSession.jsx` → full test suite still passes (jsdom `innerWidth=1024` → `'desktop'` → existing desktop path unchanged)
6. CSS sections in `App.css` → verify in browser devtools device emulation
7. Comment out `.fcs-landscape` CSS as deprecated

---

## Verification

- `yarn lint` — no new errors
- `yarn test --run` — all 82 existing tests pass; new `useLayoutMode` tests pass
- Browser devtools: test all 4 mobile configurations + desktop at 1440px
- Physical device rotation mid-session: card index, playing state, playback rate must survive unchanged
