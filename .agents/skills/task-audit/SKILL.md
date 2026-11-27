---
name: task-audit
description: Use when a task branch is finished and about to become a PR, and it is feature-sized (10 or more touched code files: `.ts`, `.html`, `.scss`, `public/i18n/*.json`). Runs the repo's checks once, then up to three read-only review lenses (code, accessibility, PocketBase and tenants) and one triaged report. Not for one-file fixes, docs-only or tooling-only branches; review those inline. Not the impeccable `audit` skill (design).
metadata:
  version: '1.0'
  origin: NewWebSite task-audit 2.0, cut from eight lenses to three (META-23)
---

# Task audit: review of a finished branch before its PR

Audits only what the branch touched. Principle: **tools prove, agents interpret.** Everything with a yes-or-no answer runs as a script first (Step 0.5); the lens agents get those results as facts and spend their tokens on judgement. The audit ends with findings triaged by the user, approved fixes committed and the checks green.

Measured on the PR #1558 branch (META-23, root `TASKS.md`): what it found, what it missed and what it cost. Do not run it on small branches: three agents each load the repo's instructions again.

In a worktree, `unset NX_WORKSPACE_ROOT_PATH` before any `yarn nx` command, or Nx reads the main checkout. Nx writes a lock file and its cache, so `yarn nx` runs outside the Bash sandbox.

## Step 0: scope

```sh
BASE=$(git merge-base HEAD origin/develop)
yarn lint:delta --scope-only --base "$BASE"
```

`--scope-only` lists the touched files (commits since the base, staged, unstaged and untracked; deleted files dropped) under `ts`, `html`, `scss`, `i18n`, `docs` and `other`. Deleted files are not reviewed, but what they leave behind is (unused i18n keys, docs that still name them).

- **Stacked branch** (its base is another open PR): use the parent's tip, `BASE=$(git rev-parse <parent-branch>)`, and say so. The parent's code is the parent PR's job.
- **Fewer than 10 code files** (`ts` + `html` + `scss` + `i18n`): stop and review inline.

Before dispatching anything, show the user the base, the file count per group and the lenses that will run or be skipped (Step 1), with the reason for each.

## Step 0.5: checks (main thread, once)

Run each check whose condition holds and keep its output: it goes to the lenses verbatim.

| Check                                                                                             | Command                                                                              | Runs when                                          |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Nx tags (every library has `scope:*` and `type:*`)                                                | `yarn nx-tags:check`                                                                 | always (under a second)                            |
| ESLint errors over the affected projects, module boundaries included                              | `yarn nx affected -t lint --base="$BASE" --output-style=static`                      | `ts` or `html` not empty                           |
| ESLint warnings that grew in touched files                                                        | `yarn lint:delta --base "$BASE"`                                                     | `ts` or `html` not empty                           |
| Eco templates and styles (bare form control, raw hex, `--mat-sys-*` declared, `::ng-deep` listed) | `node tools/scripts/check-eco-conventions.cjs --files <touched eco .ts/.html/.scss>` | a touched file under `apps/eco-*` or `libs/eco*`   |
| i18n keys used in templates and `instant()`                                                       | `yarn i18n:validate`                                                                 | `ts`, `html` or `i18n` not empty                   |
| Task docs                                                                                         | `yarn tasks:check`                                                                   | a `TASKS`, `BACKLOG` or `REQUIREMENTS` doc touched |
| Markdown                                                                                          | `npx markdownlint-cli2 <touched .md>`                                                | `docs` not empty                                   |

What these report is settled: the lenses do not check it again and do not restate the rules behind it (`documentation/code-style.md` «Lint rules» lists ESLint's). Every failure is already a finding; carry it into the report with the tool's severity.

**What the checks do not see** (the lenses do): a hand-written reactive form or `<mat-select>` (check-eco-conventions only catches bare `<input>`, `<select>` and `<textarea>`), Formly labels and option labels (`i18n:validate` reads the `translate` pipe and `instant()` only, and does not compare the language files), the type-aware ESLint rules (CI only), and anything Pa11y would report on the built page.

## Step 1: dispatch the lenses in parallel

One message, one `audit-lens` agent (`.claude/agents/audit-lens.md`: read-only, Sonnet, medium effort) per lens that applies. Skip the others and say why.

| Lens                                                       | File                   | Dispatch when                                                                                                                                                                    |
| ---------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code: Angular, TypeScript, forms, layering                 | `lenses/code.md`       | `ts` not empty                                                                                                                                                                   |
| Accessibility: WCAG 2.2 AA beyond the lint and Pa11y       | `lenses/a11y.md`       | `html` not empty, or a touched `.ts` has an inline `template:`                                                                                                                   |
| PocketBase and tenants: API rules, tenant isolation, hooks | `lenses/pocketbase.md` | a touched file under `apps/eco-store/pocketbase/`, under an eco `data-access` or `api` library, or one that calls `pb.collection(`, `pb.filter(` or builds a PocketBase `filter` |

A lens report that comes back thin on a branch with depth gets one second run with `model: "opus"`; do not raise the effort instead. A rule an agent missed that a script could check belongs in a script (META-15…18), not in a longer lens.

Every agent gets this prompt, brackets filled and nothing else:

> Repository: `<absolute repo path>`. Base commit: `<BASE>`. Work off the working tree: uncommitted changes are in scope.
> Read `<this skill's folder, as an absolute path>/lenses/<lens>.md` first and follow it exactly.
> Files in your scope: `<the files of this lens>`.
> Facts the checks already established (input, not something to re-check): `<the Step 0.5 output this lens needs, or "none">`.
> Report contract: return ONLY this:
>
> ```text
> ## <lens> — <N> findings (high <x> / med <y> / low <z>)
> - `path/file.ext:LINE` — high|med|low — <issue, one sentence> — fix: <one or two concrete sentences>
> …
> Unverified: <`file:line` items you could not confirm in the code, or "none">
> ```
>
> Verify every claim at its `file:line` before reporting it. Do not restate rules ESLint or the checks enforce. Prefer fewer, confirmed findings.

When the fan-out runs as a workflow, pass `agentType: 'audit-lens'`, and work from the value each agent returns, never from its transcript.

**Severity** (agents and triage use the same scale):

| Severity | Means                                                                                                                                                                                                                                                                                                      |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| high     | A defect or regression users see; a silent no-op (a key that renders raw, a field type not registered); an a11y blocker (keyboard trap, unnamed control, lost focus); data of one tenant reachable from another, or an API rule that lets a user act beyond their role; a doc that lies about a public API |
| med      | A convention broken at a maintenance cost (hand-written control or style where a shared or Material one exists, wrong library, duplicated logic, missing spec for real logic); an a11y degradation (a state not announced); an API rule broader than it needs                                              |
| low      | Naming, ordering, small simplifications                                                                                                                                                                                                                                                                    |

A finding is identified by `file:line`: two lenses reporting the same one are one finding.

## Step 2: triage (main thread, no fixes yet)

1. Merge the Step 0.5 failures and every lens report; deduplicate by `file:line`, keeping the higher severity.
2. Re-verify every high and med finding at its `file:line` yourself: agents overclaim. Drop or downgrade what does not hold in the code. A finding that applies a rule of its lens file keeps its severity when the code matches: general knowledge does not overrule a repo rule (on PR #1558, triage dropped a correct `autocomplete` finding that way).
3. Present ONE report, grouped by file: severity, lens, `file:line`, issue, proposed fix, and fix or skip as your recommendation.
4. Wait for the user's triage. Touch no code before it.

## Step 3: apply the approved fixes

- Few coherent commits, never one per tweak. A change to a shared library's public API, or a moved file, needs an explicit go-ahead beyond the triage.
- Then the checks again: `yarn nx affected -t lint,test,build --base="$BASE" --output-style=static`, `yarn lint:delta`, `yarn i18n:validate`, `yarn format:check`, and check-eco-conventions on the touched eco files.

## Step 4: hand off

Commits go through `commitizen-git-flow` (its commit-msg check wants the ClickUp ID, the task ID on eco code and the CHANGELOG bullet). The audit is done when the findings are triaged, the approved fixes committed, the checks green and the user has the summary.

## Red flags: stop and correct

- A lens dispatched with an empty scope, "just in case".
- A lens report that restates ESLint rules or re-checks Step 0.5: send it back with the facts.
- A finding without `file:line`, or a fix naming a token, type or API you have not seen exist.
- Code edited before the user's triage.
- Findings in files the branch did not touch.
