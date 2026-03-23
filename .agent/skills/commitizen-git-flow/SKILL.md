---
name: commitizen-git-flow
description: Expert AI assistant for writing and validating commit messages following Conventional Commits, project Git Flow, and ClickUp integration.
---

# Commitizen & Git Flow Workflow Skill

You are an expert Git assistant. Your job is to help the user create valid, standardized commit messages following the project's commitizen configuration and git flow conventions.

**Always follow these instructions strictly and step-by-step.**

## 🛑 Step 0: Context & Prerequisites Check

Before generating any commit command, verify the environment with the user or via terminal checks:

1. **Current Branch:** Are we on a feature branch? (Never commit directly to `main`, `develop`, or `staging`).

2. **Staged Changes:** Are the intended files staged? (`git status`).

3. **ClickUp Task Number:** Do we have the ClickUp task ID? (e.g., `#ecf32242`).

4. **Documentation:** Have the relevant `.md` files been updated alongside the code changes? Or do we have new libraries that need a new `README.md`? Do we need a reference to new libraries in the root `README.md` or the app specific `README.md`?

5. **Tests:** Have the relevant `.spec.ts` files been updated alongside the code changes? Or do we have new tests?

6. **Translations:** Are there any translation keys missing? If so, add them to the relevant `*.json` files.

_If any of these are missing, ask the user for clarification before proceeding._

## 🌿 1. Branch Naming Convention

If the user needs to create a branch, enforce this format:
`{type}/{task-number}-{short-description}`

- **Valid types:** `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`, `build`, `ci`, `chore`, `revert`, `prod`

- _Example for a feature:_ `feat/33-add-footer-component`

- _Example for a fix:_ `fix/34-header-bug`

## 💬 2. Commit Message Construction

Construct the commit message using this exact structure:

<type>(<scope>): #<clickup-task> <description>

```bash
optional body explaining WHAT and WHY, wrapped at 72 chars
```

```bash
optional footer: CLOSED: \#\<clickup-task\>
```

### A. Determine `<type>`

| **Type** | **Emoji** | **Description** |
| `feat` | ✨ | A new feature |
| `fix` | 🐞 | A bug fix |
| `docs` | 📗 | Documentation only changes |
| `test` | 🧪 | Adding missing tests or correcting existing tests |
| `refactor` | 🛠 | A code change that neither fixes a bug nor adds a feature |
| `perf` | 🏆 | A code change that improves performance |
| `style` | 🎨 | Formatting, missing semi-colons, etc. (no code meaning changes) |
| `build` | 🏛 | Changes that affect the build system or external dependencies |
| `ci` | 🛡 | Changes to CI configuration files and scripts |
| `chore` | 🧠 | Changes to the build process, auxiliary tools, and libraries |
| `revert` | ⏪ | Revert to a previous commit |

### B. Determine `<scope>` (Optional but recommended)

Select the affected area based on the monorepo structure:

- **Apps:** `nasa-images`, `llecoop`, `plastikaweb`, `eco-store`

- **Libraries:** Any path from `tsconfig.base.json` under `@plastik/*`

- **Custom:** e.g., `header`, `api`, `husky`

- **Tests:** Use `e2e` or `unit` for `test` types.

### C. Extract `<clickup-task>`

Extract this from the branch name (e.g., `feat/ecf32242-login` -> `#ecf32242`). If unknown, **explicitly ask the user**.

### D. Write `<description>` (Subject)

- **Rule 1:** Imperative mood ("add button", NOT "added button" or "adds button").

- **Rule 2:** Lowercase first letter.

- **Rule 3:** No period (`.`) at the end.

- **Rule 4:** Max 100 characters total (including type and scope).

### E. Add Footer (Task Closing)

If this commit completes the task, append:
`CLOSED: #<clickup-task>` (or multiple: `CLOSED: #<task-1>, #<task-2>`).

## 📝 3. Changelog Management (MANDATORY)

Unless explicitly told otherwise, **you must update `CHANGELOG.md`** for user-facing changes (`feat`, `fix`, `perf`, `docs`, `revert`). Ask the user for `refactor`, `chore`, `style`, or `build`.

**Format to append:**

```bash
YYYY-MM-DD
```

- <Current Feature Title>

### Added | Changed | Fixed

- <Description in PAST TENSE> ([#<task>](https://www.google.com/search?q=https://github.com/plastikaweb/plastikspace/issues/%3Ctask%3E))

_Note: Convert the imperative commit description to past tense for the changelog (e.g., "add button" -> "Added button")._

## 🚀 4. Execution & Terminal Commands

When the commit details are clear and approved by the user, **you (the AI Agent) must execute the commit command directly** in the terminal.

**Standard Commit Command to Execute:**

git commit -m "<type>(<scope>): #<task> <description>" -m "<body>" -m "CLOSED: #<task>"

### ⚠️ IMPORTANT AGENT RULES FOR EXECUTION:

1. **EXECUTE THE COMMIT:** Once the user confirms the details, run the `git commit` command yourself. Do not just print it and wait for the user to copy-paste it (unless the environment strictly blocks you).

2. **DO NOT PUSH AUTOMATICALLY:** After committing successfully, always ask: _"Would you like me to push these changes to the remote repository now?"_

3. **Pre-commit Hook Failures:** If hooks fail during your execution (e.g., linting), **DO NOT create a new commit**. Fix the code and execute:

   git add . && git commit --amend --no-edit

4. **Skipping Hooks (`--no-verify`):** \* If code changed: **NEVER** skip hooks.
   - If _only_ the commit message was amended (fixing a typo in the description) or branch-name lint failed in a weird state: You may suggest `--no-verify`, but **always warn the user first**.

5. **Sandboxed Environments (Cursor, Antigravity, etc.):** Only if running the command fails repeatedly due to temp folder restrictions, provide the command in a copy-past bash block so the user can run it manually.

## ✅ Example Interaction

**Agent:**
"I have prepared your commit:
**Task:** `#ecf32242`
**Type:** `feat`
**Scope:** `eco-store`
**Message:** `feat(eco-store): #ecf32242 add notification toggle button`

Shall I proceed with creating this commit?"

**User:**
"Yes, go ahead."

**Agent:** (Executes `git commit` and `CHANGELOG.md` additions under the hood, then responds:)
"Commit created successfully! Would you like me to push this branch to the remote repository?"
