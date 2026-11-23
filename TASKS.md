# Plastikspace — TASKS

> **Workspace-wide tasks:** tooling, git hooks, CI, Claude Code setup, and shared or core code used outside eco.
>
> - Home `plastikspace` in `tools/scripts/task-homes.json`; ClickUp list `1200240000011497`.
> - Read one task with `yarn task <ID>`; check the docs with `yarn tasks:check`.
> - The ClickUp ticket holds the full scope of each task. This file holds the row, the status and the order.

**Document version:** 1.6 · **Last updated:** 2026-11-23

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
| **META-11** ✅ | `tasks:check`: lint and consistency gate for the task docs | Low | `123kjkdqcqu` |
| **META-12** ✅ | Fast git hooks: lint-staged in pre-commit, no duplicate lint in pre-push | Normal | `123kjkdqv31` |
| **META-13** ✅ | ESLint: keep the type-aware rules out of the hooks | Normal | `123kjkdqv32` |
| **META-14** ✅ | Claude Code Stop hook: feedback loop before the agent says "done" | Low | `123kjkdqv33` |
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
| **META-25** ✅ | ESLint 10 with flat config, on the current Nx 22.7 | Normal | `123kjkdqv9f` |
| **META-26** ✅ | Nx 22.7 → 23 → 24.0.x with `nx migrate`, plus the legacy `nx.json` cleanup | Normal | `123kjkdqv9g` |
| **META-27** ✅ | Remove Verdaccio: the root `local-registry` target, its config and the dependency | Low | `123kjkdqwqp` |
| **META-28** ✅ | Root the Vite cache and coverage paths of the three eco-store orders feature libs | Normal | `123kjkdqwrm` |
| **META-29** 📋 | ESLint: make the private-fields rule fire (`ClassProperty` → `PropertyDefinition`) | Low | `123kjkdqzv8` |
| **META-30** ✅ | Delete the 18 dead `jest.config.cts` files | Low | `123kjkdqzv9` |
| **META-31** 📋 | `documentation/code-style.md`: match the ESLint rule list to `eslint.config.mjs` | Low | `123kjkdqzvb` |

### Order and dependencies

| Step | Tasks | Why this order |
| --- | --- | --- |
| 1 | META-12 | Every other check runs inside the hooks; they must be fast first |
| 2 | META-25, then META-26 | ESLint 8 and every 9.x are out of support, and Nx 23.1 drops ESLint 8; the ESLint rules and the lint split build on the final config |
| 3 | META-13 | Splits the lint on the final ESLint config and the inferred Nx lint tasks, and measures from there |
| 4 | META-14 | The feedback loop needs the fast lint of META-13 |
| 5 | META-15, META-16, META-17, META-18, META-19 | Rules move from prose to scripts, ESLint and a generator |
| 6 | META-20 | Lets an agent reproduce a reported bug on its own |
| 7 | META-21, then META-22 | Prune the instructions before measuring them |
| 8 | META-23 | Needs META-15, META-16 and META-18 |
| 9 | META-24 | Packages what steps 1-8 proved |
| Any | META-27 | No blocker, and it blocks none of the others |
| First | META-28 | The test job of every CI run that tests all projects can fail without it, #1570's twice |
| Any | META-29, META-30, META-31 | No blocker: three cleanups META-13 found. META-29 and META-31 both edit `documentation/code-style.md` |

---

### META-06 — Task homes: one ClickUp list and one TASKS doc row per task

ClickUp `123kjkdpqjq`. Phase 2 table written 2026-11-11 (`tmp/meta07/disposition.md`); Phase 3 (the moves) not started. Before Phase 3, revisit the placements that rest on "llecoop imports this library": llecoop is now discontinued and only has to keep compiling and passing its tests.

### META-08 — Standing ticket for task-doc maintenance PRs

ClickUp `123kjkdpqjr`. Doc-only PRs that fix rows, statuses or ClickUp IDs reuse this ticket. Version 0.1 of this file was created under it.

### META-11 — `tasks:check`

ClickUp `123kjkdqcqu`. Merged 2026-11-20 (PR #1562, `b15d12fa`). The pre-commit runs it when a TASKS, BACKLOG or REQUIREMENTS doc changes; CI runs it in the lint step. It takes 4-6 s with yarn startup. Since META-12 the pre-commit runs its two scripts with node directly, 1.4–1.7 s (measured 2026-11-21), on a copy of the index: a Markdown-only commit that stages a task doc took 8 s instead of 4 s.

### META-12 — Fast git hooks

ClickUp `123kjkdqv31`. Merged 2026-11-21 (PR #1568, `2ab4b20b`). Wall time of `git commit` with the first version of the hook, before → after: one line in a feature lib 199 s → 63 s, one line in `libs/core/entities` 45 min 14 s → 49 s, Markdown only 20 s → 8 s; the round-3 version took 32–34 s and 4 s on a quiet machine. What remains is ESLint start-up (META-25, META-13). Worktrees run the main checkout's `.husky`, so the new hooks start once the main checkout's branch has them, and need `yarn install` there for lint-staged 16.4.0. The schema PR check (`pb-schema-guard.yml`) has only run on PRs without a schema change; its label and record paths are tested in simulation only. The legacy `nx.json` keys moved to META-26.

### META-13 — ESLint without types in the hooks

ClickUp `123kjkdqv32`. Merged 2026-11-23 (PR #1578, `6d06d675`). By default ESLint builds no TypeScript program: one lint task takes 2.0–2.9 s instead of 6.8–8.2 s (10 projects, one at a time), all 190 tasks 178 s instead of 685 s (3 in parallel), and the pre-commit's ESLint call on one file about 2 s instead of 7 s. `ESLINT_TYPED=1` (CI's lint step, `yarn lint:ci`) adds `no-deprecated`, `prefer-readonly` and the boolean `naming-convention` selector, typed per project through typescript-eslint's project service: the same 675 findings as before, 516 s for the 190 tasks. `yarn lint:profiles` checks both profiles in CI. Left for later: the 18 dead `jest.config.cts` files (META-30), and the `ClassProperty` selector of the private-fields rule, which never fires under typescript-eslint v8 (META-29).

### META-14 — Claude Code Stop hook

ClickUp `123kjkdqv33`. Merged 2026-11-23 (PR #1581, `332d794f`). When Claude ends a turn, `.claude/hooks/stop-check.mjs` checks the files changed since the session started (a `SessionStart` run records those already modified): ESLint with the fast profile (errors only), markdownlint, `prettier --check`, `vitest related` for at most two projects, `tasks:check` when a task doc changed, and new suppression comments in `apps/` and `libs/`. A failure keeps the turn open once; if it is still there at the next stop, the turn ends and the user is told. A turn without new changes adds 0.4 s, a Markdown change 2.5 s, a TypeScript change in one library about 20 s. In a `claude -p` trial the hook blocked a `no-console` error and Claude removed it; in an earlier trial, before the suppression check, Claude had silenced it with `eslint-disable`. A session gets the hook only once the checkout it starts in has it. Left out: subagents (`SubagentStop`), deleted files, and an automated test of the script.

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

ClickUp `123kjkdqv3f`. Blocked by META-19 and META-23. A private plugin (hooks, skills, CLAUDE.md skeleton) plus a template repo (Husky, lint-staged, ESLint profiles, CI).

### META-25 — ESLint 10 with flat config

ClickUp `123kjkdqv9f`. Merged 2026-11-22 (PR #1570, `95c51bf8`). ESLint 10.15 with 191 flat configs replaced ESLint 8.57; `nx run-many -t lint` gives the same findings per project and rule (2,672 files, 0 errors, 675 warnings) except where ESLint 10 changed `eslint:recommended`, whose nine new findings were fixed. A checkout or worktree that merges develop needs `yarn install` before its next commit, or Nx fails to build the project graph. ESLint 8 and every 9.x release are out of support on npm, and ESLint 10 drops `.eslintrc`. The ticket swaps `eslint-plugin-deprecation` and `eslint-plugin-ngrx`, which break on ESLint 9 and later, converts the 191 configs to flat config and moves to ESLint 10, all on the current Nx 22.7. ESLint 10 also looks the config up per file, which the root `eslint --fix` of the META-12 lint-staged needs. Same findings before and after.

### META-26 — Nx 22.7 → 24.0.x

ClickUp `123kjkdqv9g`. Merged 2026-11-22 in two PRs: #1574 (`2f2306b1`, Nx 23.3.2 and the legacy `nx.json` and script cleanup) and #1575 (`6a8a5019`, Nx 24.0.6). Nx packages only: Angular 21, TypeScript 5.9 and Cypress 15 stay; Nx 23 brought Vite 8.3.8 for Vitest, and Analog 2.9.7 with it. `lint` and `test` are inferred tasks (`eslint .` and `vitest run`), and the 186 `project.json` that used the removed executors lost them. Same targets, same project graph and the same five projects affected by a one-file change. Lint: 0 errors and 675 warnings, 371 fewer, all of them deprecations of the two Nx Vite helpers the PR removed. The same 1,224 tests pass. In an A/B under equal load, a lint task takes 30 % less time and a test task 8 % less. One spec runs with `nx test <project> <file> --passWithNoTests=false`, the path relative to the project. Left open: the Cypress e2e were not checked (out of scope), and the `*:e2e:local` scripts that pass `--watch` fail for all five e2e projects; the lint cache hashes `eslint` but not its plugins.

### META-27 — Remove Verdaccio

ClickUp `123kjkdqwqp`. Merged 2026-11-22 (PR #1572, `e981d4c5`); `yarn.lock` lost exactly the 90 entries only `verdaccio` reached, 3,450 → 3,360. The root project's only target, `local-registry`, runs `@nx/js:verdaccio`, a local npm registry for publishing packages, and nothing in the repo publishes any. The executor points the user-level npm and Yarn configs at `localhost:4873` and restores them only from its exit and signal handlers, so one run killed before they ran, on 2026-11-20, broke every `yarn install` on the machine until 2026-11-22. The ticket removes the target, `.verdaccio/`, the `verdaccio` dependency and the two ignore entries for the folder, and keeps the root project.

### META-28 — Orders feature libs: cache and coverage paths

ClickUp `123kjkdqwrm`. Merged 2026-11-22 (PR #1571, `d6f42b64`); CI then collected the coverage of the three libs for the first time. The `vite.config.mts` of `libs/eco-store/orders/feature/{created,detail,list}` climbed four levels from projects five deep, and the coverage folder of `created` was the parent of those of `detail` and `list`. Vitest empties its coverage folder when it starts, so `created` running beside `detail` deleted the coverage files `detail` was writing, and CI on #1570 failed on `eco-store-orders-detail:test` twice in a row. The ticket points both paths at the root, in each project's own folder.

### META-29 — Private-fields rule selector

ClickUp `123kjkdqzv8`. No blocker. The root `no-restricted-syntax` rule against the `private` modifier selects `ClassProperty`, a node typescript-eslint v8 calls `PropertyDefinition`, so it has never fired; root `CLAUDE.md` presents it as enforced. Limited to fields it reports nothing today; widened to every private member it reports 19 methods and 3 constructor parameter properties in 16 files, and the owner picks which when the work starts. A check fails if the selector stops matching again.

### META-30 — Dead `jest.config.cts` files

ClickUp `123kjkdqzv9`. Merged 2026-11-23 (PR #1583, `590ede94`). The 18 `jest.config.cts` files are gone (Jest is not installed, and the `jest.preset.js` they pointed to did not exist), and so is their `**/jest.config.cts` entry in `TS_UNTYPED` of the root `eslint.config.mjs`. Before and after: the same 197 Nx projects, the same targets for the 18, and the same ESLint findings on them in both profiles (104 warnings fast, 107 typed, no error). The `jest.config.*` excludes in the tsconfigs and in `nx.json` stay: they match nothing, and editing them makes most projects affected.

### META-31 — ESLint rule list in `code-style.md`

ClickUp `123kjkdqzvb`. No blocker. The "Lint rules" section of `documentation/code-style.md` says `no-console` warns, where the root config makes it an error outside test files; it names five of the custom rules and credits `@angular-eslint/schematics`, which is not installed. Docs only: every entry checked against `eslint.config.mjs`, with one wording shared with root `CLAUDE.md`.

---

## 📝 Changelog

| Version | Date | Notes |
| --- | --- | --- |
| 1.6 | 2026-11-23 | **META-08** (`123kjkdpqjr`) — META-30 ✅ (PR #1583, `590ede94`), with its before/after checks; it went from 📋 to ✅ without an in-progress row, because #1582 held the previous version while it ran. |
| 1.5 | 2026-11-23 | **META-08** (`123kjkdpqjr`) — META-14 ✅ (PR #1581, `332d794f`), with the time the hook adds to a turn and the live trial; META-24 no longer lists META-14 among its blockers. |
| 1.4 | 2026-11-23 | **META-14** (`123kjkdqv33`) — META-14 🔄: work started on `chore/123kjkdqv33-meta-14-stop-hook`. |
| 1.3 | 2026-11-23 | **META-08** (`123kjkdpqjr`) — META-29 (private-fields rule selector), META-30 (dead `jest.config.cts` files) and META-31 (ESLint rule list in `code-style.md`) added as 📋, three cleanups META-13 found; the order table lists them as free of blockers. |
| 1.2 | 2026-11-23 | **META-08** (`123kjkdpqjr`) — META-13 ✅ (PR #1578, `6d06d675`), with its before/after lint times; META-14 📋, its only blocker done; META-24 no longer lists META-13 among its blockers. |
| 1.1 | 2026-11-22 | **META-13** (`123kjkdqv32`) — META-13 🔄: work started on `chore/123kjkdqv32-meta-13-eslint-without-types-in-hooks`. |
| 1.0 | 2026-11-22 | **META-08** (`123kjkdpqjr`) — META-26 ✅ (PR #1574, `2f2306b1`, and PR #1575, `6a8a5019`); META-13 📋, its last blocker done, with the lint task time after Nx 24. |
| 0.9 | 2026-11-22 | **META-26** (`123kjkdqv9g`) — META-26 🔄: work started on `chore/123kjkdqv9g-meta-26-nx-23`, the branch of its first PR (Nx 23). |
| 0.8 | 2026-11-22 | **META-08** (`123kjkdpqjr`) — META-25 ✅ (PR #1570, `95c51bf8`), META-27 ✅ (PR #1572, `e981d4c5`) and META-28 ✅ (PR #1571, `d6f42b64`); META-26 📋, its only blocker done; META-13 names `eslint.config.mjs` and only META-26 as its blocker; the META-27 block says the executor restores the configs from its exit and signal handlers. |
| 0.7 | 2026-11-22 | **META-27** (`123kjkdqwqp`) — META-27 (remove Verdaccio) added as 🔄, with work started on `chore/123kjkdqwqp-meta-27-remove-verdaccio`; the order table lists it as independent of the other tasks. |
| 0.6 | 2026-11-22 | **META-25** (`123kjkdqv9f`) — META-25 🔄: work started on `chore/123kjkdqv9f-meta-25-eslint-10-flat-config`. |
| 0.5 | 2026-11-22 | **META-28** (`123kjkdqwrm`) — META-28 (cache and coverage paths of the orders feature libs) added as 🔄, with work started on `fix/123kjkdqwrm-meta-28-orders-vite-paths`; the order table puts it first, since CI test jobs that test all projects need it. |
| 0.4 | 2026-11-21 | **META-08** (`123kjkdpqjr`) — META-12 ✅ (PR #1568, `2ab4b20b`), with its before/after commit times; META-25 📋, its only blocker done; META-14 and META-24 no longer list META-12 among their blockers. The META-11 note gives the pre-commit's cost of `tasks:check`. |
| 0.3 | 2026-11-20 | **META-08** (`123kjkdpqjr`) — META-25 (`123kjkdqv9f`, ESLint 10 with flat config) and META-26 (`123kjkdqv9g`, Nx 22.7 → 24.0.x) added between META-12 and META-13, which is now ⛔. The legacy `nx.json` cleanup moves from META-12 to META-26; META-12 gains the PocketBase schema safeguards. |
| 0.2 | 2026-11-20 | **META-08** (`123kjkdpqjr`) — META-11 ✅ (PR #1562, `b15d12fa`); META-12 🔄. The header no longer says `tasks:check` is pending. |
| 0.1 | 2026-11-20 | **META-08** (`123kjkdpqjr`) — file created for the Plastikspace home with the META family only: META-06…11 (already in ClickUp) and META-12…24 (created today from the 2026-11-20 review of hook timing and of the "feedback loop, evals, guardrails" approach). META-06 Phase 3 adds the moved rows later. |
