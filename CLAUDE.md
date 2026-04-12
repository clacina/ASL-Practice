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

## Architecture

This is a React 19 + Vite app (JavaScript, not TypeScript). Entry point is `src/main.jsx` → `src/App.jsx`. The app is in early/empty state — `App.jsx` currently renders nothing.

**Key conventions:**
- `_specs/` — feature spec files (use `_specs/template.md` as the template for new specs)
- `_plans/` — implementation plans (currently empty)
- Feature branches follow the naming pattern `claude/feature/<feature-name>` (from the spec template)
- ESLint rule: unused vars are an error unless the name starts with a capital letter or underscore (`varsIgnorePattern: '^[A-Z_]'`)

## Stack

- React 19, no router or state management library installed yet
- Vite 8 with `@vitejs/plugin-react` (Babel/Oxc transform, not SWC)
- Plain CSS (`src/App.css`, `src/index.css`) — no CSS framework installed
- Yarn (use `yarn`, not `npm`)
