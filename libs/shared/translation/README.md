# shared-translation

- [shared-translation](#shared-translation)
  - [🚀 Features](#-features)
  - [🏗️ Usage](#️-usage)
    - [LanguageSwitcherComponent](#languageswitchercomponent)
  - [🧪 Running unit tests](#-running-unit-tests)

This library provides centralized language management and localization utilities for the **Plastikspace** workspace using `@ngx-translate/core` and Angular Signals.

## 🚀 Features

- **Reactive State Management**: Uses Angular Signals (`LanguageSwitcherService`) for immediate UI updates when the language changes.
- **Modern UI Components**: Includes a standalone `LanguageSwitcherComponent` with Signal-based inputs and outputs.
- **Persistent Settings**: Automatically persists user language preferences to `localStorage`.
- **SSR Safe**: Designed to handle language detection and settings across client and server environments.

## 🏗️ Usage

### LanguageSwitcherComponent

Import the `LanguageSwitcherComponent` in your standalone component:

```typescript
import { LanguageSwitcherComponent } from '@plastik/shared/translation';

@Component({
  imports: [LanguageSwitcherComponent],
  template: `
    <plastik-language-switcher
      [languages]="['ca', 'es', 'en']"
      [current]="translateService.currentLang"
      (languageChange)="onLanguageChange($event)" />
  `,
})
export class MyComponent {}
```

## 🧪 Running unit tests

Run `nx test shared-translation` to execute the unit tests via Vitest.
