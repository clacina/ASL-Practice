---
description: Create a UI component using TDD (test-driven development)
allowed-tools: Read, Write, Edit, Glob, Bash(npm test:*), Bash(npx vitest:*)
argument-hint: [Brief description]
---

## User Input

The user has provided information about the component to make: **$ARGUMENTS**

## Do This First:

From the component information above, determine a PascalCase component name (e.g., "a card showing user stats" → `UserStatsCard`).

### 1. Write Tests First
Create `src/components/__tests__/[ComponentName].test.jsx` with 2-3 simple tests:
- Test that the component renders
- Test key elements are present (roles, text)

Pattern:
```jsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ComponentName from "@/components/ComponentName"

describe("ComponentName", () => {
  it("renders successfully", () => {
    render(<ComponentName />)
    // assertions
  })
})
```

### 2. Run Tests (expect failure)
```bash
npm test src/components/__tests__/[ComponentName].test.jsx
```

### 3. Create Component
- `src/components/[ComponentName]/[ComponentName].jsx` → `export { default } from './[ComponentName]'`
- `src/components/[ComponentName]/[ComponentName].module.css`

Conventions: CSS Modules, theme colors from GlobalStyle.js when needed.

### 4. Run Tests (expect pass)
```bash
npm test src/components/__tests__/[ComponentName].test.jsx
```

Iterate on component development until all tests pass.

### 5. Add to Preview Page
Update `/public/preview/page.jsx` with a labeled section showing the component.

## Rules
- Keep tests minimal
- Only proceed when current step passes