# GEMINI.md

This file provides comprehensive guidance to the Gemini CLI agent for working with the **Plastikspace** repository.

## 🚀 Project Overview

**Plastikspace** is a modern Nx monorepo managed by **Carlos Matheu Armengol**. It serves as an experimentation lab for cutting-edge web technologies, featuring **6 applications** and **137 libraries**.

### Core Tech Stack

- **Framework:** [Angular 21](https://angular.io/) (Standalone, Signals, Hydration, OnPush).
- **Monorepo Tooling:** [Nx](https://nx.dev/) for high-performance task execution and architectural enforcement.
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & Angular Material (M3).
- **State Management:** [NgRx Signal Store](https://ngrx.io/guide/signals/signal-store).
- **Backends:** Firebase (llecoop), PocketBase (eco-store), GraphQL/Apollo (plastikaweb).
- **Quality:** Jest, Cypress, Pa11y, ESLint.

---

## 🏗️ Architecture & Module Boundaries

The repository follows **Domain-Driven Design (DDD)** principles and strict module boundaries enforced via ESLint.

### Library Types & Tags

- `type:feature`: Smart components with business logic and state.
- `type:data-access`: API services and Signal Stores.
- `type:ui`: Dumb/Presentational components.
- `type:util`: Pure functions and helpers.
- `type:entity`: TypeScript interfaces and models.

### Scope Constraints

- `scope:core`: Fundamental infrastructure (API base, Layout, CMS).
- `scope:shared`: Reusable cross-app features (Auth, UI kits, Utils).
- `scope:<app-name>`: App-specific logic (e.g., `scope:eco-store`).

**Dependency Rules:**

- Apps can depend on Features, UI, Util, Data-Access, Entities.
- Features can depend on anything _except_ Apps.
- UI can only depend on Entities, Util, or other UI.
- Data-Access can only depend on Util and Entities.
- Core/Shared cannot depend on app-specific scopes.

---

## 🔧 Building and Running

### Prerequisites

- **Node.js**: v22
- **Package Manager**: Yarn v4+
- **Global Tools**: `rimraf`

### Development Commands

| Command                | Description                                |
| :--------------------- | :----------------------------------------- |
| `yarn <app>:serve`     | Start app in development mode              |
| `yarn eco-store:local` | Start **PocketBase** + **eco-store**       |
| `yarn llecoop:local`   | Start **Firebase Emulators** + **llecoop** |
| `yarn test:all`        | Run all unit tests (Jest)                  |
| `yarn lint:all`        | Run all linters (ESLint)                   |
| `yarn format:write`    | Format code with Prettier                  |
| `yarn dep-graph`       | Visualize project dependencies             |

---

## 💅 Development Conventions

### Angular & TypeScript

- **Standalone Architecture:** Components are standalone by default in Angular v20+; do **NOT** set `standalone: true`.

- **Signals API:**
  - Use `signal()` for writable state. Use `update()` or `set()`, **never** `mutate()`.

  - Use `computed()` for derived state.

  - Use `linkedSignal()` for dependent state that needs to reset when a source changes.

  - Use `resource()` or `httpResource()` for asynchronous data fetching (replaces many `toSignal(http.get)` patterns).

  - Use `effect()` sparingly for side effects (e.g., logging, manual DOM syncing).

- **Component Inputs/Outputs:** Use Signal-based `input()`, `input.required()`, and `output()`.

- **Private Fields:** Use **ES6 private fields** (`#fieldName`) instead of the `private` keyword.

- **Change Detection:** Always use `ChangeDetectionStrategy.OnPush`.

- **Host Properties:** Use the `host` object in `@Component` or `@Directive` for bindings and listeners. **DO NOT** use `@HostBinding` or `@HostListener` decorators.

- **Composition:** Use `hostDirectives` to compose behaviors across components.

- **Control Flow:** Use modern template syntax (`@if`, `@for`, `@switch`). **DO NOT** use `*ngIf`, `*ngFor`, or `*ngSwitch`.

- **Lifecycle Hooks:** Use `afterNextRender()` and `afterRender()` for DOM-dependent logic (SSR-safe).

### Styling & UI

- **Tailwind CSS 4.0:** Use utility-first styling. Prefer Tailwind classes over custom CSS.

- **Material Design M3:** Use Angular Material components following the M3 theming system.

- **No ngClass/ngStyle:** Use direct `[class.name]="condition"` or `[style.property]="value"` bindings.

- **Encapsulation:** Do not break encapsulation. Avoid `::ng-deep` unless scoped with `:host`.

- **Images:** Use `NgOptimizedImage` (`ngSrc`) for all static and critical images.

- **SVGs:** Use `angular-svg-icon` for manageable SVG assets.

### Documentation (JSDoc)

- TypeScript files must use JSDoc for complex logic.

- Description must start with a capital letter and end with a period.

---

## ♿ Accessibility (A11y)

- **Standards:** Target WCAG compliance.
- **Testing:** Use `jest-axe` for unit tests and `pa11y-ci` for E2E.
- **Semantic HTML:** Always use semantic landmarks (`<main>`, `<header>`, etc.).
- **Alt Text:** Mandatory for images (use `alt=""` for decorative ones).
- **Focus Management:** Handled globally via `is-keyboard-active` on `body`.

---

## 📜 Git & Commit Conventions

### Conventional Commits

Format: `<type>(<scope>): <subject>`

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `chore`, `build`, `revert`.
- **Tooling:** Use `yarn cz` (Commitizen) for interactive commits. Scopes are auto-synced from `tsconfig` paths.

### Branch Naming

Format: `<prefix>/<description>`

- **Prefixes:** `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`, `build`, `ci`, `chore`.
- **Rules:** No `wip` branches. No direct pushes to `main`, `develop`, or `staging`.

---

## 🔍 Agent Instructions

- **Nx Tasks:** Always prefer running tasks through `nx` (e.g., `nx run <project>:<target>`).
- **Architectural Discovery:** Use `codebase_investigator` for high-level mapping of dependencies.
- **Project Structure:** Analyze `project.json` and `tsconfig.json` in individual apps/libs to understand specific configurations.
- **Existing Patterns:** Before implementing new features, search for existing similar implementations in `libs/shared` or `libs/core`.
