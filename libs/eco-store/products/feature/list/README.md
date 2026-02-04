# @plastik/eco-store/products/feature

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/products/feature](#plastikeco-storeproductsfeature)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Reference](#api-reference)
    - [`EcoStoreProductsFeature`](#ecostoreproductsfeature)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Products Feature** library provides the main product list functionality for the Eco Store application.
It orchestrates the display of products in a responsive grid, handling data retrieval, pagination, and user interactions.

Part of the [**Eco-Store**](../../../../../apps/eco-store/README.md) application.

## Features

- **Responsive Product Grid**: Displays products in a layout that adapts to different screen sizes.
- **State Management**: Integrates with [NgRx Signal Store](https://ngrx.io/) for reactive state management.
- **Performance**: Uses `OnPush` change detection and Angular Signals for optimal rendering performance.
- **Pagination**: Built-in support for paginated data fetching.
- **Modern Architecture**: Built using Angular Standalone Components.
- **Lazy Loading**: Uses `enableListLoading()` in resolver for efficient data fetching.
- **UX Optimization**: Implements `@defer` blocks tied to the store's `initiallyLoaded` signal to prevent empty states and flickering during initial data fetch.

## Installation

This library is part of the `@plastik/eco-store` scope. It is not intended for external installation but can be imported within the workspace.

## Usage

Import the `EcoStoreProductsFeature` component into your feature route or container component.

```typescript
import { Component } from '@angular/core';
import { EcoStoreProductsFeature } from '@plastik/eco-store/products/feature';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [EcoStoreProductsFeature],
  template: `
    <header>
      <h1>Shop Sustainable</h1>
    </header>
    <main>
      <eco-store-products-feature></eco-store-products-feature>
    </main>
  `,
})
export class ShopPageComponent {}
```

## API Reference

### `EcoStoreProductsFeature`

**Selector:** `<eco-store-products-feature>`

The component relies on the injected Store for its data and does not require inputs.

| Input | Type | Description                                               |
| :---- | :--- | :-------------------------------------------------------- |
| N/A   | -    | This is a smart container request its own data via Store. |

## Running unit tests

Run `nx test eco-store-products-feature` to execute the unit tests via [Jest](https://jestjs.io/).
