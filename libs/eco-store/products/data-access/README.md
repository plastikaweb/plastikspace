# eco-store-products-data-access

- [eco-store-products-data-access](#eco-store-products-data-access)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides data access functionality for eco-store products.

## Features

- GET operations for products
- Filtering and searching capabilities
- Type-safe API interactions

## Usage

Import the service and use its methods to interact with products:

```typescript
import { EcoStoreProductsApiService } from '@plastik/eco-store/products/data-access';

const service = inject(EcoStoreProductsApiService);
const products = await service.getAll();
```

## Running unit tests

Run `nx test eco-store-products-data-access` to execute the unit tests.
