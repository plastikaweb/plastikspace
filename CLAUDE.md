# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

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
yarn eco-store:pb:export             # Export PocketBase schema
yarn eco-store:pb:sync               # Sync PocketBase schema
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
- Use the SKILL `commitzen-git-flow` as the source of truth to create commits

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

### Vitest (Unit Tests)

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

- Runner: `@analogjs/vitest-angular` via `@nx/vite` preset
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
- **Libraries**: Standalone by default with Vitest for unit testing
- **Applications**: Vitest for unit tests, Cypress for E2E, ESLint for linting, SCSS for styling

**After generating a new library**, remove the `outputs` and `reportsDirectory` lines that the generator adds to the `test` target in `project.json`. Coverage paths are managed globally via `nx.json` `targetDefaults` (`coverage/{projectRoot}`), and the generator-added paths are wrong (lib-relative instead of workspace-root-relative). The test target should look like:

```json
"test": {
  "executor": "@nx/vitest:test"
}
```

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
2. `yarn eco-store:pb:export` - Export schema to `apps/eco-store/pocketbase/pb_schema.json`
3. `yarn eco-store:pb:diff` - Review schema changes in git
4. `yarn eco-store:pb:sync` - Sync schema across environments (if needed)
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
- PocketBase 0.36.7
- graphql-request 7.4.0

**Forms**:

- @ngx-formly 7.0.1
- Reactive Forms (Angular built-in)

**Testing**:

- Vitest 4.0.18 + @analogjs/vitest-angular 2.1.2
- Cypress 15.8.1
- Pa11y CI 4.0.1
- vitest-axe 0.1.0

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

<!-- autoskills:start -->

Summary generated by `autoskills`. Check the full files inside `.claude/skills`.

## Accessibility (a11y)

Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".

- `.claude/skills/accessibility/SKILL.md`
- `.claude/skills/accessibility/references/A11Y-PATTERNS.md`: Practical, copy-paste-ready patterns for common accessibility requirements. Each pattern is self-contained and linked from the main [SKILL.md](../SKILL.md).
- `.claude/skills/accessibility/references/WCAG.md`

## Assess Adaptation Challenge

Adapt designs to work across different screen sizes, devices, contexts, or platforms. Ensures consistent experience across varied environments.

- `.claude/skills/adapt/SKILL.md`

## Angular Documentation (adev) Writing Guide

Comprehensive writing guide for Angular documentation (adev). Covers Google Technical Writing standards, Angular-specific markdown extensions, code blocks, and components. Use when authoring or reviewing content in adev/src/content.

- `.claude/skills/adev-writing-guide/SKILL.md`

## Angular Component

Create modern Angular standalone components following v20+ best practices. Use for building UI components with signal-based inputs/outputs, OnPush change detection, host bindings, content projection, and lifecycle hooks. Triggers on component creation, refactoring class-based inputs to signals, a...

- `.claude/skills/angular-component/SKILL.md`
- `.claude/skills/angular-component/references/component-patterns.md`: For two-way binding with `[(value)]` syntax:

## Angular Developer Guidelines

Generates Angular code and provides architectural guidance. Trigger when creating projects, components, or services, or for best practices on reactivity (signals, linkedSignal, resource), forms, dependency injection, routing, SSR, accessibility (ARIA), animations, styling (component styles, Tailw...

- `.claude/skills/angular-developer/SKILL.md`
- `.claude/skills/angular-developer/references/angular-animations.md`: When animating elements in Angular, **first analyze the project's Angular version** in `package.json`. For modern applications (**Angular v20.2 and above**), prefer using native CSS with `animate.enter` and `animate.leave`. For older applications, you may need to use the deprecated `@angular/anim...
- `.claude/skills/angular-developer/references/angular-aria.md`: Angular Aria (`@angular/aria`) is a collection of headless, accessible directives that implement common WAI-ARIA patterns. These directives handle keyboard interactions, ARIA attributes, focus management, and screen reader support.
- `.claude/skills/angular-developer/references/cli.md`: The Angular CLI (`ng`) is the primary tool for managing an Angular workspace. Always prefer CLI commands over manual file creation or generic `npm` commands when modifying project structure or adding Angular-specific dependencies.
- `.claude/skills/angular-developer/references/component-harnesses.md`: Component harnesses are the standard, preferred way to interact with components in tests. They provide a robust, user-centric API that makes tests less brittle and easier to read by insulating them from changes to a component's internal DOM structure.
- `.claude/skills/angular-developer/references/component-styling.md`: Angular components can define styles that apply specifically to their template, enabling encapsulation and modularity.
- `.claude/skills/angular-developer/references/components.md`: Angular components are the fundamental building blocks of an application. Each component consists of a TypeScript class with behaviors, an HTML template, and a CSS selector.
- `.claude/skills/angular-developer/references/creating-services.md`: Services in Angular are reusable pieces of code that handle data fetching, business logic, or state management that multiple components or other services need to access.
- `.claude/skills/angular-developer/references/data-resolvers.md`: Data resolvers fetch data before a route activates, ensuring components have the necessary data upon rendering.
- `.claude/skills/angular-developer/references/define-routes.md`: Routes are objects that define which component should render for a specific URL path.
- `.claude/skills/angular-developer/references/defining-providers.md`: Angular offers automatic and manual ways to provide dependencies to its Dependency Injection (DI) system.
- `.claude/skills/angular-developer/references/di-fundamentals.md`: Dependency Injection (DI) is a design pattern used to organize and share code across an application by allowing you to "inject" features into different parts. This improves code maintainability, scalability, and testability.
- `.claude/skills/angular-developer/references/e2e-testing.md`: This project uses [Cypress](https://www.cypress.io/) for end-to-end (E2E) testing, which simulates real user interactions in a browser. The E2E tests are located primarily within the `devtools/` package.
- `.claude/skills/angular-developer/references/effects.md`: In Angular, an **effect** is an operation that runs whenever one or more signal values it tracks change.
- `.claude/skills/angular-developer/references/hierarchical-injectors.md`: Angular's dependency injection system is hierarchical, meaning services can be scoped to different levels of the application.
- `.claude/skills/angular-developer/references/host-elements.md`: The **host element** is the DOM element that matches a component's selector. The component's template renders inside this element.
- `.claude/skills/angular-developer/references/injection-context.md`: The `inject()` function can only be used when code is executing within an **injection context**.
- `.claude/skills/angular-developer/references/inputs.md`: Inputs allow data to flow from a parent component to a child component. Angular recommends using the signal-based `input` API for modern applications.
- `.claude/skills/angular-developer/references/linked-signal.md`: The `linkedSignal` function lets you create writable state that is intrinsically linked to some other state. It is perfect for state that needs a default value derived from an input or another signal, but can still be independently modified by the user.
- `.claude/skills/angular-developer/references/loading-strategies.md`: Angular supports two main strategies for loading routes and components to balance initial load time and navigation responsiveness.
- `.claude/skills/angular-developer/references/mcp.md`: The Angular CLI includes a Model Context Protocol (MCP) server that enables AI assistants (like Cursor, Gemini CLI, JetBrains AI, etc.) to interact directly with the Angular CLI. It provides tools for code generation, modernizing code, fetching examples, and running builds/tests.
- `.claude/skills/angular-developer/references/navigate-to-routes.md`: Angular provides both declarative and programmatic ways to navigate between routes.
- `.claude/skills/angular-developer/references/outputs.md`: Outputs allow a child component to emit custom events that a parent component can listen to. Angular recommends using the new `output()` function for modern applications.
- `.claude/skills/angular-developer/references/reactive-forms.md`: Reactive forms provide a model-driven approach to handling form inputs. They are built around observable streams and provide synchronous access to the data model, making them more scalable and testable than template-driven forms.
- `.claude/skills/angular-developer/references/rendering-strategies.md`: Angular supports multiple rendering strategies to optimize for SEO, performance, and interactivity.
- `.claude/skills/angular-developer/references/resource.md`: A `Resource` incorporates asynchronous data fetching into Angular's signal-based reactivity. It executes an async loader function whenever its dependencies change, exposing the status and result as synchronous signals.
- `.claude/skills/angular-developer/references/route-animations.md`: Angular Router supports the browser's **View Transitions API** for smooth visual transitions between routes.
- `.claude/skills/angular-developer/references/route-guards.md`: Route guards control whether a user can navigate to or leave a route.
- `.claude/skills/angular-developer/references/router-lifecycle.md`: Angular Router emits events through the `Router.events` observable, allowing you to track the navigation lifecycle from start to finish.
- `.claude/skills/angular-developer/references/router-testing.md`: When testing components that involve routing, it is crucial **not to mock the Router or related services**. Instead, use the `RouterTestingHarness`, which provides a robust and reliable way to test routing logic in an environment that closely mirrors a real application.
- `.claude/skills/angular-developer/references/show-routes-with-outlets.md`: The `RouterOutlet` directive is a placeholder where Angular renders the component for the current URL.
- `.claude/skills/angular-developer/references/signal-forms.md`: Signal Forms are the recommended approach for handling forms in modern Angular applications (v21+). They provide a reactive, type-safe, and model-driven way to manage form state using Angular Signals.
- `.claude/skills/angular-developer/references/signals-overview.md`: Signals are the foundation of reactivity in modern Angular applications. A **signal** is a wrapper around a value that notifies interested consumers when that value changes.
- `.claude/skills/angular-developer/references/tailwind-css.md`: Tailwind CSS is a utility-first CSS framework that integrates seamlessly with Angular.
- `.claude/skills/angular-developer/references/template-driven-forms.md`: Template-driven forms use two-way data binding (`[(ngModel)]`) to update the data model in the component as changes are made in the template and vice versa. They are ideal for simple forms and use directives in the HTML template to manage form state and validation.
- `.claude/skills/angular-developer/references/testing-fundamentals.md`: This guide covers the fundamental principles and practices for writing unit tests in this repository, which uses Vitest as the test runner.

## Angular Dependency Injection

Implement dependency injection in Angular v20+ using inject(), injection tokens, and provider configuration. Use for service architecture, providing dependencies at different levels, creating injectable tokens, and managing singleton vs scoped services. Triggers on service creation, configuring p...

- `.claude/skills/angular-di/SKILL.md`
- `.claude/skills/angular-di/references/di-patterns.md`: Combine multiple services into a single API:

## Angular Directives

Create custom directives in Angular v20+ for DOM manipulation and behavior extension. Use for attribute directives that modify element behavior/appearance, structural directives for portals/overlays, and host directives for composition. Triggers on creating reusable DOM behaviors, extending eleme...

- `.claude/skills/angular-directives/SKILL.md`
- `.claude/skills/angular-directives/references/directive-patterns.md`

## Angular Signal Forms

Build signal-based forms in Angular v21+ using the new Signal Forms API. Use for form creation with automatic two-way binding, schema-based validation, field state management, and dynamic forms. Triggers on form implementation, adding validation, creating multi-step forms, or building forms with...

- `.claude/skills/angular-forms/SKILL.md`
- `.claude/skills/angular-forms/references/form-patterns.md`: For production applications requiring stability guarantees, use Reactive Forms:

## Angular HTTP & Data Fetching

Implement HTTP data fetching in Angular v20+ using resource(), httpResource(), and HttpClient. Use for API calls, data loading with signals, request/response handling, and interceptors. Triggers on data fetching, API integration, loading states, error handling, or converting Observable-based HTTP...

- `.claude/skills/angular-http/SKILL.md`
- `.claude/skills/angular-http/references/http-patterns.md`: Encapsulate HTTP logic in services:

## Angular Material Skill

Angular Material UI components, theming, and accessible interface design

- `.claude/skills/angular-material/SKILL.md`
- `.claude/skills/angular-material/references/GUIDE.md`: This guide provides comprehensive documentation for the **angular-material** skill in the custom-plugin-angular plugin.
- `.claude/skills/angular-material/references/PATTERNS.md`: Always validate input before processing:

## Angular Routing

Implement routing in Angular v20+ applications with lazy loading, functional guards, resolvers, and route parameters. Use for navigation setup, protected routes, route-based data loading, and nested routing. Triggers on route configuration, adding authentication guards, implementing lazy loading,...

- `.claude/skills/angular-routing/SKILL.md`
- `.claude/skills/angular-routing/references/routing-patterns.md`: Using auxiliary outlets for modals:

## Angular Signals

Implement signal-based reactive state management in Angular v20+. Use for creating reactive state with signal(), derived state with computed(), dependent state with linkedSignal(), and side effects with effect(). Triggers on state management questions, converting from BehaviorSubject/Observable p...

- `.claude/skills/angular-signals/SKILL.md`
- `.claude/skills/angular-signals/references/signal-patterns.md`: The `resource()` API handles async data fetching with signals:

## Angular SSR

Implement server-side rendering and hydration in Angular v20+ using @angular/ssr. Use for SSR setup, hydration strategies, prerendering static pages, and handling browser-only APIs. Triggers on SSR configuration, fixing hydration mismatches, prerendering routes, or making code SSR-compatible.

- `.claude/skills/angular-ssr/SKILL.md`
- `.claude/skills/angular-ssr/references/ssr-patterns.md`

## Angular Testing

Write unit and integration tests for Angular v21+ applications using Vitest or Jasmine with TestBed, component harnesses, and modern testing patterns. Use for testing components with signals, OnPush change detection, services with inject(), and HTTP interactions. Triggers on test creation, testin...

- `.claude/skills/angular-testing/SKILL.md`
- `.claude/skills/angular-testing/references/testing-patterns.md`: Use Angular CDK component harnesses for more maintainable tests:

## Angular Tooling

Use Angular CLI and development tools effectively in Angular v20+ projects. Use for project setup, code generation, building, testing, and configuration. Triggers on creating new projects, generating components/services/modules, configuring builds, running tests, or optimizing production builds.

- `.claude/skills/angular-tooling/SKILL.md`
- `.claude/skills/angular-tooling/references/tooling-patterns.md`: Automatic in v20+ - builds for modern browsers by default.

## MANDATORY PREPARATION

Review a feature and enhance it with purposeful animations, micro-interactions, and motion effects that improve usability and delight.

- `.claude/skills/animate/SKILL.md`

## Diagnostic Scan

Perform comprehensive audit of interface quality across accessibility, performance, theming, and responsive design. Generates detailed report of issues with severity ratings and recommendations.

- `.claude/skills/audit/SKILL.md`

## MANDATORY PREPARATION

Amplify safe or boring designs to make them more visually interesting and stimulating. Increases impact while maintaining usability.

- `.claude/skills/bolder/SKILL.md`

## Assess Current Copy

Improve unclear UX copy, error messages, microcopy, labels, and instructions. Makes interfaces easier to understand and use.

- `.claude/skills/clarify/SKILL.md`

## MANDATORY PREPARATION

Add strategic color to features that are too monochromatic or lack visual interest. Makes interfaces more engaging and expressive.

- `.claude/skills/colorize/SKILL.md`

## Design Critique

Evaluate design effectiveness from a UX perspective. Assesses visual hierarchy, information architecture, emotional resonance, and overall design quality with actionable feedback.

- `.claude/skills/critique/SKILL.md`

## MANDATORY PREPARATION

Add moments of joy, personality, and unexpected touches that make interfaces memorable and enjoyable to use. Elevates functional to delightful.

- `.claude/skills/delight/SKILL.md`

## MANDATORY PREPARATION

Strip designs to their essence by removing unnecessary complexity. Great design is simple, powerful, and clean.

- `.claude/skills/distill/SKILL.md`

## Discover

Extract and consolidate reusable components, design tokens, and patterns into your design system. Identifies opportunities for systematic reuse and enriches your component library.

- `.claude/skills/extract/SKILL.md`

## Design Direction

Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications. Generates creative, polished code that avoids generic AI aesthetics.

- `.claude/skills/frontend-design/SKILL.md`
- `.claude/skills/frontend-design/reference/color-and-contrast.md`: **Stop using HSL.** Use OKLCH (or LCH) instead. It's perceptually uniform, meaning equal steps in lightness _look_ equal—unlike HSL where 50% lightness in yellow looks bright while 50% in blue looks dark.
- `.claude/skills/frontend-design/reference/interaction-design.md`: Every interactive element needs these states designed:
- `.claude/skills/frontend-design/reference/motion-design.md`: Timing matters more than easing. These durations feel right for most UI:
- `.claude/skills/frontend-design/reference/responsive-design.md`: Start with base styles for mobile, use `min-width` queries to layer complexity. Desktop-first (`max-width`) means mobile loads unnecessary styles first.
- `.claude/skills/frontend-design/reference/spatial-design.md`: 8pt systems are too coarse—you'll frequently need 12px (between 8 and 16). Use 4pt for granularity: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- `.claude/skills/frontend-design/reference/typography.md`: Your line-height should be the base unit for ALL vertical spacing. If body text has `line-height: 1.5` on `16px` type (= 24px), spacing values should be multiples of 24px. This creates subconscious harmony—text and space share a mathematical foundation.
- `.claude/skills/frontend-design/reference/ux-writing.md`: **Never use "OK", "Submit", or "Yes/No".** These are lazy and ambiguous. Use specific verb + object patterns:

## Assess Hardening Needs

Improve interface resilience through better error handling, i18n support, text overflow handling, and edge case management. Makes interfaces robust and production-ready.

- `.claude/skills/harden/SKILL.md`

## Node.js Backend Patterns

Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js servers, REST APIs, GraphQL backends, or microservices architectures.

- `.claude/skills/nodejs-backend-patterns/SKILL.md`
- `.claude/skills/nodejs-backend-patterns/references/advanced-patterns.md`: Advanced patterns for dependency injection, database integration, authentication, caching, and API response formatting.

## Node.js Best Practices

Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying.

- `.claude/skills/nodejs-best-practices/SKILL.md`

## Plan

Normalize design to match your design system and ensure consistency

- `.claude/skills/normalize/SKILL.md`

## Assess Onboarding Needs

Design or improve onboarding flows, empty states, and first-time user experiences. Helps users get started successfully and understand value quickly.

- `.claude/skills/onboard/SKILL.md`

## Assess Performance Issues

Improve interface performance across loading speed, rendering, animations, images, and bundle size. Makes experiences faster and smoother.

- `.claude/skills/optimize/SKILL.md`

## PocketBase Best Practices

PocketBase development best practices covering collection design, API rules, authentication, SDK usage, query optimization, realtime subscriptions, file handling, and deployment. Use when building PocketBase backends, designing schemas, implementing access control, setting up auth flows, or optim...

- `.claude/skills/pocketbase-best-practices/SKILL.md`
- `.claude/skills/pocketbase-best-practices/AGENTS.md`: **Version 1.1.0** Community January 2026
- `.claude/skills/pocketbase-best-practices/references/api-rules-security.md`: **Impact: CRITICAL**
- `.claude/skills/pocketbase-best-practices/references/authentication.md`: **Impact: CRITICAL**
- `.claude/skills/pocketbase-best-practices/references/collection-design.md`: **Impact: CRITICAL**
- `.claude/skills/pocketbase-best-practices/references/file-handling.md`: **Impact: MEDIUM**
- `.claude/skills/pocketbase-best-practices/references/production-deployment.md`: **Impact: LOW-MEDIUM**
- `.claude/skills/pocketbase-best-practices/references/query-performance.md`: **Impact: HIGH**
- `.claude/skills/pocketbase-best-practices/references/realtime.md`: **Impact: MEDIUM**
- `.claude/skills/pocketbase-best-practices/references/sdk-usage.md`: **Impact: HIGH**
- `.claude/skills/pocketbase-best-practices/rules/auth-impersonation.md`: Impersonation allows superusers to generate tokens for other users, enabling admin support tasks and API key functionality without sharing passwords.
- `.claude/skills/pocketbase-best-practices/rules/auth-mfa.md`: MFA requires users to authenticate with two different methods. PocketBase supports OTP (One-Time Password) via email as the second factor.
- `.claude/skills/pocketbase-best-practices/rules/auth-oauth2.md`: OAuth2 integration should use the all-in-one method for simplicity and security. Manual code exchange should only be used when necessary (e.g., mobile apps with deep links).
- `.claude/skills/pocketbase-best-practices/rules/auth-password.md`: Password authentication should include proper error handling, avoid exposing whether emails exist, and correctly manage the auth store.
- `.claude/skills/pocketbase-best-practices/rules/auth-token-management.md`: Auth tokens should be refreshed before expiration, validated on critical operations, and properly cleared on logout. The SDK's authStore handles most of this automatically.
- `.claude/skills/pocketbase-best-practices/rules/coll-auth-vs-base.md`: Auth collections provide built-in authentication features including secure password hashing, email verification, OAuth2 support, and token management. Using base collections for users requires reimplementing these security-critical features.
- `.claude/skills/pocketbase-best-practices/rules/coll-field-types.md`: Selecting the wrong field type leads to data validation issues, wasted storage, and poor query performance. PocketBase provides specialized field types that enforce constraints at the database level.
- `.claude/skills/pocketbase-best-practices/rules/coll-geopoint.md`: PocketBase provides a dedicated GeoPoint field type for storing geographic coordinates with built-in distance query support via `geoDistance()`.
- `.claude/skills/pocketbase-best-practices/rules/coll-indexes.md`: PocketBase uses SQLite which benefits significantly from proper indexing. Queries filtering or sorting on unindexed fields perform full table scans.
- `.claude/skills/pocketbase-best-practices/rules/coll-relations.md`: Relation fields connect collections together. Proper cascade configuration ensures data integrity when referenced records are deleted.
- `.claude/skills/pocketbase-best-practices/rules/coll-view-collections.md`: View collections execute custom SQL queries and expose results through the standard API. They're ideal for aggregations, joins, and computed fields without duplicating logic across your application.
- `.claude/skills/pocketbase-best-practices/rules/deploy-backup.md`: Regular backups are essential for production deployments. PocketBase provides built-in backup functionality and supports external S3 storage.
- `.claude/skills/pocketbase-best-practices/rules/deploy-configuration.md`: Production deployments require proper configuration of URLs, secrets, SMTP, and security settings.
- `.claude/skills/pocketbase-best-practices/rules/deploy-rate-limiting.md`: PocketBase v0.23+ includes built-in rate limiting. Enable it to protect against brute-force attacks, API abuse, and excessive resource consumption.
- `.claude/skills/pocketbase-best-practices/rules/deploy-reverse-proxy.md`: Use a reverse proxy (Nginx, Caddy) for HTTPS termination, caching, rate limiting, and security headers.
- `.claude/skills/pocketbase-best-practices/rules/deploy-sqlite-considerations.md`: PocketBase uses SQLite with optimized defaults. Understanding its characteristics helps optimize performance and avoid common pitfalls. PocketBase uses two separate databases: `data.db` (application data) and `auxiliary.db` (logs and ephemeral data), which reduces write contention.
- `.claude/skills/pocketbase-best-practices/rules/file-serving.md`: Use the SDK's `getURL` method to generate proper file URLs with thumbnail support and access tokens for protected files.
- `.claude/skills/pocketbase-best-practices/rules/file-upload.md`: File uploads can use plain objects or FormData. Handle large files properly with progress tracking and appropriate error handling.
- `.claude/skills/pocketbase-best-practices/rules/file-validation.md`: Validate files on both client and server side. Client validation improves UX; server validation (via collection settings) enforces security.
- `.claude/skills/pocketbase-best-practices/rules/query-back-relations.md`: Back-relations allow you to expand records that reference the current record, enabling inverse lookups in a single request. Use the `collectionName_via_fieldName` syntax.
- `.claude/skills/pocketbase-best-practices/rules/query-batch-operations.md`: Batch operations combine multiple create/update/delete operations into a single atomic transaction. This ensures consistency and dramatically reduces API calls.
- `.claude/skills/pocketbase-best-practices/rules/query-expand.md`: Use the `expand` parameter to fetch related records in a single request. This eliminates N+1 query problems and dramatically reduces API calls.
- `.claude/skills/pocketbase-best-practices/rules/query-field-selection.md`: Use the `fields` parameter to request only the data you need. This reduces bandwidth and can improve query performance, especially with large text or file fields.
- `.claude/skills/pocketbase-best-practices/rules/query-first-item.md`: Use `getFirstListItem()` when you need to find a single record by a field value other than ID. It's cleaner than `getList()` with limit 1 and provides proper error handling.
- `.claude/skills/pocketbase-best-practices/rules/query-n-plus-one.md`: N+1 queries occur when you fetch a list of records, then make additional requests for each record's related data. This pattern causes severe performance issues at scale.
- `.claude/skills/pocketbase-best-practices/rules/query-pagination.md`: Pagination impacts performance significantly. Use `skipTotal` for large datasets, cursor-based pagination for infinite scroll, and appropriate page sizes.
- `.claude/skills/pocketbase-best-practices/rules/realtime-auth.md`: Realtime subscriptions respect collection API rules. Ensure the connection is authenticated before subscribing to protected data.
- `.claude/skills/pocketbase-best-practices/rules/realtime-events.md`: Realtime events should update local state correctly, handle edge cases, and maintain UI consistency.
- `.claude/skills/pocketbase-best-practices/rules/realtime-reconnection.md`: Realtime connections can disconnect due to network issues or server restarts. Implement proper reconnection handling and state synchronization.
- `.claude/skills/pocketbase-best-practices/rules/realtime-subscribe.md`: PocketBase uses Server-Sent Events (SSE) for realtime updates. Proper subscription management prevents memory leaks and ensures reliable event delivery.
- `.claude/skills/pocketbase-best-practices/rules/rules-basics.md`: PocketBase uses five collection-level rules to control access. Understanding the difference between locked (null), open (""), and expression rules is critical for security.
- `.claude/skills/pocketbase-best-practices/rules/rules-cross-collection.md`: The `@collection` reference allows rules to query other collections, enabling complex authorization patterns like role-based access, team membership, and resource permissions.
- `.claude/skills/pocketbase-best-practices/rules/rules-filter-syntax.md`: PocketBase filter expressions use a specific syntax for both API rules and client-side queries. Understanding operators and composition is essential.
- `.claude/skills/pocketbase-best-practices/rules/rules-locked-vs-open.md`: New collections should start with locked (null) rules and explicitly open only what's needed. This prevents accidental data exposure and follows the principle of least privilege.
- `.claude/skills/pocketbase-best-practices/rules/rules-request-context.md`: The `@request` object provides access to the current request context including authenticated user, request body, query parameters, and headers. Use it to build dynamic access rules.
- `.claude/skills/pocketbase-best-practices/rules/sdk-auth-store.md`: The auth store persists authentication state. Choose the right store type based on your platform: LocalAuthStore for browsers, AsyncAuthStore for React Native, or custom stores for specific needs.
- `.claude/skills/pocketbase-best-practices/rules/sdk-auto-cancellation.md`: The SDK automatically cancels duplicate pending requests. This prevents race conditions but requires understanding for proper use in concurrent scenarios.
- `.claude/skills/pocketbase-best-practices/rules/sdk-error-handling.md`: All SDK methods return Promises that may reject with `ClientResponseError`. Proper error handling improves user experience and simplifies debugging.
- `.claude/skills/pocketbase-best-practices/rules/sdk-field-modifiers.md`: PocketBase supports `+` and `-` modifiers for incrementing numbers, appending/removing relation IDs, and managing file arrays without replacing the entire value.
- `.claude/skills/pocketbase-best-practices/rules/sdk-filter-binding.md`: Always use `pb.filter()` with parameter binding when constructing filters with user input. String concatenation is vulnerable to injection attacks.
- `.claude/skills/pocketbase-best-practices/rules/sdk-initialization.md`: Client initialization should consider the environment (browser, Node.js, SSR), auth store persistence, and any required polyfills.
- `.claude/skills/pocketbase-best-practices/rules/sdk-send-hooks.md`: The SDK provides `beforeSend` and `afterSend` hooks for intercepting and modifying requests and responses globally.

## Pre-Polish Assessment

Final quality pass before shipping. Fixes alignment, spacing, consistency, and detail issues that separate good from great.

- `.claude/skills/polish/SKILL.md`

## PR Review Guidelines

Guidelines and tools for reviewing pull requests in the Angular repository.

- `.claude/skills/pr-review/SKILL.md`
- `.claude/skills/pr-review/reference/router.md`: When reviewing pull requests that modify the Angular Router (`packages/router`), pay special attention to the following:

## MANDATORY PREPARATION

Tone down overly bold or visually aggressive designs. Reduces intensity while maintaining design quality and impact.

- `.claude/skills/quieter/SKILL.md`

## Angular Compiler CLI (`ngtsc`) Architecture

Explains the mental model and architecture of the code under `packages/compiler-cli`. You MUST use this skill any time you plan to work with code in `packages/compiler-cli`

- `.claude/skills/reference-compiler-cli/SKILL.md`

## Angular Core (`packages/core`) Mental Model

Explains the mental model and architecture of the code under `packages/core`. You MUST use this skill any time you plan to work with code in `packages/core`

- `.claude/skills/reference-core/SKILL.md`

## Signal Forms Architecture

Explains the mental model and architecture of the code under `packages/forms/signals`. You MUST use this skill any time you plan to work with code in `packages/forms/signals`

- `.claude/skills/reference-signal-forms/SKILL.md`
- `.claude/skills/reference-signal-forms/references/integration.md`: This document explains how the Signal Forms system hooks into the Angular compiler and runtime to provide seamless type-checking and efficient updates.

## SEO optimization

Optimize for search engine visibility and ranking. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".

- `.claude/skills/seo/SKILL.md`

## Tailwind CSS Development Patterns

Provides comprehensive Tailwind CSS utility-first styling patterns including responsive design, layout utilities, flexbox, grid, spacing, typography, colors, and modern CSS best practices. Use when styling React/Vue/Svelte components, building responsive layouts, implementing design systems, or o...

- `.claude/skills/tailwind-css-patterns/SKILL.md`
- `.claude/skills/tailwind-css-patterns/references/accessibility.md`
- `.claude/skills/tailwind-css-patterns/references/animations.md`: Usage:
- `.claude/skills/tailwind-css-patterns/references/component-patterns.md`
- `.claude/skills/tailwind-css-patterns/references/configuration.md`: Use the `@theme` directive for CSS-based configuration:
- `.claude/skills/tailwind-css-patterns/references/layout-patterns.md`: Basic flex container:
- `.claude/skills/tailwind-css-patterns/references/performance.md`: Configure content sources for optimal purging:
- `.claude/skills/tailwind-css-patterns/references/reference.md`: Tailwind CSS is a utility-first CSS framework that generates styles by scanning HTML, JavaScript, and template files for class names. It provides a comprehensive design system through CSS utility classes, enabling rapid UI development without writing custom CSS. The framework operates at build-ti...
- `.claude/skills/tailwind-css-patterns/references/responsive-design.md`: Enable dark mode in tailwind.config.js:

## Step 1: Explore the Codebase

One-time setup that gathers design context for your project and saves it to your AI config file. Run once to establish persistent design guidelines.

- `.claude/skills/teach-impeccable/SKILL.md`

## TypeScript Advanced Types

Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating reusable type utilities, or ensuring compile-time type safety in TypeScript pr...

- `.claude/skills/typescript-advanced-types/SKILL.md`

## Vite

Vite build tool configuration, plugin API, SSR, and Vite 8 Rolldown migration. Use when working with Vite projects, vite.config.ts, Vite plugins, or building libraries/SSR apps with Vite.

- `.claude/skills/vite/SKILL.md`
- `.claude/skills/vite/GENERATION.md`
- `.claude/skills/vite/references/build-and-ssr.md`: Vite library mode, multi-page apps, JavaScript API, and SSR guidance
- `.claude/skills/vite/references/core-config.md`: Vite configuration patterns using vite.config.ts
- `.claude/skills/vite/references/core-features.md`: Vite-specific import patterns and runtime features
- `.claude/skills/vite/references/core-plugin-api.md`: Vite plugin authoring with Vite-specific hooks
- `.claude/skills/vite/references/environment-api.md`: Vite 6+ Environment API for multiple runtime environments
- `.claude/skills/vite/references/rolldown-migration.md`: Vite 8 Rolldown bundler and Oxc transformer migration

## Core

Vitest fast unit testing framework powered by Vite with Jest-compatible API. Use when writing tests, mocking, configuring coverage, or working with test filtering and fixtures.

- `.claude/skills/vitest/SKILL.md`
- `.claude/skills/vitest/GENERATION.md`
- `.claude/skills/vitest/references/advanced-environments.md`: Configure environments like jsdom, happy-dom for browser APIs
- `.claude/skills/vitest/references/advanced-projects.md`: Multi-project configuration for monorepos and different test types
- `.claude/skills/vitest/references/advanced-type-testing.md`: Test TypeScript types with expectTypeOf and assertType
- `.claude/skills/vitest/references/advanced-vi.md`: vi helper for mocking, timers, utilities
- `.claude/skills/vitest/references/core-cli.md`: Command line interface commands and options
- `.claude/skills/vitest/references/core-config.md`: Configure Vitest with vite.config.ts or vitest.config.ts
- `.claude/skills/vitest/references/core-describe.md`: describe/suite for grouping tests into logical blocks
- `.claude/skills/vitest/references/core-expect.md`: Assertions with matchers, asymmetric matchers, and custom matchers
- `.claude/skills/vitest/references/core-hooks.md`: beforeEach, afterEach, beforeAll, afterAll, and around hooks
- `.claude/skills/vitest/references/core-test-api.md`: test/it function for defining tests with modifiers
- `.claude/skills/vitest/references/features-concurrency.md`: Concurrent tests, parallel execution, and sharding
- `.claude/skills/vitest/references/features-context.md`: Test context, custom fixtures with test.extend
- `.claude/skills/vitest/references/features-coverage.md`: Code coverage with V8 or Istanbul providers
- `.claude/skills/vitest/references/features-filtering.md`: Filter tests by name, file patterns, and tags
- `.claude/skills/vitest/references/features-mocking.md`: Mock functions, modules, timers, and dates with vi utilities
- `.claude/skills/vitest/references/features-snapshots.md`: Snapshot testing with file, inline, and file snapshots

<!-- autoskills:end -->
