# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/dist/PLUGIN.md` (Nx's generated agent rules say `node_modules/@nx/<plugin>/PLUGIN.md`, which does not exist). Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## Repository Overview

Plastikspace is a personal Nx monorepo: Angular 21 apps over Firebase, PocketBase and HTTP or GraphQL backends (apps under [Applications](#applications); `yarn nx show projects` lists every project). ESLint module constraints enforce strict architectural boundaries. Read versions in `package.json`, never from memory.

- **Repository**: <https://github.com/plastikaweb/plastikspace>. **Main branch**: `develop`, also Nx's `defaultBase` (many tools assume `main`; this workspace does not). **Package manager**: Yarn 4; one-time setup in `README.md`.
- Working in `apps/eco-store/` or `libs/eco-store/*`: read `apps/eco-store/CLAUDE.md` alongside this file.

### Where things actually live

- Nx config and cache: `nx.json`, cache in `tmp/my-cache`
- Path aliases (200+): `tsconfig.base.json`. Import across libraries only through them (`@plastik/core/util/api-http`), never by relative path; each library exports through its `index.ts`
- ESLint: the root `eslint.config.mjs` holds the boundary rules and every code rule; each project's `eslint.config.mjs` spreads it (the five Cypress e2e configs after `cypress.configs.recommended`)
- Workspace scripts and their tests: `tools/scripts/` (task docs, i18n, feature map, PocketBase helpers, local setup); `decorate-angular-cli.cjs` runs on `postinstall`
- Eco page map (URL → lib, access): `tools/feature-map.json`, generated from the routes (`yarn feature-map`); CI fails when it is stale
- Branch-name rules: `branchNameLint.json`. Commit scopes: `.cz-config.cjs`, loaded from `tsconfig.base.json`
- MCP servers of the repo: `.mcp.json` (pocketbase, playwright)
- Long-form docs: `documentation/` (nx-architecture, code-style, accessibility, css-styles, commit-conventions, git-flow, i18n)
- eco-store PocketBase schema and hooks: `apps/eco-store/pocketbase/`. llecoop's Firebase emulator data: gitignored under `apps/llecoop-firebase/`

## Common Commands

```bash
yarn <app>:serve                      # dev server (eco-store with its backend: apps/eco-store/CLAUDE.md "Local dev")
yarn nx test <project>                # unit tests of one project
yarn nx test <project> <file> --passWithNoTests=false   # one spec file, path relative to the project root
yarn nx test <project> --testNamePattern="<pattern>"     # tests by name
yarn affected:test                    # affected projects vs develop
yarn nx lint <project>                # fast lint profile, as hooks and editors run it
yarn lint:ci                          # affected projects with the type-aware rules, as CI runs them
yarn <app>:a11y                       # build, serve and run Pa11y
yarn i18n:validate                    # translation keys consistent across languages (pre-commit and CI)
yarn format:check
yarn plastikaweb:codegen              # plastikaweb GraphQL types
POCKETBASE_ENV=development yarn eco-store:pb:sync   # push pb_schema.json to the local PocketBase (staging: POCKETBASE_ENV=staging; none: refused)
```

`vitest run` runs in the project root, so a spec path from the repo root matches nothing, and the workspace's `passWithNoTests` would report that as a pass: keep `--passWithNoTests=false`. `package.json` and AGENTS.md "Common Commands" have the rest.

## Applications

- **eco-store** (Angular 21, PocketBase): multi-tenant storefront for consumer cooperatives.
- **eco-admin** (Angular 21, PocketBase): its admin panel (AP-0 scaffold). It shares the eco-store PocketBase and its `users` auth collection; a CSR SPA (no SSR) served from its own origin. Docs: `apps/eco-admin/{REQUIREMENTS,TASKS,DESIGN-BRIEF,DESIGN-REVIEWS}.md`.
- **nasa-images** (Angular 21, NASA API): image gallery with search.
- **plastikaweb** (Angular 21, GraphQL with Apollo): personal portfolio, a static site.
- **llecoop** (Angular 21, Firebase), with **llecoop-firebase** and **llecoop-triggers** (Firebase Functions): discontinued, kept only as Firebase reference code. Keep it compiling and green, with no visual checks.

Read one task from the eco task docs (eco-store, eco-admin TASKS and REQUIREMENTS, `libs/eco`) with `yarn task <ID>`, never the whole file: eco-admin TASKS is over 200 KB.

## Library Architecture

Libraries are organized by **scope** (domain) and **type** (layer); `documentation/nx-architecture.md` has the long form.

### Scopes

- **core**: foundation libraries used across all apps
- **shared**: cross-app reusable features and utilities
- **product-family**: domain code shared by the apps of one product and by no other app. Only `eco` (`libs/eco/*`), the eco platform domain layer of `eco-store` and `eco-admin`
- **app-specific**: libraries of one app (`llecoop/`, `eco-store/`, `eco-admin/`, `nasa-images/`, `plastikaweb/`)

### Types

- **feature**: smart components implementing use cases (services, state)
- **data-access**: API services, state, backend communication
- **ui**: presentational components (inputs in, outputs out)
- **util**: pure functions and helpers
- **entity**: type definitions and entity-related utilities
- **app**: the applications in `/apps`

Key core libraries: `api-base` (the interfaces every API service implements), `api-http`, `api-firebase` and `api-pocketbase` (CRUD per backend, in `libs/core/util/`); the NgRx Signal Store features per backend in `libs/shared/signal-state/`; auth features and data access in `libs/shared/auth/`.

### Module Boundaries (ESLint Enforced)

`@nx/enforce-module-boundaries` in the root `eslint.config.mjs`:

- **By type**: apps → feature, ui, util, data-access, entity, and anything in `scope:core` or `scope:shared`; feature → ui, util, data-access, entity, feature; ui → ui, util, entity; data-access → data-access, util, entity; util → util, entity; entity → entity, util.
- **By scope**: `scope:core` → core, shared and any `type:util` or `type:entity`; `scope:shared` → shared and any `type:util` or `type:entity`; `scope:eco` → eco, core, shared; an app scope → itself, core, shared. `scope:eco-store` and `scope:eco-admin` may also use `scope:eco`; no other app scope may, and the two never import each other.
- No circular dependencies.

Every library carries **both** a `scope:*` and a `type:*` tag: the rules are ANDed, and a library with a scope alone cannot be imported by any app. `yarn nx-tags:check` enforces it on every `libs/**/project.json` (first step of the pre-push and of CI's Lint Affected step).

### Code Quality Rules (ESLint)

ESLint reports each rule at its line (lint-staged in the pre-commit, the Stop hook, the editor); `documentation/code-style.md` "Lint rules" lists them all with severity and scope. What to know before writing:

- **Private fields**: `#field`, never the TypeScript `private` modifier (an error). Fields set by `input()`, `model()`, `output()` or `outputFromObservable()` can be neither (the Angular compiler rejects `#`, NG1053), and a signal query may keep `private`. Private methods and constructor parameter properties keep `private`.
- **No `console`** outside `*.spec.*`.
- **JSDoc**: a description starts with a capital letter and contains a period (an error); a `function` declaration needs a block, and a block's `@param`/`@returns` need their `{type}` (warnings).
- **Angular** (META-17, errors): signal inputs and queries, `readonly` on every signal property, `inject()`, `output()`, native control flow, `type` on every `<button>`; no `standalone: true`, `@HostBinding`/`@HostListener` or `NgClass`/`NgStyle`.
- **Warnings may not grow** (META-18): `yarn lint:delta` fails when a file the branch touches has more ESLint warnings than at the merge base (pre-push and CI).
- **Type-aware rules run in CI only** (META-13): `prefer-readonly` (an error), `no-deprecated` and the boolean-prefix naming rule (warnings). `yarn lint:ci` runs them locally. A TypeScript file that no tsconfig includes fails the CI lint ("was not found by the project service"): add it to a tsconfig, or to `TS_DEFAULT_PROJECT` in the root `eslint.config.mjs`.
- **Warnings**: vague names (`data`, `info`, `temp`, `val`, `item`…), booleans without `is`/`has`/`can`/`should`/`will`, no blank line before a `return`.

## Testing

- **Vitest**: `vitest run`, inferred per project (`documentation/nx-architecture.md`, "Inferred `lint` and `test` targets"); setup in each project's `src/test-setup.ts`.
- **i18n**: ngx-translate; `yarn i18n:validate` (`tools/scripts/validate-i18n-keys.cjs`) checks that every language file has the same keys.

### Cypress (E2E Tests)

`yarn <app-name>:e2e` runs an app's Cypress suite (every app but the Firebase ones has an `-e2e` project). No hook or CI job runs them and they are no acceptance check, so do not run them to verify a change. New e2e tests will use Playwright.

### Pa11y (Accessibility Tests)

`yarn <app-name>:a11y` builds the app, serves it and runs Pa11y with the app's `.pa11yci.json`. Every app targets **WCAG 2.2 AA** (owner, 2026-11-24). Pa11y checks less: its `WCAG2AA` standard means 2.1 AA at most in both its runners, and axe-core's only 2.2 rule is `target-size`. Check what 2.2 adds by hand: 2.4.11 focus not obscured, 2.5.7 dragging, 2.5.8 target size, 3.2.6 consistent help, 3.3.7 redundant entry, 3.3.8 accessible authentication.

## Angular & TypeScript Conventions

The canonical Angular and TypeScript rules live in [`.claude/CLAUDE.md`](.claude/CLAUDE.md). What goes beyond them:

### Routing

- Lazy-load feature routes, from a `*.routes.ts` entry point per feature or scope.
- `providedIn: 'root'` for global services; component-specific services in the component's `providers`.
- Guards are functional (`CanActivateFn`) and run before resolvers: never rely on resolver data in a guard of the same route.

### RxJS / Signal Interop

- `toSignal(obs$, { initialValue: ... })` for templates (no `undefined` in strict templates); `toObservable()` back into RxJS pipelines.
- `takeUntilDestroyed()` (from `@angular/core/rxjs-interop`) instead of a manual `ngOnDestroy` unsubscription.

### Naming and Generating Libraries

- **Eco libraries** (`libs/eco-store`, `libs/eco-admin`, `libs/eco`): `yarn eco-lib` (META-19) asks for app, domain, type and name, and writes the names, tags, alias and configs; its scheme is in `tools/generators/eco-lib/generator.cjs`. The alias edits `tsconfig.base.json`, which makes every project affected: one new library per small PR.
- **Other libraries**: `yarn nx g @nx/angular:lib libs/<scope>/<type>/<name> --tags=scope:<scope>,type:<type>`, the main file named after the full path (`booking-feature-destination.component.ts`); then match `eslint.config.mjs` and `vite.config.mts` to a sibling library.
- `lint` and `test` are inferred from `eslint.config.mjs` and `vite.config.mts`: never add those targets to a `project.json`, and keep `angular({ tsconfig: 'tsconfig.spec.json' })` in a new `vite.config.mts`. Why, and what else the plugins infer: `documentation/nx-architecture.md`.

## Styling

- Tailwind CSS 4, Angular Material 21 and SCSS; the theme in `libs/core/styles`, PostCSS in `.postcssrc.json`; conventions in `documentation/css-styles.md`.
- **Eco conventions** (META-15): `yarn eco-conventions:check` (pre-commit on staged eco files, and CI) reads the templates and styles of `libs/eco*` and `apps/eco-*`. Errors: an `<input>`, `<select>` or `<textarea>` without `matInput` or `matNativeControl`; a hex colour or a `--mat-sys-*` declaration outside the token sources (`libs/eco/styles/src/_eco_tokens.css` and the eco-store `*-theme.css` files). An exception needs `/* eco:check allow <rule>: <reason> */` (`<!-- ... -->` in a template) on the line before.

## Backend Systems

- **PocketBase** (eco-store, eco-admin): `apps/eco-store/CLAUDE.md` and `apps/eco-store/POCKETBASE.md`.
- **GraphQL** (plastikaweb): Apollo Client; types from `yarn plastikaweb:codegen`.
- **Firebase** (llecoop): Firestore, Functions and Hosting; `yarn llecoop:local` starts the emulators.
- Each backend has its data-access layer in `libs/core/util/api-*`, on the interfaces of `api-base`.

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- `ci.yml` runs on every pull request and on push to `develop`: format check, the repo checks of its "Lint Affected" step (`yarn tasks:check`, `yarn feature-map:check`…), then lint, test and build on affected projects (AGENTS.md "CI Strategy").
- Nx Cloud runs out of credits most months; `ci.yml` then sets `NX_NO_CLOUD=true` and runs with the local cache only. Its 401 is harmless.
- `pb-schema-guard.yml` (PRs that change `pb_schema.json`) and `pocketbase-schema.yml` (push to `develop`: syncs the schema to staging): `apps/eco-store/CLAUDE.md`.
- Pa11y: `eco-store-pa11y.yml`, `eco-admin-pa11y.yml` and `nasa-images-pa11y.yml`, after each CI run on `develop`.
- Deploys: `eco-store-deploy-staging.yml`, `nasa-images-deploy-dev.yml`, `llecoop-deploy-{staging,prod}.yml`.
- `claude.yml`, `claude-code-review.yml` and `jules-analysis.yml` run the review bots.

## Git Workflow

- Branches: `<type>/<description>` or `<type>/<task-id>-<description>`, with a type from `branchNameLint.json` (`feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`, `build`, `ci`, `chore`, `revert`, `prod`); `wip`, `master`, `main`, `develop` and `staging` are rejected.
- Commits: the `commitizen-git-flow` skill is the source of truth (`<type>(<scope>): #<clickup-id> <description>`); `yarn cz` is the interactive form.
- Worktrees: run `node tools/scripts/worktree-setup.cjs --branch <type>/<task-id>-<words>` outside the Bash sandbox before the first commit (not `yarn worktree:setup`: Yarn runs no script before the worktree is installed), so the worktree runs its own hooks and has the main checkout's ignored PocketBase files (AGENTS.md "Worktrees").
- Hooks: AGENTS.md "Pre-commit Hook" and "Commit-msg Hook" (the ClickUp ID, a task ID on eco code and the CHANGELOG bullet are checked there); the long form is in `documentation/git-flow.md` and `documentation/commit-conventions.md`.

## Key Patterns

- **Smart and dumb components**: feature libraries hold services, state and business logic; UI libraries take inputs and emit outputs.
- **State**: NgRx Signal Store, with the custom store features per backend in `libs/shared/signal-state/`.
- **Forms**: `@ngx-formly` with its Material types, fields declared with validators, expressions and hooks in a `*.config.ts` next to the component (`cart-shipping-form.config.ts`); `.claude/CLAUDE.md` "Forms" has the rules.

## Skills

Claude Code already lists every skill in `.claude/skills` with its description, so this file does not repeat them. Running `autoskills` re-inserts a generated summary block here (about 38 KB, loaded on every call): delete it if it comes back. When a skill contradicts this file or `.claude/CLAUDE.md`, the repo files win (see `.claude/CLAUDE.md`).
