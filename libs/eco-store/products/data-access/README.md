# eco-store-products-data-access

- [eco-store-products-data-access](#eco-store-products-data-access)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [Store Usage](#store-usage)
    - [API Service Usage](#api-service-usage)
    - [Available Store Methods](#available-store-methods)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides data access functionality for eco-store products.

## Features

- Signal-based state management with NgRx Signals
- Reactive product store with pagination and filtering
- Category-based product filtering
- Localized product and category names
- Type-safe API interactions with PocketBase
- Computed signals for derived state (products with category names)
- Automatic localization support

## Usage

### Store Usage

Import the store and use its reactive signals:

```typescript
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';

const store = inject(ecoStoreProductsStore);

// Access reactive signals
const products = store.entities();
const productsWithCategories = store.productsWithCategoryName();
const isLoading = store.isLoading();

// Filter products by category
store.setFilter({ category: 'category-id' });

// Load products
store.loadEntities();
```

### API Service Usage

Import the service for direct API interactions:

```typescript
import { EcoStoreProductsApiService } from '@plastik/eco-store/products/data-access';

const service = inject(EcoStoreProductsApiService);
const products = await service.getList({ page: 1, perPage: 20 });
```

### Available Store Methods

- `loadEntities()` - Load products with current pagination and filters
- `setFilter(filter)` - Update product filters (category-based)
- `setPagination(pagination)` - Update pagination settings
- `productsWithCategoryName` - Computed signal with localized category names

## Running unit tests

Run `nx test eco-store-products-data-access` to execute the unit tests.
