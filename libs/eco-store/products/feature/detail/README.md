# @plastik/eco-store/products/feature/detail

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/products/feature/detail](#plastikeco-storeproductsfeaturedetail)
  - [Description](#description)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Usage](#usage)
    - [Route Configuration](#route-configuration)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Product Detail Feature** provides the comprehensive product detail page for the Eco-Store application.
It handles loading individual products via route resolvers and offers a rich UI with pricing, quantity management, and related products.

## Features

- **Slug-based product loading**: Efficiently loads products using URL slugs.
- **Smart caching**: Integrates with `ecoStoreProductsStore` to reuse already loaded data.
- **Rich Product Information**: Displays product tags (ECO, Novetat, Oferta), rating, and stock availability.
- **Interactive Components**:
  - **Store Window Status Awareness**: Automatically disables quantity controls and hides availability badges when the store is closed, respecting the `ecoStoreTenantStore` status.
  - **Quantity Control**: Precise control over purchase quantity, respecting `minQuantity` and step logic.
  - **Favorite Button**: Glass-effect button for toggling favorites.
  - **Category Label**: Branded category display with color-coded dot.
  - **Pricing**: Detailed pricing with unit-based information.
- **Image Gallery**: Support for main product image and thumbnail navigation.
- **Related Products**: Displays similar products from the same category.
- **Responsive Layout**: Optimized for both mobile and desktop experiences.

## Architecture

The feature uses `EcoStoreProductFeatureComponent` which is a standalone component using Angular Signals for state management and `OnPush` change detection for performance.

It uses a resolver (`ecoStoreProductResolver`) for pre-fetching product data and managing global store state (disabling list loading while on the detail page).

### CanDeactivate Guard

The feature implements a `CanDeactivate` guard (`ecoStoreProductCanDeactivateGuard`) to prevent navigating away if there are unsaved changes to the product quantity.
It checks the `pendingChanges` signal of the component and triggers a confirmation dialog if needed.

```typescript
export interface EcoStoreProductCanDeactivateComponent {
  pendingChanges: Signal<boolean> | (() => boolean);
}
```

## Usage

### Route Configuration

```typescript
{
  path: ':category/:slug',
  loadComponent: () => import('@plastik/eco-store/products/feature/detail'),
}
```

## View Transitions

This module incorporates smooth CSS view transitions to provide a seamless and visually appealing user experience during interactions and navigation.

## Running unit tests

Run `nx test eco-store-product-feature` to execute the unit tests via Jest.
