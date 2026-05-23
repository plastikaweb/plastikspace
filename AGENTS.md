<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
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
yarn nx test <project> --testFile=<path>              # single file
yarn nx test <project> --testNamePattern="<pattern>"  # by test name
yarn nx test <project> --watch                        # watch mode

# Test all / affected
yarn test:all                                        # run-many --all with coverage
yarn affected:test                                   # affected vs develop

# Lint
yarn nx lint <project>
yarn lint:all

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

Remove `outputs` and `reportsDirectory` from the `test` target in the generated `project.json`.
Coverage paths are managed globally via `nx.json` — the generator adds lib-relative paths that are wrong.
The test target should be just:

```json
"test": { "executor": "@nx/vitest:test" }
```

## PocketBase Schema Workflow (eco-store)

Pre-commit hook auto-exports schema. Manual workflow:

1. Make changes in PocketBase Admin UI (`http://localhost:8090/_/`)
2. `yarn eco-store:pb:export` — exports to `apps/eco-store/pocketbase/pb_schema.json`
3. `yarn eco-store:pb:diff` — review changes
4. Commit schema with code changes

## Pre-commit Hook (`.husky/pre-commit`)

Runs in order: PocketBase schema export → branch-lint → i18n:validate → lint affected → markdownlint → format:write.
**Do not bypass.** If the PocketBase binary isn't available, the hook may fail — install it via `yarn eco-store:pb:download`.

## CI Strategy

- **PR:** `nx affected --target=test` (fast feedback)
- **Push to develop:** `nx run-many --target=test --all` (full validation + coverage badge)
- **Format check** runs first, then lint → test → build (in that order)
- **llecoop-firebase** excluded from lint/test/build (handled separately)
- Nx Cloud for caching; CI falls back to local cache if unavailable
- Coverage badge updates from `coverage/**/coverage-summary.json` on push to develop

## Commits

- Conventional commits via Commitizen: `yarn cz` (or `yarn nx cz`)
- Format: `<type>(<scope>): <subject>`
- Branch naming: `<type>/<description>` (banned: `wip`, `master`, `main`, `develop`, `staging`)
- Use the `commitizen-git-flow` skill for commit guidance
