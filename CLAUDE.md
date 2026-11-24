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

Plastikspace is a personal Nx monorepo (the apps are listed under [Applications](#applications); `yarn nx show projects` gives the current project list), using Angular 21 and multiple backend systems (Firebase, PocketBase, HTTP APIs).
The repository enforces strict architectural boundaries through ESLint module constraints.

**Repository**: <https://github.com/plastikaweb/plastikspace>
**Main Branch**: `develop` (also Nx's `defaultBase` — many tools assume `main`, this workspace does not)
**Package Manager**: Yarn

### Per-app guidance

When working inside an app directory, read its CLAUDE.md alongside this one:

- `apps/eco-store/CLAUDE.md` — eco-store / PocketBase / multi-tenant specifics

### Where things actually live

| What                              | Path                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Nx cache (custom)                 | `tmp/my-cache`                                                                                                |
| Path aliases (200+)               | `tsconfig.base.json`                                                                                          |
| Architectural boundary rules      | `eslint.config.mjs` (`@nx/enforce-module-boundaries`)                                                         |
| Workspace scripts                 | `tools/scripts/` (i18n validation, PocketBase helpers, local setup)                                           |
| Eco page map (URL → lib, access)  | `tools/feature-map.json`, generated from the routes (`yarn feature-map`); CI fails when it is stale           |
| Branch-name rules                 | `branchNameLint.json`                                                                                         |
| Commitizen config                 | `.cz-config.cjs` (scopes auto-loaded from `tsconfig.base.json`)                                               |
| Long-form docs                    | `documentation/` (nx-architecture, code-style, accessibility, css-styles, commit-conventions, git-flow, i18n) |
| eco-store PocketBase schema/hooks | `apps/eco-store/pocketbase/`                                                                                  |
| Firebase emulator data (llecoop)  | gitignored under `apps/llecoop-firebase/`                                                                     |

## Installation

Requires [rimraf](https://www.npmjs.com/package/rimraf) installed globally:

```bash
npm install -g rimraf
git clone git@github.com:plastikaweb/plastikspace.git
yarn install:local  # Cleans, installs dependencies, sets up husky
```

## Common Commands

### Development

```bash
# Start development server for an app
yarn <app-name>:serve                # e.g., yarn eco-store:serve
yarn <app-name>:local                # With backend (llecoop, eco-store)

# Build
yarn <app-name>:build                # Production build
yarn build                           # Build all apps

# Testing
yarn <app-name>:test                 # Run tests for specific app
yarn test:all                        # Run all tests with coverage
yarn affected:test                   # Test affected projects only

# E2E Testing
yarn <app-name>:e2e                  # Run E2E tests
yarn <app-name>:e2e:local            # E2E with watch mode

# Linting
yarn <app-name>:lint                 # Lint specific app
yarn lint:all                        # Lint all projects
yarn affected:lint                   # Lint affected projects
yarn lint:ci                         # Lint affected projects with the type-aware rules, as CI does

# Accessibility Testing
yarn <app-name>:a11y                 # Run Pa11y accessibility tests
```

### Monorepo Commands

```bash
yarn dep-graph                       # Visualize dependency graph
yarn affected:build                  # Build affected projects
yarn format:write                    # Format code with Prettier
yarn format:check                    # Check code formatting
```

### App-Specific Local Development

**LLecoop** (Firebase):

```bash
yarn llecoop:local                   # Start app + Firebase emulators
yarn llecoop:firestore              # Firestore emulator only
yarn llecoop:functions              # Functions emulator only
```

**Eco-store** (PocketBase):

```bash
yarn eco-store:local                 # Start app + PocketBase + SCSS watcher
yarn eco-store:pocketbase:run       # PocketBase only
yarn eco-store:pb:export             # Export PocketBase schema
yarn eco-store:pb:sync               # Push the schema to STAGING unless POCKETBASE_ENV=development
```

**Plastikaweb** (Angular):

```bash
yarn plastikaweb:serve               # Dev server
yarn plastikaweb:codegen             # Generate GraphQL types
```

### Git and Commits

```
yarn husky-install                   # Setup git hooks
yarn branch:lint                     # Validate branch names
yarn cz                              # Interactive commit with Commitizen
```

**Commitizen Integration**:

- Uses `cz-customizable` with configuration in `.cz-config.cjs`
- Automatically loads scopes from `tsconfig.base.json` path aliases
- Commit format: `<type>(<scope>): <subject>` with optional issue number from branch name
- Supports conventional commit types: feat, fix, docs, test, refactor, perf, style, build, ci, chore, revert
- Use the SKILL `commitizen-git-flow` as the source of truth to create commits

## Applications

| Application          | Framework          | Backend    | Purpose                                    |
| -------------------- | ------------------ | ---------- | ------------------------------------------ |
| **nasa-images**      | Angular 21         | NASA API   | Image gallery with search                  |
| **llecoop**          | Angular 21         | Firebase   | Discontinued: Firebase reference code only |
| **llecoop-firebase** | Firebase Functions | -          | Cloud functions for Llecoop                |
| **llecoop-triggers** | Firebase Functions | -          | Event triggers for Llecoop                 |
| **eco-store**        | Angular 21         | PocketBase | E-commerce demo                            |
| **eco-admin**        | Angular 21         | PocketBase | Admin panel for eco-store (scaffold, AP-0) |
| **plastikaweb**      | Angular 21         | GraphQL    | Personal portfolio (static site)           |

Each app except the Firebase ones has a Cypress `-e2e` project (see [Cypress](#cypress-e2e-tests)). llecoop stays only as Firebase reference code: keep it compiling and green, with no visual checks.

`eco-admin` shares the eco-store PocketBase instance and its `users` auth collection; it is a CSR SPA (no SSR) served from its own origin, and its docs live in `apps/eco-admin/{REQUIREMENTS,TASKS,DESIGN-BRIEF,DESIGN-REVIEWS}.md`. Read one task from the eco task docs (eco-store, eco-admin TASKS and REQUIREMENTS, `libs/eco`) with `yarn task <ID>`, never the whole file: eco-admin TASKS is over 200 KB.

## Library Architecture

Libraries are organized by **scope** (domain) and **type** (layer):

### Scopes

- **core**: Foundation libraries used across all apps
- **shared**: Cross-app reusable features and utilities
- **product-family**: Domain code shared by the apps of one product but by no other app. Currently only `eco/` (`libs/eco/*`), the eco platform domain layer shared by `eco-store` and `eco-admin`
- **app-specific**: Libraries scoped to individual apps (e.g., `llecoop/`, `eco-store/`, `eco-admin/`, `nasa-images/`, `plastikaweb/`)

### Types

- **app**: Main applications in `/apps`
- **feature**: Smart components implementing use cases (can use services, state management)
- **data-access**: Services for APIs, state management, backend communication
- **ui**: Presentational components (dumb, receive data via inputs)
- **util**: Pure functions, helpers, utilities
- **entity**: Type definitions and entity-related utilities

### Key Core Libraries

**API Abstraction**:

- `api-base` - Base interfaces for all API services
- `api-http` - Generic HTTP CRUD operations
- `api-firebase` - Firebase Firestore CRUD
- `api-pocketbase` - PocketBase CRUD

**Shared State Management** (`shared/signal-state/`):

- `data-access-http` - NgRx Signal Store for HTTP
- `data-access-firebase` - NgRx Signal Store for Firebase
- `data-access-pocketbase` - NgRx Signal Store for PocketBase

**Auth** (`shared/auth/`):

- Auth feature components (login, register, password recovery)
- Firebase and PocketBase data access implementations

### Module Boundaries (ESLint Enforced)

The following dependency rules are enforced by `@nx/enforce-module-boundaries` in the root `eslint.config.mjs`:

> Apps → can depend on: features, ui, util, data-access, entities (from core/shared)
>
> Features → can depend on: ui, util, data-access, entities, other features
>
> UI → can depend on: entities, util, other UI
>
> Data-access → can depend on: util, entities, other data-access
>
> Utils → can depend on: util, entities only
>
> Entities → can depend on: entities, util only

**Scope constraints**:

- `scope:core` → can depend on core, shared, util, entity
- `scope:shared` → can depend on shared, util, entity only
- `scope:eco` → can depend on eco, core, shared
- App-scoped libs → can depend on own scope + core + shared
- `scope:eco-store` and `scope:eco-admin` additionally depend on `scope:eco`; no other app scope may, and the two never import each other

**No circular dependencies allowed**. These rules prevent architectural drift.

Every library must carry **both** a `scope:*` and a `type:*` tag. The rules are ANDed, and the `type:app` rule lists no app scope — a library tagged with a scope alone cannot be imported by any app. `yarn nx-tags:check` enforces it on every `libs/**/project.json`, with a `scope:*` that a `sourceTag` of the root `eslint.config.mjs` names; it is the first step of the pre-push and of CI's Lint Affected step.

### Code Quality Rules (ESLint)

Beyond architectural boundaries, the following code quality rules are enforced:

- `no-console` is an error in TypeScript files other than `*.spec.*` (Cypress `*.cy.ts` included) - use proper logging or remove debug statements
- **Private fields**: a class field must be an ES6 private field (`#fieldName`), not a TypeScript `private` one: an error (`no-restricted-syntax`). Private methods and constructor parameter properties keep the `private` modifier, and so do fields set by `input()`, `model()`, `output()`, `outputFromObservable()` or a signal query, where the Angular compiler rejects `#` (NG1053): a `#` field set by one of them, or a `private` one set by the first four, is an error too. `yarn lint:profiles` checks that the rule still fires and skips a `private` query
- **Member ordering** (`@typescript-eslint/member-ordering`, an error): signature, field, constructor, method
- **JSDoc** (the `eslint-plugin-jsdoc` recommended set, on every TypeScript file, specs included): a `function` declaration without a JSDoc block is a warning, exported or not (methods, classes and arrow functions need none); in a block that exists, a missing `@param`/`@returns` tag or its `{type}` is a warning too. A description must start with a capital letter and contain a period (`jsdoc/match-description`, `/^[A-Z].+[.]/`): an error
- **Deprecation warnings** (`@typescript-eslint/no-deprecated`): warns on deprecated API usage in TypeScript files other than `*.spec.*` and `worker-configuration.d.ts` (test setup files and Cypress `*.cy.ts` included), in CI only (see the last item)
- **NgRx** (`@ngrx/eslint-plugin`): `select-style` and `no-effects-in-providers` are errors; the other 23 rules kept from the former `eslint-plugin-ngrx` recommended set warn
- **Angular** (META-17, errors in every project, specs included): `@angular-eslint/prefer-signals` (signal inputs and queries instead of decorators, and `readonly` on every signal property), `prefer-inject`, `prefer-output-emitter-ref` and `prefer-output-readonly`; `no-restricted-syntax` rejects `standalone: true` in `@Component`/`@Directive`/`@Pipe`, `@HostBinding`/`@HostListener`, and importing `NgClass`/`NgStyle`. In templates: `template/prefer-control-flow`, `template/button-has-type` (every `<button>` states `type="button"` or `type="submit"`) and no `ngClass`/`ngStyle`, bound or static. No rule covers an `effect()` that writes a signal (4 do today)
- **Templates and accessibility**: angular-eslint's `templateRecommended` and `templateAccessibility` presets plus the template rules of the root config's `*.html` block (no-positive-tabindex, alt-text, label-has-associated-control, etc., and the template rules of the Angular item), all errors, on `*.html` files and on inline `template:` strings, which the `flat/angular` preset in each Angular project's `eslint.config.mjs` extracts
- **Naming** (warnings, not errors): `id-length` 2-40 chars (short loop/callback names like `i`, `e`, `id` are whitelisted), `id-denylist` rejects vague names (`data`, `info`, `temp`, `val`, `item`, `foo`, `bar`, `baz`), and `@typescript-eslint/naming-convention` enforces camelCase by default (variables may also be UPPER_CASE or PascalCase; properties are not checked), PascalCase types, and `is`/`has`/`can`/`should`/`will` prefixes on boolean variables. The boolean selector needs type information, so it runs in CI only (see the last item), and never on `*.spec.ts`
- **Warnings may not grow** (META-18): `yarn lint:delta` compares each file a branch touches with its version at the merge base with `origin/develop` (or `--base <ref>`) and fails when the file has more ESLint warnings than before; the warnings it already had may stay. Fast profile, both versions linted with the current config. It runs in the pre-push (non-Markdown pushes) and as a failing check in CI's Lint Affected step; `--scope-only` only classifies the touched files
- **Statement padding** (`padding-line-between-statements`, a warning): a blank line before every `return` and after a block of variable declarations
- **Rules that need type information run in CI only** (META-13): `prefer-readonly` (an error: a private member never reassigned outside the constructor must be `readonly`), `no-deprecated` and the boolean `naming-convention` selector (warnings); `cypress/unsafe-to-chain-command` also flags chains that start at a helper function only there. They need `ESLINT_TYPED=1`, which CI's lint step and `yarn lint:ci` set. ESLint in hooks, editors and `nx lint` builds no TypeScript program and skips them; `yarn lint:profiles` checks both profiles. With `ESLINT_TYPED=1`, the project service types each file from its nearest `tsconfig.json`, the tsconfigs that one references or a `tsconfig.json` further up (the repo has none), never from `tsconfig.base.json`. A TypeScript file it cannot place fails the CI lint with "was not found by the project service": include it in one of those tsconfigs, or list it in `TS_DEFAULT_PROJECT` in the root `eslint.config.mjs`. A listed file that a tsconfig later takes in fails with "was included by allowDefaultProject but also was found in the project service": take it off the list

## Testing

### Vitest (Unit Tests)

```bash
yarn <app-name>:test                 # Run tests for app
yarn test:all                        # All tests with coverage
nx test <lib-name>                   # Test specific library

# Run single test file: the path goes straight to `vitest run`, which runs in the project root,
# so give it relative to the project root (or part of the file name). A path from the repo
# root matches nothing, and the workspace default passWithNoTests would report that as a pass:
# --passWithNoTests=false makes it fail instead.
nx test <project-name> <file-name> --passWithNoTests=false
# Example: nx test eco-store src/app/app.component.spec.ts --passWithNoTests=false

# Run tests matching a pattern (matches test name, not file name)
nx test <project-name> --testNamePattern="<pattern>"
# Example: nx test eco-store --testNamePattern="should create"

# Run tests in watch mode
nx test <project-name> --watch

# Run test for a specific library (faster than running app tests)
nx test <lib-name>
# Example: nx test api-http
```

- Runner: `vitest run`, inferred by the `@nx/vitest` plugin (`testMode: "run"`, cwd = project root), with `@analogjs/vite-plugin-angular` in each project's `vite.config.mts`
- Setup: `src/test-setup.ts` in each project
- Coverage reports in `/coverage`

### Cypress (E2E Tests)

`yarn <app-name>:e2e` runs an app's Cypress suite. No hook or CI job runs them and they are no acceptance check, so do not run them to verify a change. New e2e tests will use Playwright.

### Pa11y (Accessibility Tests)

```bash
yarn <app-name>:a11y                 # Run accessibility tests
```

- Configuration per app in `.pa11yci.json`
- Serves built app via HTTP server, runs Pa11y checks
- Every app targets **WCAG 2.2 AA** (owner, 2026-11-24). Pa11y checks less: its `WCAG2AA` standard means 2.1 AA at most in both its runners, and axe-core's only 2.2 rule is `target-size`. Check what 2.2 adds by hand: 2.4.11 focus not obscured, 2.5.7 dragging, 2.5.8 target size, 3.2.6 consistent help, 3.3.7 redundant entry, 3.3.8 accessible authentication.

### i18n Validation

```bash
yarn i18n:validate                   # Validate translation keys consistency
yarn i18n:test                       # Run i18n validation tests
```

- Custom script in `tools/scripts/validate-i18n-keys.cjs`
- Ensures translation keys are consistent across all language files
- Part of code quality checks

## Angular & TypeScript Conventions

The canonical Angular / TypeScript rules for this workspace live in [`.claude/CLAUDE.md`](.claude/CLAUDE.md) (standalone components, signals, `inject()`, `host` object, native control flow, no `ngClass`/`ngStyle`, no `mutate` on signals, etc.). Don't duplicate them here — read that file first.

The sections below capture only workspace-specific patterns that go beyond those baseline rules.

### Routing

- Implement lazy loading for feature routes
- Dedicated `*.routes.ts` file for each feature/scope as entrypoint
- Use `providedIn: 'root'` for global services; provide component-specific services in component decorator
- Guards are functional (`CanActivateFn`), not class-based
- Resolvers load data before route activation; guards validate state/conditions
- Guards run before resolvers — do not rely on resolver-loaded data inside a guard on the same route

### RxJS / Signal Interop

- Use `toSignal()` to convert Observables into signals for use in component templates
- Use `toObservable()` to convert signals back to Observables for RxJS pipelines
- Prefer `toSignal(obs$, { initialValue: ... })` to avoid `undefined` in strict templates
- Use `takeUntilDestroyed()` (from `@angular/core/rxjs-interop`) instead of manual `ngOnDestroy` unsubscription

## Code Organization

### Path Aliases

The repository has 200+ path aliases defined in `tsconfig.base.json` for clean imports:

```typescript
import { ApiService } from '@plastik/core/util/api-http';
import { AuthFeature } from '@plastik/shared/auth/feature';
```

### Barrel Exports

Use `index.ts` files for modularization. Export related classes together when possible.

### Naming and Generating Libraries

- **Eco libraries** (`libs/eco-store`, `libs/eco-admin`, `libs/eco`): `yarn eco-lib` (META-19) asks for app, domain, type and name, and writes the names, tags, alias and configs; its scheme is in `tools/generators/eco-lib/generator.cjs`. The alias edits `tsconfig.base.json`, which makes every project affected: one new library per small PR.
- **Other libraries**: `yarn nx g @nx/angular:lib libs/<scope>/<type>/<name> --tags=scope:<scope>,type:<type>`, the main file named after the full path (`booking-feature-destination.component.ts`); then match `eslint.config.mjs` and `vite.config.mts` to a sibling library.

**Default Generator Configuration** (from `nx.json`):

- **Components**: Automatically use `OnPush` change detection, standalone architecture, SCSS styles, and `displayBlock: true`
- **Libraries**: Standalone by default with Vitest for unit testing
- **Applications**: Vitest for unit tests, Cypress for E2E, ESLint for linting, SCSS for styling

**`lint` and `test` are inferred, not declared.** Since Nx 24, `@nx/eslint/plugin` and `@nx/vitest` (both registered in `nx.json`) create them from each project's `eslint.config.mjs` and `vite.config.mts`, so a generated `project.json` has `"targets": {}`. Do not add `lint` or `test` targets by hand. An entry without an `executor` is merged into the inferred target, and its `args` are appended to `eslint .` / `vitest run`, so they cannot narrow what runs. An entry with an `executor` replaces the inferred target, and the old `@nx/eslint:lint` and `@nx/vitest:test` no longer exist. Coverage goes to the `reportsDirectory` in the project's `vite.config.mts` (`coverage/{projectRoot}`), which Nx also uses as the task's cached output. Run `nx show project <name>` to see the resolved targets. A `package.json` script with the same name also becomes a target and wins over the plugins; `llecoop-triggers` opts out with `"nx": { "includedScripts": [] }`. To infer the targets, `@nx/vitest` resolves every `vite.config.mts` outside Vitest, so each one calls `angular({ tsconfig: 'tsconfig.spec.json' })`: without it, Analog looks for `tsconfig.app.json` and prints «Unable to resolve tsconfig» for every library whenever the graph is built from scratch, as in CI. Keep it in the config of a new library.

- These defaults are pre-configured, so you don't need to specify these flags when generating

## State Management

- **NgRx Signal Store** for modern reactive state management
- **Signals** for local component state
- **Computed** for derived state
- **Effects** for side effects
- Custom data access layers per backend type (Firebase, PocketBase, HTTP)

State transformations must be pure and predictable.

## Styling

- **TailwindCSS 4.0** for utility-first styling
- **Angular Material 21** for UI components
- **SCSS** preprocessor for custom styles
- Custom theme system in `libs/core/styles`
- PostCSS configuration in `.postcssrc.json`
- **Eco conventions** (META-15): `yarn eco-conventions:check` reads the templates and styles of `libs/eco*` and `apps/eco-*` (specs left out). Errors: an `<input>`, `<select>` or `<textarea>` without `matInput` or `matNativeControl`, in a template or a `template:` literal; a hex colour or a `--mat-sys-*` declaration in a `.scss` or `.css` file other than the token sources (`libs/eco/styles/src/_eco_tokens.css` and the eco-store `*-theme.css` files). Each `::ng-deep` is listed as info. A justified exception is `/* eco:check allow <rule>: <reason> */` (`<!-- ... -->` in a template) on the line before; no reason, no exception. It runs in the pre-commit on the staged eco files and in CI's Lint Affected step

See `documentation/css-styles.md` for detailed styling conventions.

## Backend Systems

### Firebase (Llecoop)

- Firestore for NoSQL database
- Firebase Functions for serverless backend
- Firebase Hosting for deployment
- Emulators for local development (`yarn llecoop:local`)

### PocketBase (Eco-store)

- Self-hosted SQL backend; local emulation via `yarn eco-store:local`
- Schema, hooks, and full workflow live in `apps/eco-store/CLAUDE.md` and `apps/eco-store/POCKETBASE.md`

### GraphQL (Plastikaweb)

- Apollo Client for GraphQL
- Code generation: `yarn plastikaweb:codegen`

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- `ci.yml` runs on every pull request and on push to `develop`: format check, the repo checks of its "Lint Affected" step (`yarn tasks:check`, `yarn feature-map:check`…), then lint, test and build on affected projects (AGENTS.md "CI Strategy").
- Nx Cloud runs out of credits most months; `ci.yml` then sets `NX_NO_CLOUD=true` and runs with the local cache only. Its 401 is harmless.
- `pb-schema-guard.yml` (PRs that change `pb_schema.json`) and `pocketbase-schema.yml` (push to `develop`: syncs the schema to staging) — see `apps/eco-store/CLAUDE.md`.
- Pa11y: `eco-store-pa11y.yml`, `eco-admin-pa11y.yml` and `nasa-images-pa11y.yml`, after each CI run on `develop`.
- Deploys: `eco-store-deploy-staging.yml`, `nasa-images-deploy-dev.yml`, `llecoop-deploy-{staging,prod}.yml`.
- `claude.yml`, `claude-code-review.yml` and `jules-analysis.yml` run the review bots.

## Git Workflow

- Main branch: `develop`
- Feature branches: `<type>/<description>` or `<type>/<issue-number>-<description>`
  - Allowed types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`, `build`, `ci`, `chore`, `revert`, `prod`
  - Examples: `feat/user-authentication`, `fix/704-cart-persistent`, `refactor/state-management`
  - Banned names: `wip`, `master`, `main`, `develop`, `staging`
- Commitizen for conventional commits (use `yarn cz`)
  - Format: `<type>(<scope>): <subject>`
  - Issue numbers automatically appended from branch name
- Branch name linting enforced via Husky (see `branchNameLint.json`)
- Pre-commit hooks for linting and formatting

See `documentation/git-flow.md` and `documentation/commit-conventions.md` for details.

## Documentation

Key documentation in `/documentation/`:

- **nx-architecture.md** - Comprehensive Nx patterns, scopes, types, boundaries
- **code-style.md** - Angular/TypeScript best practices
- **accessibility.md** - A11y guidelines and patterns
- **commit-conventions.md** - Git commit standards
- **git-flow.md** - Branching strategy & deployment
- **css-styles.md** - Styling conventions & Tailwind setup

## Important Files

- `nx.json` - Nx workspace configuration (custom cache: `./tmp/my-cache`, default base: `develop`)
- `tsconfig.base.json` - TypeScript config with 200+ path aliases
- `eslint.config.mjs` - Root ESLint flat config with the architectural boundary rules (critical for understanding constraints); every project's `eslint.config.mjs` spreads it (the five Cypress e2e configs after `cypress.configs.recommended`)
- `.mcp.json` - MCP server configuration (Nx CLI integration)
- `decorate-angular-cli.cjs` - Nx CLI decoration for caching
- `branchNameLint.json` - Branch naming rules enforced by Husky
- `.cz-config.cjs` - Commitizen configuration with auto-generated scopes

## Tech Stack

Angular 21, Nx, NgRx Signal Store, Angular Material and Tailwind CSS 4, ngx-translate, @ngx-formly, PocketBase, Firebase, Apollo; Vitest for unit tests. Read versions in `package.json`, never from memory.

## Key Patterns

### Smart vs Dumb Components

- **Smart** (Feature libraries): Use services, state management, implement business logic
- **Dumb** (UI libraries): Receive data via inputs, emit events via outputs, reusable

### Data Access Layers

Each backend type has its own abstraction:

- HTTP: `libs/core/util/api-http`
- Firebase: `libs/core/util/api-firebase`
- PocketBase: `libs/core/util/api-pocketbase`

All implement common interfaces from `libs/core/util/api-base`.

### Signal Store Pattern

Custom Signal Store features in `libs/shared/signal-state/` provide reusable patterns for each backend type.

### Form Management

- Use **@ngx-formly** for dynamic form generation
- Form configurations live in `*.config.ts` files alongside components
- Use Material UI types from `@ngx-formly/material`
- Form configs define fields declaratively with validators, expressions, and hooks
- Example: `cart-shipping-form.config.ts` defines form structure for shipping forms

## Design Context

### Users

Users and partners of local food cooperatives who want to browse proximity and ecological products, place orders, and consult their history.

### Brand Personality

**Nature, Lightness, Proximity.**
The interface should evoke feelings of organic connection, kindness, and approachability.

### Aesthetic Direction

**Organic and Kind.**
The visual tone should be soft, natural, and welcoming, avoiding harsh "tech" aesthetics or overly clinical minimalism.

### Design Principles

1.  **Earthy Elegance:** Use colors and spacing that feel natural, light, and unforced.
2.  **Gentle Interactions:** Animations and micro-interactions should be smooth and subtle, not jarring or aggressive.
3.  **Clear Typographic Hierarchy:** Ensure legibility to respect a diverse user base, prioritizing accessibility without sacrificing the "kind" aesthetic.
4.  **Emphasize Proximity:** Design choices should reduce friction, making the process of ordering local food feel intuitive and neighborly.

## Skills

Claude Code already lists every skill in `.claude/skills` with its description, so this file does not repeat them. Running `autoskills` re-inserts a generated summary block here (about 38 KB, loaded on every call): delete it if it comes back. When a skill contradicts this file or `.claude/CLAUDE.md`, the repo files win (see `.claude/CLAUDE.md`).
