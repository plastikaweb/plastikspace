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
    - [Resolver](#resolver)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Product Detail Feature** library provides the product detail page functionality for the Eco Store application.
It handles loading individual products by their URL slug and displays detailed product information.

Part of the [**Eco-Store**](../../../../../../../apps/eco-store/README.md) application.

## Features

- **Slug-based product loading**: Products are loaded by their normalized name (URL-friendly slug).
- **Smart caching**: First checks if the product is already in the store, avoiding unnecessary API calls.
- **Lazy loading support**: Disables list loading when viewing details to prevent unnecessary data fetching.
- **Error handling**: Redirects to home page if product is not found.
- **Resolver-based data loading**: Ensures product data is available before component renders.

## Architecture

The feature uses a resolver that:

1. Disables list loading (`enableListLoading(false)`)
2. Checks if product exists in store (`setSelectedFromSlug`)
3. If not found, fetches from API (`loadProductBySlug`)
4. Redirects to home if product doesn't exist

```mermaid
sequenceDiagram
    participant Router
    participant Resolver
    participant Store
    participant API
    participant Component

    Router->>Resolver: Navigate to /botiga/:category/:slug
    Resolver->>Store: enableListLoading(false)
    Resolver->>Store: setSelectedFromSlug(slug)

    alt Product in store
        Store-->>Resolver: true
    else Product not in store
        Store-->>Resolver: false
        Resolver->>Store: loadProductBySlug(slug)
        Store->>API: Fetch product
        API-->>Store: Product data
    end

    Resolver-->>Router: Resolved
    Router->>Component: Load component
    Component->>Store: Read selected product
```

## Usage

### Route Configuration

The feature is typically used as a lazy-loaded route:

```typescript
{
  path: ':category/:slug',
  loadChildren: () => import('@plastik/eco-store/products/feature/detail')
    .then(m => m.ecoStoreProductFeatureRoutes),
}
```

### Resolver

The resolver (`ecoStoreProductResolver`) handles:

- Extracting `slug` from route parameters
- Disabling list loading for efficiency
- Loading product from store or API
- Redirecting on errors

## Running unit tests

Run `nx test eco-store-product-feature` to execute the unit tests via [Jest](https://jestjs.io/).
