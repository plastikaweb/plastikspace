# @plastik/eco-store/core/router-state

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/core/router-state](#plastikeco-storecorerouter-state)
  - [Description](#description)
  - [Features](#features)
  - [Architecture](#architecture)
    - [Services](#services)
      - [EcoStorePrefixTitleService](#ecostoreprefixtitleservice)
      - [EcoStoreCategoryRouteTitleService](#ecostorecategoryroutetitleservice)
      - [EcoStoreCategoryProductTitleService](#ecostorecategoryproducttitleservice)
  - [Usage](#usage)
    - [App Configuration](#app-configuration)
    - [Route Configuration](#route-configuration)
  - [Testing](#testing)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides **eco-store-specific router data access** functionality, including reactive, signal-based page title resolution services that integrate with the tenant, product categories, and products stores.

It extends the core `PrefixTitleService` from `@plastik/core/router-state` with eco-store-specific logic for dynamically resolved route titles based on signal state.

## Features

- **Reactive Page Titles**: Uses Angular `effect()` to automatically update the browser title whenever the tenant name, category, or product data changes.
- **Tenant-Prefixed Titles**: Automatically prefixes page titles with the current tenant name (falls back to the environment app name).
- **Signal-Based Lookup**: Resolves category and product titles from in-memory signal store data — no extra API calls.
- **Internationalization Support**: Titles are resolved in the current application language using `TranslateService`.
- **Lazy Key Resolution**: Route title resolvers emit semantic keys (e.g., `CATEGORY_TITLE:envasats`) which are resolved reactively by `EcoStorePrefixTitleService`.

## Architecture

### Services

#### EcoStorePrefixTitleService

Extends `PrefixTitleService` from the core router library. It overrides the `getTranslatedTitle()` and `getPrefixedTitle()` methods:

- Detects `CATEGORY_TITLE:<slug>` keys → looks up the localized name from `ecoStoreProductCategoriesStore`.
- Detects `PRODUCT_TITLE:<slug>` keys → looks up the product name from `ecoStoreProductsStore`.
- Prefixes the final title with the tenant name from `ecoStoreTenantStore`.

```typescript
import { EcoStorePrefixTitleService } from '@plastik/eco-store/core/router-state';

// In app.config.ts:
{
  provide: TitleStrategy,
  useClass: EcoStorePrefixTitleService,
}
```

#### EcoStoreCategoryRouteTitleService

A route title resolver for category listing pages (`/botiga/:category`). Emits a `CATEGORY_TITLE:<categorySlug>` key resolved by `EcoStorePrefixTitleService`.

#### EcoStoreCategoryProductTitleService

A route title resolver for product detail pages (`/botiga/:category/:slug`). Emits a `PRODUCT_TITLE:<productSlug>` key resolved by `EcoStorePrefixTitleService`.

## Usage

### App Configuration

In your `app.config.ts`:

```typescript
import { TitleStrategy } from '@angular/router';
import { EcoStorePrefixTitleService } from '@plastik/eco-store/core/router-state';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    {
      provide: TitleStrategy,
      useClass: EcoStorePrefixTitleService,
    },
  ],
};
```

### Route Configuration

In your layout routes using the functional resolver pattern:

```typescript
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  EcoStoreCategoryRouteTitleService,
  EcoStoreCategoryProductTitleService,
} from '@plastik/eco-store/core/router-state';

export const layoutRoutes: Route[] = [
  {
    path: 'botiga/:category',
    title: (route: ActivatedRouteSnapshot) =>
      inject(EcoStoreCategoryRouteTitleService).resolve(route),
    // ...
  },
  {
    path: 'botiga/:category/:slug',
    title: (route: ActivatedRouteSnapshot) =>
      inject(EcoStoreCategoryProductTitleService).resolve(route),
    // ...
  },
];
```

For simple static titles (e.g., login page), use a translation key directly:

```typescript
{
  path: '',
  title: 'auth.login.title',
  // ...
}
```

## Testing

Mock providers are available from the `/testing` sub-path exports of related stores:

- `mockEcoStoreTenantStore` from `@plastik/eco-store/tenant/testing`
- `mockEcoStoreProductCategoriesStore` from `@plastik/eco-store/product-categories/data-access/testing`
- `mockEcoStoreProductsStore` from `@plastik/eco-store/products/data-access/testing`

## Running unit tests

Run `nx test eco-store-router-data-access` to execute the unit tests via Vitest.
