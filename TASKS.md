# Plastikspace — TASKS

> **Workspace-wide tasks:** tooling, git hooks, CI, Claude Code setup, and shared or core code used outside eco.
>
> - Home `plastikspace` in `tools/scripts/task-homes.json`; ClickUp list `1200240000011497`.
> - Read one task with `yarn task <ID>`; check the docs with `yarn tasks:check`.
> - The ClickUp ticket holds the full scope of each task. This file holds the row, the status and the order.

**Document version:** 1.25 · **Last updated:** 2026-11-27

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
| **META-15** ✅ | `check-eco-conventions.cjs`: template and style rules for eco | Low | `123kjkdqv34` |
| **META-16** ✅ | `check-nx-tags`: every lib carries a `scope:*` and a `type:*` tag | Low | `123kjkdqv35` |
| **META-17** ✅ | ESLint: Angular rules that `.claude/CLAUDE.md` asks for in prose become errors | Low | `123kjkdqv36` |
| **META-18** ✅ | `lint-delta`: ESLint warnings may not grow on touched files | Low | `123kjkdqv37` |
| **META-19** ✅ | eco-lib Nx generator: the shortest path is the correct one | Low | `123kjkdqv38` |
| **META-20** ✅ | Feature map for the eco apps + skill to open the app signed in | Low | `123kjkdqv3a` |
| **META-21** ✅ | Prune Claude memory: workarounds become fixes, stale entries go | Low | `123kjkdqv3b` |
| **META-22** ✅ | Skill evals: measure that the daily skills are actually followed | Low | `123kjkdqv3d` |
| **META-23** ✅ | `task-audit` skill: pre-PR review of feature-sized branches | Low | `123kjkdqv3e` |
| **META-24** ✅ | Portable setup playbook: config, security and automation, first applied to NewWebSite | Low | `123kjkdqv3f` |
| **META-25** ✅ | ESLint 10 with flat config, on the current Nx 22.7 | Normal | `123kjkdqv9f` |
| **META-26** ✅ | Nx 22.7 → 23 → 24.0.x with `nx migrate`, plus the legacy `nx.json` cleanup | Normal | `123kjkdqv9g` |
| **META-27** ✅ | Remove Verdaccio: the root `local-registry` target, its config and the dependency | Low | `123kjkdqwqp` |
| **META-28** ✅ | Root the Vite cache and coverage paths of the three eco-store orders feature libs | Normal | `123kjkdqwrm` |
| **META-29** ✅ | ESLint: make the private-fields rule fire (`ClassProperty` → `PropertyDefinition`) | Low | `123kjkdqzv8` |
| **META-30** ✅ | Delete the 18 dead `jest.config.cts` files | Low | `123kjkdqzv9` |
| **META-31** ✅ | `documentation/code-style.md`: match the ESLint rule list to `eslint.config.mjs` | Low | `123kjkdqzvb` |
| **META-32** ✅ | `guard.sh`: commit message limits, temp paths, piped git and quoted PocketBase words checked before they bite | Low | `123kjkdr15p` |
| **META-33** ✅ | Claude Code settings: the Nx env for worktrees and a sandbox exclusion list | Low | `123kjkdr15q` |
| **META-34** ✅ | Worktree bootstrap and per-worktree hooks | Low | `123kjkdr15t` |
| **META-35** ✅ | Long runs survive: SSH keepalive, no idle sleep, no forwarded `--cache` in pre-push | Low | `123kjkdr15u` |
| **META-36** ✅ | `eco-admin:watch-scss`: the dev server picks up changed SCSS partials | Low | `123kjkdr15v` |
| **META-37** ✅ | `eco-store:pb:sync` refuses to run without `POCKETBASE_ENV` | Normal | `123kjkdr15w` |
| **META-38** ✅ | Trim root and eco-store `CLAUDE.md`: reference detail moves to the docs it belongs to | Low | `123kjkdr15x` |
| **META-39** ✅ | WCAG 2.2 AA in practice: Pa11y checks `target-size`, audit of the new criteria, a new eco-store statement | Normal | `123kjkdr177` |
| **META-40** ✅ | Per-screen a11y suite in Playwright with axe (WCAG 2.2), replacing Pa11y in eco-store and eco-admin | Low | `123kjkdr20r` |
| **META-41** ✅ | `plastikaweb:a11y` points to a `.pa11yci.json` that does not exist | Low | `123kjkdr4vz` |

### Order and dependencies

| Step | Tasks | Why this order |
| --- | --- | --- |
| 1 | META-12 | Every other check runs inside the hooks; they must be fast first |
| 2 | META-25, then META-26 | ESLint 8 and every 9.x are out of support, and Nx 23.1 drops ESLint 8; the ESLint rules and the lint split build on the final config |
| 3 | META-13 | Splits the lint on the final ESLint config and the inferred Nx lint tasks, and measures from there |
| 4 | META-14 | The feedback loop needs the fast lint of META-13 |
| 5 | META-15, META-16, META-17, META-18, META-19 | Rules move from prose to scripts, ESLint and a generator |
| 6 | META-20 | Lets an agent reproduce a reported bug on its own |
| 7 | META-21, META-38, then META-22 | Prune the instructions before measuring them; META-38 is the `CLAUDE.md` half of the pruning |
| 8 | META-23 | Needs META-15, META-16 and META-18 |
| 9 | META-24 | Packages what steps 1-8 proved |
| Any | META-27 | No blocker, and it blocks none of the others |
| First | META-28 | The test job of every CI run that tests all projects can fail without it, #1570's twice |
| Any | META-32, META-33, META-34, META-35, META-36, META-37 | No blocker: each turns a workaround Claude keeps in memory into a fix, and its memory entries go once it merges. META-35's SSH setting can live in META-34's setup script |
| Any | META-39 | No blocker. Measure the new Pa11y config before it reaches the eco-store pre-push, the only a11y gate |
| After META-39 | META-40 | Its assertions encode what META-39's manual audit finds checkable; its prototype measures before Pa11y goes |
| Any | META-41 | No blocker: META-40 found it, and no hook or CI job runs the script |
| Any | META-29, META-30, META-31 | No blocker: three cleanups META-13 found. META-29 and META-31 both edit `documentation/code-style.md` |

---

### META-06 — Task homes: one ClickUp list and one TASKS doc row per task

ClickUp `123kjkdpqjq`. Phase 2 table written 2026-11-11 (`tmp/meta07/disposition.md`); refreshed 2026-11-27 (`tmp/meta07/refresh-2026-11-27.md`): 36 creates and 38 moves still apply, about 200 of the 216 doc fixes, all to be placed by content since every line moved. Owner rulings 2026-11-27: llecoop no longer counts as a non-eco consumer (llecoop-only tickets close instead of moving), and BUG-016's server-side limit splits into its own Eco Shared ticket. Phase 3 (creates, the docs PR, the moves) under way.

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

ClickUp `123kjkdqv34`. Merged 2026-11-24 (PR #1595, `8ab386de`). `yarn eco-conventions:check` reads the templates and styles of `libs/eco*` and `apps/eco-*` (specs left out) and fails on an `<input>`, `<select>` or `<textarea>` without `matInput` or `matNativeControl`, and on a hex colour or a `--mat-sys-*` declaration outside the token sources (`_eco_tokens.css` and the eco-store `*-theme.css` files); each `::ng-deep` is listed as info. Comments are blanked first; `/* eco:check allow <rule>: <reason> */` on the line before is an exception, never without a reason. In the pre-commit on the staged eco files (from worktrees once the main checkout's `.husky` has it) and as a failing CI check. Before → after: 4 → 0 errors, all four the hex of `apps/eco-admin/src/styles/_base.scss`, which no Material role matches and which carry allow markers by the owner's choice; 435 files in 0.4 s; 12 test cases, and 18 deliberate bugs in the script each fail them. Not covered: inline `styles:` of components (none in eco), and hex in TypeScript or `index.html` (the pre-paint theme colours).

### META-16 — `check-nx-tags`

ClickUp `123kjkdqv35`. Merged 2026-11-23 (PR #1589, `a3eebc0b`). `yarn nx-tags:check` fails a `libs/**/project.json` without a `scope:*` that a `sourceTag` of the root `eslint.config.mjs` names or without a `type:*` tag (`missing-scope`, `missing-type`, `empty-tag`, `unknown-scope`); it reads the scopes from the config's text in 0.14 s, and `yarn nx-tags:test` checks that they match the imported config. First step of the pre-push and of CI's Lint Affected step; from a worktree the pre-push step runs only once the main checkout's `.husky` has it, CI runs both commands. The four libs that failed (8 errors in 4 of 183) now carry `scope:core` and `type:util`. Not covered: a `type:*` no rule names (`unknown-type`), and the apps without tags.

### META-17 — Angular ESLint rules to errors

ClickUp `123kjkdqv36`. Merged 2026-11-24 (PR #1591, `86654500`). Errors in every project, specs and llecoop included: `prefer-signals` (with `readonly` on signal properties), `prefer-inject`, `prefer-output-emitter-ref`, `prefer-output-readonly`, `template/prefer-control-flow`, `template/button-has-type`, and `no-restricted-syntax` against `standalone: true`, `@HostBinding`/`@HostListener` and `ngClass`/`ngStyle`. Swept in the same commit: 207 `readonly` signals, 21 outputs, 38 button types, 1 `@Input`, 5 `ngStyle`; `yarn lint:all` keeps its 656 warnings. NG1053 is caught at lint time, and the private-fields rule skips fields set by Angular's initializer APIs. The `*.html` block lost its 13 component-class rules (8 owner-approved; 5 that reach Angular TypeScript through `flat/angular` anyway). No rule for an `effect()` that writes a signal: 4 today, no angular-eslint rule, and a selector would also flag `Map.set()`.

### META-18 — `lint-delta`

ClickUp `123kjkdqv37`. Merged 2026-11-24 (PR #1593, `2aca478a`). `yarn lint:delta` lints each touched file on disk and at the merge base with `origin/develop` (or `--base <ref>`), same config, fast profile, and fails when the file has more warnings; the ones it had may stay, and the report lists only the new warning texts. In the pre-push (non-Markdown pushes) and, by the owner's choice, as a failing CI check, since from worktrees the pre-push step waits for the main checkout's `.husky`. `--scope-only` classifies the touched files for META-23. On META-17's 99 files: 110 → 110 warnings in 24 s. The owner's choice (2026-11-23) for the 621 `id-denylist`/`id-length` warnings: they stay warnings, and this keeps them from growing.

### META-19 — eco-lib Nx generator

ClickUp `123kjkdqv38`. Merged 2026-11-24 (PR #1597, `ef076441`). `yarn eco-lib` (`tools/generators/eco-lib`, run by path, so no alias, dependency or Nx project) asks for app, domain, type and name and wraps `@nx/angular:library`. It writes eco-admin's names (the owner's choice: `libs/<app>/<domain>/<type>[/<name>]`, `core` and `libs/eco` flat; existing libraries keep theirs), both tags, the alias, the configs of the other eco libraries, flat `src/` files and a README stub, and puts back the root `eslint.config.mjs`, `.gitignore` and `nx.json` that the stock generator edits. Five libraries made with it, one per type, passed lint in both profiles, test, `tsc`, `nx-tags:check`, `eco-conventions:check` and `lint:delta` with no manual edit; `yarn eco-lib:test` (27 checks, 17 s) runs in CI. The ticket's `@nx/vitest:test` target was out of date since META-26: the targets are inferred. The root `CLAUDE.md` naming prose became a pointer, 30,439 → 30,129 bytes. Not exercised: the interactive prompts.

### META-20 — Feature map and signed-in app skill

ClickUp `123kjkdqv3a`. Merged 2026-11-24 in two PRs. PR #1599 (`bfcb7fbc`): `yarn feature-map` (`tools/scripts/feature-map.cjs`) follows the eco-store and eco-admin routes with the TypeScript parser into `tools/feature-map.json`, 27 pages with access, roles, needs, guards, project, component, specs, layout and outlets, plus 4 redirects; a guard in neither of its tables, or a route shape it does not know, stops it, and `yarn feature-map:check` fails CI on drift (proven by renaming a route). PR #1600 (`9721cac1`): the `eco-page-check` skill (find the page with `yarn feature-map:find`, ask before PocketBase, serve, sign in as a throwaway user from `tools/scripts/eco-test-user.cjs`, read the page) and a headless `playwright` MCP server through `npx`, the owner's choice over the desktop built-in browser. A fresh Sonnet agent told only that the avatar page fails reproduced a planted fault and named its file and lines in 69 s. Not exercised in a browser: eco-admin pages and pages with `needs`.

### META-21 — Prune Claude memory

ClickUp `123kjkdqv3b`. Done 2026-11-24. The memory, outside the repo, went from 62 entries (301,119 B) to 26 (49,054 B), and `MEMORY.md`, loaded by every session, from 17,149 B to 4,872 B; each workaround left names its fix ticket, META-32…37 or A11Y-022 (eco-store). The inventory, attached to the ticket, also found errors in the Claude docs. PR #1602 (`1d6e56b3`) fixed them, among them the claim that `orders.createRule` pins the tenant (it does not: SEC-09), and the `commitizen-git-flow` advice to amend after a failed hook. PR #1603 (`04b9efc8`) sets WCAG 2.2 AA as every app's target, and META-39 makes the checks follow, the owner's decision. The section trims went to META-38.

### META-22 — Skill evals

ClickUp `123kjkdqv3d`. Done 2026-11-24 (PR #1608, `38b05d14`). The commit rules commitlint cannot see became a script, not an eval: `.husky/commit-msg` runs `tools/scripts/check-commit-refs.cjs` (the branch's ClickUp ID in the header, a task ID on eco code, a CHANGELOG bullet naming the task for a `feat`, `fix` or `perf` with code). Replayed over develop's last 150 PRs it would have refused 2 of the 98 commits since 2026-11-01. The form-field eval (`tools/evals/form-field/`, headless Sonnet, graded by a script) passed 5/5 on develop for 2.59 USD, but its task has a select next to the new one to copy, so it cannot fail; the second batch was not run. Rerun it with the first eco-admin form. The task-doc eval was dropped: `yarn tasks:check` already checks them on every commit and push.

### META-23 — `task-audit` skill

ClickUp `123kjkdqv3e`. Done 2026-11-24 (PR #1610, `4176c74a`). The `task-audit` skill (`.agents/skills/task-audit`) runs three read-only Sonnet lenses (code, a11y, PocketBase and tenants) on a finished branch and triages what they report. Replayed headless on the PR #1558 branch for 3.05 USD, it reported three of the five issues fixed after that merge, folded a fourth into another finding and lost the fifth in its own triage, which now keeps any finding a lens backs with a file and line. The lenses were written from #1558's lessons, so the replay flatters them; the first real branch is the test.

### META-24 — Reusable Claude Code base

ClickUp `123kjkdqv3f`. Redefined by the owner 2026-11-27: not a plugin or a template repo, which would carry only the Claude Code part or tie each piece to Nx, but a playbook of what this repo applies (config, security, automation, performance), each piece with the failure it prevents, its cost and how portable it is (universal, Angular, Nx, this repo only). First target: NewWebSite, a standard Angular repo with no Nx. A kit of copyable files waits for a second repo that uses it; a plugin, for the Claude Code part only, if two repos ever share it. Done 2026-11-27: the playbook is `docs/setup-playbook.md` in NewWebSite (eight items, from security headers to sandbox exclusions); applying it is NewWebSite's work, not this repo's.

### META-25 — ESLint 10 with flat config

ClickUp `123kjkdqv9f`. Merged 2026-11-22 (PR #1570, `95c51bf8`). ESLint 10.15 with 191 flat configs replaced ESLint 8.57; `nx run-many -t lint` gives the same findings per project and rule (2,672 files, 0 errors, 675 warnings) except where ESLint 10 changed `eslint:recommended`, whose nine new findings were fixed. A checkout or worktree that merges develop needs `yarn install` before its next commit, or Nx fails to build the project graph. ESLint 8 and every 9.x release are out of support on npm, and ESLint 10 drops `.eslintrc`. The ticket swaps `eslint-plugin-deprecation` and `eslint-plugin-ngrx`, which break on ESLint 9 and later, converts the 191 configs to flat config and moves to ESLint 10, all on the current Nx 22.7. ESLint 10 also looks the config up per file, which the root `eslint --fix` of the META-12 lint-staged needs. Same findings before and after.

### META-26 — Nx 22.7 → 24.0.x

ClickUp `123kjkdqv9g`. Merged 2026-11-22 in two PRs: #1574 (`2f2306b1`, Nx 23.3.2 and the legacy `nx.json` and script cleanup) and #1575 (`6a8a5019`, Nx 24.0.6). Nx packages only: Angular 21, TypeScript 5.9 and Cypress 15 stay; Nx 23 brought Vite 8.3.8 for Vitest, and Analog 2.9.7 with it. `lint` and `test` are inferred tasks (`eslint .` and `vitest run`), and the 186 `project.json` that used the removed executors lost them. Same targets, same project graph and the same five projects affected by a one-file change. Lint: 0 errors and 675 warnings, 371 fewer, all of them deprecations of the two Nx Vite helpers the PR removed. The same 1,224 tests pass. In an A/B under equal load, a lint task takes 30 % less time and a test task 8 % less. One spec runs with `nx test <project> <file> --passWithNoTests=false`, the path relative to the project. Left open: the Cypress e2e were not checked (out of scope), and the `*:e2e:local` scripts that pass `--watch` fail for all five e2e projects; the lint cache hashes `eslint` but not its plugins.

### META-27 — Remove Verdaccio

ClickUp `123kjkdqwqp`. Merged 2026-11-22 (PR #1572, `e981d4c5`); `yarn.lock` lost exactly the 90 entries only `verdaccio` reached, 3,450 → 3,360. The root project's only target, `local-registry`, runs `@nx/js:verdaccio`, a local npm registry for publishing packages, and nothing in the repo publishes any. The executor points the user-level npm and Yarn configs at `localhost:4873` and restores them only from its exit and signal handlers, so one run killed before they ran, on 2026-11-20, broke every `yarn install` on the machine until 2026-11-22. The ticket removes the target, `.verdaccio/`, the `verdaccio` dependency and the two ignore entries for the folder, and keeps the root project.

### META-28 — Orders feature libs: cache and coverage paths

ClickUp `123kjkdqwrm`. Merged 2026-11-22 (PR #1571, `d6f42b64`); CI then collected the coverage of the three libs for the first time. The `vite.config.mts` of `libs/eco-store/orders/feature/{created,detail,list}` climbed four levels from projects five deep, and the coverage folder of `created` was the parent of those of `detail` and `list`. Vitest empties its coverage folder when it starts, so `created` running beside `detail` deleted the coverage files `detail` was writing, and CI on #1570 failed on `eco-store-orders-detail:test` twice in a row. The ticket points both paths at the root, in each project's own folder.

### META-29 — Private-fields rule selector

ClickUp `123kjkdqzv8`. Merged 2026-11-23 (PR #1585, `483c622c`). The root `no-restricted-syntax` rule now selects `PropertyDefinition[accessibility='private']`; the old `ClassProperty` matched nothing under typescript-eslint v8. It stays on class fields, the owner's choice: private methods and constructor parameter properties keep the modifier (19 and 3 today), and `CLAUDE.md` says so. No class field uses `private`, so the 191 lint tasks pass with no finding from it. `yarn lint:profiles` lints a probe file and fails if the rule stops reporting its `private` field; a check by hand on a real file showed the error in both profiles.

### META-30 — Dead `jest.config.cts` files

ClickUp `123kjkdqzv9`. Merged 2026-11-23 (PR #1583, `590ede94`). The 18 `jest.config.cts` files are gone (Jest is not installed, and the `jest.preset.js` they pointed to did not exist), and so is their `**/jest.config.cts` entry in `TS_UNTYPED` of the root `eslint.config.mjs`. Before and after: the same 197 Nx projects, the same targets for the 18, and the same ESLint findings on them in both profiles (104 warnings fast, 107 typed, no error). The `jest.config.*` excludes in the tsconfigs and in `nx.json` stay: they match nothing, and editing them makes most projects affected.

### META-31 — ESLint rule list in `code-style.md`

ClickUp `123kjkdqzvb`. Merged 2026-11-23 (PR #1587, `edc1c5cf`). The "Lint rules" section of `documentation/code-style.md` no longer lists rules: it points to the list in root `CLAUDE.md`, the one copy every Claude session loads, and gives `yarn eslint --print-config <file>`. That list was checked line by line against the effective config: JSDoc is a warning on `function` declarations only, not "required for public APIs"; `no-console` also covers Cypress files; each rule now gives its severity; template rules also reach inline templates, through the `flat/angular` preset of each Angular project.

### META-32 — `guard.sh` hardening

ClickUp `123kjkdr15p`. From the META-21 inventory. Merged 2026-11-27 (PR #1633). The guard checks five mistakes sessions now avoid from memory: PocketBase words inside quoted text (a hung agent), `eco-store:pocketbase:stop`, a commit message commitlint would reject after the whole pre-commit, `git commit -F` from `$TMPDIR` or a relative path, and `git push` or `git commit` piped into another command (allowed with `PIPESTATUS` or `pipefail`). It reads command words, not quoted text or heredocs. `yarn guard:test`: 46 cases in CI, 18 fail on the old guard; replayed over 6,854 Bash commands of 12 sessions.

### META-33 — Claude Code settings for the repo

ClickUp `123kjkdr15q`. From the META-21 inventory. `NX_WORKSPACE_ROOT_PATH=""` and `NX_DEFAULT_OUTPUT_STYLE=static` in `.claude/settings.json`, and sandbox exclusions for `gh`, SSH git, `git worktree` and the Angular builds; the owner weighs each exclusion's security cost. Merged 2026-11-27 (PR #1635), every item approved. Excluded commands still go through the permission prompts, and a call with `cd`, a redirect to a file or a heredoc stays sandboxed.

### META-34 — Worktree bootstrap and per-worktree hooks

ClickUp `123kjkdr15t`. Done 2026-11-24 (PR #1611, `72d34a3b`; follow-up PR #1613, `f44ac365`). Every checkout runs its own `.husky` through a dispatcher that `tools/scripts/worktree-setup.cjs` writes into the shared git folder, and a checkout without `.husky` cannot commit. In a new worktree, `node tools/scripts/worktree-setup.cjs --branch <type>/<task-id>-<words>` also links the ignored PocketBase files, renames the branch and installs packages (with `node`: Yarn runs no script before an install, which the first real run found). On this repository a fresh worktree was ready in 67 s, its first non-Markdown commit took 12 s, and a line only it had in its pre-commit stopped its commit. Two departures from the ticket: no relative `core.hooksPath` (no worktree has `.husky/_`, so git would have run no hook, silently), and `yarn install` instead of linking the main checkout's older `node_modules`.

### META-35 — Long runs survive

ClickUp `123kjkdr15u`. Done 2026-11-24 (PR #1614, `7c510653`). From the META-21 inventory. `worktree-setup.cjs` sets the shared `core.sshCommand` with a keepalive, a second `SessionStart` hook runs `caffeinate -i -w <session pid>` on macOS, and the pre-push test step no longer forwards `--cache`. Evidence: two GitHub push connections left idle 15 minutes, the one without keepalive closed by the remote (exit 255), the other exit 0. The `--cache` premise was half wrong: Nx cached the test either way, and the flag only reached vitest and changed the task hash, so a test run by hand never served the pre-push. Not waited out: the 40-minute idle session; shown instead that the session holds the idle-sleep assertion while it lives, and only sessions started in a checkout that has the hook get it.

### META-36 — `eco-admin:watch-scss`

ClickUp `123kjkdr15v`. From the META-21 inventory. Done 2026-11-27. `yarn eco-admin:serve` now runs the Nx serve target (`eco-admin:serve:app`) next to `eco-admin:watch-scss`, which touches `apps/eco-admin/src/styles/styles.scss` when a partial changes. It watches the app's partials and the style include paths (`libs/eco/styles/src`, `libs/core/styles/util/{material,tailwind4}/src`, the hot-toast styles): only `_base.scss` lives in the app, and a partial from a library was just as stale. Measured on a dev server: an edit to `_base.scss` or `_eco_auth_card.scss` never reached `styles.css` in 30 s without the watcher, and arrived in 4 to 6 s with it. The Nx target `eco-admin:serve`, which the e2e uses, has no watcher.

### META-37 — `pb:sync` needs `POCKETBASE_ENV`

ClickUp `123kjkdr15w`. Merged 2026-11-24 (PR #1605, `45932c0e`). `sync-pocketbase-schema.js` no longer defaults to staging: it accepts only `development` or `staging`, read before `apps/eco-store/.env`, and exits 2 otherwise, before any network call. The deploy workflow now names `staging`; its run on the merge synced staging as before. `yarn pb-sync:test` in CI: 9 checks on a fixture copy, 7 of 7 mutations caught.

### META-38 — Trim the CLAUDE.md files

ClickUp `123kjkdr15x`. Merged 2026-11-24 (PR #1606, `01e83b2d`). Root `CLAUDE.md` 30,821 → 16,068 B and `apps/eco-store/CLAUDE.md` 26,868 → 18,989 B. The ESLint list moved to `documentation/code-style.md`, the inferred targets to `documentation/nx-architecture.md`, the hooks to `POCKETBASE.md` (now all seven) and the Design Context to eco-store.

### META-39 — WCAG 2.2 AA in practice

ClickUp `123kjkdr177`. Done 2026-11-24. The owner set WCAG 2.2 AA for every app (PR #1603), but Pa11y's `WCAG2AA` means 2.1 AA at most, and axe-core's only 2.2 rule is `target-size`. Add the axe runner with that rule to the eco Pa11y configs (measured first, so the pre-push does not start failing), audit the other five new AA criteria by hand on eco-store and eco-admin, file each failure as an A11Y task, and rewrite eco-store's statement, which still claims full 2.1 AA conformance with A11Y-001 open.

The Pa11y half merged (PR #1616, `64b27e76`): both eco configs list each page a second time, as `<url>#axe`, with the axe runner and `target-size` (HTML_CodeSniffer throws on that rule). No page fails it, and the eco-store gate ran 14 of 14 in 25 s. The runs also showed the gate checks only `/botiga`, `/accedir` and `/recuperar-contrasenya` for real: the cart pages redirect with an empty cart and the product page never leaves its loading screen. META-40 takes that on.

The audit of the other five criteria, by code review and in Chrome at 320, 640 and 1280 px, found three failures, each filed and fixed the same day: 2.4.11, a focused control hidden under eco-store's fixed header and mobile bar (A11Y-023, PR #1620, `f3c8f5cb`); 2.5.7, the avatar cropper moved only by dragging (A11Y-024 with A11Y-016, PR #1621, `6a8de02c`); and, outside the five, 1.3.5 on the profile name and phone (A11Y-025, PR #1622, `4585aff6`). 2.5.8, 3.2.6, 3.3.7 and 3.3.8 pass. The new eco-store statement, partially conformant with WCAG 2.2 AA, is a draft outside the repo for the owner to publish; drop each limitation from it once its fix reaches production.

Left open, for the owner or a later task: the hot-toast notifications against 2.4.11 (manual check); the 25-character password `maxLength` against PocketBase's 71 (3.3.8); the lone password field of `/confirmar-correu`; the new-email field's `autocomplete: 'off'`, possibly on purpose (1.3.5); the eco-admin login inputs that Pa11y's axe flags for contrast and axe run directly does not (META-40); the eco-admin shell, which needs 2.4.11 and 2.5.7 checked once `feat/123kjkdp4kw-admin-shell` merges; and `plastikaweb:a11y:run`, which points to a missing `.pa11yci.json` (META-41, ticket pending).

### META-40 — Per-screen a11y suite in Playwright

ClickUp `123kjkdr20r`. Proposed by the owner during META-39. Check each eco screen in the state a user sees it (cart with products, product loaded, signed in, PWA sheet closed) with `@axe-core/playwright` and the WCAG 2.2 tags, PocketBase answered by fixtures, and assertions for the criteria no rule covers. A prototype on three screens Pa11y cannot reach is measured against Pa11y first; if Playwright wins, it replaces Pa11y and the eco Cypress projects, which hold only the generated spec.

The prototype won: on a loaded product page, a cart with a product and eco-admin signed in, Pa11y saw a blank page, an empty cart or `/botiga`, and the login screen, with a different cart URL from run to run; Playwright reached all three, the same in 3 runs of 3, and found the product chips' `aria-required-parent`. The owner chose two PRs.

PR 1 (#1624, `c23c909d`) adds `apps/eco-a11y-e2e`, next to Pa11y and run by no hook or CI job: 11 screens (the Pa11y pages, a product with a cart, the delivery step and the profile signed in, eco-admin signed in, the PWA install sheet) at 320 px light, 320 px dark and 1280 px, 33 tests in about two minutes, green in 5 runs in a row once it waits for the icon font. Beyond axe with every 2.2 AA rule it checks 2.4.11 with Tab, 3.3.8 on both sign-in screens, 1.3.5 on the profile and 3.3.7 on the delivery step. Its first run found what Pa11y let through, listed in the specs as known violations until their tasks exist (owner to approve): dark-mode text on fixed palette shades at 1.2 to 1.4:1, the terms note at 3.8:1 (1.4.3); the desktop header buttons and the rating link (2.5.3); the product chips (1.3.1). It does not find the eco-admin login contrast that Pa11y's axe reported (META-39 open point), in light or dark.

PR 2 had Cypress leave both eco apps, but `eco-admin-e2e` holds more than the generated spec: a real spec and `cy.loginAs` (AP-0 0.7), and eco-admin `REQUIREMENTS.md` §6 asks for Cypress for AMBR-07 and AORD-03. PR 2 moves the pre-push and the two Pa11y workflows to the suite and drops Pa11y and the generated `eco-store-e2e`; eco-admin's Cypress stays unless the owner changes §6. PR 2 merged (#1625, `a267bc51`).

The owner then changed §6 (eco-admin REQUIREMENTS 0.4.51, TASKS 0.1.155). PR 3 moves `eco-admin-e2e` to Playwright: `cy.loginAs` becomes the `signedInAs` option, still bound to the local PocketBase, and the target is not cached. Its only spec had failed since AP-0 0.7b removed the login field ids it looked for; it now finds them by name. No eco app uses Cypress. PR 3 merged (#1626, `0c263362`); META-40 done on 2026-11-24.

Its findings are eco-store tasks A11Y-026 to A11Y-029 (BACKLOG 7.58 to 7.61), and each known violation in the spec names its task. The first `eco-a11y.yml` run failed before the suite started: the eco-store production build timed out prerendering `/recuperar-contrasenya`, as `ci.yml` had on `/accedir` the day before; the next run passed in 3m20s.

### META-41 — `plastikaweb:a11y` has no config

ClickUp `123kjkdr4vz`. Found during META-40: `yarn plastikaweb:a11y` runs Pa11y with `apps/plastikaweb/.pa11yci.json`, which does not exist, so it fails before checking anything. Write the config, move plastikaweb to a Playwright and axe check, or remove the script; the docs follow. Merged 2026-11-27 (PR #1634): the owner chose removal; `plastikaweb:http-server` stays.

---

## 📝 Changelog

| Version | Date | Notes |
| --- | --- | --- |
| 1.25 | 2026-11-27 | **META-08** (`123kjkdpqjr`) — META-32 ✅ (#1633), META-33 ✅ (#1635), META-36 ✅ (#1632), META-41 ✅ (#1634). META-24 ✅ redefined as a portable setup playbook and delivered to NewWebSite. META-06: Phase 2 table refreshed, two owner rulings. |
| 1.24 | 2026-11-25 | **META-08** (`123kjkdpqjr`) — META-40 ✅ (PRs #1624, #1625, #1626); its findings filed as eco-store A11Y-026 to A11Y-029. New **META-41** (`123kjkdr4vz`): `plastikaweb:a11y` has no config. |
| 1.23 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-40 🔄: PRs 1 and 2 merged; PR 3 moves eco-admin's e2e from Cypress to Playwright after the owner changed eco-admin REQUIREMENTS §6. |
| 1.22 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-40 🔄: PR 1 adds the Playwright and axe suite of the eco apps next to Pa11y; its findings and the change to PR 2 (eco-admin keeps Cypress) are in its section. |
| 1.21 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-39 ✅: the manual audit of WCAG 2.2's new AA criteria found three failures, fixed by A11Y-023 (PR #1620), A11Y-024 with A11Y-016 (PR #1621) and A11Y-025 (PR #1622); the points it left open are listed in its section. |
| 1.20 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-35 ✅ (PR #1614, `7c510653`): SSH keepalive, `caffeinate` while a session runs, no forwarded `--cache` in the pre-push. META-39 🔄 (PR #1616, `64b27e76`): Pa11y checks `target-size`. META-40 📋 joins: a per-screen Playwright suite to replace Pa11y in the eco apps. |
| 1.19 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-34 ✅ (PR #1611, `72d34a3b`, and PR #1613, `f44ac365`): every checkout runs its own git hooks, and a new worktree is ready to commit with one command. META-35 🔄 (PR #1614). |
| 1.18 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-23 ✅ (PR #1610, `4176c74a`): the `task-audit` skill, which found three of the five issues of the PR #1558 replay. META-24 goes from ⛔ to 📋, its last blocker merged. META-34 🔄 (PR #1611). |
| 1.17 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-22 ✅ (PR #1608, `38b05d14`): a commit-msg check for the ClickUp ID, the task ID and the CHANGELOG bullet, and a form-field eval that passed 5/5 on a case it cannot fail. META-23 🔄. |
| 1.16 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-37 ✅ (PR #1605, `45932c0e`): `pb:sync` needs `POCKETBASE_ENV`. META-38 ✅ (PR #1606, `01e83b2d`): the two `CLAUDE.md` files trimmed. META-22 🔄, unblocked. |
| 1.15 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-21 ✅ (PR #1602, `1d6e56b3`, and PR #1603, `04b9efc8`): memory pruned, the Claude docs' errors fixed, WCAG 2.2 AA as the target. Seven tickets from its inventory join as META-32…38 (A11Y-022 went to the eco-store docs), and META-39 makes Pa11y and an audit follow the 2.2 target. META-22 now waits on META-38, the `CLAUDE.md` trims. |
| 1.14 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-20 ✅ (PR #1599, `bfcb7fbc`, and PR #1600, `9721cac1`): the generated feature map with its CI check, and the `eco-page-check` skill with headless Playwright and its acceptance run; META-22 stays ⛔ on META-21. |
| 1.13 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-19 ✅ (PR #1597, `ef076441`): the `eco-lib` generator with the eco-admin naming scheme, its acceptance run and tests; META-24 stays ⛔, now on META-23 alone. |
| 1.12 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-15 ✅ (PR #1595, `8ab386de`): `check-eco-conventions` in the pre-commit and as a failing CI check, with its tests, and allow markers on the four eco-admin hex; META-23 goes from ⛔ to 📋, its three blockers merged. |
| 1.11 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-18 ✅ (PR #1593, `2aca478a`): `lint-delta` in the pre-push and as a failing CI check, with its tests and measurements. |
| 1.10 | 2026-11-24 | **META-08** (`123kjkdpqjr`) — META-17 ✅ (PR #1591, `86654500`): the Angular rules at error with their sweep, NG1053 at lint time, the `*.html` block without class rules; META-18 records the owner's choice to keep the naming warnings as warnings. |
| 1.9 | 2026-11-23 | **META-08** (`123kjkdpqjr`) — META-16 ✅ (PR #1589, `a3eebc0b`): `check-nx-tags` in the pre-push and CI, its tests, and the four libs that failed fixed; it went from 📋 to ✅ without an in-progress row. |
| 1.8 | 2026-11-23 | **META-08** (`123kjkdpqjr`) — META-31 ✅ (PR #1587, `edc1c5cf`): `code-style.md` points to the `CLAUDE.md` rule list, now checked against the config; META-17 gains the 9 Angular class rules that never run. |
| 1.7 | 2026-11-23 | **META-08** (`123kjkdpqjr`) — META-29 ✅ (PR #1585, `483c622c`), with the selector fix, its scope (class fields only) and the `lint:profiles` check. |
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
