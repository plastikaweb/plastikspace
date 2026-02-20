---
name: commitizen
description: Help to write and validate each step of the commit message following conventional commits.
---

# Commitizen Workflow Skill

Create commits following the project's commitizen configuration and git flow conventions.

## Prerequisites

Before creating a commit, verify:

1. **You are on a feature branch** (not `main`, `develop`, or `staging`)
2. **Changes are staged** - if not, stage them with `git add`
3. **Configuration files exist**:
   - `.cz-config.js` - commitizen types and scopes
   - `branchNameLint.json` - branch naming prefixes

## Branch Naming Convention

If on `develop` branch, create a feature branch first:

```
${type}/${issue-number}-${short-description}
```

**Valid prefixes** (from `branchNameLint.json`):
`feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`, `build`, `ci`, `chore`, `revert`, `prod`

**Example**: `feat/33-add-footer-component`

## Commit Message Structure

```
<type>(<scope>): #<issue> <description>

[optional body]

[optional footer: CLOSED: #<issue>]
```

### Step 1: Determine Type

Select from `.cz-config.js` types:

| Type       | Emoji | Description                                                          |
| ---------- | ----- | -------------------------------------------------------------------- |
| `feat`     | ✨    | A new feature                                                        |
| `fix`      | 🐞    | A bug fix                                                            |
| `docs`     | 📗    | Documentation only changes                                           |
| `test`     | 🧪    | Adding missing tests or correcting existing tests                    |
| `refactor` | 🛠    | A code change that neither fixes a bug nor adds a feature            |
| `perf`     | 🏆    | A code change that improves performance                              |
| `style`    | 🎨    | Changes that do not affect the meaning of the code (formatting, etc) |
| `build`    | 🏛    | Changes that affect the build system or external dependencies        |
| `ci`       | 🛡    | Changes to CI configuration files and scripts                        |
| `chore`    | 🧠    | Changes to the build process, auxiliary tools and libraries          |
| `revert`   | ⏪    | Revert to a commit                                                   |

### Step 2: Determine Scope (optional)

Choose from:

- **Apps**: `nasa-images`, `llecoop`, `plastikaweb`, `eco-store`
- **Libraries**: Any path from `tsconfig.base.json` under `@plastik/*`
- **Custom scope**: Any descriptive name (e.g., `header`, `api`, `husky`)
- **Scope overrides for `test` type**: `e2e`, `unit`

### Step 3: Get Issue Number

Extract from the **branch name**. Branch `feat/42-add-login` → issue `#42`

If unable to determine from branch, **ask the user** if there is one and what is it or not. We can make commits without issue number, but it is not recommended.

### Step 4: Write Description (subject)

**Rules**:

- Write in **imperative mood** (e.g., "add button" not "added button")
- **Do not capitalize** the first letter
- **No period** at the end
- **Maximum 100 characters** (from `subjectLimit`)
- Do not repeat information from type/scope

**Good**: `add notification toggle to user preferences`
**Bad**: `Added the notification toggle feature.`

### Step 5: Write Body (optional)

- Separate from subject with blank line
- Explain **what** and **why**, not how
- Use `|` to break into new lines
- Wrap at 72 characters per line

### Step 6: Add Footer (optional)

To know if the commit closes an issue, in the case we have an issue number, use the one from step 3. One issue can have multiple commits.

If the commit closes an issue:

```
CLOSED: #<issue-number>
```

Multiple issues: `CLOSED: #31, #34`

### Step 7: Add Changelog Entry (prompt)

After completing the commit message, **ask the user** if this change should be added to the changelog.

**Auto-suggest based on type**:

| Type       | Changelog? | Section |
| ---------- | ---------- | ------- |
| `feat`     | ✅ Yes     | Added   |
| `fix`      | ✅ Yes     | Fixed   |
| `perf`     | ✅ Yes     | Changed |
| `refactor` | ⚠️ Ask     | Changed |
| `docs`     | ❌ Skip    | -       |
| `test`     | ❌ Skip    | -       |
| `ci`       | ❌ Skip    | -       |
| `chore`    | ❌ Skip    | -       |
| `style`    | ❌ Skip    | -       |
| `build`    | ❌ Skip    | -       |

**If user confirms**, add entry to `CHANGELOG.md` under `## [Unreleased]` in the appropriate section:

```markdown
## [Unreleased] - <Current Feature Title>

### Added|Changed|Fixed

- <Description in past tense> ([#<issue>](https://github.com/plastikaweb/plastikspace/issues/<issue>))
```

**Entry format**:

- Convert imperative description to **past tense** (e.g., "add button" → "Added button")
- Include issue link if available
- Create the section if it doesn't exist

## Workflow Execution

### Check Current Branch

```bash
git branch --show-current
```

### If on develop/main, Create Feature Branch

```bash
# Ask user for issue number if not provided
git checkout -b ${type}/${issue-number}-${short-description}
```

### Stage Changes (if needed)

```bash
# Check status
git status

# Stage all changes
git add .
# Or stage specific files
git add <files>
```

### Create Commit

Construct the commit message following the structure above:

```bash
git commit -m "<type>(<scope>): #<issue> <description>" -m "<body>" -m "CLOSED: #<issue>"
```

For simple commits without body:

```bash
git commit -m "<type>(<scope>): #<issue> <description>"
```

## Example Commit Flow

**Branch**: `feat/54-notification-button`
**Changes**: Added notification button to shared UI library

```bash
git commit -m "feat(shared-button): #54 add notifications toggle button" \
  -m "Allow users to toggle particular notifications by app section." \
  -m "CLOSED: #54"
```

## Validation

Commits are validated by:

1. **commitlint** - Checks message format against `commitlint.config.js`
2. **branch-name-lint** - Validates branch naming in pre-commit hooks

## Interactive Alternative

For interactive commitizen flow:

```bash
yarn cz
```

> **Note**: Use `--no-verify` flag to skip hooks (not recommended).

## Sandboxed Environment Note

When running commits from sandboxed environments (like Antigravity, Cursor, or similar AI tools), yarn may fail due to restricted file system access to temp folders.

**Workaround options**:

1. **Run in user's terminal**: Copy the prepared commit command and ask the user to run it directly
2. **Skip hooks**: Use `--no-verify` flag (not recommended, always ask the user)
3. **Two-step process**: Agent prepares the commit message, user executes in their terminal

**Prepared commit command format**:

```bash
git add -A && git commit -m "<type>(<scope>): #<issue> <description>" -m "<body>"
```

## Important Notes

- DO NOT push the changes to the remote repository automatically. Ask the user first if he wants to push the changes to the remote repository.
  Maybe this branch will have several commits, and the user wants to push them all at once when the feature is complete.

- When passing precommit and prepush hooks, if they fail, don't create a new commit with the fixes, use `git commit --amend` instead.
