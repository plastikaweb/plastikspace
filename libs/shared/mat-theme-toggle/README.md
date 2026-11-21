# @plastik/shared/mat-theme-toggle

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/mat-theme-toggle](#plastiksharedmat-theme-toggle)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [1. Import the `MatThemeToggleComponent` in your component](#1-import-the-matthemetogglecomponent-in-your-component)
    - [2. Use the component in your template](#2-use-the-component-in-your-template)
  - [The browser bar](#the-browser-bar)
  - [API](#api)
    - [MatThemeToggleService](#matthemetoggleservice)
      - [Methods](#methods)
      - [Theme Configuration](#theme-configuration)
  - [Running unit tests](#running-unit-tests)
  - [Resources](#resources)

## Description

A reusable **Angular Material theme toggle component** that allows users to switch between light, dark, and system themes.

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
import { MatThemeToggleComponent } from '@plastik/shared/mat-theme-toggle';

@Component({
  imports: [MatThemeToggleComponent],
})
export class YourComponent {}
```

### 2. Use the component in your template

```html
<plastik-mat-theme-toggle></plastik-mat-theme-toggle>
```

## The browser bar

The service also paints the browser bar (`<meta name="theme-color">`): the address bar of a mobile browser, the title bar of an installed app, the tab bar of Safari.
It needs no configuration. Every time the theme changes, and when the operating system changes scheme while the theme is `system`,
it reads the computed `background-color` of `<body>` and writes it to the tag.

- **The color comes from the stylesheet of the application**, so it follows the palette, a theme a tenant brings, and anything else the stylesheet reacts to
  (`prefers-contrast`, for one). No color is written in TypeScript.
- **CSS alone cannot do this.** The tag takes no `var()`, and its `media` attribute follows the operating system only, never the theme the user picks in the control.
  That is why a script writes it; the value it writes is the stylesheet's.
- **The convention is `<body>`**: an application paints its page background there. One whose `<body>` paints none (`transparent`) keeps the bar as its `index.html` left it.
- **Before Angular starts**, an application that wants the bar right from the first paint sets it from a script in its `index.html`.
  That script runs before any stylesheet exists, so it is the one place where the two colors are written by hand. Keep them equal to the page background.
- The value is written as the browser computes it (`rgb(…)` today).

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

## Resources

- [Angular Material - Supporting Light and Dark Mode](https://material.angular.io/guide/theming#supporting-light-and-dark-mode)
