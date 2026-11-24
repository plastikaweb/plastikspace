# Code Style

- [Code Style](#code-style)
  - [Angular Style Guide](#angular-style-guide)
  - [Visual Studio Code](#visual-studio-code)
    - [Needed extensions](#needed-extensions)
    - [Minimal configuration settings](#minimal-configuration-settings)
  - [Prettier auto formatter](#prettier-auto-formatter)
  - [Lint rules](#lint-rules)
  - [Other recommended rules](#other-recommended-rules)
  - [Links](#links)

## Angular Style Guide

All Angular code must follow the styles dictated by the official [Angular Style Guide](https://angular.io/styleguide).  
As long as you use Angular CLI and don't skip the git hooks, we shouldn't need to worry about missing something.

## Visual Studio Code

### Needed extensions

- **Angular Language Service** ([angular.ng-template](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)):
rich editing experience for Angular templates, both inline and external templates.
- **Nx Console** ([nrwl.angular-console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)):
UI for Nx commands in an easy way.
- **Prettier - Code formatter** ([esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)):
VSCode plugin for prettier.
- **Jest Runner** ([firsttris.vscode-jest-runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)):
A simple way to run or debug tests.
- **ESLint** ([dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)):
integrates ESLint JavaScript into VS Code.
- **markdownlint** ([davidanson.vscode-markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)):
markdown linting and style checking for Visual Studio Code.
- **axe Accessibility Linter** ([deque-systems.vscode-axe-linter](https://marketplace.visualstudio.com/items?itemName=deque-systems.vscode-axe-linter))

> These extensions will appear in your extension VSCODE manager, under "recommended". For a real view of recommended extensions, please take a look at it.

### Minimal configuration settings

Under .vscode/settings.json there are some configurations needed for this project repository.

## Prettier auto formatter

We use prettier for automatic code formatting on save. The minimal configuration lives in .prettierrc and .prettierignore project root files.

## Lint rules

The rules live in the root `eslint.config.mjs`; the module boundaries are in the root `CLAUDE.md`
([Module Boundaries](../CLAUDE.md#module-boundaries-eslint-enforced)), which also keeps a short list of what to know before
writing code. This is the full list, with the severity, the files and the lint profile of each rule:

- `no-console` is an error in TypeScript files other than `*.spec.*` (Cypress `*.cy.ts` included) - use proper logging or remove debug statements
- **Private fields**: a class field must be an ES6 private field (`#fieldName`), not a TypeScript `private` one: an
  error (`no-restricted-syntax`). Private methods and constructor parameter properties keep the `private` modifier, and
  so do fields set by `input()`, `model()`, `output()`, `outputFromObservable()` or a signal query, where the Angular
  compiler rejects `#` (NG1053): a `#` field set by one of them, or a `private` one set by the first four, is an error
  too. `yarn lint:profiles` checks that the rule still fires and skips a `private` query
- **Member ordering** (`@typescript-eslint/member-ordering`, an error): signature, field, constructor, method
- **JSDoc** (the `eslint-plugin-jsdoc` recommended set, on every TypeScript file, specs included): a `function`
  declaration without a JSDoc block is a warning, exported or not (methods, classes and arrow functions need none); in a
  block that exists, a missing `@param`/`@returns` tag or its `{type}` is a warning too. A description must start with a
  capital letter and contain a period (`jsdoc/match-description`, `/^[A-Z].+[.]/`): an error
- **Deprecation warnings** (`@typescript-eslint/no-deprecated`): warns on deprecated API usage in TypeScript files other
  than `*.spec.*` and `worker-configuration.d.ts` (test setup files and Cypress `*.cy.ts` included), in CI only (see the
  last item)
- **NgRx** (`@ngrx/eslint-plugin`): `select-style` and `no-effects-in-providers` are errors; the other 23 rules kept from the former `eslint-plugin-ngrx` recommended set warn
- **Angular** (META-17, errors in every project, specs included): `@angular-eslint/prefer-signals` (signal inputs and
  queries instead of decorators, and `readonly` on every signal property), `prefer-inject`, `prefer-output-emitter-ref`
  and `prefer-output-readonly`; `no-restricted-syntax` rejects `standalone: true` in `@Component`/`@Directive`/`@Pipe`,
  `@HostBinding`/`@HostListener`, and importing `NgClass`/`NgStyle`. In templates: `template/prefer-control-flow`,
  `template/button-has-type` (every `<button>` states `type="button"` or `type="submit"`) and no `ngClass`/`ngStyle`,
  bound or static. No rule covers an `effect()` that writes a signal (4 do today)
- **Templates and accessibility**: angular-eslint's `templateRecommended` and `templateAccessibility` presets plus the
  template rules of the root config's `*.html` block (no-positive-tabindex, alt-text, label-has-associated-control,
  etc., and the template rules of the Angular item), all errors, on `*.html` files and on inline `template:` strings,
  which the `flat/angular` preset in each Angular project's `eslint.config.mjs` extracts
- **Naming** (warnings, not errors): `id-length` 2-40 chars (short loop/callback names like `i`, `e`, `id` are
  whitelisted), `id-denylist` rejects vague names (`data`, `info`, `temp`, `val`, `item`, `foo`, `bar`, `baz`), and
  `@typescript-eslint/naming-convention` enforces camelCase by default (variables may also be UPPER_CASE or PascalCase;
  properties are not checked), PascalCase types, and `is`/`has`/`can`/`should`/`will` prefixes on boolean variables. The
  boolean selector needs type information, so it runs in CI only (see the last item), and never on `*.spec.ts`
- **Warnings may not grow** (META-18): `yarn lint:delta` compares each file a branch touches with its version at the
  merge base with `origin/develop` (or `--base <ref>`) and fails when the file has more ESLint warnings than before; the
  warnings it already had may stay. Fast profile, both versions linted with the current config. It runs in the pre-push
  (non-Markdown pushes) and as a failing check in CI's Lint Affected step; `--scope-only` only classifies the touched
  files
- **Statement padding** (`padding-line-between-statements`, a warning): a blank line before every `return` and after a block of variable declarations
- **Rules that need type information run in CI only** (META-13): `prefer-readonly` (an error: a private member never
  reassigned outside the constructor must be `readonly`), `no-deprecated` and the boolean `naming-convention` selector
  (warnings); `cypress/unsafe-to-chain-command` also flags chains that start at a helper function only there. They need
  `ESLINT_TYPED=1`, which CI's lint step and `yarn lint:ci` set. ESLint in hooks, editors and `nx lint` builds no
  TypeScript program and skips them; `yarn lint:profiles` checks both profiles. With `ESLINT_TYPED=1`, the project
  service types each file from its nearest `tsconfig.json`, the tsconfigs that one references or a `tsconfig.json`
  further up (the repo has none), never from `tsconfig.base.json`. A TypeScript file it cannot place fails the CI lint
  with "was not found by the project service": include it in one of those tsconfigs, or list it in `TS_DEFAULT_PROJECT`
  in the root `eslint.config.mjs`. A listed file that a tsconfig later takes in fails with "was included by
  allowDefaultProject but also was found in the project service": take it off the list

To see every rule that applies to one file, with its severity: `yarn eslint --print-config <file>`. Prefix it with
`ESLINT_TYPED=1` for the profile that CI runs.

## Other recommended rules

- Do not use enums. Use instead union types. Enums increment bundle size.

  ```typescript
  // instead of this 🛑
  export enum NotificationType {
    Error = 'ERROR',
    Warning = 'WARNING',
    Info = 'INFO',
    Success = 'SUCCESS',
  }
  // use this 💚
  export type NotificationType = 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  ```

## Links

- [Angular Style Guide](https://angular.io/guide/styleguide/)
- [Angular lint](https://angular.io/cli/lint)
- [prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
