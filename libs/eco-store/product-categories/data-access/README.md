# @plastik/eco-store/product-categories/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/product-categories/data-access](#plastikeco-storeproduct-categoriesdata-access)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [Available Store Methods](#available-store-methods)
  - [Testing](#testing)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides **data access functionality for eco-store product categories**.

## Features

- Signal-based state management with NgRx Signals.
- Reactive store for product categories using stats collection.
- Category grouping by parent group names.
- Automatic category stats loading on initialization.
- Localized category names with fallback support.
- Category lookup by slug/normalized name.
- Total product count aggregation from stats.
- Error handling with notifications.

## Usage

Import the store and use its reactive signals:

```typescript
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';

const store = inject(ecoStoreProductCategoriesStore);

// Access reactive signals
const stats = store.stats();
const groupedCategories = store.groupedCategories();
const totalProducts = store.totalProducts();

// Load category stats
store.getStats();

// Find category by slug
const category = store.findCategoryBySlug('electronics');

// Get localized category name
const localizedName = store.getLocalizedCategoryName(category);

// Get category by slug with fallback icon and name
const categoryData = store.getCategoryBySlug('electronics', 'products.all');
```

### Available Store Methods

- `getStats()`: Load product category statistics from API.
- `findCategoryBySlug(slug)`: Find a category stat by its normalized name.
- `getLocalizedCategoryName(category)`: Get localized category name from a category object.
- `getCategoryBySlug(slug, defaultText)`: Get localized name and icon for a category by slug, with fallbacks.
- `groupedCategories`: Computed signal with categories grouped by parent group name.
- `totalProducts`: Computed signal with total product count across all categories.

## Testing

A mock store is exported for use in unit tests from `@plastik/eco-store/product-categories/data-access/testing`:

```typescript
import { mockEcoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access/testing';

// Provide in TestBed:
{ provide: ecoStoreProductCategoriesStore, useValue: mockEcoStoreProductCategoriesStore }
```

The mock exposes `entities`, `stats`, `isLoading`, `error` signals and the `findCategoryBySlug`
and `getLocalizedCategoryName` jest mocks.

## Running unit tests

Run `nx test eco-store-product-categories-data-access` to execute the unit tests.
