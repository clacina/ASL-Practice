# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start dev server (Vite HMR)
yarn build      # Production build to dist/
yarn preview    # Preview production build
yarn lint       # Run ESLint
```

No test runner is configured yet. When adding tests, check `_specs/template.md` for the expected pattern — specs call for a `./tests` folder.

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

## Stack

- React 19, no router or state management library
- Vite 8 with `@vitejs/plugin-react` (Babel/Oxc transform, not SWC)
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
