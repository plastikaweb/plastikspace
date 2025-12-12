# @plastik/eco-store/product-categories/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/product-categories/data-access](#plastikeco-storeproduct-categoriesdata-access)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [Available Store Methods](#available-store-methods)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides **data access functionality for eco-store product categories**.

## Features

- **Signal-based state management** with NgRx Signals.
- Reactive store for product categories with localization.
- Category grouping by parent groups.
- Automatic category loading on initialization.
- Localized category names with fallback support.
- Category search by slug/normalized name.
- Total product count aggregation.
- Error handling with notifications.

## Usage

Import the store and use its reactive signals:

```typescript
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';

const store = inject(ecoStoreProductCategoriesStore);

// Access reactive signals
const categories = store.categories();
const groupedCategories = store.groupedCategories();
const totalProducts = store.totalProducts();
const isLoading = store.isLoading();

// Load all categories
store.getFullList();

// Find category by slug
const category = store.findCategoryBySlug('electronics');

// Get localized category name
const localizedName = store.getLocalizedCategoryName(category);

// Get category title by slug with fallback
const title = store.getCategoryTitleBySlug('electronics', 'products.all');
```

### Available Store Methods

- `getFullList()`: Load all product categories from API.
- `findCategoryBySlug(slug)`: Find category by normalized name.
- `getLocalizedCategoryName(category)`: Get category name in current language.
- `getCategoryTitleBySlug(slug, defaultText)`: Get localized title with fallback.
- `groupedCategories`: Computed signal with categories grouped by parent.
- `totalProducts`: Computed signal with total product count across all categories.

## Running unit tests

Run `nx test eco-store-product-categories-data-access` to execute the unit tests.
