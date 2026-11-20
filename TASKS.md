# Plastikspace — TASKS

> **Workspace-wide tasks:** tooling, git hooks, CI, Claude Code setup, and shared or core code used outside eco.
>
> - Home `plastikspace` in `tools/scripts/task-homes.json`; ClickUp list `1200240000011497`.
> - Read one task with `yarn task <ID>`; check the docs with `yarn tasks:check` (once META-11 merges).
> - The ClickUp ticket holds the full scope of each task. This file holds the row, the status and the order.

**Document version:** 0.1 · **Last updated:** 2026-11-20

---

## How to use this document

- One row per task. The status symbol goes in the ID cell; the ClickUp ID goes in its own column.
- Phase 3 of META-06 adds the rows that move here from the eco docs (29 in `tmp/meta07/disposition.md`). Until then, this file holds only the META family.
- Escape `|` inside cells as `\|`, even inside backticks, and never leave a blank line between table rows.

### Status legend

| Symbol | Meaning                                        |
| ------ | ---------------------------------------------- |
| ✅     | Done — implemented and merged                  |
| 🔄     | In progress — actively being worked            |
| 📋     | Ready — spec'd, unblocked, can be picked up    |
| 🧪     | Discovery — needs spec/UX/decision before code |
| ⛔     | Blocked — waiting on dependency or decision    |

---

## Tasks

### Meta / tooling

| ID | Description | Priority | ClickUp |
| --- | --- | --- | --- |
| **META-06** 🔄 | Task homes: one ClickUp list and one TASKS doc row per task | Low | `123kjkdpqjq` |
| **META-07** ✅ | Generalize the TASKS doc ↔ ClickUp sync across the four task homes | Low | `123kjkdpqjp` |
| **META-08** 📋 | Standing ticket for task-doc maintenance PRs | Low | `123kjkdpqjr` |
| **META-09** ✅ | Claude Code context and guards: trim CLAUDE.md, PreToolUse guards, skill overrides | Low | `123kjkdqcgt` |
| **META-10** ✅ | `task.cjs`: single-task reader for the eco task docs | Low | `123kjkdqcmy` |
| **META-11** 🔄 | `tasks:check`: lint and consistency gate for the task docs | Low | `123kjkdqcqu` |
| **META-12** 📋 | Fast git hooks: lint-staged in pre-commit, no duplicate lint in pre-push | Normal | `123kjkdqv31` |
| **META-13** 📋 | ESLint: keep the type-aware rules out of the hooks | Normal | `123kjkdqv32` |
| **META-14** ⛔ | Claude Code Stop hook: feedback loop before the agent says "done" | Low | `123kjkdqv33` |
| **META-15** 📋 | `check-eco-conventions.cjs`: template and style rules for eco | Low | `123kjkdqv34` |
| **META-16** 📋 | `check-nx-tags`: every lib carries a `scope:*` and a `type:*` tag | Low | `123kjkdqv35` |
| **META-17** 📋 | ESLint: Angular rules that `.claude/CLAUDE.md` asks for in prose become errors | Low | `123kjkdqv36` |
| **META-18** 📋 | `lint-delta`: ESLint warnings may not grow on touched files | Low | `123kjkdqv37` |
| **META-19** 📋 | eco-lib Nx generator: the shortest path is the correct one | Low | `123kjkdqv38` |
| **META-20** 📋 | Feature map for the eco apps + skill to open the app signed in | Low | `123kjkdqv3a` |
| **META-21** 📋 | Prune Claude memory: workarounds become fixes, stale entries go | Low | `123kjkdqv3b` |
| **META-22** ⛔ | Skill evals: measure that the daily skills are actually followed | Low | `123kjkdqv3d` |
| **META-23** ⛔ | `task-audit` skill: pre-PR review of feature-sized branches | Low | `123kjkdqv3e` |
| **META-24** ⛔ | Reusable Claude Code base: private plugin + template repo | Low | `123kjkdqv3f` |

### Order and dependencies

| Step | Tasks | Why this order |
| --- | --- | --- |
| 1 | META-12, META-13 | Every other check runs inside the hooks; they must be fast first |
| 2 | META-14 | The feedback loop needs the fast lint of META-13 |
| 3 | META-15, META-16, META-17, META-18, META-19 | Rules move from prose to scripts, ESLint and a generator |
| 4 | META-20 | Lets an agent reproduce a reported bug on its own |
| 5 | META-21, then META-22 | Prune the instructions before measuring them |
| 6 | META-23 | Needs META-15, META-16 and META-18 |
| 7 | META-24 | Packages what steps 1-6 proved |

---

### META-06 — Task homes: one ClickUp list and one TASKS doc row per task

ClickUp `123kjkdpqjq`. Phase 2 table written 2026-11-11 (`tmp/meta07/disposition.md`); Phase 3 (the moves) not started. Before Phase 3, revisit the placements that rest on "llecoop imports this library": llecoop is now discontinued and only has to keep compiling and passing its tests.

### META-08 — Standing ticket for task-doc maintenance PRs

ClickUp `123kjkdpqjr`. Doc-only PRs that fix rows, statuses or ClickUp IDs reuse this ticket. Version 0.1 of this file was created under it.

### META-11 — `tasks:check`

ClickUp `123kjkdqcqu`. Committed on `chore/123kjkdqcqu-meta-11-tasks-check` (`f174b9d6`); not pushed yet. Its pre-commit block runs when a TASKS, BACKLOG or REQUIREMENTS doc changes.

### META-12 — Fast git hooks

ClickUp `123kjkdqv31`. Measured 2026-11-20: one lint task averages 20 s; the pre-commit lints every project the branch affects on every commit (124 projects for a change in `libs/core/entities`, all 197 when a lib is deleted); about 45 s of fixed cost per commit before any lint. Scope: lint-staged, pre-push without the duplicate lint, `NX_NO_CLOUD` in the hooks, legacy `nx.json` keys removed.

### META-13 — ESLint without types in the hooks

ClickUp `123kjkdqv32`. The root `.eslintrc.json` builds a TypeScript program of the whole monorepo for every lint task (about 13 of its 20 s). Only `deprecation/deprecation` and the boolean `naming-convention` selector need it; they move to the CI profile.

### META-14 — Claude Code Stop hook

ClickUp `123kjkdqv33`. Blocked by META-12 and META-13. At the end of each turn: fast lint, Prettier, related tests and `tasks:check` on the changed files; exit 2 keeps the turn open until they pass.

### META-15 — `check-eco-conventions.cjs`

ClickUp `123kjkdqv34`. Bare form controls without `matInput`, hex colours outside `libs/core/styles`, `--mat-sys-*` redefinitions. Fixture tests, since it runs in pre-commit.

### META-16 — `check-nx-tags`

ClickUp `123kjkdqv35`. Four libs fail today: `core/styles/util/{material,tailwind-preset,tailwind4}` (no tags) and `core/util/cypress-commands` (empty tag).

### META-17 — Angular ESLint rules to errors

ClickUp `123kjkdqv36`. `prefer-signals`, `prefer-inject`, `prefer-output-emitter-ref`, `prefer-control-flow`, `button-has-type`, plus bans on `standalone: true`, `ngClass`/`ngStyle` and `@HostBinding`/`@HostListener`. Count, sweep, then `error`.

### META-18 — `lint-delta`

ClickUp `123kjkdqv37`. Per touched file, warnings at HEAD may not exceed warnings at the merge-base with `origin/develop`. Runs in pre-push.

### META-19 — eco-lib Nx generator

ClickUp `123kjkdqv38`. Replaces the prose rules for new libs (tags, test target, file names, README, alias) with one generator, and removes that prose from the root CLAUDE.md.

### META-20 — Feature map and signed-in app skill

ClickUp `123kjkdqv3a`. `feature-map.json` generated from the eco `app.routes.ts` files, with a check that it matches; a skill that starts the app and signs in with a throwaway PocketBase user, asking before it touches :8090.

### META-21 — Prune Claude memory

ClickUp `123kjkdqv3b`. The memory lives outside the repo, so this task has no PR of its own. Tooling workarounds get a fix ticket and leave memory once the fix merges.

### META-22 — Skill evals

ClickUp `123kjkdqv3d`. Blocked by META-21. Evals for `commitizen-git-flow`, eco form fields and the task docs only.

### META-23 — `task-audit` skill

ClickUp `123kjkdqv3e`. Blocked by META-15, META-16 and META-18. Three lenses (code, a11y, PocketBase and tenants); proven on the PR #1558 branch before adoption.

### META-24 — Reusable Claude Code base

ClickUp `123kjkdqv3f`. Blocked by META-12, META-13, META-14, META-19 and META-23. A private plugin (hooks, skills, CLAUDE.md skeleton) plus a template repo (Husky, lint-staged, ESLint profiles, CI).

---

## 📝 Changelog

| Version | Date | Notes |
| --- | --- | --- |
| 0.1 | 2026-11-20 | **META-08** (`123kjkdpqjr`) — file created for the Plastikspace home with the META family only: META-06…11 (already in ClickUp) and META-12…24 (created today from the 2026-11-20 review of hook timing and of the "feedback loop, evals, guardrails" approach). META-06 Phase 3 adds the moved rows later. |
