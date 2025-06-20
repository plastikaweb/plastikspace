# user-order-product-list-data-access

## Table of Contents

- [Overview](#overview)
- [Key Components](#key-components)
  - [LlecoopUserOrderProductFireService](#llecoopuserorderproductfireservice)
  - [llecoopUserOrderProductStore](#llecoopuserorderproductstore)
- [Features](#features)
- [Usage](#usage)
- [Running unit tests](#running-unit-tests)

## Overview

This library provides data access functionality for managing product listings in the LleCoop user ordering system. It handles product data retrieval, filtering, sorting, and pagination through Firebase integration, enabling users to browse and select available products.

## Key Components

### LlecoopUserOrderProductFireService

A Firebase service extending `EntityFireService` that handles:

- Retrieving available products from Firestore with filtering and pagination
- Searching products by name with text normalization and case-insensitive matching
- Filtering products by category
- Counting total available products matching filters
- Ensuring only available products are shown (`isAvailable: true`)

```typescript
// Example of using the fire service
import { LlecoopUserOrderProductFireService } from '@plastik/llecoop/user-order/product-list/data-access';

// In a component or service
constructor(private productFireService: LlecoopUserOrderProductFireService) {}

// Get all available products with pagination, sorting and filtering
this.productFireService.getAll(pagination, sorting, filter).subscribe(products => {
  // Handle products
});
```

### llecoopUserOrderProductStore

A Signal-based state management store that handles the product list state, including:

- Managing product filtering (text search and category filtering)
- Pagination state management
- Sorting configuration
- Integration with the Firebase service

```typescript
// Example of using the product store
import { llecoopUserOrderProductStore } from '@plastik/llecoop/user-order/product-list/data-access';

// Load products
llecoopUserOrderProductStore.loadEntities();

// Update filters
llecoopUserOrderProductStore.updateFilter({ text: 'apple', category: 'fruits' });

// Access product data
const products = llecoopUserOrderProductStore.entities();
const loading = llecoopUserOrderProductStore.loading();
```

## Features

- **Product Search**: Text-based searching with normalization for accents and special characters
- **Category Filtering**: Filter products by specific categories
- **Pagination Support**: Built-in pagination for handling large product catalogs
- **Sorting Options**: Configure product sorting (e.g., by name, price, update date)
- **Available Products Only**: Automatically filters out unavailable products
- **Reactive Design**: Built with Angular's Signal-based architecture

## Usage

To use this library in your Angular components:

```typescript
import {
  llecoopUserOrderProductStore,
  LlecoopUserOrderProductFireService,
} from '@plastik/llecoop/user-order/product-list/data-access';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  template: `
    <div *ngIf="loading()">Loading products...</div>
    <div *ngIf="!loading() && products().length === 0">No products found</div>
    <div *ngFor="let product of products()">
      <!-- Your product display logic -->
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  products = llecoopUserOrderProductStore.entities;
  loading = llecoopUserOrderProductStore.loading;

  ngOnInit() {
    // Initialize with default filters
    llecoopUserOrderProductStore.loadEntities();
  }

  searchProducts(term: string) {
    llecoopUserOrderProductStore.updateFilter({ text: term });
  }

  filterByCategory(category: string) {
    llecoopUserOrderProductStore.updateFilter({ category });
  }
}
```

## Running unit tests

Run `nx test user-order-product-list-data-access` to execute the unit tests.
