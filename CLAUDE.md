# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start dev server (Vite HMR)
yarn build      # Production build to dist/
yarn preview    # Preview production build
yarn lint       # Run ESLint
```

Tests use **Vitest** + `@testing-library/react`. Run them with:

```bash
yarn test          # watch mode
yarn test --run    # single run (CI)
yarn test:ui       # Vitest browser UI
```

Test files live in `./tests/`. Use `renderHook` + `act` for hook tests.

## Environment

Create `.env.local` (gitignored) before running locally:
```
VITE_PASSPHRASE=<passphrase>
```
The app will not advance past the gate page without this variable set.

## Architecture

React 19 + Vite app (JavaScript, not TypeScript). Entry point: `src/main.jsx` → `src/App.jsx`.

### View flow

`App.jsx` manages a single `view` state with three values:

| View | Component | Notes |
|------|-----------|-------|
| `'gate'` | `PassphrasePage` | Initial view; skipped if `sessionStorage.asl-unlocked` is set |
| `'input'` | `LandingPage` → `TermInput` | Category selection |
| `'session'` | `FlashcardSession` | Flashcard practice |

`PassphrasePage` and `FlashcardSession` each render `Footer` themselves. The outer `App` wrapper renders `Footer` and `Toaster` only for the `'input'`/`'session'` views.

### Term data schema

All term data lives in `src/data/*.json`. Each entry is:
```json
{ "term": "Hello", "code": "<video-url-or-empty>", "fix": true }
```
- `code` — empty string means no video URL is confirmed yet
- `fix: true` — marks terms whose video URL is missing or unverified; displayed with a `[fix]` prefix and orange color in the term drawer select
- When `code` is empty at runtime, `FlashcardSession` falls back to a URL constructed from `https://media.signbsl.com/videos/asl/startasl/mp4/<term>.mp4`

### Category registration

Categories are defined in `src/components/TermInput.jsx` as a `CATEGORIES` array. Each entry maps an icon, title, description, and a reference to a JSON data file. To add a new category, add a JSON file to `src/data/` and add an entry to this array.

### Session components

`FlashcardSession` is the main session controller. It owns all playback state (`currentIndex`, `playing`, `repeat`, `playbackRate`, etc.) and renders one of five paths based on `useLayoutMode()`:

| Layout mode | Shell component |
|---|---|
| `phone-portrait` | `PhonePortraitLayout` |
| `phone-landscape` | `PhoneLandscapeLayout` |
| `tablet-portrait` | `TabletPortraitLayout` |
| `tablet-landscape` | `TabletLandscapeLayout` |
| `desktop` | Inline JSX in `FlashcardSession` |

Layout shells are purely presentational — they receive named slot props (`video`, `nav`, `termList`, `positionLabel`, `termText`, `termBg`, `termFg`, `onBack`, `swipeHandlers`, `title`, `description`) and have no state of their own.

The `termList` slot differs by context: on all mobile layouts (`isMobileLayout`) it is a bottom-sheet `.term-drawer` element (hidden until the "📋 Terms" nav button is tapped, CSS breakpoint `max-width: 1023px`); on desktop it is rendered inline as a sidebar.

**`FlashcardNav`** (`src/components/FlashcardNav.jsx`) — nav button bar (prev, next, shuffle, terms drawer toggle, autoplay, player-controls toggle, play/pause, speed, repeat). Pass `onOpenTerms={undefined}` to hide the terms button (desktop only; all mobile layouts pass a callback that opens the term drawer).

**`FlashcardPlayer`** (`src/components/FlashcardPlayer.jsx`) — thin wrapper around `react-player` with standardised props (`url`, `playing`, `loop`, `autoPlay`, `controls`, `playbackRate`, `onPlay`, `onPause`, `onEnded`, `onError`).

### Hooks

- `src/hooks/useLayoutMode.js` — returns the current layout mode string. Uses `screen.orientation.type` when available; falls back to `innerWidth > innerHeight`. Re-evaluates on `resize`, `orientationchange`, and `screen.orientation change`.
- `src/hooks/useSwipe.js` — returns `{ onTouchStart, onTouchEnd }` for spread onto a container. 50 px threshold; swipe-left → next, swipe-right → prev.

### Constants

- `src/constants/breakpoints.js` — `PHONE_MAX_WIDTH = 767`, `TABLET_MAX_WIDTH = 1023`. Use these instead of magic numbers.

### Utilities

- `src/utils/contrastColor.js` — given a hex background color, returns `#08060d` or `#ffffff` for legible text (used by `FlashcardSession` for card text color)
- `src/utils/shuffle.js` — Fisher-Yates shuffle
- `src/utils/parseTerms.js` — parses term arrays
- `src/data/card-colors.js` — palette of background colors for flashcards
- `src/data/checkData.js` — standalone audit script; reports duplicate terms and terms with `fix: true` across all JSON files

### CSS conventions

- **BEM naming**: `.block__element--modifier` (e.g. `.landing-hero__title`, `.carousel-dot--active`)
- **CSS variables** defined in `src/index.css`: `--text`, `--text-h`, `--bg`, `--code-bg`, `--border`, `--accent`, `--accent-bg`, `--accent-border`, `--color-needs-fix`, `--shadow`, `--sans`, `--heading`, `--mono`
- Dark mode overrides are in `src/index.css` under `@media (prefers-color-scheme: dark)`
- All component styles live in `src/App.css` (no per-component CSS files)

**Per-layout CSS custom properties** — each layout shell block opens with a custom-property block for easy tweaking without touching shared styles. Prefixes:

| Prefix | Layout |
|---|---|
| `--lpp-` | phone-portrait |
| `--lpl-` | phone-landscape |
| `--ltp-` | tablet-portrait |
| `--ltl-` | tablet-landscape |

The old `.fcs-landscape` block in `App.css` is deprecated (commented) — it has been superseded by the layout shells and should be removed in a follow-up.

## Stack

- React 19, no router or state management library
- Vite 8 with `@vitejs/plugin-react` (Babel/Oxc transform, not SWC); `base: "/asl"` set in `vite.config.js` for subdirectory deployment
- Plain CSS (`src/App.css`, `src/index.css`) — no CSS framework
- `react-hot-toast` — toast notifications (Toaster mounted in App)
- `react-player` — video playback in FlashcardSession (replaces iframe)
- `axios` — HTTP client (used in TermInput to fetch random words for Finger Spelling)
- `tippy.js` — tooltips
- Yarn (use `yarn`, not `npm`)

## Key conventions

- `_specs/` — feature spec files (use `_specs/template.md` as the template)
- `_plans/` — implementation plans
- Feature branches: `claude/feature/<feature-name>`
- ESLint rule: unused vars are an error unless the name starts with a capital letter or underscore (`varsIgnorePattern: '^[A-Z_]'`)
