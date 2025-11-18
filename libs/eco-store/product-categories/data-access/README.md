# eco-store-product-categories-data-access

- [eco-store-product-categories-data-access](#eco-store-product-categories-data-access)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides data access functionality for eco-store product categories.

## Features

- GET operations for product categories
- Filtering and searching capabilities
- Type-safe API interactions

## Usage

Import the store and use its methods to interact with product categories:

```typescript
import { ProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';

const store = new ProductCategoriesStore();
const categories = await store.getAll();
```

## Running unit tests

Run `nx test eco-store-product-categories-data-access` to execute the unit tests.
