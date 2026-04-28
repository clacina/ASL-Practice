---
description: Add any modified files and create a commit message by analyzing git diffs
allowed-tools: Bash(git status:*), Bash(git diff --staged), Bash(git commit:*), Bash(git add:*)
---

## Context:

- Current git status: !`git status`
- Current git diff: !`git diff --staged`
- ADD all modified and new files to git.  If you think there are files that should not be in version control, ask the user.  If you see files that you think should be bundled into separate commits, ask the user.
- Abort on any untracked files.
Analyze above staged git changes and create a commit message. Use present tense and explain "why" something has changed, not just "what" has changed.

## Commit types with emojis:
Only use the following emojis: 

- ✨ `feat:` - New feature
- 🐛 `fix:` - Bug fix
- 🔨 `refactor:` - Refactoring code
- 📝 `docs:` - Documentation
- 🎨 `style:` - Styling/formatting
- ✅ `test:` - Tests
- ⚡ `perf:` - Performance

## Format:
Use the following format for making the commit message:

```
<emoji> <type>: <concise_description>
<optional_body_explaining_why>
```

## Output:

1. Show summary of changes currently staged
2. Propose commit message with appropriate emoji
3. Ask for confirmation before committing

DO NOT auto-commit - wait for user approval, and only commit if the user says so.