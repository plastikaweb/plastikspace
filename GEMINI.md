# GEMINI.md

This file provides guidance to the Gemini CLI agent when working with code in this repository.

## General Guidelines for working with Nx

- **Nx Commands**: When running tasks (build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e., `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly.
- **Project Details**: When working in individual projects, analyze the `project.json` and `tsconfig.json` files to understand specific project structures and dependencies.
- **Architectural Discovery**: Use the `codebase_investigator` tool for high-level architectural mapping and understanding system-wide dependencies.

## Repository Overview

Plastikspace is a personal Nx monorepo containing **6 applications** and **137 libraries**, using Angular 21, Astro, and multiple backend systems (Firebase, PocketBase, HTTP APIs).
The repository enforces strict architectural boundaries through ESLint module constraints.

- **Main Branch**: `develop`
- **Package Manager**: Yarn

## Common Commands

### Development

```bash
# Start development server
yarn <app-name>:serve                # e.g., yarn eco-store:serve
yarn <app-name>:local                # With backend (llecoop, eco-store)

# Build, Test, Lint
yarn <app-name>:build
yarn <app-name>:test
yarn <app-name>:lint
```

### Monorepo

```bash
yarn dep-graph                       # Visualize dependency graph
yarn format:write                    # Format code with Prettier
yarn i18n:validate                   # Validate translation keys
```

## Library Architecture

Libraries are organized by **scope** (domain) and **type** (layer):

- **Scopes**: `core` (foundation), `shared` (cross-app), or app-specific (e.g., `llecoop/`, `eco-store/`).
- **Types**:
  - `feature`: Smart components with business logic.
  - `data-access`: API services and state management (Signal Store).
  - `ui`: Presentational/Dumb components.
  - `util`: Pure functions and helpers.
  - `entity`: Type definitions.

### Module Boundaries (ESLint)

Strict rules prevent architectural drift (see `.eslintrc.json`):

- Apps → Features, UI, Util, Data-Access, Entities.
- Features → UI, Util, Data-Access, Entities, other Features.
- UI → Entities, Util, other UI.
- Data-access → Util, Entities.
- Utils/Entities → Only other Utils/Entities.

## Angular & TypeScript Best Practices

- **Standalone Architecture**: Only use standalone components (no NgModules).
- **Signals**: Use `signal()`, `computed()`, `input()`, `output()`. **DO NOT use `mutate`**, use `update` or `set`.
- **Change Detection**: Always use `ChangeDetectionStrategy.OnPush`.
- **Control Flow**: Use `@if`, `@for`, `@switch` templates.
- **Private Fields**: Use ES6 private fields (`#fieldName`) instead of the `private` keyword.
- **Styles**: **DO NOT use `ngClass` or `ngStyle`**. Use direct `[class]` or `[style]` bindings.
- **Encapsulation**: **DO NOT break component CSS encapsulation**. Avoid `::ng-deep` without `:host`.
- **Enums**: **DO NOT use enums**. Use union types instead to keep bundle size small.
- **Prohibited**: `@HostBinding`, `@HostListener`. Use the `host` property in the component decorator.

## Styling & UI

- **TailwindCSS 4.0**: Utility-first styling. Prefer Tailwind classes over custom CSS.
- **Material Design**: Use Angular Material components and the M3 theming system.
- **Accessibility (A11y)**:
  - Focus ring handled globally via `is-keyboard-active` class on `body`.
  - Use semantic HTML and landmarks (`<header>`, `<main>`, etc.).
  - Always provide `alt` text for images (empty for decorative).

## Testing

- **Unit (Jest)**: `nx test <project-name>`. Supports `--watch`, `--testFile`, and `--testNamePattern`.
- **A11y (Pa11y)**: `yarn <app-name>:a11y`.
- **jest-axe**: Use for accessibility unit tests in UI components.

## Git and Commits

- **Format**: Conventional Commits `<type>(<scope>): <subject>`.
- **Commitizen**: Use `yarn cz` for interactive commits. Scopes are auto-synced from path aliases.
- **Branch Naming**: `<issue-type>/<issue-number>-<short-description>` (e.g., `feat/33-footer-main`). Enforced by linting.
