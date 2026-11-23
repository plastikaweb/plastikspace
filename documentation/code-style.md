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

The rules live in the root `eslint.config.mjs`. Their list, with the severity, the files and the lint profile of each one,
is kept in one place only, the root `CLAUDE.md`:

- [Code Quality Rules (ESLint)](../CLAUDE.md#code-quality-rules-eslint): `no-console`, private fields, member ordering,
  JSDoc, NgRx, template and accessibility rules, naming, statement padding, and the rules that run in CI only.
- [Module Boundaries](../CLAUDE.md#module-boundaries-eslint-enforced): `@nx/enforce-module-boundaries`.

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
