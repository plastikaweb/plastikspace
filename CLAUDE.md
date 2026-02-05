# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

## Repository Overview

Plastikspace is a personal Nx monorepo containing **6 applications** and **137 libraries**, using Angular 21, Astro, and multiple backend systems (Firebase, PocketBase, HTTP APIs).
The repository enforces strict architectural boundaries through ESLint module constraints.

**Repository**: <https://github.com/plastikaweb/plastikspace>
**Main Branch**: `develop`
**Package Manager**: Yarn

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
yarn pb:export                       # Export PocketBase schema
yarn pb:sync                         # Sync PocketBase schema
```

**Plastikaweb** (Astro):

```bash
yarn plastikaweb:serve               # Dev server (Astro)
yarn plastikaweb:preview             # Preview built site
yarn plastikaweb:codegen             # Generate GraphQL types
```

### Git and Commits

```
yarn husky-install                   # Setup git hooks
yarn branch:lint                     # Validate branch names
yarn cz                              # Interactive commit with Commitizen
```

**Commitizen Integration**:

- Uses `cz-customizable` with configuration in `.cz-config.js`
- Automatically loads scopes from `tsconfig.base.json` path aliases
- Commit format: `<type>(<scope>): <subject>` with optional issue number from branch name
- Supports conventional commit types: feat, fix, docs, test, refactor, perf, style, build, ci, chore, revert

## Applications

| Application          | Framework          | Backend    | Purpose                                      |
| -------------------- | ------------------ | ---------- | -------------------------------------------- |
| **nasa-images**      | Angular 21         | NASA API   | Image gallery with search                    |
| **llecoop**          | Angular 21         | Firebase   | Consumer cooperative management (production) |
| **llecoop-firebase** | Firebase Functions | -          | Cloud functions for Llecoop                  |
| **llecoop-triggers** | Firebase Functions | -          | Event triggers for Llecoop                   |
| **eco-store**        | Angular 21         | PocketBase | E-commerce demo                              |
| **plastikaweb**      | Angular 21         | GraphQL    | Personal portfolio (static site)             |

Each app has a corresponding `-e2e` project for Cypress testing.

## Library Architecture

Libraries are organized by **scope** (domain) and **type** (layer):

### Scopes

- **core**: Foundation libraries used across all apps
- **shared**: Cross-app reusable features and utilities
- **app-specific**: Libraries scoped to individual apps (e.g., `llecoop/`, `eco-store/`, `nasa-images/`, `plastikaweb/`)

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

The following dependency rules are enforced via `.eslintrc.json`:

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
- App-scoped libs → can depend on own scope + core + shared

**No circular dependencies allowed**. These rules prevent architectural drift.

### Code Quality Rules (ESLint)

Beyond architectural boundaries, the following code quality rules are enforced:

- `no-console` is an error (except in test files) - use proper logging or remove debug statements
- **Private fields**: Must use ES6 private fields (`#fieldName`) instead of TypeScript `private` modifier
- **Member ordering**: Enforced order - signature, field, constructor, method
- **JSDoc**: Required for public APIs; must start with capital letter and end with period
- **Deprecation warnings**: Enabled for non-test files to catch deprecated API usage
- **NgRx**: Select style is enforced; recommended NgRx patterns required
- **Accessibility**: Comprehensive a11y rules for templates (no-positive-tabindex, alt-text, label-has-associated-control, etc.)

## Testing

### Jest (Unit Tests)

```bash
yarn <app-name>:test                 # Run tests for app
yarn test:all                        # All tests with coverage
nx test <lib-name>                   # Test specific library

# Run single test file (use relative path from project root)
nx test <project-name> --testFile=<file-name>
# Example: nx test eco-store --testFile=src/app/app.component.spec.ts

# Run tests matching a pattern (matches test name, not file name)
nx test <project-name> --testNamePattern="<pattern>"
# Example: nx test eco-store --testNamePattern="should create"

# Run tests in watch mode
nx test <project-name> --watch

# Run test for a specific library (faster than running app tests)
nx test <lib-name>
# Example: nx test core-util-api-http
```

- Preset: `@nx/jest/preset`
- Transform: `ts-jest`
- Setup: `src/test-setup.ts` in each project
- Coverage reports in `/coverage`

### Cypress (E2E Tests)

```bash
yarn <app-name>:e2e                  # Headless E2E
yarn <app-name>:e2e:local           # Interactive with watch mode
```

- Custom commands in `libs/core/util/cypress-commands`
- Component harness utilities via `@jscutlery/cypress-harness`

### Pa11y (Accessibility Tests)

```bash
yarn <app-name>:a11y                 # Run accessibility tests
```

- Configuration per app in `.pa11yci.json`
- Serves built app via HTTP server, runs Pa11y checks

### i18n Validation

```bash
yarn i18n:validate                   # Validate translation keys consistency
yarn i18n:test                       # Run i18n validation tests
```

- Custom script in `tools/scripts/validate-i18n-keys.js`
- Ensures translation keys are consistent across all language files
- Part of code quality checks

## Angular & TypeScript Best Practices

### TypeScript

- Use strict type checking
- Prefer type inference when obvious
- Avoid `any`; use `unknown` when type is uncertain

### Angular Components

- **Standalone components only** (default, don't set `standalone: true`)
- Use `ChangeDetectionStrategy.OnPush`
- Use `input()` and `output()` functions instead of decorators
- Use signals for state: `signal()`, `computed()`, `effect()`
- **DO NOT use `mutate` on signals**, use `update` or `set` instead
- Keep components small and focused

### Templates

- Use native control flow: `@if`, `@for`, `@switch` (not `*ngIf`, `*ngFor`, `*ngSwitch`)
- Use `async` pipe for observables
- **DO NOT use `ngClass`**, use `[class]` bindings instead
- **DO NOT use `ngStyle`**, use `[style]` bindings instead
- Use `NgOptimizedImage` for static images (not for base64)

### Services & DI

- Use `inject()` function instead of constructor injection
- Use `providedIn: 'root'` for singleton services
- Design services around single responsibility

### Prohibited Patterns

- **NO NgModules** - standalone components only
- **NO `@HostBinding` or `@HostListener`** - use `host` object in decorator instead
- **NO `ngClass` or `ngStyle`** - use direct bindings

### Routing

- Implement lazy loading for feature routes
- Dedicated `*.routes.ts` file for each feature/scope as entrypoint
- Use `providedIn: 'root'` for global services; provide component-specific services in component decorator

## Code Organization

### Path Aliases

The repository has 200+ path aliases defined in `tsconfig.base.json` for clean imports:

```typescript
import { ApiService } from '@plastikspace/core/util/api-http';
import { AuthFeature } from '@plastikspace/shared/auth/feature';
```

### Barrel Exports

Use `index.ts` files for modularization. Export related classes together when possible.

### Naming Conventions

Library naming pattern: `{scope}/{type}/{name}`

Examples:

- `libs/core/util/api-http/` → Core utility for HTTP
- `libs/shared/auth/feature/` → Shared auth feature
- `libs/llecoop/data-access-orders/` → Llecoop-specific data access

Main module/component files must contain the full path in the filename:

- Library: `libs/booking/feature-destination`
- Main file: `booking-feature-destination.component.ts`

### Generating Libraries

Generate new libraries following the naming conventions and tagging strategy:

```bash
# Generate a new library following conventions
nx g @nx/angular:lib <name> --directory=<scope>/<type> --tags=scope:<scope>,type:<type>

# Example: Generate a feature library for eco-store
nx g @nx/angular:lib checkout --directory=eco-store/feature --tags=scope:eco-store,type:feature

# Example: Generate a shared UI component
nx g @nx/angular:lib button --directory=shared/ui --tags=scope:shared,type:ui
```

**Default Generator Configuration** (from `nx.json`):

- **Components**: Automatically use `OnPush` change detection, standalone architecture, SCSS styles, and `displayBlock: true`
- **Libraries**: Standalone by default with Jest for unit testing
- **Applications**: Jest for unit tests, Cypress for E2E, ESLint for linting, SCSS for styling
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

See `documentation/css-styles.md` for detailed styling conventions.

## Backend Systems

### Firebase (Llecoop)

- Firestore for NoSQL database
- Firebase Functions for serverless backend
- Firebase Hosting for deployment
- Emulators for local development (`yarn llecoop:local`)

### PocketBase (Eco-store)

- Self-hosted backend with SQL-based storage
- Local emulation: `yarn eco-store:local` (starts PocketBase + app + SCSS watcher)
- PocketBase runs on default port (usually 8090)
- Admin UI: `http://localhost:8090/_/` (when PocketBase is running)

**Schema Management Workflow**:

1. Make changes in PocketBase Admin UI
2. `yarn pb:export` - Export schema to `apps/eco-store/pocketbase/pb_schema.json`
3. `yarn pb:diff` - Review schema changes in git
4. `yarn pb:sync` - Sync schema across environments (if needed)
5. Commit schema file with your changes

Schema is version-controlled and should be committed with related code changes.

### GraphQL (Plastikaweb)

- Apollo Client for GraphQL
- Code generation: `yarn plastikaweb:codegen`

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

**Main CI** (`ci.yml`):

- Runs on push to `develop`
- Format check, lint, test, build on affected projects
- Uses NX Cloud for distribution
- 3 parallel jobs max

**Deployment**:

- `llecoop-deploy-staging.yml` / `llecoop-deploy-prod.yml`
- `eco-store-deploy-staging.yml`
- `nasa-images-deploy-dev.yml`

**Accessibility**:

- `nasa-images-pa11y.yml`
- `eco-store-pa11y.yml`

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
- `.eslintrc.json` - Architectural boundary rules (critical for understanding constraints)
- `jest.preset.js` - Jest configuration
- `.mcp.json` - MCP server configuration (Nx CLI integration)
- `decorate-angular-cli.js` - Nx CLI decoration for caching
- `branchNameLint.json` - Branch naming rules enforced by Husky
- `.cz-config.js` - Commitizen configuration with auto-generated scopes

## Tech Stack

**Core**:

- Angular 21.0.6
- TypeScript 5.9.3
- Nx 22.3.3
- RxJS 7.8
- Astro 5.16.16

**State**:

- NgRx 21.0.0 (store, effects, signals)
- @angular-architects/ngrx-toolkit

**UI**:

- Angular Material 21.0.5
- TailwindCSS 4.0.0
- Angular CDK 21.0.5

**Data**:

- Apollo Client 3.13.6
- Firebase Admin SDK 12.6.0
- PocketBase 0.26.3
- graphql-request 7.4.0

**Forms**:

- @ngx-formly 7.0.1
- Reactive Forms (Angular built-in)

**Testing**:

- Jest 30.2.0 + jest-preset-angular 16.0.0
- Cypress 15.8.1
- Pa11y CI 4.0.1
- jest-axe 10.0.0

**i18n**:

- @ngx-translate/core 17.0.0

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
