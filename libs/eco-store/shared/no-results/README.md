# @plastik/eco-store/shared/no-results

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/shared/no-results](#plastikeco-storesharedno-results)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Shared No Results** library provides a reusable presentational component to display a consistent "no results" state across the Eco Store application.
It features a centered illustration, a title, a description, and an optional action slot.

## Features

- **Visual Consistency**: Standardized layout for empty states.
- **Customizable Content**: Uses `ng-content` for title, description, and action buttons.
- **Image Integration**: Displays a dedicated "no results" illustration with LCP optimization.
- **Internationalization**: Fully compatible with `ngx-translate`.

## Usage

```html
<eco-store-shared-no-results [imgTitle]="'orders.list.empty' | translate">
  <div title>{{ 'orders.list.empty' | translate }}</div>
  <div description>{{ 'orders.list.emptyDescription' | translate }}</div>
  <button action mat-stroked-button routerLink="/botiga">
    {{ 'orders.list.goToStore' | translate }}
  </button>
</eco-store-shared-no-results>
```

## Running unit tests

Run `nx test eco-store-shared-no-results` to execute the unit tests via [Vitest](https://vitest.dev/).
