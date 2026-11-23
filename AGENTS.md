<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/dist/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Plastikspace

Personal Nx monorepo (Angular 21, Tailwind 4, NgRx Signal Store) with 4 apps + e2e + ~130 libs.

## Quick Reference

**Package manager:** Yarn 4 (Berry). Always prefix nx commands with `yarn` (e.g. `yarn nx test <project>`).
**Node:** 22 (`.nvmrc`). **Default branch:** `develop` (`nx.json` `defaultBase`).
**Setup:** `npm install -g rimraf` once globally, then `node tools/scripts/setup-local.js`.

## Core Conventions (ESLint-enforced)

- Standalone components only (don't set `standalone: true`, it's default). `ChangeDetectionStrategy.OnPush`.
- Use `input()`/`output()` functions, not decorators. Use `inject()`, not constructor DI.
- Signals with `set`/`update`, never `mutate`. Use `computed()` for derived state.
- Native control flow: `@if`, `@for`, `@switch` (no `*ngIf`/`*ngFor`/`*ngSwitch`).
- No `ngClass`/`ngStyle` — use `[class]`/`[style]` bindings.
- No `@HostBinding`/`@HostListener` — use `host` object in decorator.
- Private fields: ES6 `#fieldName`, not TS `private`.
- Module boundaries enforced via `@nx/enforce-module-boundaries` — apps depend on feature/ui/util/data-access/entity; core depends on core/shared/entity/util; shared depends on shared/entity/util only.

## Apps

| App             | Backend                          | Local Command                                                   |
| --------------- | -------------------------------- | --------------------------------------------------------------- |
| **llecoop**     | Firebase (Firestore + Functions) | `yarn llecoop:local` (starts emulators + app)                   |
| **eco-store**   | PocketBase                       | `yarn eco-store:local` (starts PocketBase + app + SCSS watcher) |
| **nasa-images** | NASA public API                  | `yarn nasa-images:serve`                                        |
| **plastikaweb** | GraphQL (Apollo)                 | `yarn plastikaweb:serve`                                        |

## Common Commands

```bash
# Test specific project
yarn nx test <project>                              # e.g. yarn nx test eco-store
yarn nx test <project> <path> --passWithNoTests=false # single file, path relative to the project root
yarn nx test <project> --testNamePattern="<pattern>"  # by test name
yarn nx test <project> --watch                        # watch mode

# Test all / affected
yarn test:all                                        # run-many --all with coverage
yarn affected:test                                   # affected vs develop

# Lint
yarn nx lint <project>
yarn lint:all
yarn lint:ci                                         # affected projects with the type-aware rules, as CI

# Build
yarn nx build <project>
yarn <app>:build:github                              # production build for CI

# E2E (Cypress)
yarn <app>:e2e                                       # headless
yarn <app>:e2e:local                                 # interactive + watch

# Accessibility (Pa11y)
yarn <app>:a11y                                      # builds, serves, runs pa11y-ci

# Formatting
yarn format:write
yarn format:check

# i18n
yarn i18n:validate
yarn i18n:test

# Code generation
yarn plastikaweb:codegen                             # GraphQL types
```

## After Generating a Library

`lint` and `test` are inferred by `@nx/eslint/plugin` and `@nx/vitest` (Nx 24), so the generated `project.json` has `"targets": {}`.
Do not add them by hand. Coverage goes to the `reportsDirectory` in the project's `vite.config.mts`.
Check the resolved targets with `nx show project <name>`.
In its `vite.config.mts`, call `angular({ tsconfig: 'tsconfig.spec.json' })` like every other config, or building the graph prints «Unable to resolve tsconfig».

## PocketBase Schema Workflow (eco-store)

Every worktree shares the PocketBase on :8090, so its schema can hold edits made for another branch.
The pre-commit exports it on every commit that is not Markdown-only. When the export differs from the staged schema,
it stages `pb_schema.json` only if the commit already stages eco code (files under `apps/eco-*` or `libs/eco*`, Markdown aside), once every other check has passed.
Any other commit keeps the file as it was, with a warning, and so does a commit that names its paths (`git commit <paths>`).
A `pb_schema.json` you staged yourself is kept and not exported; staged without eco code, it needs `ALLOW_SCHEMA_ONLY=1 git commit ...`.
A merge (a squash merge too), cherry-pick, revert or rebase in progress skips the export.
A squash still needs eco code or `ALLOW_SCHEMA_ONLY=1` for a staged schema: git cannot tell one in progress from the `SQUASH_MSG` an abandoned squash leaves, and the hook says how to recover.
Next to a real merge or cherry-pick, git puts that `SQUASH_MSG` in the commit message (a cherry-pick then fails commitlint): the hook names the file, and deleting it fixes the message.
A commit that stops after the pre-commit (commitlint, an empty message) leaves the export staged, or only on disk after `git commit -a`.
The next commit unstages it and decides again, or keeps it when nothing else is staged or `ALLOW_SCHEMA_ONLY=1` is set; an export left only on disk is put back.
The hook knows its own export by a record that `.husky/post-commit` deletes once a commit lands with it.

Manual workflow:

1. Make changes in PocketBase Admin UI (`http://localhost:8090/_/`)
2. `yarn eco-store:pb:export` — exports to `apps/eco-store/pocketbase/pb_schema.json`
3. `yarn eco-store:pb:diff` — review changes
4. Commit schema with code changes

On every PR into develop that changes `pb_schema.json`, `.github/workflows/pb-schema-guard.yml` posts a per-collection summary.
It fails when no eco code changes (Markdown does not count), or when a collection or field disappears, unless the PR has the `pb-schema` label.
The staging sync drops a removed field with its data; it never deletes a collection, so a removed one stays on staging.
Like the sync, the check finds a collection by id or else by name, so a collection whose id changed under the same name is no removal.
View fields are matched by name, because their `_clone_` ids change each time the view is saved.
The label covers the schema of the head it was added at, which the workflow records in a comment of its bot.
Any later run whose schema differs from that head's, as the check reads it, removes the label, even when the check passes; add it again once the new summary is reviewed.
A record written before the label's latest addition (that run was dropped, or could not write) does not count,
and neither does a label with no record (added before the workflow kept one): remove it and add it again.
A re-run of an older run stops once the pull request's head has moved on (push, or remove and add the label); at the same head it takes the labels the pull request has now.

## Pre-commit Hook (`.husky/pre-commit`)

Checks the **staged** content only; nothing unstaged enters the commit. Runs in order:

1. Task-docs guard, then `tasks:check` when a task doc is staged.
2. PocketBase schema export (see above): reuses a PocketBase already on :8090, otherwise starts and stops its own.
3. branch-lint and i18n:validate.
4. `nx show projects` when TypeScript under `apps/` or `libs/` is staged: ESLint's module-boundaries rule reads the cached Nx graph and skips itself without one.
5. `lint-staged` (`lint-staged.config.mjs`): ESLint `--fix` (problem and layout fixes only), markdownlint and Prettier on the staged files.
6. Stages the exported `pb_schema.json` when step 2 decided to.

`.husky/post-commit` only deletes the pre-commit's record of that export once the commit lands.
`tasks:check` and i18n:validate run on a copy of the index, so they read the content being committed.
Untracked files are never added: the hook lists them after the commit, and the pre-push warns about them.
Markdown-only commits skip the export and i18n. The affected lint over whole projects runs in CI, not in the hooks; pre-push keeps the Nx tags check, format check, affected test, build and a11y.
ESLint in the hooks builds no TypeScript program, so the rules that need one (`no-deprecated`, `prefer-readonly`, the boolean `naming-convention` selector) only report in CI or with `yarn lint:ci` (META-13).
`cypress/unsafe-to-chain-command` also flags chains that start at a helper function only there.
A worktree on a branch older than META-12 has neither lint-staged nor `lint-staged.config.mjs`; the hook then uses those of the main checkout.

While a commit runs, lint-staged keeps a `lint-staged automatic backup` entry on the stash, which every worktree shares.
Apply an entry by its SHA (`git stash apply <sha>`), never with `pop`: the `stash@{n}` numbers shift while any checkout is committing.
`git stash drop` takes no SHA, so find the entry's current `stash@{n}` right before dropping it: `git stash list --format='%gd %H'`.

**Do not bypass.** If the PocketBase binary isn't available, the hook may fail — install it via `yarn eco-store:pb:download`.

## CI Strategy

- **PR:** `nx affected --target=test` (fast feedback)
- **Push to develop:** `nx run-many --target=test --all` (full validation + coverage badge)
- **Format check** runs first, then lint → test → build (in that order)
- **Lint** runs with `ESLINT_TYPED=1`, the profile with the rules that need type information (META-13)
- Before it, `yarn lint:profiles` lints a fixture with both ESLint profiles and checks every ESLint config in the fast one
- **llecoop-firebase** excluded from lint/test/build (handled separately)
- Nx Cloud for caching; CI falls back to local cache if unavailable
- Coverage badge updates from `coverage/**/coverage-summary.json` on push to develop

## Commits

- Conventional commits via Commitizen: `yarn cz` (or `yarn nx cz`)
- Format: `<type>(<scope>): <subject>`
- Branch naming: `<type>/<description>` (banned: `wip`, `master`, `main`, `develop`, `staging`)
- Use the `commitizen-git-flow` skill for commit guidance
