---
name: changelog
description: Add changelog entries for feature branches following conventional changelog format.
---

# Changelog Skill

Add structured changelog entries before pushing a feature branch to remote.

## Changelog Location

```
/CHANGELOG.md
```

## Entry Format

Each release section should include an **issue number** if available, **date** and a **brief title** describing the main focus:

```markdown
## [Unreleased] - <Brief Title>

### Added

- <Description> ([#<issue>](https://github.com/plastikaweb/plastikspace/pull/<issue>))

### Changed

### Fixed

### Removed

---

## [YYYY-MM-DD] - <Brief Title>

### Added

- <Description> ([#<issue>](https://github.com/plastikaweb/plastikspace/pull/<issue>))
```

> **Note**: Use horizontal rules (`---`) to separate release sections for better readability.

## Workflow

### Step 1: Map Commit Type to Section

| Commit Type          | Changelog Section |
| -------------------- | ----------------- |
| `feat`               | Added             |
| `fix`                | Fixed             |
| `refactor`, `perf`   | Changed           |
| `revert`             | Removed           |
| `docs`, `chore`, etc | Usually skip      |

> **Note**: Only add entries for **user-facing changes**. Skip internal refactors, CI changes, or documentation updates unless significant.

### Step 2: Write Entry

**Format**: `- <Past tense description> ([#<issue>](<github-link>))`

**Examples**:

```markdown
### Added

- Added notification toggle to user preferences ([#54](https://github.com/plastikaweb/plastikspace/issues/54))

### Fixed

- Fixed header alignment on mobile devices ([#102](https://github.com/plastikaweb/plastikspace/issues/102))
```

### Step 3: Insert Entry

1. Open `CHANGELOG.md`
2. Add entry under `## [Unreleased]` in the appropriate section
3. Create section if it doesn't exist

## When to Add Entries

- **Add**: New features, bug fixes, breaking changes
- **Skip**: Internal refactors, CI/build changes, typo fixes

## Integration with Commitizen

When using the **commitizen skill** (`yarn cz` or agent-assisted commits), changelog entries are prompted automatically:

1. After creating a commit with `feat`, `fix`, or `perf` type, the agent will ask if a changelog entry should be added
2. If confirmed, the entry is added to `[Unreleased]` section
3. Description is converted from imperative to past tense

See [commitizen/SKILL.md](../commitizen/SKILL.md) for the full commit workflow.

## Markdownlint Compliance

Changelog entries must comply with markdownlint rules:

- **Line length**: Keep lines under 210 characters (MD013)
- **Multiple PRs**: When a change spans multiple PRs, use **separate entries** instead of comma-separated links:

```markdown
### Fixed

- Fixed CI pipeline errors ([#683](https://github.com/plastikaweb/plastikspace/pull/683))
- Fixed CI pipeline errors ([#682](https://github.com/plastikaweb/plastikspace/pull/682))
```

**Not**:

```markdown
- Fixed CI pipeline errors ([#683](...), [#682](...), [#681](...)) <!-- Too long! -->
```
