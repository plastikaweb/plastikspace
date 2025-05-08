# shared-mat-theme-toggle

- [shared-mat-theme-toggle](#shared-mat-theme-toggle)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [1. Import the `MatThemeToggleComponent` in your component](#1-import-the-matthemetogglecomponent-in-your-component)
    - [2. Use the component in your template](#2-use-the-component-in-your-template)
  - [API](#api)
    - [MatThemeToggleService](#matthemetoggleservice)
      - [Methods](#methods)
      - [Theme Configuration](#theme-configuration)
  - [Running unit tests](#running-unit-tests)
  - [Useful links](#useful-links)

## Description

A reusable Angular Material theme toggle component that allows users to switch between light, dark, and system themes.

## Features

- Seamless integration with Angular Material
- Support for light, dark, and system themes
- Persistent theme selection using localStorage
- Reactive theme updates using Angular signals
- Accessible button with aria-label
- Customizable icons for each theme

## Usage

### 1. Import the `MatThemeToggleComponent` in your component

```typescript
import { MatThemeToggleComponent } from '@plastikspace/shared-mat-theme-toggle';

@Component({
  imports: [MatThemeToggleComponent],
})
export class YourComponent {}
```

### 2. Use the component in your template

```html
<shared-mat-theme-toggle></shared-mat-theme-toggle>
```

## API

### MatThemeToggleService

Service that handles theme management.

#### Methods

- `getThemes()`: Returns an array of available themes
- `setTheme(theme: 'light' | 'dark' | 'system')`: Sets the active theme
- `selectedTheme`: Computed signal that returns the current theme configuration

#### Theme Configuration

Each theme has the following properties:

- `id`: Theme identifier ('light', 'dark', 'system')
- `name`: Display name of the theme
- `icon`: Material icon name for the theme

## Running unit tests

Run `nx test shared-mat-theme-toggle` to execute the unit tests.

## Useful links

- [Angular Material - Supporting Light and Dark Mode](https://material.angular.io/guide/theming#supporting-light-and-dark-mode)
